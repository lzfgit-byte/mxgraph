import type { mxUndoManager as typeMxUndoManager } from 'mxgraph';
import type MyGraph from './useGraphGraph';
import mx from './useGraphFactory';
import { ctrlKey } from './useGraphDefaultConfig';
const { mxEventObject, mxUndoManager, mxEvent, mxClipboard, mxUtils, mxEventSource } = mx;
export class ActionItem extends mxEventSource {
  func: (graph: MyGraph) => any;
  name: string;
  shortcutKey: string;
  enabled: boolean;
  constructor(func: (graph: MyGraph) => any, name: string, shortcutKey: string, enabled?: boolean) {
    super();
    this.func = func;
    this.name = name;
    this.shortcutKey = shortcutKey;
    this.enabled = enabled != null ? enabled : true;
  }

  setEnabled(value: boolean) {
    if (this.enabled !== value) {
      this.enabled = value;
      this.fireEvent(new mxEventObject('stateChanged'), undefined);
    }
  }

  isEnabled() {
    return this.enabled;
  }
}
export class Action {
  action: {
    [k: string]: ActionItem;
  };

  graph: MyGraph;
  undoManager: typeMxUndoManager;
  constructor(graph: MyGraph) {
    this.action = {};
    this.graph = graph;
    this.undoManager = new mxUndoManager();
    const listener = (sender: any, evt: any) => {
      this.undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);
  }

  get(key: string) {
    return this.action[key];
  }

  put(key: string, actionItem: ActionItem) {
    this.action[key] = actionItem;
  }

  init() {
    // 剪切
    this.put(
      'cut',
      new ActionItem(
        () => {
          const cells = this.graph.getSelectionCells();
          mxClipboard.setCells(mxClipboard.cut(this.graph, cells));
        },
        '剪切',
        `${ctrlKey}+X`
      )
    );
    // 复制
    this.put(
      'copy',
      new ActionItem(
        () => {
          mxClipboard.copy(this.graph);
        },
        '复制',
        `${ctrlKey}+C`
      )
    );
    // 粘贴
    this.put(
      'paste',
      new ActionItem(
        () => {
          if (this.graph.isEnabled() && !this.graph.isCellLocked(this.graph.getDefaultParent())) {
            mxClipboard.paste(this.graph);
          }
        },
        '粘贴',
        `${ctrlKey}+V`
      )
    );
    // 粘贴这里
    this.put(
      'pasteHere',
      new ActionItem(
        () => {
          if (this.graph.isEnabled() && !this.graph.isCellLocked(this.graph.getDefaultParent())) {
            this.graph.getModel().beginUpdate();
            try {
              const cells = mxClipboard.paste(this.graph);

              if (cells != null) {
                let includeEdges = true;

                for (let i = 0; i < cells.length && includeEdges; i++) {
                  includeEdges = includeEdges && this.graph.model.isEdge(cells[i]);
                }

                const t = this.graph.view.translate;
                const s = this.graph.view.scale;
                const dx = t.x;
                const dy = t.y;
                let bb = null;

                if (cells.length === 1 && includeEdges) {
                  const geo = this.graph.getCellGeometry(cells[0]);

                  if (geo != null) {
                    bb = geo.getTerminalPoint(true);
                  }
                }

                bb = bb != null ? bb : this.graph.getBoundingBoxFromGeometry(cells, includeEdges);

                if (bb != null) {
                  const x = Math.round(
                    this.graph.snap(this.graph.popupMenuHandler.triggerX / s - dx)
                  );
                  const y = Math.round(
                    this.graph.snap(this.graph.popupMenuHandler.triggerY / s - dy)
                  );

                  this.graph.cellsMoved(cells, x - bb.x, y - bb.y);
                }
              }
            } finally {
              this.graph.getModel().endUpdate();
            }
          }
        },
        '粘贴这里',
        ''
      )
    );
    // 删除
    this.put(
      'delete',
      new ActionItem(
        () => {
          const cells = this.graph.getSelectionCells();
          this.graph.deleteCells(cells);
        },
        '删除',
        'Delete'
      )
    );
    // 撤销
    this.put(
      'undo',
      new ActionItem(
        () => {
          this.undoManager.undo();
        },
        '撤销',
        `${ctrlKey}+Z`
      )
    );
    // 取消撤销
    this.put(
      'redo',
      new ActionItem(
        () => {
          this.undoManager.redo();
        },
        '取消撤销',
        `${ctrlKey}+Y`
      )
    );
    // 置于底部
    this.put(
      'toBack',
      new ActionItem(
        () => {
          this.graph.orderCells(true);
        },
        '置于底部',
        `${ctrlKey}+Shift+B`
      )
    );
    // 置于顶部
    this.put(
      'toFront',
      new ActionItem(
        () => {
          this.graph.orderCells(false);
        },
        '置于顶部',
        `${ctrlKey}+Shift+Y`
      )
    );
    // 组合
    this.put(
      'group',
      new ActionItem(
        () => {
          if (this.graph.isEnabled()) {
            let cells = mxUtils.sortCells(this.graph.getSelectionCells(), true);

            // if (cells.length == 1 && !this.graph.isTable(cells[0]) && !this.graph.isTableRow(cells[0])) {
            //   this.graph.setCellStyles('container', '1')
            // }
            // else {
            cells = this.graph.getCellsForGroup(cells);

            if (cells.length > 1) {
              const group = this.graph.createGroupCell([]);

              group.setStyle('group');

              this.graph.setSelectionCell(this.graph.groupCells(group, 0, cells));
            }
            // }
          }
        },
        '组合',
        `${ctrlKey}+G`
      )
    );
    // 取消组合
    this.put(
      'ungroup',
      new ActionItem(
        () => {
          if (this.graph.isEnabled()) {
            let cells = this.graph.getSelectionCells();
            this.graph.setSelectionCells(cells);
            this.graph.model.beginUpdate();
            let temp;
            try {
              temp = this.graph.ungroupCells(cells);

              // Clears container flag for remaining cells
              if (cells != null) {
                for (let i = 0; i < cells.length; i++) {
                  if (this.graph.model.contains(cells[i])) {
                    if (
                      this.graph.model.getChildCount(cells[i]) === 0 &&
                      this.graph.model.isVertex(cells[i])
                    ) {
                      this.graph.setCellStyles('container', '0', [cells[i]]);
                    }

                    temp.push(cells[i]);
                  }
                }
              }
            } finally {
              this.graph.model.endUpdate();
            }

            this.graph.setSelectionCells(temp);
          }
        },
        '取消组合',
        `${ctrlKey}+Shift+U`
      )
    );
    // 选中所有edges
    this.put(
      'selectEdges',
      new ActionItem(
        () => {
          this.graph.selectEdges(this.graph.getDefaultParent());
        },
        '选中所有边',
        `${ctrlKey}+Shift+I`
      )
    );
    // 选中所有vertex
    this.put(
      'selectVertices',
      new ActionItem(
        () => {
          this.graph.selectVertices(this.graph.getDefaultParent(), true);
        },
        '选中所有图元',
        `${ctrlKey}+Shift+V`
      )
    );
    this.put(
      'zoomIn',
      new ActionItem(
        () => {
          this.graph.zoomIn();
        },
        '放大',
        `${ctrlKey}+加`
      )
    );
    this.put(
      'zoomOut',
      new ActionItem(
        () => {
          this.graph.zoomOut();
        },
        '缩小',
        `${ctrlKey}+-`
      )
    );
    this.put(
      'addChildren',
      new ActionItem(
        () => {
          if (this.graph.isEnabled()) {
            this.graph.getModel().beginUpdate();
            try {
              const parent = this.graph.getDefaultParent();
              const cells = mxUtils.sortCells(this.graph.getSelectionCells(), true);
              console.log(cells);
              const x = cells[0].geometry.x;
              const y = cells[0].geometry.y;
              const v = this.graph.insertVertex(parent, null, '', x, y, 120, 30);
              v.collapsed = true;
              for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                cell.geometry.x = cell.geometry.x - x;
                cell.geometry.y = cell.geometry.y - y;
                v.insert(cell, v.children.length);
              }
            } finally {
              this.graph.getModel().endUpdate();
            }
          }
        },
        '添加子节点',
        `${ctrlKey}+A`
      )
    );
    // this.put('toggleTree', new ActionItem(() => {
    //   this.graph.isTree = !this.graph.isTree
    // }, '切换树形', ''))
  }
}

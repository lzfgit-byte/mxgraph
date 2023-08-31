import type { mxPopupMenuHandler, mxCell as typeMxCell } from 'mxgraph';

import { nanoid } from 'nanoid';
import { Base64 } from 'js-base64';
import mx from './useGraphFactory';
import { Action } from './useGraphAction';
import myStyle from './useGraphDefaultStyle';
import type { NodeConfig } from '@/components/mxGraph/src/type/graphTyped';
// import { ctrlKey, keyCode } from './useGraphDefaultConfig';
// @ts-expect-error
import handlerImag from '@/components/mxGraph/src/images/handle-main.png?url';
import type { GraphEmitsType } from '@/components/mxGraph/src/const/emits';
const {
  mxGraph,
  mxRubberband,
  mxGraphHandler,
  mxEvent,
  mxConstants,
  mxEdgeHandler,
  mxCell,
  mxCellState,
  mxShape,
  mxPoint,
  mxConnectionConstraint,
  mxVertexHandler,
  mxImage,
} = mx;

export class MyGraph extends mxGraph {
  gridColor = '#d0d0d0';
  showGrid = true;
  rubberband: any;
  currentEdge?: {
    style: string;
    panelId: string;
  };

  getComponentEmits: () => GraphEmitsType;
  actions: Action;
  createVertexStatus = false;
  createEdgeStatus = false;
  lineStyle?: Record<string, string>[];
  cellRightClick?: (cells: typeMxCell[], menu: mxPopupMenuHandler) => void;
  handleAddVertex?: (cell: typeMxCell, x: number, y: number, target: typeMxCell) => void;
  handleDeleteCell?: (cell: typeMxCell) => void;
  handleAddEdge?: (cell: typeMxCell) => void;
  handleDropIn?: (target: typeMxCell, cells: typeMxCell[]) => void;
  handleDropOut?: (target: typeMxCell, cells: typeMxCell[]) => void;
  handleMoveCell?: (cell: typeMxCell) => void;

  handleRotate?: (cell: typeMxCell) => void;
  beforeDeleteCell?: (cell: typeMxCell) => boolean;
  beforeAddVertex?: (cell: typeMxCell) => boolean;
  // menuClick?:()
  constructor(container: HTMLElement) {
    super(container);
    this.actions = new Action(this);
    this.actions.init();
  }

  _init() {
    // 右键平移
    this.setPanning(true);
    this._setAnchors();
    this._setDefaultConfig();
    this._setDefaultEdgeStyle();
    // this._setDrop()
    this.setGrid();
    this._initActionState();
    // this.keyHandler.actions = this.actions;
    // this._initKeyHandler();
    // this.addUndoListener();
    /** 监听状态变化 */
    // this.getSelectionModel().addListener(mxEvent.CHANGE, () => {
    //   this._initActionState();
    // });
    // this.getModel().addListener(mxEvent.CHANGE, () => {
    //   this._initActionState();
    // });

    this.listenRotation();
  }

  _setDefaultConfig() {
    // cell style editable 控制是否可以双击编辑
    this.setConnectable(true);
    mxEvent.disableContextMenu(this.container);
    // 固定节点大小
    this.setCellsResizable(true);
    // // 编辑时按回车键不换行，而是完成输入
    // this.setEnterStopsCellEditing(true)
    // // 编辑时按 escape 后完成输入
    // mxCellEditor.prototype.escapeCancelsEditing = false
    // // 失焦时完成输入
    // mxCellEditor.prototype.blurEnabled = true
    // // 禁止节点折叠
    // this.foldingEnabled = false
    // // 文本包裹效果必须开启此配置
    this.setHtmlLabels(true);

    // // 拖拽过程对齐线
    mxGraphHandler.prototype.guidesEnabled = true;

    // // 禁止游离线条
    this.setDisconnectOnMove(false);
    // this.setAllowDanglingEdges(false)
    // mxGraph.prototype.isCellMovable=function = cell => !cell.edge

    // // 禁止调整线条弯曲度
    // this.setCellsBendable(false)

    // // 禁止从将label从线条上拖离
    mxGraph.prototype.edgeLabelsMovable = false;
    // 样式
    myStyle.children.forEach((ele: any) => {
      const node: { [k: string]: string } = {};
      ele.children.forEach((element: any) => {
        node[element.attributes.as] = element.attributes.value;
      });
      this.getStylesheet().putCellStyle(ele.attributes.as, node);
    });
  }

  _setDefaultEdgeStyle() {
    const style = this.getStylesheet().getDefaultEdgeStyle();
    Object.assign(style, {
      [mxConstants.STYLE_ROUNDED]: true, // 设置线条拐弯处为圆角
      [mxConstants.STYLE_STROKEWIDTH]: '2',
      [mxConstants.STYLE_STROKECOLOR]: '#333333',
      // [mxConstants.STYLE_EDGE]: mxConstants.EDGESTYLE_ORTHOGONAL,
      [mxConstants.STYLE_FONTCOLOR]: '#33333',
      // 连接线可编辑
      [mxConstants.STYLE_EDITABLE]: '0',
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#ffa94d',
    });

    mx.mxEdgeHandler.prototype.handleImage = new mx.mxImage(handlerImag, 17, 17);

    // style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ORTHOGONAL;
    // 设置拖拽线的过程出现折线，默认为直线
    this.connectionHandler.createEdgeState = () => {
      const edge = this.createEdge(
        this.defaultParent,
        null,
        '',
        new mxCell(),
        new mxCell(),
        `${mxConstants.STYLE_EDGE}=${mxConstants.EDGESTYLE_ORTHOGONAL};${mxConstants.STYLE_EDITABLE}=1`
      );
      edge.connectable = true;
      return new mxCellState(this.view, edge, this.getCellStyle(edge));
    };
  }

  // _initKeyHandler() {
  //   for (const key in this.actions.action) {
  //     if (Object.hasOwnProperty.call(this.actions.action, key)) {
  //       const action = this.actions.action[key];
  //       const shortcutKey = action.shortcutKey;
  //       if (shortcutKey) {
  //         const keyArray = shortcutKey.split('+');
  //         const isCtrl = keyArray.includes(ctrlKey);
  //         const isShift = keyArray.includes('Shift');
  //         const isDownKey =
  //           keyArray[keyArray.length - 1] === '加' ? '+' : keyArray[keyArray.length - 1];
  //         const downKey = keyCode[isDownKey];
  //         this.keyHandler.bindAction(downKey, isCtrl, key, isShift);
  //       }
  //     }
  //   }
  // }

  _setDrop() {
    this.setDropEnabled(true);
    this.isValidDropTarget = function (target, cells, evt) {
      if (target.info && target.info.type === 'combo') {
        return true;
      }
      return false;
    };
  }

  /**
   * 初始化大部分action的是否可用状态
   * toolbar是否可用操作通过这个函数进行状态管理
   */
  _initActionState() {
    let selected = !this.isSelectionEmpty();
    let vertexSelected = false;
    let groupSelected = false;
    let edgeSelected = false;
    const cells = this.getSelectionCells();
    if (cells != null) {
      for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        if (this.getModel().isEdge(cell)) {
          edgeSelected = true;
        }

        if (this.getModel().isVertex(cell)) {
          vertexSelected = true;

          if (this.getModel().getChildCount(cell) > 0) {
            groupSelected = true;
          }
        }

        if (edgeSelected && vertexSelected) {
          break;
        }
      }
    }
    const actions = ['cut', 'copy', 'delete', 'toFront', 'toBack'];
    for (let i = 0; i < actions.length; i++) {
      this.actions.get(actions[i]).setEnabled(selected);
    }
    let oneVertexSelected = vertexSelected && this.getSelectionCount() === 1;
    this.actions.get('group').setEnabled(this.getSelectionCount() > 1 || oneVertexSelected);
    this.actions.get('ungroup').setEnabled(groupSelected);
  }

  _setAnchors() {
    mxEdgeHandler.prototype.isConnectableCell = () => false;

    // hover时显示连接节点
    mxGraph.prototype.getAllConnectionConstraints = (terminal) => {
      if (terminal != null && terminal.cell != null && terminal.cell.isEdge()) {
        return [];
      }
      if (terminal != null && terminal.shape != null) {
        if (terminal.shape.stencil != null) {
          return terminal.shape.stencil.constraints;
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints;
        }
      }
      return [];
    };

    // 设计连接节点
    mxShape.prototype.constraints = [
      // new mxConnectionConstraint(new mxPoint(0, 0), true),
      // new mxConnectionConstraint(new mxPoint(0, 1), true),
      // new mxConnectionConstraint(new mxPoint(1, 0), true),
      // new mxConnectionConstraint(new mxPoint(1, 1), true),
      // new mxConnectionConstraint(new mxPoint(0.25, 0), true),
      new mxConnectionConstraint(new mxPoint(0.5, 0), true),
      // new mxConnectionConstraint(new mxPoint(0.75, 0), true),
      // new mxConnectionConstraint(new mxPoint(0, 0.25), true),
      new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      // new mxConnectionConstraint(new mxPoint(0, 0.75), true),
      // new mxConnectionConstraint(new mxPoint(1, 0.25), true),
      new mxConnectionConstraint(new mxPoint(1, 0.5), true),
      // new mxConnectionConstraint(new mxPoint(1, 0.75), true),
      // new mxConnectionConstraint(new mxPoint(0.25, 1), true),
      new mxConnectionConstraint(new mxPoint(0.5, 1), true),
      // new mxConnectionConstraint(new mxPoint(0.75, 1), true),
    ];
  }

  _initRotate() {
    // 旋转
    const rotationHandle = new mxImage(
      'data:image/png;base64,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',
      19,
      21
    );
    mxVertexHandler.prototype.rotationEnabled = true;

    let vertexHandlerCreateSizerShape = mxVertexHandler.prototype.createSizerShape;
    mxVertexHandler.prototype.createSizerShape = function (bounds, index, fillColor) {
      this.handleImage = index === mxEvent.ROTATION_HANDLE ? rotationHandle : this.handleImage;

      return vertexHandlerCreateSizerShape.apply(this, [bounds, index, fillColor]);
    };
  }

  /**
   * 创建背景grid svg
   * @param {string}} color grid的颜色
   */
  createSvgGrid() {
    let tmp = this.gridSize * this.getView().scale;
    const color = this.gridColor;
    while (tmp < 4) {
      tmp *= 2;
    }

    let tmp2 = 4 * tmp;

    // Small grid lines
    let d = [];

    for (let i = 1; i < 4; i++) {
      let tmp3 = i * tmp;
      d.push(`M 0 ${tmp3} L ${tmp2} ${tmp3} M ${tmp3} 0 L ${tmp3} ${tmp2}`);
    }

    // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
    // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
    let size = tmp2;
    let svg =
      `<svg width="${size}" height="${size}" xmlns="${mxConstants.NS_SVG}">` +
      `<defs><pattern id="grid" width="${tmp2}" height="${tmp2}" patternUnits="userSpaceOnUse">` +
      `<path d="${d.join(' ')}" fill="none" stroke="${color}" opacity="0.2" stroke-width="1"/>` +
      `<path d="M ${tmp2} 0 L 0 0 0 ${tmp2}" fill="none" stroke="${color}" stroke-width="1"/>` +
      `</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>`;

    return svg;
  }

  /** 设置Grid */
  setGrid() {
    const svg = this.createSvgGrid();
    let image = '';
    image = unescape(encodeURIComponent(svg));
    image = btoa(image);
    image = `url(` + `data:image/svg+xml;base64,${image})`;
    // this.container.parentElement.style.backgroundImage = `${image}`;
    this.container.style.backgroundImage = `${image}`;
    this.onPan();
  }

  onPan() {
    this.addListener(mxEvent.PAN_END, () => {
      const translate = this.view.translate;
      this.container.style.backgroundPositionX = `${translate.x}px`;
      this.container.style.backgroundPositionY = `${translate.y}px`;
    });
  }

  sidebarToGraph(dragCell: typeMxCell, x: number, y: number, target: typeMxCell) {
    try {
      if (this.beforeAddVertex && !this.beforeAddVertex(dragCell)) {
        return;
      }
      this.getModel().beginUpdate();
      dragCell.id = nanoid();
      this.createVertexStatus = true;
      const cell = this.importCells([dragCell], x, y, target);
      this.setSelectionCells(cell);
      this.createVertexStatus = false;
      this.handleAddVertex && this.handleAddVertex(cell[0], x, y, target);
    } finally {
      this.getModel().endUpdate();
    }
    // this.refresh()
  }

  insertVertetByConfig(cfg: NodeConfig) {
    let parent = this.getDefaultParent();
    if (cfg.parentId) {
      parent = this.findById(cfg.parentId) as typeMxCell;
    }
    const cell = this.insertVertex(
      parent,
      cfg.id || nanoid(),
      cfg.value || '',
      cfg.x,
      cfg.y,
      cfg.width,
      cfg.height,
      cfg.style,
      undefined
    );
    cell.info = cfg.info;
    return cell;
  }

  insertEdge(
    parent: typeMxCell,
    id: string | null,
    value: any,
    source: typeMxCell,
    target: typeMxCell,
    style?: string | undefined
  ): typeMxCell {
    let edge = this.createEdge(parent, id, value, source, target, style);
    edge = this.addEdge(edge, parent, source, target);
    if (!this.createEdgeStatus) {
      this.handleAddEdge && this.handleAddEdge(edge);
    }
    return edge;
  }

  moveCells(
    cells: typeMxCell[],
    dx: number,
    dy: number,
    clone: boolean,
    target?: typeMxCell | undefined,
    evt?: Event | undefined,
    mapping?: any
  ) {
    cells = mxGraph.prototype.moveCells.call(this, cells, dx, dy, clone, target, evt, mapping);
    if (target) {
      if (target.id === '1') {
        this.handleDropOut && this.handleDropOut(target, cells);
      } else {
        this.handleDropIn && this.handleDropIn(target, cells);
      }
    }
    if (!this.createVertexStatus) {
      cells.forEach((ele) => {
        this.handleMoveCell && this.handleMoveCell(ele);
      });
    }
    return cells;
  }

  findById(id: string | ((cell: typeMxCell) => boolean)) {
    const cells = this.getAllCells();
    const cell = cells.find((ele) => {
      if (typeof id === 'string') {
        return ele.id === id;
      } else {
        return id(ele);
      }
    });
    return cell;
  }

  getAllCells(): typeMxCell[] {
    const cells: typeMxCell[] = [];
    for (const key in this.model.cells) {
      if (Object.prototype.hasOwnProperty.call(this.model.cells, key)) {
        const element = this.model.cells[key];
        if (key !== '0' && key !== '1') {
          cells.push(element);
        }
      }
    }
    return cells;
  }

  deleteCells(cells: typeMxCell[]) {
    if (cells.length > 0) {
      for (let i = 0; i < cells.length; i++) {
        const ele = cells[i];
        let flag = true;
        if (this.beforeDeleteCell) {
          flag = this.beforeDeleteCell(ele);
        }
        if (flag) {
          this.removeCells([ele]);
          this.handleDeleteCell && this.handleDeleteCell(ele);
        }
      }
    }
  }

  insertEdgeByConfig(cfg: NodeConfig) {
    const cell = this.insertEdge(
      this.defaultParent,
      cfg.id ? cfg.id : null,
      cfg.value,
      cfg.source as typeMxCell,
      cfg.target as typeMxCell,
      cfg.style
    );
    return cell;
  }

  /**
   * 撤回和取消撤回的监听函数
   */
  addUndoListener() {
    const undo = this.actions.get('undo');
    const redo = this.actions.get('redo');

    const undoMgr = this.actions.undoManager;

    const undoListener = () => {
      undo.setEnabled(this.canUndo());
      redo.setEnabled(this.canRedo());
    };

    undoMgr.addListener(mxEvent.ADD, undoListener);
    undoMgr.addListener(mxEvent.UNDO, undoListener);
    undoMgr.addListener(mxEvent.REDO, undoListener);
    undoMgr.addListener(mxEvent.CLEAR, undoListener);

    // Updates the button states once
    undoListener();
  }

  /**
   * 是否可以撤回
   */
  canUndo() {
    return this.isEditing() || this.actions.undoManager.canUndo();
  }

  /**
   * 是否可以取消撤回
   */
  canRedo() {
    return this.isEditing() || this.actions.undoManager.canRedo();
  }

  /** 监听rotate */
  listenRotation() {
    this.addListener('rotate', (params) => {
      if (this.handleRotate) {
        this.handleRotate(params);
      }
    });
  }

  static createSvgImage = function (w, h, data, coordWidth?: string, coordHeight?: string) {
    let tmp = unescape(
      encodeURIComponent(
        `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">` +
          `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}px" height="${h}px" ${
            coordWidth != null && coordHeight != null
              ? `viewBox="0 0 ${coordWidth} ${coordHeight}" `
              : ''
          }version="1.1">${data}</svg>`
      )
    );

    return new mxImage(
      `data:image/svg+xml;base64,${window.btoa ? btoa(tmp) : Base64.encode(tmp, true)}`,
      w,
      h
    );
  };

  static svgTxt2Image = function (w, h, svgTxt) {
    let tmp = unescape(encodeURIComponent(svgTxt));
    return new mxImage(
      `data:image/svg+xml;base64,${window.btoa ? btoa(tmp) : Base64.encode(tmp, true)}`,
      w,
      h
    );
  };
}

export default MyGraph;

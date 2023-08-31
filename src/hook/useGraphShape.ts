import type { mxRectangle } from 'mxgraph';

import mx from '../hook/useGraphFactory';
import MyGraph from '@/hook/useGraphGraph';
import allShape from '@/const/shapes';
import { CustomShimShape, CustomSwimlineShape } from '@/const/customeShape';
import useGraphCustomStyle from '@/hook/useGraphCustomStyle';
import {isFunction} from "lodash";
const {
  SingleArrowShape,
  UmlLifeline,
  UmlFrame,
  ProcessShape,
  CrossShape,
  NoteShape,
  NoteShape2,
  ManualInputShape,
  DataStorageShape,
  CalloutShape,
  InternalStorageShape,
  ModuleShape,
  CornerShape,
  TeeShape,
  FolderShape,
  DocumentShape,
  TapeShape,
  IsoCubeShape2,
  CylinderShape,
  CylinderShape3,
  OffPageConnectorShape,
  StepShape,
  HexagonShape,
  CurlyBracketShape,
  DisplayShape,
  CubeShape,
  CardShape,
  LoopLimitShape,
  TrapezoidShape,
  ParallelogramShape,
} = allShape;
const {
  mxUtils,
  mxConstants,
  mxCellRenderer,
  mxPoint,
  mxVertexHandler,
  mxEdgeHandler,
  mxStencilRegistry,
  mxEvent,
  mxHandle,
} = mx;
function createHandle(
  state?: any,
  keys?: any,
  getPositionFn?: any,
  setPositionFn?: any,
  ignoreGrid?: any,
  redrawEdges?: any,
  executeFn?: any
) {
  let handle = new mxHandle(
    state,
    null,
    MyGraph.createSvgImage(
      18,
      18,
      `<circle cx="9" cy="9" r="5" stroke="#fff" fill="#fca000" stroke-width="1"/>`
    )
  );

  handle.execute = function (me) {
    for (let i = 0; i < keys.length; i++) {
      this.copyStyle(keys[i]);
    }

    if (executeFn) {
      executeFn(me);
    }
  };

  handle.getPosition = getPositionFn;
  handle.setPosition = setPositionFn;
  handle.ignoreGrid = ignoreGrid !== null ? ignoreGrid : true;

  // Overridden to update connected edges
  if (redrawEdges) {
    let positionChanged = handle.positionChanged;

    handle.positionChanged = function () {
      positionChanged.apply(this, arguments);

      // Redraws connected edges TODO: Include child edges
      state.view.invalidate(this.state.cell);
      state.view.validate();
    };
  }

  return handle;
}

function createArcHandle(state, yOffset?: any) {
  return createHandle(
    state,
    [mxConstants.STYLE_ARCSIZE],
    function (bounds) {
      let tmp = yOffset !== null ? yOffset : bounds.height / 8;

      if (mxUtils.getValue(state.style, mxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
        let arcSize =
          mxUtils.getValue(state.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;

        return new mxPoint(
          bounds.x + bounds.width - Math.min(bounds.width / 2, arcSize),
          bounds.y + tmp
        );
      } else {
        let arcSize =
          Math.max(
            0,
            parseFloat(
              mxUtils.getValue(
                state.style,
                mxConstants.STYLE_ARCSIZE,
                mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
              )
            )
          ) / 100;

        return new mxPoint(
          bounds.x +
            bounds.width -
            Math.min(
              Math.max(bounds.width / 2, bounds.height / 2),
              Math.min(bounds.width, bounds.height) * arcSize
            ),
          bounds.y + tmp
        );
      }
    },
    function (bounds, pt, me) {
      if (mxUtils.getValue(state.style, mxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
        this.state.style[mxConstants.STYLE_ARCSIZE] = Math.round(
          Math.max(0, Math.min(bounds.width, (bounds.x + bounds.width - pt.x) * 2))
        );
      } else {
        let f = Math.min(
          50,
          Math.max(
            0,
            ((bounds.width - pt.x + bounds.x) * 100) / Math.min(bounds.width, bounds.height)
          )
        );
        this.state.style[mxConstants.STYLE_ARCSIZE] = Math.round(f);
      }
    }
  );
}

function createArcHandleFunction() {
  return function (state) {
    let handles = [];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  };
}

function createTrapezoidHandleFunction(max, defaultValue, fixedDefaultValue) {
  max = max !== null ? max : 0.5;

  return function (state) {
    let handles = [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let fixed =
            fixedDefaultValue !== null
              ? mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0'
              : null;
          let size = Math.max(
            0,
            parseFloat(
              mxUtils.getValue(this.state.style, 'size', fixed ? fixedDefaultValue : defaultValue)
            )
          );

          return new mxPoint(
            bounds.x +
              Math.min(bounds.width * 0.75 * max, size * (fixed ? 0.75 : bounds.width * 0.75)),
            bounds.y + bounds.height / 4
          );
        },
        function (bounds, pt) {
          let fixed =
            fixedDefaultValue !== null
              ? mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0'
              : null;
          let size = fixed
            ? pt.x - bounds.x
            : Math.max(0, Math.min(max, ((pt.x - bounds.x) / bounds.width) * 0.75));

          this.state.style.size = size;
        },
        false,
        true
      ),
    ];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  };
}

function createDisplayHandleFunction(
  defaultValue?: any,
  allowArcHandle?: any,
  max?: any,
  redrawEdges?: any,
  fixedDefaultValue?: any
) {
  max = max !== null ? max : 0.5;

  return function (state) {
    let handles = [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let fixed =
            fixedDefaultValue !== null
              ? mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0'
              : null;
          let size = parseFloat(
            mxUtils.getValue(this.state.style, 'size', fixed ? fixedDefaultValue : defaultValue)
          );

          return new mxPoint(
            bounds.x + Math.max(0, Math.min(bounds.width * 0.5, size * (fixed ? 1 : bounds.width))),
            bounds.getCenterY()
          );
        },
        function (bounds, pt, me) {
          let fixed =
            fixedDefaultValue !== null
              ? mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0'
              : null;
          let size = fixed
            ? pt.x - bounds.x
            : Math.max(0, Math.min(max, (pt.x - bounds.x) / bounds.width));

          this.state.style.size = size;
        },
        false,
        redrawEdges
      ),
    ];

    if (allowArcHandle && mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  };
}

function createCubeHandleFunction(factor, defaultValue, allowArcHandle) {
  return function (state) {
    let handles = [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size =
            Math.max(
              0,
              Math.min(
                bounds.width,
                Math.min(
                  bounds.height,
                  parseFloat(mxUtils.getValue(this.state.style, 'size', defaultValue))
                )
              )
            ) * factor;

          return new mxPoint(bounds.x + size, bounds.y + size);
        },
        function (bounds, pt) {
          this.state.style.size = Math.round(
            Math.max(
              0,
              Math.min(
                Math.min(bounds.width, pt.x - bounds.x),
                Math.min(bounds.height, pt.y - bounds.y)
              )
            ) / factor
          );
        },
        false
      ),
    ];

    if (allowArcHandle && mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  };
}

function createCylinderHandleFunction(defaultValue) {
  return function (state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.height * 0.5,
              parseFloat(mxUtils.getValue(this.state.style, 'size', defaultValue))
            )
          );

          return new mxPoint(bounds.x, bounds.y + size);
        },
        function (bounds, pt) {
          this.state.style.size = Math.max(0, pt.y - bounds.y);
        },
        true
      ),
    ];
  };
}

function createArrowHandleFunction(maxSize) {
  return function (state) {
    return [
      createHandle(
        state,
        ['arrowWidth', 'arrowSize'],
        function (bounds) {
          let aw = Math.max(
            0,
            Math.min(
              1,
              mxUtils.getValue(
                this.state.style,
                'arrowWidth',
                SingleArrowShape.prototype.arrowWidth
              )
            )
          );
          let as = Math.max(
            0,
            Math.min(
              maxSize,
              mxUtils.getValue(this.state.style, 'arrowSize', SingleArrowShape.prototype.arrowSize)
            )
          );

          return new mxPoint(
            bounds.x + (1 - as) * bounds.width,
            bounds.y + ((1 - aw) * bounds.height) / 2
          );
        },
        function (bounds, pt) {
          this.state.style.arrowWidth = Math.max(
            0,
            Math.min(1, (Math.abs(bounds.y + bounds.height / 2 - pt.y) / bounds.height) * 2)
          );
          this.state.style.arrowSize = Math.max(
            0,
            Math.min(maxSize, (bounds.x + bounds.width - pt.x) / bounds.width)
          );
        }
      ),
    ];
  };
}

function createEdgeHandle(state, keys, start, getPosition, setPosition) {
  return createHandle(
    state,
    keys,
    function (bounds) {
      let pts = state.absolutePoints;
      let n = pts.length - 1;

      let tr = state.view.translate;
      let s = state.view.scale;

      let p0 = start ? pts[0] : pts[n];
      let p1 = start ? pts[1] : pts[n - 1];
      let dx = start ? p1.x - p0.x : p1.x - p0.x;
      let dy = start ? p1.y - p0.y : p1.y - p0.y;

      let dist = Math.sqrt(dx * dx + dy * dy);

      let pt = getPosition.call(this, dist, dx / dist, dy / dist, p0, p1);

      return new mxPoint(pt.x / s - tr.x, pt.y / s - tr.y);
    },
    function (bounds, pt, me) {
      let pts = state.absolutePoints;
      let n = pts.length - 1;

      let tr = state.view.translate;
      let s = state.view.scale;

      let p0 = start ? pts[0] : pts[n];
      let p1 = start ? pts[1] : pts[n - 1];
      let dx = start ? p1.x - p0.x : p1.x - p0.x;
      let dy = start ? p1.y - p0.y : p1.y - p0.y;

      let dist = Math.sqrt(dx * dx + dy * dy);
      pt.x = (pt.x + tr.x) * s;
      pt.y = (pt.y + tr.y) * s;

      setPosition.call(this, dist, dx / dist, dy / dist, p0, p1, pt, me);
    }
  );
}

function createEdgeWidthHandle(state, start, spacing) {
  return createEdgeHandle(
    state,
    ['width'],
    start,
    function (dist, nx, ny, p0, p1) {
      let w = state.shape.getEdgeWidth() * state.view.scale + spacing;

      return new mxPoint(
        p0.x + (nx * dist) / 4 + (ny * w) / 2,
        p0.y + (ny * dist) / 4 - (nx * w) / 2
      );
    },
    function (dist, nx, ny, p0, p1, pt) {
      let w = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y));
      state.style.width = Math.round(w * 2) / state.view.scale - spacing;
    }
  );
}

function ptLineDistance(x1, y1, x2, y2, x0, y0) {
  return (
    Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) /
    Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
  );
}

let handleFactory = {
  link(state) {
    let spacing = 10;

    return [
      createEdgeWidthHandle(state, true, spacing),
      createEdgeWidthHandle(state, false, spacing),
    ];
  },
  flexArrow(state) {
    // Do not use state.shape.startSize/endSize since it is cached
    let tol = state.view.graph.gridSize / state.view.scale;
    let handles = [];

    if (
      mxUtils.getValue(state.style, mxConstants.STYLE_STARTARROW, mxConstants.NONE) !==
      mxConstants.NONE
    ) {
      handles.push(
        createEdgeHandle(
          state,
          ['width', mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE],
          true,
          function (dist, nx, ny, p0, p1) {
            let w = (state.shape.getEdgeWidth() - state.shape.strokewidth) * state.view.scale;
            let l =
              mxUtils.getNumber(
                state.style,
                mxConstants.STYLE_STARTSIZE,
                mxConstants.ARROW_SIZE / 5
              ) *
              3 *
              state.view.scale;

            return new mxPoint(
              p0.x + nx * (l + state.shape.strokewidth * state.view.scale) + (ny * w) / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) - (nx * w) / 2
            );
          },
          function (dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y));
            let l = mxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y);

            state.style[mxConstants.STYLE_STARTSIZE] =
              Math.round(((l - state.shape.strokewidth) * 100) / 3) / 100 / state.view.scale;
            state.style.width = Math.round(w * 2) / state.view.scale;

            // Applies to opposite side
            if (mxEvent.isControlDown(me.getEvent())) {
              state.style[mxConstants.STYLE_ENDSIZE] = state.style[mxConstants.STYLE_STARTSIZE];
            }

            // Snaps to end geometry
            if (!mxEvent.isAltDown(me.getEvent())) {
              if (
                Math.abs(
                  parseFloat(state.style[mxConstants.STYLE_STARTSIZE]) -
                    parseFloat(state.style[mxConstants.STYLE_ENDSIZE])
                ) <
                tol / 6
              ) {
                state.style[mxConstants.STYLE_STARTSIZE] = state.style[mxConstants.STYLE_ENDSIZE];
              }
            }
          }
        )
      );

      handles.push(
        createEdgeHandle(
          state,
          ['startWidth', 'endWidth', mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE],
          true,
          function (dist, nx, ny, p0, p1) {
            let w = (state.shape.getStartArrowWidth() - state.shape.strokewidth) * state.view.scale;
            let l =
              mxUtils.getNumber(
                state.style,
                mxConstants.STYLE_STARTSIZE,
                mxConstants.ARROW_SIZE / 5
              ) *
              3 *
              state.view.scale;

            return new mxPoint(
              p0.x + nx * (l + state.shape.strokewidth * state.view.scale) + (ny * w) / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) - (nx * w) / 2
            );
          },
          function (dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y));
            let l = mxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y);

            state.style[mxConstants.STYLE_STARTSIZE] =
              Math.round(((l - state.shape.strokewidth) * 100) / 3) / 100 / state.view.scale;
            state.style.startWidth =
              Math.max(0, Math.round(w * 2) - state.shape.getEdgeWidth()) / state.view.scale;

            // Applies to opposite side
            if (mxEvent.isControlDown(me.getEvent())) {
              state.style[mxConstants.STYLE_ENDSIZE] = state.style[mxConstants.STYLE_STARTSIZE];
              state.style.endWidth = state.style.startWidth;
            }

            // Snaps to endWidth
            if (!mxEvent.isAltDown(me.getEvent())) {
              if (
                Math.abs(
                  parseFloat(state.style[mxConstants.STYLE_STARTSIZE]) -
                    parseFloat(state.style[mxConstants.STYLE_ENDSIZE])
                ) <
                tol / 6
              ) {
                state.style[mxConstants.STYLE_STARTSIZE] = state.style[mxConstants.STYLE_ENDSIZE];
              }

              if (
                Math.abs(parseFloat(state.style.startWidth) - parseFloat(state.style.endWidth)) <
                tol
              ) {
                state.style.startWidth = state.style.endWidth;
              }
            }
          }
        )
      );
    }

    if (
      mxUtils.getValue(state.style, mxConstants.STYLE_ENDARROW, mxConstants.NONE) !==
      mxConstants.NONE
    ) {
      handles.push(
        createEdgeHandle(
          state,
          ['width', mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE],
          false,
          function (dist, nx, ny, p0, p1) {
            let w = (state.shape.getEdgeWidth() - state.shape.strokewidth) * state.view.scale;
            let l =
              mxUtils.getNumber(
                state.style,
                mxConstants.STYLE_ENDSIZE,
                mxConstants.ARROW_SIZE / 5
              ) *
              3 *
              state.view.scale;

            return new mxPoint(
              p0.x + nx * (l + state.shape.strokewidth * state.view.scale) - (ny * w) / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) + (nx * w) / 2
            );
          },
          function (dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y));
            let l = mxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y);

            state.style[mxConstants.STYLE_ENDSIZE] =
              Math.round(((l - state.shape.strokewidth) * 100) / 3) / 100 / state.view.scale;
            state.style.width = Math.round(w * 2) / state.view.scale;

            // Applies to opposite side
            if (mxEvent.isControlDown(me.getEvent())) {
              state.style[mxConstants.STYLE_STARTSIZE] = state.style[mxConstants.STYLE_ENDSIZE];
            }

            // Snaps to start geometry
            if (!mxEvent.isAltDown(me.getEvent())) {
              if (
                Math.abs(
                  parseFloat(state.style[mxConstants.STYLE_ENDSIZE]) -
                    parseFloat(state.style[mxConstants.STYLE_STARTSIZE])
                ) <
                tol / 6
              ) {
                state.style[mxConstants.STYLE_ENDSIZE] = state.style[mxConstants.STYLE_STARTSIZE];
              }
            }
          }
        )
      );

      handles.push(
        createEdgeHandle(
          state,
          ['startWidth', 'endWidth', mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE],
          false,
          function (dist, nx, ny, p0, p1) {
            let w = (state.shape.getEndArrowWidth() - state.shape.strokewidth) * state.view.scale;
            let l =
              mxUtils.getNumber(
                state.style,
                mxConstants.STYLE_ENDSIZE,
                mxConstants.ARROW_SIZE / 5
              ) *
              3 *
              state.view.scale;

            return new mxPoint(
              p0.x + nx * (l + state.shape.strokewidth * state.view.scale) - (ny * w) / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) + (nx * w) / 2
            );
          },
          function (dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y));
            let l = mxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y);

            state.style[mxConstants.STYLE_ENDSIZE] =
              Math.round(((l - state.shape.strokewidth) * 100) / 3) / 100 / state.view.scale;
            state.style.endWidth =
              Math.max(0, Math.round(w * 2) - state.shape.getEdgeWidth()) / state.view.scale;

            // Applies to opposite side
            if (mxEvent.isControlDown(me.getEvent())) {
              state.style[mxConstants.STYLE_STARTSIZE] = state.style[mxConstants.STYLE_ENDSIZE];
              state.style.startWidth = state.style.endWidth;
            }

            // Snaps to start geometry
            if (!mxEvent.isAltDown(me.getEvent())) {
              if (
                Math.abs(
                  parseFloat(state.style[mxConstants.STYLE_ENDSIZE]) -
                    parseFloat(state.style[mxConstants.STYLE_STARTSIZE])
                ) <
                tol / 6
              ) {
                state.style[mxConstants.STYLE_ENDSIZE] = state.style[mxConstants.STYLE_STARTSIZE];
              }

              if (
                Math.abs(parseFloat(state.style.endWidth) - parseFloat(state.style.startWidth)) <
                tol
              ) {
                state.style.endWidth = state.style.startWidth;
              }
            }
          }
        )
      );
    }

    return handles;
  },
  swimlane(state) {
    let handles = [];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED)) {
      let size = parseFloat(
        mxUtils.getValue(state.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE)
      );
      handles.push(createArcHandle(state, size / 2));
    }

    // Start size handle must be last item in handles for hover to work in tables (see mouse event handler in Graph)
    handles.push(
      createHandle(
        state,
        [mxConstants.STYLE_STARTSIZE],
        function (bounds) {
          let size = parseFloat(
            mxUtils.getValue(
              state.style,
              mxConstants.STYLE_STARTSIZE,
              mxConstants.DEFAULT_STARTSIZE
            )
          );

          if (mxUtils.getValue(state.style, mxConstants.STYLE_HORIZONTAL, 1) === 1) {
            return new mxPoint(
              bounds.getCenterX(),
              bounds.y + Math.max(0, Math.min(bounds.height, size))
            );
          } else {
            return new mxPoint(
              bounds.x + Math.max(0, Math.min(bounds.width, size)),
              bounds.getCenterY()
            );
          }
        },
        function (bounds, pt) {
          state.style[mxConstants.STYLE_STARTSIZE] =
            mxUtils.getValue(this.state.style, mxConstants.STYLE_HORIZONTAL, 1) === 1
              ? Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
              : Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x)));
        },
        false,
        null,
        function (me) {
          if (mxEvent.isControlDown(me.getEvent())) {
            let graph = state.view.graph;

            if (graph.isTableRow(state.cell) || graph.isTableCell(state.cell)) {
              let dir = graph.getSwimlaneDirection(state.style);
              let parent = graph.model.getParent(state.cell);
              let cells = graph.model.getChildCells(parent, true);
              let temp = [];

              for (let i = 0; i < cells.length; i++) {
                // Finds siblings with the same direction and to set start size
                if (
                  cells[i] !== state.cell &&
                  graph.isSwimlane(cells[i]) &&
                  graph.getSwimlaneDirection(graph.getCurrentCellStyle(cells[i])) === dir
                ) {
                  temp.push(cells[i]);
                }
              }

              graph.setCellStyles(
                mxConstants.STYLE_STARTSIZE,
                state.style[mxConstants.STYLE_STARTSIZE],
                temp
              );
            }
          }
        }
      )
    );

    return handles;
  },
  label: createArcHandleFunction(),
  ext: createArcHandleFunction(),
  rectangle: createArcHandleFunction(),
  triangle: createArcHandleFunction(),
  rhombus: createArcHandleFunction(),
  umlLifeline(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.height,
              parseFloat(mxUtils.getValue(this.state.style, 'size', UmlLifeline.prototype.size))
            )
          );

          return new mxPoint(bounds.getCenterX(), bounds.y + size);
        },
        function (bounds, pt) {
          this.state.style.size = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)));
        },
        false
      ),
    ];
  },
  umlFrame(state) {
    let handles = [
      createHandle(
        state,
        ['width', 'height'],
        function (bounds) {
          let w0 = Math.max(
            UmlFrame.prototype.corner,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'width', UmlFrame.prototype.width)
            )
          );
          let h0 = Math.max(
            UmlFrame.prototype.corner * 1.5,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'height', UmlFrame.prototype.height)
            )
          );

          return new mxPoint(bounds.x + w0, bounds.y + h0);
        },
        function (bounds, pt) {
          this.state.style.width = Math.round(
            Math.max(UmlFrame.prototype.corner, Math.min(bounds.width, pt.x - bounds.x))
          );
          this.state.style.height = Math.round(
            Math.max(UmlFrame.prototype.corner * 1.5, Math.min(bounds.height, pt.y - bounds.y))
          );
        },
        false
      ),
    ];

    return handles;
  },
  process(state) {
    let handles = [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let fixed = mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0';
          let size = parseFloat(
            mxUtils.getValue(this.state.style, 'size', ProcessShape.prototype.size)
          );

          return fixed
            ? new mxPoint(bounds.x + size, bounds.y + bounds.height / 4)
            : new mxPoint(bounds.x + bounds.width * size, bounds.y + bounds.height / 4);
        },
        function (bounds, pt) {
          let fixed = mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0';
          let size = fixed
            ? Math.max(0, Math.min(bounds.width * 0.5, pt.x - bounds.x))
            : Math.max(0, Math.min(0.5, (pt.x - bounds.x) / bounds.width));
          this.state.style.size = size;
        },
        false
      ),
    ];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  },
  cross(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let m = Math.min(bounds.width, bounds.height);
          let size =
            (Math.max(
              0,
              Math.min(1, mxUtils.getValue(this.state.style, 'size', CrossShape.prototype.size))
            ) *
              m) /
            2;

          return new mxPoint(bounds.getCenterX() - size, bounds.getCenterY() - size);
        },
        function (bounds, pt) {
          let m = Math.min(bounds.width, bounds.height);
          this.state.style.size = Math.max(
            0,
            Math.min(
              1,
              Math.min(
                (Math.max(0, bounds.getCenterY() - pt.y) / m) * 2,
                (Math.max(0, bounds.getCenterX() - pt.x) / m) * 2
              )
            )
          );
        }
      ),
    ];
  },
  note(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.width,
              Math.min(
                bounds.height,
                parseFloat(mxUtils.getValue(this.state.style, 'size', NoteShape.prototype.size))
              )
            )
          );

          return new mxPoint(bounds.x + bounds.width - size, bounds.y + size);
        },
        function (bounds, pt) {
          this.state.style.size = Math.round(
            Math.max(
              0,
              Math.min(
                Math.min(bounds.width, bounds.x + bounds.width - pt.x),
                Math.min(bounds.height, pt.y - bounds.y)
              )
            )
          );
        }
      ),
    ];
  },
  note2(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.width,
              Math.min(
                bounds.height,
                parseFloat(mxUtils.getValue(this.state.style, 'size', NoteShape2.prototype.size))
              )
            )
          );

          return new mxPoint(bounds.x + bounds.width - size, bounds.y + size);
        },
        function (bounds, pt) {
          this.state.style.size = Math.round(
            Math.max(
              0,
              Math.min(
                Math.min(bounds.width, bounds.x + bounds.width - pt.x),
                Math.min(bounds.height, pt.y - bounds.y)
              )
            )
          );
        }
      ),
    ];
  },
  manualInput(state) {
    let handles = [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'size', ManualInputShape.prototype.size)
            )
          );

          return new mxPoint(bounds.x + bounds.width / 4, bounds.y + (size * 3) / 4);
        },
        function (bounds, pt) {
          this.state.style.size = Math.round(
            Math.max(0, Math.min(bounds.height, ((pt.y - bounds.y) * 4) / 3))
          );
        },
        false
      ),
    ];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  },
  dataStorage(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let fixed = mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0';
          let size = parseFloat(
            mxUtils.getValue(
              this.state.style,
              'size',
              fixed ? DataStorageShape.prototype.fixedSize : DataStorageShape.prototype.size
            )
          );

          return new mxPoint(
            bounds.x + bounds.width - size * (fixed ? 1 : bounds.width),
            bounds.getCenterY()
          );
        },
        function (bounds, pt) {
          let fixed = mxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0';
          let size = fixed
            ? Math.max(0, Math.min(bounds.width, bounds.x + bounds.width - pt.x))
            : Math.max(0, Math.min(1, (bounds.x + bounds.width - pt.x) / bounds.width));

          this.state.style.size = size;
        },
        false
      ),
    ];
  },
  callout(state) {
    let handles = [
      createHandle(
        state,
        ['size', 'position'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'size', CalloutShape.prototype.size)
            )
          );
          let position = Math.max(
            0,
            Math.min(
              1,
              mxUtils.getValue(this.state.style, 'position', CalloutShape.prototype.position)
            )
          );
          let base = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'base', CalloutShape.prototype.base)
            )
          );

          return new mxPoint(bounds.x + position * bounds.width, bounds.y + bounds.height - size);
        },
        function (bounds, pt) {
          let base = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'base', CalloutShape.prototype.base)
            )
          );
          this.state.style.size = Math.round(
            Math.max(0, Math.min(bounds.height, bounds.y + bounds.height - pt.y))
          );
          this.state.style.position =
            Math.round(Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width)) * 100) / 100;
        },
        false
      ),
      createHandle(
        state,
        ['position2'],
        function (bounds) {
          let position2 = Math.max(
            0,
            Math.min(
              1,
              mxUtils.getValue(this.state.style, 'position2', CalloutShape.prototype.position2)
            )
          );

          return new mxPoint(bounds.x + position2 * bounds.width, bounds.y + bounds.height);
        },
        function (bounds, pt) {
          this.state.style.position2 =
            Math.round(Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width)) * 100) / 100;
        },
        false
      ),
      createHandle(
        state,
        ['base'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'size', CalloutShape.prototype.size)
            )
          );
          let position = Math.max(
            0,
            Math.min(
              1,
              mxUtils.getValue(this.state.style, 'position', CalloutShape.prototype.position)
            )
          );
          let base = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'base', CalloutShape.prototype.base)
            )
          );

          return new mxPoint(
            bounds.x + Math.min(bounds.width, position * bounds.width + base),
            bounds.y + bounds.height - size
          );
        },
        function (bounds, pt) {
          let position = Math.max(
            0,
            Math.min(
              1,
              mxUtils.getValue(this.state.style, 'position', CalloutShape.prototype.position)
            )
          );

          this.state.style.base = Math.round(
            Math.max(0, Math.min(bounds.width, pt.x - bounds.x - position * bounds.width))
          );
        },
        false
      ),
    ];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  },
  internalStorage(state) {
    let handles = [
      createHandle(
        state,
        ['dx', 'dy'],
        function (bounds) {
          let dx = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'dx', InternalStorageShape.prototype.dx)
            )
          );
          let dy = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'dy', InternalStorageShape.prototype.dy)
            )
          );

          return new mxPoint(bounds.x + dx, bounds.y + dy);
        },
        function (bounds, pt) {
          this.state.style.dx = Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x)));
          this.state.style.dy = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)));
        },
        false
      ),
    ];

    if (mxUtils.getValue(state.style, mxConstants.STYLE_ROUNDED, false)) {
      handles.push(createArcHandle(state));
    }

    return handles;
  },
  module(state) {
    let handles = [
      createHandle(
        state,
        ['jettyWidth', 'jettyHeight'],
        function (bounds) {
          let dx = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'jettyWidth', ModuleShape.prototype.jettyWidth)
            )
          );
          let dy = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'jettyHeight', ModuleShape.prototype.jettyHeight)
            )
          );

          return new mxPoint(bounds.x + dx / 2, bounds.y + dy * 2);
        },
        function (bounds, pt) {
          this.state.style.jettyWidth = Math.round(
            Math.max(0, Math.min(bounds.width, pt.x - bounds.x)) * 2
          );
          this.state.style.jettyHeight = Math.round(
            Math.max(0, Math.min(bounds.height, pt.y - bounds.y)) / 2
          );
        }
      ),
    ];

    return handles;
  },
  corner(state) {
    return [
      createHandle(
        state,
        ['dx', 'dy'],
        function (bounds) {
          let dx = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'dx', CornerShape.prototype.dx)
            )
          );
          let dy = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'dy', CornerShape.prototype.dy)
            )
          );

          return new mxPoint(bounds.x + dx, bounds.y + dy);
        },
        function (bounds, pt) {
          this.state.style.dx = Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x)));
          this.state.style.dy = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)));
        },
        false
      ),
    ];
  },
  tee(state) {
    return [
      createHandle(
        state,
        ['dx', 'dy'],
        function (bounds) {
          let dx = Math.max(
            0,
            Math.min(bounds.width, mxUtils.getValue(this.state.style, 'dx', TeeShape.prototype.dx))
          );
          let dy = Math.max(
            0,
            Math.min(bounds.height, mxUtils.getValue(this.state.style, 'dy', TeeShape.prototype.dy))
          );

          return new mxPoint(bounds.x + (bounds.width + dx) / 2, bounds.y + dy);
        },
        function (bounds, pt) {
          this.state.style.dx = Math.round(
            Math.max(0, Math.min(bounds.width / 2, pt.x - bounds.x - bounds.width / 2) * 2)
          );
          this.state.style.dy = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)));
        },
        false
      ),
    ];
  },
  singleArrow: createArrowHandleFunction(1),
  doubleArrow: createArrowHandleFunction(0.5),
  folder(state) {
    return [
      createHandle(
        state,
        ['tabWidth', 'tabHeight'],
        function (bounds) {
          let tw = Math.max(
            0,
            Math.min(
              bounds.width,
              mxUtils.getValue(this.state.style, 'tabWidth', FolderShape.prototype.tabWidth)
            )
          );
          let th = Math.max(
            0,
            Math.min(
              bounds.height,
              mxUtils.getValue(this.state.style, 'tabHeight', FolderShape.prototype.tabHeight)
            )
          );

          if (
            mxUtils.getValue(this.state.style, 'tabPosition', FolderShape.prototype.tabPosition) ===
            mxConstants.ALIGN_RIGHT
          ) {
            tw = bounds.width - tw;
          }

          return new mxPoint(bounds.x + tw, bounds.y + th);
        },
        function (bounds, pt) {
          let tw = Math.max(0, Math.min(bounds.width, pt.x - bounds.x));

          if (
            mxUtils.getValue(this.state.style, 'tabPosition', FolderShape.prototype.tabPosition) ===
            mxConstants.ALIGN_RIGHT
          ) {
            tw = bounds.width - tw;
          }

          this.state.style.tabWidth = Math.round(tw);
          this.state.style.tabHeight = Math.round(
            Math.max(0, Math.min(bounds.height, pt.y - bounds.y))
          );
        },
        false
      ),
    ];
  },
  customSwimline(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds: mxRectangle) {
          let size = Math.max(
            0,
            Math.min(
              1,
              parseFloat(
                mxUtils.getValue(this.state.style, 'size', CustomSwimlineShape.prototype.size)
              )
            )
          );
          return new mxPoint(bounds.x + 20, bounds.y + size * bounds.height);
        },
        function (bounds: mxRectangle, pt: typeof mxPoint.prototype) {
          this.state.style.size = Math.max(0, Math.min(1, (pt.y - bounds.y) / bounds.height));
        },
        false
      ),
    ];
  },
  customShim(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds: mxRectangle) {
          let size = Math.max(
            0,
            Math.min(
              1,
              parseFloat(mxUtils.getValue(this.state.style, 'size', CustomShimShape.prototype.size))
            )
          );
          return new mxPoint(bounds.x + +size * bounds.width, bounds.y + 20);
        },
        function (bounds: mxRectangle, pt: typeof mxPoint.prototype) {
          this.state.style.size = Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.x));
        },
        false
      ),
    ];
  },
  document(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              1,
              parseFloat(mxUtils.getValue(this.state.style, 'size', DocumentShape.prototype.size))
            )
          );

          return new mxPoint(
            bounds.x + (3 * bounds.width) / 4,
            bounds.y + (1 - size) * bounds.height
          );
        },
        function (bounds, pt) {
          this.state.style.size = Math.max(
            0,
            Math.min(1, (bounds.y + bounds.height - pt.y) / bounds.height)
          );
        },
        false
      ),
    ];
  },
  tape(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              1,
              parseFloat(mxUtils.getValue(this.state.style, 'size', TapeShape.prototype.size))
            )
          );

          return new mxPoint(bounds.getCenterX(), bounds.y + (size * bounds.height) / 2);
        },
        function (bounds, pt) {
          this.state.style.size = Math.max(0, Math.min(1, ((pt.y - bounds.y) / bounds.height) * 2));
        },
        false
      ),
    ];
  },
  isoCube2(state) {
    return [
      createHandle(
        state,
        ['isoAngle'],
        function (bounds) {
          let isoAngle =
            (Math.max(
              0.01,
              Math.min(
                94,
                parseFloat(
                  mxUtils.getValue(this.state.style, 'isoAngle', (IsoCubeShape2 as any).isoAngle)
                )
              )
            ) *
              Math.PI) /
            200;
          let isoH = Math.min(bounds.width * Math.tan(isoAngle), bounds.height * 0.5);

          return new mxPoint(bounds.x, bounds.y + isoH);
        },
        function (bounds, pt) {
          this.state.style.isoAngle = Math.max(0, ((pt.y - bounds.y) * 50) / bounds.height);
        },
        true
      ),
    ];
  },
  cylinder2: createCylinderHandleFunction(CylinderShape.prototype.size),
  cylinder3: createCylinderHandleFunction(CylinderShape3.prototype.size),
  offPageConnector(state) {
    return [
      createHandle(
        state,
        ['size'],
        function (bounds) {
          let size = Math.max(
            0,
            Math.min(
              1,
              parseFloat(
                mxUtils.getValue(this.state.style, 'size', OffPageConnectorShape.prototype.size)
              )
            )
          );

          return new mxPoint(bounds.getCenterX(), bounds.y + (1 - size) * bounds.height);
        },
        function (bounds, pt) {
          this.state.style.size = Math.max(
            0,
            Math.min(1, (bounds.y + bounds.height - pt.y) / bounds.height)
          );
        },
        false
      ),
    ];
  },
  step: createDisplayHandleFunction(
    StepShape.prototype.size,
    true,
    null,
    true,
    StepShape.prototype.fixedSize
  ),
  hexagon: createDisplayHandleFunction(
    HexagonShape.prototype.size,
    true,
    0.5,
    true,
    HexagonShape.prototype.fixedSize
  ),
  curlyBracket: createDisplayHandleFunction(CurlyBracketShape.prototype.size, false),
  display: createDisplayHandleFunction(DisplayShape.prototype.size, false),
  cube: createCubeHandleFunction(1, CubeShape.prototype.size, false),
  card: createCubeHandleFunction(0.5, CardShape.prototype.size, true),
  loopLimit: createCubeHandleFunction(0.5, LoopLimitShape.prototype.size, true),
  trapezoid: createTrapezoidHandleFunction(
    0.5,
    TrapezoidShape.prototype.size,
    TrapezoidShape.prototype.fixedSize
  ),
  parallelogram: createTrapezoidHandleFunction(
    1,
    ParallelogramShape.prototype.size,
    ParallelogramShape.prototype.fixedSize
  ),
};

let vertexHandlerCreateCustomHandles = mxVertexHandler.prototype.createCustomHandles;

mxVertexHandler.prototype.createCustomHandles = function () {
  let handles = vertexHandlerCreateCustomHandles.apply(this, arguments);

  if (this.graph.isCellRotatable(this.state.cell)) {
    // LATER: Make locked state independent of rotatable flag, fix toggle if default is false
    // if (this.graph.isCellResizable(this.state.cell) || this.graph.isCellMovable(this.state.cell))
    let name = this.state.style.shape;

    if (
      mxCellRenderer.defaultShapes[name] === null &&
      mxStencilRegistry.getStencil(name) === null
    ) {
      name = mxConstants.SHAPE_RECTANGLE;
    } else if (this.state.view.graph.isSwimlane(this.state.cell)) {
      name = mxConstants.SHAPE_SWIMLANE;
    }

    let fn = handleFactory[name];

    if (fn === null && this.state.shape !== null && this.state.shape.isRoundable()) {
      fn = handleFactory[mxConstants.SHAPE_RECTANGLE];
    }

    if (isFunction(fn)) {
      let temp = fn(this.state);

      if (temp !== null) {
        if (handles === null) {
          handles = temp;
        } else {
          handles = handles.concat(temp);
        }
      }
    }
  }

  return handles;
};
mxVertexHandler.prototype.handleImage = MyGraph.createSvgImage(
  18,
  18,
  `<circle cx="9" cy="9" r="5" stroke="#fff" fill="#29b6f2" stroke-width="1"/>`
);

mxEdgeHandler.prototype.createCustomHandles = function () {
  let name = this.state.style.shape;

  if (mxCellRenderer.defaultShapes[name] === null && mxStencilRegistry.getStencil(name) === null) {
    name = mxConstants.SHAPE_CONNECTOR;
  }

  let fn = handleFactory[name];

  if (isFunction(fn)) {
    return fn(this.state);
  }

  return null;
};

useGraphCustomStyle();
export default () => {};

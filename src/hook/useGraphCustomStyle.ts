import mx from '@/components/mxGraph/src/hook/useGraphFactory';
const { mxUtils, mxPoint, mxStyleRegistry, mxElbowEdgeHandler, mxEdgeStyle } = mx;
let isoHVector = new mxPoint(1, 0);
let isoVVector = new mxPoint(1, 0);

let alpha1 = mxUtils.toRadians(-30);

let cos1 = Math.cos(alpha1);
let sin1 = Math.sin(alpha1);

isoHVector = mxUtils.getRotatedPoint(isoHVector, cos1, sin1);

let alpha2 = mxUtils.toRadians(-150);

let cos2 = Math.cos(alpha2);
let sin2 = Math.sin(alpha2);

isoVVector = mxUtils.getRotatedPoint(isoVVector, cos2, sin2);

mxEdgeStyle.IsometricConnector = function (state, source, target, points, result) {
  let view = state.view;
  let pt = points !== null && points.length > 0 ? points[0] : null;
  let pts = state.absolutePoints;
  let p0 = pts[0];
  let pe = pts[pts.length - 1];

  if (pt !== null) {
    pt = view.transformControlPoint(state, pt);
  }

  if (p0 === null) {
    if (source !== null) {
      p0 = new mxPoint(source.getCenterX(), source.getCenterY());
    }
  }

  if (pe === null) {
    if (target !== null) {
      pe = new mxPoint(target.getCenterX(), target.getCenterY());
    }
  }

  let a1 = isoHVector.x;
  let a2 = isoHVector.y;

  let b1 = isoVVector.x;
  let b2 = isoVVector.y;

  let elbow = mxUtils.getValue(state.style, 'elbow', 'horizontal') === 'horizontal';

  if (pe !== null && p0 !== null) {
    let last = p0;

    function isoLineTo(x, y, ignoreFirst) {
      let c1 = x - last.x;
      let c2 = y - last.y;

      // Solves for isometric base vectors
      let h = (b2 * c1 - b1 * c2) / (a1 * b2 - a2 * b1);
      let v = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2);

      if (elbow) {
        if (ignoreFirst) {
          last = new mxPoint(last.x + a1 * h, last.y + a2 * h);
          result.push(last);
        }

        last = new mxPoint(last.x + b1 * v, last.y + b2 * v);
        result.push(last);
      } else {
        if (ignoreFirst) {
          last = new mxPoint(last.x + b1 * v, last.y + b2 * v);
          result.push(last);
        }

        last = new mxPoint(last.x + a1 * h, last.y + a2 * h);
        result.push(last);
      }
    }

    if (pt === null) {
      pt = new mxPoint(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2);
    }

    isoLineTo(pt.x, pt.y, true);
    isoLineTo(pe.x, pe.y, false);
  }
};

mxStyleRegistry.putValue('isometricEdgeStyle', mxEdgeStyle.IsometricConnector);

let graphCreateEdgeHandler = mx.mxGraph.prototype.createEdgeHandler;
mx.mxGraph.prototype.createEdgeHandler = function (state, edgeStyle) {
  if (edgeStyle === mxEdgeStyle.IsometricConnector) {
    let handler = new mxElbowEdgeHandler(state);
    handler.snapToTerminals = false;

    return handler;
  }

  return graphCreateEdgeHandler.apply(this, arguments);
};

export default () => {};

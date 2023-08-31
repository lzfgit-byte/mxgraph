import type { mxSvgCanvas2D } from 'mxgraph';
import mx from '@/hook/useGraphFactory';
import { flowImageType, imageFlow } from '@/const/images';
const { mxActor, mxUtils, mxCellRenderer, mxConnectionConstraint, mxPoint, mxTriangle } = mx;

export function CustomSwimlineShape() {
  mxActor.call(this);
}
mxUtils.extend(CustomSwimlineShape, mxActor);
CustomSwimlineShape.prototype.size = 0.2;
CustomSwimlineShape.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const size = Math.max(
    0,
    Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
  );
  c.moveTo(0, 0);
  c.rect(0, 0, w, h);
  c.fillAndStroke();
  c.rect(0, 0, w, h * size);
  c.stroke();
  c.close();
  c.end();
};
mxCellRenderer.registerShape('customSwimline', CustomSwimlineShape);

CustomSwimlineShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.75), false),
  new mxConnectionConstraint(new mxPoint(1, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(0.25, 1), false),
  new mxConnectionConstraint(new mxPoint(0.75, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];
//
export function CustomShimShape() {
  mxActor.call(this);
}
mxUtils.extend(CustomShimShape, mxActor);
CustomShimShape.prototype.size = 0.2;
CustomShimShape.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const size = Math.max(
    0,
    Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
  );
  c.moveTo(0, 0);
  c.rect(0, 0, w, h);
  c.fillAndStroke();
  c.rect(0, 0, w * size, h);
  c.stroke();
  c.close();
  c.end();
};
mxCellRenderer.registerShape('customShim', CustomShimShape);

CustomShimShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.75), false),
  new mxConnectionConstraint(new mxPoint(1, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(0.25, 1), false),
  new mxConnectionConstraint(new mxPoint(0.75, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];
// 椭圆
export function CustomEllipseShape() {
  mxActor.call(this);
}
mxUtils.extend(CustomEllipseShape, mxActor);
CustomEllipseShape.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const txt = mxUtils.getValue(this.style, 'textValue', 'a');
  c.moveTo(0, 0);
  c.ellipse(0, 0, w, h);
  c.fillAndStroke();
  c.text(w / 2, 10, 20, 20, txt, 'center');
  c.end();
  c.close();
};
mxCellRenderer.registerShape('customEllipse', CustomEllipseShape);

CustomEllipseShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.75), false),
  new mxConnectionConstraint(new mxPoint(1, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(0.25, 1), false),
  new mxConnectionConstraint(new mxPoint(0.75, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];

// 倒三角
export function InvertedTriangle() {
  mxTriangle.call(this);
}
mxUtils.extend(InvertedTriangle, mxTriangle);
InvertedTriangle.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  c.moveTo(0, 0);
  c.lineTo(w, 0);
  c.lineTo(w / 2, h);
  c.lineTo(0, 0);
  c.fillAndStroke();
  c.end();
  c.close();
};
mxCellRenderer.registerShape('customInvertedTriangle', InvertedTriangle);
InvertedTriangle.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
];
// 正三角
export function CustomTriangle() {
  mxTriangle.call(this);
}
mxUtils.extend(CustomTriangle, mxTriangle);
CustomTriangle.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  c.moveTo(w / 2, 0);
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.lineTo(w / 2, 0);
  c.fillAndStroke();
  c.end();
  c.close();
};
mxCellRenderer.registerShape('customTriangle', CustomTriangle);
CustomTriangle.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];
// double diamond
export function DoubleDiamond() {
  mxTriangle.call(this);
}
mxUtils.extend(DoubleDiamond, mxTriangle);
DoubleDiamond.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const offset = 10;
  const rate = w / h;
  c.moveTo(w / 2, 0);
  c.lineTo(0, h / 2);
  c.lineTo(w / 2, h);
  c.lineTo(w, h / 2);
  c.lineTo(w / 2, 0);

  c.moveTo(w / 2, offset / rate);
  c.lineTo(offset, h / 2);
  c.lineTo(w / 2, h - offset / rate);
  c.lineTo(w - offset, h / 2);
  c.lineTo(w / 2, offset / rate);

  c.fillAndStroke();
  c.end();
  c.close();
};
mxCellRenderer.registerShape('customDoubleDiamond', DoubleDiamond);
DoubleDiamond.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
];
// CustomStepShape
export function CustomStepShape() {
  mxTriangle.call(this);
}
mxUtils.extend(CustomStepShape, mxTriangle);
CustomStepShape.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const pointer = mxUtils.getValue(this.style, 'customPointer', 0.8);
  c.moveTo(0, 0);
  c.lineTo(w * pointer, 0);
  c.lineTo(w, h / 2);
  c.lineTo(w * pointer, h);
  c.lineTo(0, h);
  c.lineTo(0, 0);
  c.end();
  c.close();
};
mxCellRenderer.registerShape('customStep', CustomStepShape);
CustomStepShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
];
// 倒梯形
export function InvertedTrapezoidal() {
  mxTriangle.call(this);
}
mxUtils.extend(InvertedTrapezoidal, mxTriangle);
InvertedTrapezoidal.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const pointer = mxUtils.getValue(this.style, 'customPointer', 0.2);
  c.moveTo(0, 0);
  c.lineTo(w, 0);
  c.lineTo(w * (1 - pointer), h);
  c.lineTo(w * pointer, h);
  c.lineTo(0, 0);
  c.end();
  c.close();
};
mxCellRenderer.registerShape('customInvertedTrapezoidal', InvertedTrapezoidal);
InvertedTrapezoidal.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(0.1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.9, 0.5), false),
];

// double diamond
export function CustomImageDiamond() {
  mxTriangle.call(this);
}
mxUtils.extend(CustomImageDiamond, mxTriangle);
CustomImageDiamond.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const imageType = mxUtils.getValue(this.style, 'imageType', flowImageType.YUNJIA);

  c.begin();
  c.moveTo(w / 2, 0);
  c.lineTo(0, h / 2);
  c.lineTo(w / 2, h);
  c.lineTo(w, h / 2);
  c.lineTo(w / 2, 0);
  c.fillAndStroke();

  const d = Math.min(w, h) * 0.6;
  const r = d / 2;
  const mx = w / 2;
  const my = h / 2;
  const ex = mx - r;
  const ey = my - r;
  c.image(ex, ey, d, d, imageFlow[imageType], true, false, false);

  c.end();
  c.close();
};
mxCellRenderer.registerShape('customPlusDiamond', CustomImageDiamond);
CustomImageDiamond.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.75), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
];
// time_line
export function CustomTimeLine() {
  mxTriangle.call(this);
}
mxUtils.extend(CustomTimeLine, mxTriangle);
CustomTimeLine.prototype.redrawPath = function (c: mxSvgCanvas2D, x, y, w, h) {
  const year = mxUtils.getValue(this.style, 'year', '2023');
  c.moveTo(0, h);
  c.lineTo(0, 0);
  c.lineTo(w, 0);
  c.lineTo(w, h);
  // const stepWidth = w / 12;
  // for (let i = 0; i < 12 - 1; i++) {
  //   const step = (i + 1) * stepWidth;
  //   c.moveTo(step, 0);
  //   c.lineTo(step, h * 0.1);
  // }
  c.end();
};
mxCellRenderer.registerShape('customTimeLine', CustomTimeLine);
CustomTimeLine.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];

import mx from './useGraphFactory';
const { mxClient } = mx;

export const ctrlKey = mxClient.IS_MAC ? 'Cmd' : 'Ctrl';

export const keyCode: { [k: string]: number } = {
  A: 65,
  J: 74,
  S: 83,
  '1': 49,
  B: 66,
  K: 75,
  T: 84,
  '2': 50,
  C: 67,
  L: 76,
  U: 85,
  '3': 51,
  D: 68,
  M: 77,
  V: 86,
  '4': 52,
  E: 69,
  N: 78,
  W: 87,
  '5': 53,
  F: 70,
  O: 79,
  X: 88,
  '6': 54,
  G: 71,
  P: 80,
  Y: 89,
  '7': 55,
  H: 72,
  Q: 81,
  Z: 90,
  '8': 56,
  I: 73,
  R: 82,
  '0': 48,
  '9': 57,
  Delete: 46,
  '-': 189,
  '+': 187,
};

export function clone(item: any) {
  if (!item) {
    return item;
  } // null, undefined values check

  const types = [Number, String, Boolean];
  let result: any;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result == 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = [];
      item.forEach(function (child: any, index: number) {
        result[index] = clone(child);
      });
    } else if (typeof item == 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true);
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (let i in item) {
            result[i] = clone(item[i]);
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
}
// mxPerimeter;TODO ?? 原先是放开的
// lifeline 线上链接点自动吸附
// style设置perimeter=lifelinePerimeter;
// (mxPerimeter as any).LifelinePerimeter = function (bounds, vertex, next, orthogonal) {
//   let size = 60;
//
//   if (vertex != null) {
//     size = mx.mxUtils.getValue(vertex.style, 'size', size) * vertex.view.scale;
//   }
//
//   let sw =
//     (parseFloat(vertex.style[mx.mxConstants.STYLE_STROKEWIDTH] || 1) * vertex.view.scale) / 2 - 1;
//
//   if (next.x < bounds.getCenterX()) {
//     sw += 1;
//     sw *= -1;
//   }
//   return new mx.mxPoint(
//     bounds.getCenterX() + sw,
//     Math.min(bounds.y + bounds.height, Math.max(bounds.y + size, next.y))
//   );
// };
// (mxStyleRegistry as any).putValue('lifelinePerimeter', (mxPerimeter as any).LifelinePerimeter);

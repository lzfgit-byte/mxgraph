import { nanoid } from 'nanoid';
import type MyGraph from '@/hook/useGraphGraph';
import mx from '@/hook/useGraphFactory';
import { baseEdgeSvg, baseSvgInfo } from '@/const/svgConst';
import type { ItemType } from '@/type/graphTyped';
const { mxClient, mxCell, mxGeometry, mxConstants, mxPoint } = mx;
export interface cShapeType {
  key?: string;
  svgHtml?: string;
  style?: string;
  w?: number;
  h?: number;
  type?: ItemType;
  isShow?: boolean;
  value?: string;
  func?: (
    graph: MyGraph,
    x,
    y,
    w,
    h,
    id?: string,
    value?: string,
    businessData?: Record<string, any>
  ) => void;
  tw?: number;
  th?: number;
}
export const renderSvgCurrent = (graph, shapes: cShapeType[]) => {
  shapes = shapes.filter((item) => item.isShow !== false);
  const renderSvg = (style, width = 32, height = 30, value) => {
    let fo = mxClient.NO_FO;
    mxClient.NO_FO = false;
    graph.view.scaleAndTranslate(1, 0, 0);
    const cell = new mxCell(value, new mxGeometry(0, 0, width, height), style);
    cell.vertex = true;
    cell.connectable = false;
    cell.id = nanoid();
    graph.addCells([cell]);
    let s_width = 32 * 1.5;
    let s_height = 30 * 1.5;
    let s = Math.min(s_width / width, s_height / height);
    const dx = s_width - width * s;
    const dy = s_height - height * s;
    graph.view.scaleAndTranslate(s, dx * (2 - s), dy * (1.5 - s));
    let node = null;
    if (
      graph.dialect === mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } else {
      node = graph.container.cloneNode(false);
      node.innerHTML = graph.container.innerHTML;
      if (mxClient.IS_QUIRKS || document.documentMode === 8) {
        node.firstChild.style.overflow = 'visible';
      }
    }
    graph.getModel().clear();
    mxClient.NO_FO = fo;
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.width = `${s_width + 1}px`;
    node.style.height = `${s_height + 1}px`;
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    return node.outerHTML;
  };

  const renderEdgeSvg = (style, width = 32, height = 30, value) => {
    const cell = new mxCell(value != null ? value : '', new mxGeometry(0, 0, width, height), style);
    cell.geometry.setTerminalPoint(new mxPoint(0, height), true);
    cell.geometry.setTerminalPoint(new mxPoint(width, 0), false);
    cell.geometry.relative = true;
    cell.edge = true;
    cell.id = nanoid();
    let fo = mxClient.NO_FO;
    mxClient.NO_FO = false;
    graph.view.scaleAndTranslate(1, 0, 0);
    graph.addCells([cell]);
    let s_width = 32 * 1.5;
    let s_height = 30 * 1.5;
    let s = Math.min(s_width / width, s_height / height);
    const dx = s_width - width * s;
    const dy = s_height - height * s;
    graph.view.scaleAndTranslate(s, dx * (2 - s), dy * (1.5 - s));
    let node = null;
    if (
      graph.dialect === mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } else {
      node = graph.container.cloneNode(false);
      node.innerHTML = graph.container.innerHTML;
      if (mxClient.IS_QUIRKS || document.documentMode === 8) {
        node.firstChild.style.overflow = 'visible';
      }
    }
    graph.getModel().clear();
    mxClient.NO_FO = fo;
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.width = `${s_width + 1}px`;
    node.style.height = `${s_height + 1}px`;
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    return node.outerHTML;
  };

  const renderFuncSvg = (cInfo: cShapeType, width = 32, height = 30) => {
    let fo = mxClient.NO_FO;
    mxClient.NO_FO = false;
    graph.view.scaleAndTranslate(1, 0, 0);
    cInfo.func(graph, 0, 0, width, height);
    let s_width = 32 * 1.5;
    let s_height = 30 * 1.5;
    let s = Math.min(s_width / width, s_height / height);
    const dx = s_width - width * s;
    const dy = s_height - height * s;
    graph.view.scaleAndTranslate(s, dx * (2 - s), dy * (1.5 - s));
    let node = null;
    if (
      graph.dialect === mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } else {
      node = graph.container.cloneNode(false);
      node.innerHTML = graph.container.innerHTML;
      if (mxClient.IS_QUIRKS || document.documentMode === 8) {
        node.firstChild.style.overflow = 'visible';
      }
    }
    graph.getModel().clear();
    mxClient.NO_FO = fo;
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.width = `${s_width + 1}px`;
    node.style.height = `${s_height + 1}px`;
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    return node.outerHTML;
  };

  const edgeShapes = shapes.filter((item) => item.type === 'edge');
  const vertexShapes = shapes.filter((item) => !item.type || item.type === 'vertex');
  const funcShapes = shapes.filter((item) => item.type === 'function');

  return {
    vertexShape: vertexShapes.map((item) => ({
      ...item,
      svgHtml: renderSvg(item.style, item.w, item.h, item.value),
    })),
    edgeShape: edgeShapes.map((item) => ({
      ...item,
      svgHtml: renderEdgeSvg(item.style, item.w, item.h, item.value),
    })),
    funcShapes: funcShapes.map((item) => ({
      ...item,
      svgHtml: renderFuncSvg(item, item.w, item.h),
    })),
  };
};

export default (graph: MyGraph): { baseShape: cShapeType[]; baseEdgeShape: cShapeType[] } => {
  const renderSvg = (style, width = 32, height = 30, value) => {
    let fo = mxClient.NO_FO;
    mxClient.NO_FO = false;
    graph.view.scaleAndTranslate(1, 0, 0);
    const cell = new mxCell(value, new mxGeometry(0, 0, width, height), style);
    cell.vertex = true;
    cell.connectable = false;
    cell.id = nanoid();
    graph.addCells([cell]);
    let s_width = 32;
    let s_height = 30;
    let s = Math.min(s_width / width, s_height / height);
    const dx = s_width - width * s;
    const dy = s_height - height * s;
    graph.view.scaleAndTranslate(s, dx * (2 - s), dy * (2 - s));
    let node = null;
    if (
      graph.dialect === mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } else {
      node = graph.container.cloneNode(false);
      node.innerHTML = graph.container.innerHTML;
      if (mxClient.IS_QUIRKS || document.documentMode === 8) {
        node.firstChild.style.overflow = 'visible';
      }
    }
    graph.getModel().clear();
    mxClient.NO_FO = fo;
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.width = `${s_width + 1}px`;
    node.style.height = `${s_height + 1}px`;
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    return node.outerHTML;
  };

  const renderEdgeSvg = (style, width = 32, height = 30, value) => {
    const cell = new mxCell(value != null ? value : '', new mxGeometry(0, 0, width, height), style);
    cell.geometry.setTerminalPoint(new mxPoint(0, height / 2), true);
    cell.geometry.setTerminalPoint(new mxPoint(width, height / 2), false);
    cell.geometry.relative = true;
    cell.edge = true;
    cell.id = nanoid();
    let fo = mxClient.NO_FO;
    mxClient.NO_FO = false;
    graph.view.scaleAndTranslate(1, 0, 0);
    graph.addCells([cell]);
    let s_width = 32;
    let s_height = 30;
    let s = Math.min(s_width / width, s_height / height);
    const dx = s_width - width * s;
    const dy = s_height - height * s;
    graph.view.scaleAndTranslate(s, dx * (2 - s), dy * (2 - s));
    let node = null;
    if (
      graph.dialect === mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } else {
      node = graph.container.cloneNode(false);
      node.innerHTML = graph.container.innerHTML;
      if (mxClient.IS_QUIRKS || document.documentMode === 8) {
        node.firstChild.style.overflow = 'visible';
      }
    }
    graph.getModel().clear();
    mxClient.NO_FO = fo;
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.width = `${s_width + 1}px`;
    node.style.height = `${s_height + 1}px`;
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    return node.outerHTML;
  };

  const renderFuncSvg = (cInfo: cShapeType, width = 32, height = 30) => {
    let fo = mxClient.NO_FO;
    mxClient.NO_FO = false;
    graph.view.scaleAndTranslate(1, 0, 0);
    cInfo.func(graph, 0, 0, width, height);
    let s_width = 32;
    let s_height = 30;
    let s = Math.min(s_width / width, s_height / height);
    const dx = s_width - width * s;
    const dy = s_height - height * s;
    graph.view.scaleAndTranslate(s, dx * (2 - s), dy * (2 - s));
    let node = null;
    if (
      graph.dialect === mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } else {
      node = graph.container.cloneNode(false);
      node.innerHTML = graph.container.innerHTML;
      if (mxClient.IS_QUIRKS || document.documentMode === 8) {
        node.firstChild.style.overflow = 'visible';
      }
    }
    graph.getModel().clear();
    mxClient.NO_FO = fo;
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.width = `${s_width + 1}px`;
    node.style.height = `${s_height + 1}px`;
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    return node.outerHTML;
  };

  const getSvgHtml = (item: cShapeType) => {
    if (item.type === 'vertex' || !item.type) {
      return renderSvg(item.style, item.w, item.h, item.value);
    } else if (item.type === 'edge') {
      return renderEdgeSvg(item.style, item.w, item.h, item.value);
    } else if (item.type === 'function') {
      return renderFuncSvg(item, item.w, item.h);
    }
  };

  const baseShape: cShapeType[] = baseSvgInfo.map((item) => {
    return {
      ...item,
      style: item.style,
      svgHtml: getSvgHtml(item),
      key: item.style,
      w: item.w,
      h: item.h,
      type: item.type,
      value: item.value,
    };
  });
  const baseEdgeShape: cShapeType[] = baseEdgeSvg.map((item) => {
    return {
      ...item,
      style: item.style,
      svgHtml: getSvgHtml(item),
      key: item.style,
      w: item.w,
      h: item.h,
      type: item.type,
      value: item.value,
    };
  });
  return {
    baseShape,
    baseEdgeShape,
  };
};

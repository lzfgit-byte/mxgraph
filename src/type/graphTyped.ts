import type { mxCell, mxPoint } from 'mxgraph';
import type MyGraph from '@/hook/useGraphGraph';
export * from 'mxgraph';
export type ItemType = 'vertex' | 'edge' | 'function';
// icon
export type GraphIconTypes = 'tooltip' | 'jumped';
export interface NodeConfig extends Record<string, any> {
  id?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  style: string;
  type: ItemType;
  parentId?: string;
  source?: mxCell;
  target?: mxCell;
  value?: string;
}
export type PanelsType = 'base' | 'flow';
export interface PowerGraphProps {
  isReadonly?: boolean;
  isSimpleModel?: boolean;
  id?: string;
  name?: string;
  noFormPanel?: boolean;
  onLoaded?: () => void;
  showSidebarPanel?: PanelsType[];
  onCellClicked?: (cell: mxCell) => void;
  onGraphClick?: () => void;
  onCellBlur?: (cell: mxCell) => void;
  onSidebarLoaded?: () => void;
  onGraphChanged?: () => void;
  allowEdgeNoTarget?: boolean;
}
export interface PowerGraphExpose {
  getXml?: () => string;
  setXml?: (xml: string) => void;
  getGraph?: () => MyGraph;
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomActual?: () => void;
  setCellColor?: (id: string, color: string, stroke?: string) => void;
  getAllCells?: () => mxCell[];
  getSelectCells?: () => mxCell[];
  setSelectionCells?: (cells: mxCell[]) => void;
  tempSave?: () => void;
  loadTempSave?: () => void;
  setSimpleMode?: (flag: boolean) => void;
  covertBpmnXmlInGraph?: (xml: string) => void;
  autoLayOut?: () => void;
  toBpmnXml?: () => string;
  getCellsByIds?: (ids: string[]) => mxCell[];
  isJustCovertBpmn?: () => boolean;
  setTranslate?: (trans: mxPoint) => void;
  undo?: () => void;
  redo?: () => void;
}
export interface PowerGraphMethods extends PowerGraphExpose {
  setReadOnly?: (isReadonly: boolean) => void;
}

export interface PowerGraphOpts extends PowerGraphProps {}

import type { Ref } from 'vue';
import type { mxCell, mxEditor, mxPoint } from 'mxgraph';
import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
import type { PowerGraphExpose, PowerGraphProps } from '@/components/mxGraph/src/type/graphTyped';
import { buildStyleStr } from '@/components/mxGraph/src/utils/kitUtil';
import mx from '@/components/mxGraph/src/hook/useGraphFactory';
import type { GraphSetState } from '@/components/mxGraph/src/hook/useGraphState';
import {
  bpmnXmlToJson,
  setGraphFromJson,
  transform2Json,
  writeBpmnXml,
} from '@/components/mxGraph/src/utils/Transform';
const { mxEvent, mxUtils, mxEventObject, mxHierarchicalLayout, mxConstants } = mx;

export default (
  graph: Ref<MyGraph>,
  editor: Ref<mxEditor>,
  props: PowerGraphProps,
  state: GraphSetState
): PowerGraphExpose => {
  let justCoverBpmnFlag = false;
  const isJustCovertBpmn = () => justCoverBpmnFlag;
  const getXml = () => {
    return editor.value.writeGraphModel(null);
  };

  const setXml = (xml: string) => {
    graph.value.fireEvent(new mxEventObject(mxEvent.CUSTOM_CLEAR_ALL_ICON), null);
    let doc = mxUtils.parseXml(xml);
    let node = doc.documentElement;
    editor.value.readGraphModel(node);
    graph.value.refresh();
  };
  const zoomIn = () => {
    graph.value.zoomIn();
  };
  const zoomOut = () => {
    graph.value.zoomOut();
  };
  const zoomActual = () => {
    graph.value.zoomActual();
    graph.value.view.fireEvent(new mxEventObject(mxEvent.SCALE_AND_TRANSLATE), null);
  };
  const setCellColor = (id: string, color: string, stroke?: string) => {
    const cell = graph.value.findById(id);
    const model = graph.value.getModel();
    const style: any = graph.value.getCellStyle(cell);
    style.fillColor = color;
    if (cell.isEdge()) {
      style.strokeColor = stroke || color;
    }
    if (cell.isVertex()) {
      style.strokeColor = stroke || style.strokeColor;
    }
    model.setStyle(cell, buildStyleStr(style));
  };
  const getAllCells = () => graph.value.getAllCells();
  const getSelectCells = () => graph.value.getSelectionCells();
  const setSelectionCells = (cells: mxCell[]) => graph.value.setSelectionCells(cells);
  const xmlSetKey = 'mxGraph-tempSaveKey';
  const setSimpleMode = (flag: boolean) => {
    state.isSimpleM.value = flag;
  };
  let timer;
  const covertBpmnXmlInGraph = (xml: string) => {
    justCoverBpmnFlag = true;
    const nodes = bpmnXmlToJson(xml);
    setGraphFromJson(graph.value, nodes);

    const json = transform2Json(graph.value.getModel());
    graph.value.getModel().clear();
    setGraphFromJson(graph.value, json, 0, 0);
    justCoverBpmnFlag = true;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      justCoverBpmnFlag = false;
      clearTimeout(timer);
    }, 100);
  };
  const autoLayOut = () => {
    const layout = new mxHierarchicalLayout(graph.value, mxConstants.DIRECTION_WEST);
    layout.execute(graph?.value?.getDefaultParent());

    const json = transform2Json(graph.value.getModel());
    graph.value.getModel().clear();
    setGraphFromJson(graph.value, json, 0, 80);
  };
  const toBpmnXml = () => {
    const nodes = transform2Json(graph.value.getModel());
    return writeBpmnXml(nodes);
  };
  const getCellsByIds = (ids: string[]): mxCell[] => {
    return ids.map((id) => graph?.value?.findById(id)) as any;
  };
  const setTranslate = (trans: mxPoint) => {
    graph?.value?.getView()?.setTranslate(trans.x, trans.y);
    graph.value.getView()?.fireEvent(new mxEventObject(mxEvent.SCALE_AND_TRANSLATE), null);
  };
  const undo = () => {
    graph.value?.actions.undoManager?.undo();
  };
  const redo = () => {
    graph?.value?.actions?.undoManager?.redo();
  };
  return {
    getXml,
    setXml,
    zoomIn,
    zoomOut,
    zoomActual,
    setCellColor,
    getAllCells,
    getSelectCells,
    getGraph: () => graph.value,
    tempSave: () => localStorage.setItem(xmlSetKey, getXml()),
    loadTempSave: () => {
      const xml = localStorage.getItem(xmlSetKey);
      xml && setXml(xml);
    },
    setSimpleMode,
    covertBpmnXmlInGraph,
    autoLayOut,
    toBpmnXml,
    setSelectionCells,
    getCellsByIds,
    isJustCovertBpmn,
    setTranslate,
    undo,
    redo,
  };
};

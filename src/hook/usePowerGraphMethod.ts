import type { Ref } from 'vue';
import type {
  PowerGraphExpose,
  PowerGraphMethods,
  PowerGraphOpts,
  PowerGraphProps,
} from '@/components/mxGraph/src/type/graphTyped';

export default (
  opts: PowerGraphOpts,
  props: PowerGraphProps,
  gRef: Ref<PowerGraphExpose>
): PowerGraphMethods => {
  return {
    getXml: () => gRef.value.getXml(),
    setXml: (xml) => gRef.value.setXml(xml),
    getGraph: () => gRef.value.getGraph(),
    zoomIn: () => gRef.value.zoomIn(),
    zoomOut: () => gRef.value.zoomOut(),
    setReadOnly: (isReadonly) => (props.isReadonly = isReadonly),
    setCellColor: (id, color, stroke) => gRef.value.setCellColor(id, color, stroke),
    getAllCells: () => gRef.value.getAllCells(),
    getSelectCells: () => gRef.value.getSelectCells(),
    tempSave: () => gRef.value.tempSave(),
    loadTempSave: () => gRef.value.loadTempSave(),
    zoomActual: () => gRef.value.zoomActual(),
    setSimpleMode: (flag) => gRef?.value?.setSimpleMode(flag),
    covertBpmnXmlInGraph: (xml: string) => gRef?.value?.covertBpmnXmlInGraph(xml),
    autoLayOut: () => gRef?.value?.autoLayOut(),
    toBpmnXml: () => gRef?.value?.toBpmnXml(),
    setSelectionCells: (cells) => gRef?.value?.setSelectionCells(cells),
    getCellsByIds: (ids) => gRef?.value?.getCellsByIds(ids),
    isJustCovertBpmn: () => gRef?.value?.isJustCovertBpmn(),
    setTranslate: (trans) => gRef?.value?.setTranslate(trans),
  };
};

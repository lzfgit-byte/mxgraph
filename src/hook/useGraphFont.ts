import { reactive, ref, shallowRef, watch } from 'vue';
import type { mxCell } from 'mxgraph';
import { forIn, isNumber } from 'lodash';
import type MyGraph from '@/hook/useGraphGraph';
import mx from '@/hook/useGraphFactory';
import { fontStyle } from '@/const/FormatSettingPanel';
export interface positionModelType {
  id: string;
  width: number;
  height: number;
  rotate: number;
  x: number;
  y: number;
  fillColor?: string;
  strokeColor?: string;
}
export interface TextConfig {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  align: string;
  verticalLabelPosition: string;
  italic: boolean;
  underline: boolean;
  verticalAlign: string;
  value: string;
}
export interface edgeModelType {
  id: string;
  align: string;
  editable: string;
  endArrow: string;
  fontColor: string;
  html: number;
  labelBackgroundColor: string;
  rounded: boolean;
  shape: string;
  strokeColor: string;
  strokeWidth: string;
  verticalAlign: string;
  value?: string;
}
export default (props: { graph: MyGraph }) => {
  const activeCells = shallowRef<mxCell[]>([]);
  const positionModel = ref<positionModelType>({
    id: '',
    width: 0,
    height: 0,
    rotate: 0,
    x: 0,
    y: 0,
    fillColor: '#ffffff',
    strokeColor: '#000000',
  });

  const textModel = ref<TextConfig>({
    fontFamily: '',
    fontSize: 0,
    fontColor: '',
    bold: false,
    align: '',
    verticalLabelPosition: '',
    italic: false,
    underline: false,
    verticalAlign: '',
    value: '',
  });
  const edgeModel = reactive<edgeModelType>({
    id: '',
    align: 'center',
    editable: '0',
    endArrow: 'classic',
    fontColor: '#333333',
    html: 1,
    labelBackgroundColor: '#ffa94d',
    rounded: true,
    shape: 'flexArrow',
    strokeColor: '#333333',
    strokeWidth: '2',
    verticalAlign: 'middle',
    value: '',
  });
  const getFontStyle = (num: number) => {
    return {
      bold: !!(num === 1 || num === 3 || num === 7 || num === 5),
      italic: !!(num === 2 || num === 3 || num === 7 || num === 6),
      underline: !!(num === 4 || num === 7 || num === 5 || num === 6),
    };
  };
  const setVertex = (cells, graph: MyGraph) => {
    let firstType = cells[0].isVertex();
    const cell: mxCell = cells[0];
    activeCells.value = cells.filter((ele) => firstType === ele.isVertex());
    const { width, height, x, y } = cell.geometry;
    const styles = graph.getCellStyle(cell);
    positionModel.value = {
      id: cell.id,
      width,
      height,
      rotate: styles.rotation ? styles.rotation : 0,
      x,
      y,
      fillColor: styles.fillColor || '#ffffff',
      strokeColor: styles.strokeColor || '#000000',
    };
    const o = getFontStyle(Number(styles.fontStyle) ? Number(styles.fontStyle) : 0);
    textModel.value = {
      fontFamily: styles.fontFamily ? styles.fontFamily : '',
      fontSize: Number(styles.fontSize) ? Number(styles.fontSize) : 12,
      fontColor: styles.fontColor ? styles.fontColor : '#00000',
      align: styles.align ? styles.align : 'center',
      verticalLabelPosition: styles.verticalLabelPosition ? styles.verticalLabelPosition : 'bottom',
      verticalAlign: styles.verticalAlign ? styles.verticalAlign : 'bottom',
      value: cell.value,
      ...o,
    };
  };
  const setEdge = (cells, graph) => {
    let firstType = cells[0].isVertex();
    const cell = cells[0];
    activeCells.value = cells.filter((ele) => firstType === ele.isVertex());
    // const { width, height, x, y } = cell.geometry;
    const styles = graph.getCellStyle(cell);
    edgeModel.value = cell?.value;
    forIn(edgeModel, (value, key) => {
      if (styles[key]) {
        edgeModel[key] = styles[key];
      }
    });
    edgeModel.id = cell?.id;
  };
  const getActiveCells = (graph: MyGraph) => {
    const cells = graph.getSelectionCells();
    const emits = graph?.getComponentEmits();
    if (cells.length === 1) {
      if (cells[0].isVertex()) {
        setVertex(cells, graph);
      }
      if (cells[0].isEdge()) {
        setEdge(cells, graph);
      }
      emits('cellClicked', activeCells.value[0]);
    } else {
      activeCells?.value[0] && emits('cellBlur', activeCells?.value[0]);
      activeCells.value = [];
    }
  };
  const initFormat = (graph: MyGraph) => {
    graph.getSelectionModel().addListener(mx.mxEvent.CHANGE, () => {
      getActiveCells(graph);
    });
    graph.getModel().addListener(mx.mxEvent.CHANGE, () => {
      getActiveCells(graph);
    });
  };
  watch(
    () => props.graph,
    () => {
      if (props.graph) {
        initFormat(props.graph);
      }
    }
  );

  const handlePropChange = (prop: string, value: number | string) => {
    const graph = props.graph;
    if (!graph) {
      return;
    }
    if (Object.keys(fontStyle).includes(prop)) {
      textModel.value[prop] = value;
      const n = Object.keys(fontStyle).reduce((p, c) => {
        const num = textModel.value[c as unknown as 'fontSize']
          ? fontStyle[c as unknown as 'bold']
          : 0;
        return num + p;
      }, 0);

      mx.mxUtils.setCellStyles(
        graph.model,
        activeCells.value,
        'fontStyle',
        isNumber(n) ? `${n}` : n
      );
    } else {
      mx.mxUtils.setCellStyles(graph.model, activeCells.value, prop, value);
    }
  };
  const handleGeomertyChange = (key: string, value: number) => {
    activeCells.value.forEach((ele) => {
      ele.geometry[key as unknown as 'x'] = value;
      props.graph?.refresh(ele);
    });
  };

  const handlerSetGraphColor = (color) => {
    const model = props?.graph?.getModel();
    if (activeCells.value.length > 0) {
      const style = activeCells.value[0].getStyle();
      model.setStyle(activeCells.value[0], `${style}fillColor=${color};`);
    }
  };
  const handlerStrokeColor = (color) => {
    const model = props?.graph?.getModel();
    if (activeCells.value.length > 0) {
      const style = activeCells.value[0].getStyle();
      model.setStyle(activeCells.value[0], `${style}strokeColor=${color};`);
    }
  };
  const handlerEdgeStyle = (prop, value) => {
    const model = props?.graph?.getModel();
    if (activeCells.value.length > 0) {
      const cell = activeCells.value[0];
      const styleStr = cell.getStyle();
      const style: any = props.graph.getCellStyle(cell);
      style[prop] = value;
      let strStyle = '';
      forIn(style, (v, k) => {
        strStyle += `${k}=${v};`;
      });
      model.setStyle(activeCells.value[0], styleStr + strStyle);
    }
  };
  const handlerSetValue = (value) => {
    const model = props?.graph?.getModel();
    if (activeCells.value.length > 0) {
      model.setValue(activeCells.value[0], value);
    }
  };
  return {
    handlePropChange,
    handleGeomertyChange,
    positionModel,
    textModel,
    edgeModel,
    activeCells,
    handlerSetGraphColor,
    handlerStrokeColor,
    handlerEdgeStyle,
    handlerSetValue,
  };
};

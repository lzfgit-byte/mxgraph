import { nanoid } from 'nanoid';
import mx from '../hook/useGraphFactory';
import type { cShapeType } from '@/components/mxGraph/src/hook/useGraphSideBarSvg';
import { flowImageType } from '@/components/mxGraph/src/const/images';
import type { bpmnNodeChildType } from '@/components/mxGraph/src/utils/Transform';
const { mxGeometry, mxCell, mxConstants } = mx;
export interface baseSvgType extends cShapeType {}
export const baseSvgInfo: baseSvgType[] = [
  { style: 'rounded=0;whiteSpace=wrap;html=1;', w: 120, h: 60 },
  { style: 'rounded=1;whiteSpace=wrap;html=1;', w: 120, h: 60 },
  { style: 'ellipse;whiteSpace=wrap;html=1;', w: 120, h: 80 },
  {
    style:
      'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
    w: 30,
    h: 15,
    value: '文本',
  },
  { style: 'shape=document;whiteSpace=wrap;html=1;boundedLbl=1;', w: 120, h: 80 },
  {
    style:
      'rhombus;whiteSpace=wrap;html=1;strokeWidth=1;fillWeight=-1;hachureGap=8;fillStyle=cross-hatch;sketch=1;',
    w: 120,
    h: 60,
  },
  {
    style: 'shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;size=0.10638297872340426;',
    w: 140,
    h: 40,
  },
  {
    style:
      'shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
    w: 120,
    h: 60,
  },
  {
    style: 'shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;rounded=0;',
    w: 60,
    h: 50,
  },
  {
    style: 'triangle;whiteSpace=wrap;html=1;',
    w: 60,
    h: 80,
  },
  {
    style: 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;',
    w: 60,
    h: 80,
  },
  {
    style: 'ellipse;shape=cloud;whiteSpace=wrap;html=1;',
    w: 80,
    h: 80,
  },
  {
    style: 'ellipse;whiteSpace=wrap;html=1;aspect=fixed;',
    w: 80,
    h: 80,
    tw: 60,
    th: 60,
  },
  {
    style: 'whiteSpace=wrap;html=1;aspect=fixed;',
    w: 80,
    h: 80,
  },
  {
    style: 'shape=internalStorage;whiteSpace=wrap;html=1;backgroundOutline=1;',
    w: 80,
    h: 80,
  },
  {
    style:
      'shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;',
    w: 120,
    h: 80,
  },
  {
    style: 'shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
    w: 120,
    h: 80,
  },
  {
    style: 'shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
    w: 120,
    h: 60,
  },
  {
    style: 'shape=tape;whiteSpace=wrap;html=1;',
    w: 120,
    h: 100,
  },
  {
    style: 'shape=note;whiteSpace=wrap;size=16;html=1;dropTarget=0;',
    w: 40,
    h: 60,
  },
  {
    style: 'shape=card;whiteSpace=wrap;html=1;',
    w: 80,
    h: 100,
  },
  {
    style: 'shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;',
    w: 120,
    h: 80,
  },
  {
    style: 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;',
    w: 30,
    h: 60,
  },
  {
    style: 'shape=xor;whiteSpace=wrap;html=1;',
    w: 60,
    h: 80,
  },
  {
    style: 'shape=or;whiteSpace=wrap;html=1;',
    w: 60,
    h: 80,
  },
  {
    style: 'shape=dataStorage;whiteSpace=wrap;html=1;fixedSize=1;',
    w: 100,
    h: 80,
  },
  {
    style:
      'shape=customSwimline;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1',
    w: 80,
    h: 100,
  },
  {
    style: 'shape=mxgraph.bpmn.user_task;html=1;outlineConnect=0;',
    w: 28,
    h: 28,
  },
  {
    style:
      'shape=mxgraph.flowchart.or;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1',
    w: 50,
    h: 50,
  },
  {
    style:
      'shape=mxgraph.flowchart.summing_function;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1',
    w: 50,
    h: 50,
  },
  {
    style:
      'shape=mxgraph.flowchart.collate;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1',
    w: 50,
    h: 50,
  },
  {
    style: 'shape=actor;whiteSpace=wrap;html=1;',
    w: 50,
    h: 50,
  },
  {
    style:
      'shape=lineEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;',
    w: 50,
    h: 50,
  },
  {
    style:
      'shape=lineEllipse;line=vertical;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;',
    w: 50,
    h: 50,
  },
  {
    style: 'shape=cross;whiteSpace=wrap;html=1;',
    w: 50,
    h: 50,
  },
  {
    style: 'shape=corner;whiteSpace=wrap;html=1;',
    w: 50,
    h: 50,
  },
  {
    style: 'shape=tee;whiteSpace=wrap;html=1;',
    w: 50,
    h: 50,
  },
  {
    style:
      'shape=mxgraph.flowchart.annotation_1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1',
    w: 50,
    h: 50,
  },
  {
    style:
      'shape=mxgraph.flowchart.annotation_2;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1',
    w: 50,
    h: 50,
  },
  {
    key: 'customTimeLine',
    w: 120,
    h: 30,
    tw: 400,
    th: 30,
    isShow: false,
    type: 'vertex',
    style: 'shape=customTimeLine;whiteSpace=wrap;html=1;strokeColor=#000000;strokeWidth=1;',
    value: '',
  },
];

export const baseEdgeSvg: baseSvgType[] = [
  {
    style: 'shape=flexArrow;endArrow=classic;startArrow=classic;html=1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'shape=flexArrow;endArrow=classic;html=1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'endArrow=none;html=1;dashPattern=1 1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'endArrow=none;dashed=1;html=1;dashPattern=1 1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'endArrow=classic;startArrow=classic;html=1;dashPattern=1 1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'endArrow=classic;startArrow=classic;dashed=1;html=1;dashPattern=1 1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'curved=1;endArrow=classic;html=1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'endArrow=classic;html=1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
  {
    style: 'shape=link;html=1;',
    w: 50,
    h: 50,
    type: 'edge',
  },
];

const radient = 'radientDirection=south;gradientColor=#F0F0F0;'; // ''
const shadow = 'whiteSpace=wrap;shadow=0;';
export const multiShapes: baseSvgType[] = [
  {
    key: '数据',
    style: `shape=customSwimline;whiteSpace=wrap;html=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 100,
  },
  {
    key: '步骤',
    style: `shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;size=20;${radient}${shadow}`,
    w: 120,
    h: 80,
  },
  {
    key: '步骤2',
    style: `shape=customStep;perimeter=stepPerimeter;whiteSpace=wrap;html=1;customPointer=0.8;fixedSize=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;size=20;${radient}${shadow}`,
    w: 120,
    h: 80,
  },
  {
    key: '三角形1',
    style: `shape=customTriangle;whiteSpace=wrap;html=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 60,
    value: '',
  },
  {
    key: '椭圆3',
    style: `ellipse;whiteSpace=wrap;html=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 120,
    h: 80,
    value: '',
  },
  {
    key: '梯形',
    style: `shape=customInvertedTrapezoidal;whiteSpace=wrap;html=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 120,
    h: 80,
    value: '',
  },
  {
    key: '圆柱',
    style: `shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 60,
    h: 80,
    value: '',
  },
  {
    key: 'terminator',
    style: `shape=mxgraph.flowchart.terminator;whiteSpace=wrap;html=1;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 100,
    h: 60,
    value: '',
  },
  {
    key: 'annotation_2',
    style: `shape=mxgraph.flowchart.annotation_2;whiteSpace=wrap;html=1;fontSize=15;spacingLeft=93;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 100,
    h: 100,
    value: 'xxxxx',
  },
  {
    key: 'annotation_1',
    style: `shape=mxgraph.flowchart.annotation_1;whiteSpace=wrap;html=1;fontSize=15;fillColor=#a1c3f8;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 100,
    h: 100,
    value: 'xxxxx',
  },
  {
    key: 'manual_input',
    style: `shape=mxgraph.flowchart.manual_input;whiteSpace=wrap;html=1;fontSize=15;fillColor=#f6d3aa;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 100,
    h: 60,
    value: '',
  },
  {
    key: 'card',
    style: `shape=mxgraph.flowchart.card;whiteSpace=wrap;html=1;fillColor=#f4b699;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 100,
    h: 60,
    value: '',
  },
  {
    key: 'terminator2',
    style: `shape=mxgraph.flowchart.terminator;whiteSpace=wrap;html=1;fillColor=#a4f1d1;strokeColor=#000000;strokeWidth=1;${shadow}`,
    w: 100,
    h: 60,
    value: 'END',
  },
  {
    key: '客户',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#f9f296;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '客户',
  },
  {
    key: '角色',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#f9f296;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '角色',
  },
  {
    key: '虚拟角色',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#f9f296;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '虚拟角色',
  },
  {
    key: '公共角色',
    style: `shape=customShim;whiteSpace=wrap;html=1;fillColor=#f9f296;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '公共角色',
  },
  {
    key: '文档',
    style: `shape=document;whiteSpace=wrap;html=1;boundedLbl=1;fillColor=#fdc994;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 100,
    h: 75,
    tw: 120,
    th: 80,
  },
  {
    key: '菱形1',
    style: `rhombus;whiteSpace=wrap;html=1;fillColor=#f2b2af;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 50,
    tw: 120,
    th: 120 * (5 / 8),
  },
  {
    key: '菱形2',
    style: `rhombus;whiteSpace=wrap;html=1;fillColor=#f2b2af;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 80,
    tw: 120,
    th: 120,
  },
  {
    key: '菱形3',
    style: `shape=customDoubleDiamond;whiteSpace=wrap;html=1;fillColor=#f2b2af;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 140,
    h: 80,
    value: '',
  },
  {
    key: '菱形四',
    style: `rhombus;whiteSpace=wrap;html=1;fillColor=#ade6fb;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 80,
    tw: 120,
    th: 120,
  },
  {
    key: '虚线',
    style: `endArrow=none;dashed=1;html=1;strokeColor=#9FC3FE;strokeWidth=2;`,
    type: 'edge',
    w: 80,
    h: 80,
    tw: 120,
    th: 120,
  },
  {
    key: '实线',
    style: `endArrow=none;dashed=0;html=1;strokeColor=#9FC3FE;strokeWidth=1;`,
    type: 'edge',
    w: 80,
    h: 80,
    tw: 120,
    th: 120,
  },
  {
    key: '椭圆',
    style: `shape=customEllipse;whiteSpace=wrap;html=1;strokeColor=#f2b2af;strokeWidth=1;textValue=测试可变;${shadow}`,
    w: 120,
    h: 80,
  },
  {
    key: 'XOR',
    style: `ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeWidth=1;fontSize=29;${shadow}`,
    w: 90,
    h: 90,
    value: 'XOR',
  },
  {
    key: 'AND',
    style: `ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeWidth=1;fontSize=29;${shadow}`,
    w: 90,
    h: 90,
    value: 'AND',
  },
  {
    key: 'OR',
    style: `ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeWidth=1;fontSize=29;${shadow}`,
    w: 90,
    h: 90,
    value: 'OR',
  },
  {
    key: 'TO',
    style: `ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeWidth=1;fontSize=29;${shadow}`,
    w: 90,
    h: 90,
    value: 'TO',
  },
  {
    key: 'FROM',
    style: `ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeWidth=1;fontSize=29;${shadow}`,
    w: 90,
    h: 90,
    value: 'FROM',
  },
  {
    key: 'RCP',
    style: `shape=customInvertedTriangle;whiteSpace=wrap;html=1;fillColor=#f2b2af;strokeColor=#000000;strokeWidth=1;fontSize=18;${radient}${shadow}`,
    w: 80,
    h: 80,
    value: 'RCP',
  },
  {
    key: '正三角形',
    style: `shape=customTriangle;whiteSpace=wrap;html=1;fillColor=#f2b2af;strokeColor=#000000;strokeWidth=1;${radient}${shadow}`,
    w: 80,
    h: 80,
    value: '',
  },
  {
    key: '文本',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9FC3FE;strokeWidth=1;fontColor=#9FC3FE;${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '文本',
  },
  {
    key: 'TIME',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9FC3FE;strokeWidth=1;fontColor=#9FC3FE;${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: 'TIME',
  },
  {
    key: '名称',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9FC3FE;strokeWidth=1;fontColor=#9FC3FE;${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '名称',
  },
  {
    key: '版本信息',
    style: `rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9FC3FE;strokeWidth=1;fontColor=#9FC3FE;${shadow}`,
    w: 80,
    h: 40,
    tw: 120,
    th: 60,
    value: '版本信息',
  },
  {
    key: '椭圆2',
    style: `ellipse;whiteSpace=wrap;html=1;fillColor=#ebf6fe;strokeColor=#9FC3FE;strokeWidth=1;${radient}${shadow}`,
    w: 120,
    h: 80,
    value: '',
  },
];

export const multiFlowShape: baseSvgType[] = [
  {
    key: '开始',
    style: `rounded=1;whiteSpace=wrap;html=1;fontSize=15;fillColor=#5ccb40;strokeColor=#000000;fontColor=#FFFFFF;;strokeWidth=1;${shadow}`,
    w: 80,
    h: 80,
    tw: 60,
    th: 60,
    value: '开始',
  },
  {
    key: '结束',
    style: `rounded=1;whiteSpace=wrap;html=1;fontSize=15;fillColor=#dc2620;strokeColor=#000000;fontColor=#FFFFFF;strokeWidth=1;${shadow}`,
    w: 80,
    h: 80,
    tw: 60,
    th: 60,
    value: '结束',
  },
  {
    key: '判断',
    style: `rhombus;whiteSpace=wrap;html=1;fontSize=15;${shadow}`,
    w: 170,
    isShow: false,
    h: 80,
    value: '',
  },
  {
    key: '判断4',
    style: `shape=customPlusDiamond;whiteSpace=wrap;html=1;imageType=${flowImageType.YUNJIA};fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;${shadow}`,
    w: 140,
    h: 80,
    value: '',
  },
  {
    key: '判断5',
    style: `shape=customPlusDiamond;whiteSpace=wrap;html=1;imageType=${flowImageType.YUNCHEN};fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;${shadow}`,
    w: 140,
    h: 80,
    value: '',
  },
  {
    key: '判断2',
    style: `shape=mxgraph.flowchart.or;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;${shadow}`,
    w: 70,
    isShow: false,
    h: 70,
    value: '',
  },
  {
    key: '判断3',
    style: `shape=mxgraph.flowchart.summing_function;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;${shadow}`,
    w: 70,
    isShow: false,
    h: 70,
    value: '',
  },

  {
    key: '箭头',
    style: `endArrow=classic;html=1;${shadow}`,
    w: 170,
    isShow: false,
    h: 80,
    type: 'edge',
    value: '',
  },
  {
    key: '传阅',
    w: 120,
    h: 60,
    isShow: false,
    type: 'function',
    value: '传阅',
    func: (graph, x, y, w, h, id = null, value = null, businessData = {}) => {
      const parent = graph.getDefaultParent();
      const cell = new mxCell(
        value === null ? '传阅' : value,
        new mxGeometry(x, y, w, h),
        `endArrow=classic;rounded=1;html=1;spacingLeft=45;align=left;${shadow}`
      );
      cell.vertex = true;
      cell.id = id || nanoid();
      cell.businessData = businessData;
      cell.setCustomData(mxConstants.CUSTOM_OVERLY_ICON, flowImageType.CY);
      graph.addCell(cell, parent);
    },
  },
  {
    key: '会签',
    w: 120,
    h: 60,
    type: 'function',
    isShow: false,
    value: '会签',
    func: (graph, x, y, w, h, id = null, value = null, businessData = {}) => {
      const parent = graph.getDefaultParent();
      const cell = new mxCell(
        value === null ? '会签' : value,
        new mxGeometry(x, y, w, h),
        `endArrow=classic;rounded=1;html=1;spacingLeft=45;align=left;${shadow}`
      );
      cell.vertex = true;
      cell.id = id || nanoid();
      cell.businessData = businessData;
      cell.setCustomData(mxConstants.CUSTOM_OVERLY_ICON, flowImageType.HQ);
      cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, '会签');
      graph.addCell(cell, parent);
    },
  },
  {
    key: '会签并行',
    w: 120,
    h: 60,
    isShow: false,
    type: 'function',
    value: '会签并行',
    func: (graph, x, y, w, h, id = null, value = null, businessData = {}) => {
      const parent = graph.getDefaultParent();
      const cell = new mxCell(
        value === null ? '会签并行' : value,
        new mxGeometry(x, y, w, h),
        `endArrow=classic;rounded=1;html=1;spacingLeft=45;align=left;${shadow}`
      );
      cell.vertex = true;
      cell.id = id || nanoid();
      cell.businessData = businessData;
      cell.setCustomData(mxConstants.CUSTOM_OVERLY_ICON, flowImageType.HQH);
      cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, '会签并行');
      graph.addCell(cell, parent);
    },
  },
  {
    key: '会签串行',
    w: 120,
    h: 60,
    isShow: false,
    type: 'function',
    value: '会签串行',
    func: (graph, x, y, w, h, id = null, value = null, businessData = {}) => {
      const parent = graph.getDefaultParent();
      const cell = new mxCell(
        value === null ? '会签串行' : value,
        new mxGeometry(x, y, w, h),
        `endArrow=classic;rounded=1;html=1;spacingLeft=45;align=left;${shadow}`
      );
      cell.vertex = true;
      cell.id = id || nanoid();
      cell.businessData = businessData;
      cell.setCustomData(mxConstants.CUSTOM_OVERLY_ICON, flowImageType.HQS);
      cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, '会签串行');
      graph.addCell(cell, parent);
    },
  },
  {
    key: '审批',
    w: 120,
    h: 60,
    type: 'function',
    value: '审批',
    func: (graph, x, y, w, h, id = null, value = null, businessData = {}) => {
      const child: bpmnNodeChildType = businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD];
      let icon = flowImageType.SP;
      if (child?.multiInstanceLoopCharacteristics) {
        icon = flowImageType.HQS;
        if (child?.multiInstanceLoopCharacteristics?.isSequential) {
          icon = flowImageType.HQH;
        }
      }
      const parent = graph.getDefaultParent();
      const cell = new mxCell(
        value === null ? '审批' : value,
        new mxGeometry(x, y, w, h),
        `endArrow=classic;rounded=1;html=1;spacingLeft=45;align=left;${shadow}`
      );
      cell.vertex = true;
      cell.id = id || nanoid();
      cell.businessData = businessData;
      cell.setCustomData(mxConstants.CUSTOM_OVERLY_ICON, icon);
      cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, '审批');
      graph.addCell(cell, parent);
    },
  },
];

export const allSvgs = [...baseSvgInfo, ...baseEdgeSvg, ...multiShapes, ...multiFlowShape];

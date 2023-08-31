import type { mxCell, mxGraphModel } from 'mxgraph';
import { nanoid } from 'nanoid';
import { cloneDeep, forIn, keys } from 'lodash';
import mx from '../hook/useGraphFactory';
import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
import { allSvgs } from '@/components/mxGraph/src/const/svgConst';
import { getGraphInfo, setGraphInfo } from '@/components/mxGraph/src/hook/useGraphState';
const { mxConstants, mxUtils } = mx;
let allVertex = {};
let allEdge = [];
let useCellIds = [];
let allNodes: Record<string, nodeLink> = {};
const clear = () => {
  allVertex = {};
  allEdge = [];
  useCellIds = [];
  allNodes = {};
};
const walkModelCell = (cells: mxCell[]) => {
  cells.forEach((cell) => {
    if (cell.isVertex()) {
      allVertex[cell?.id] = cell;
    }
    if (cell.isEdge()) {
      const s = cell.source;
      const t = cell.target;
      if (s && t) {
        allEdge.push(cell);
      }
    }
    if (cell?.getChildCount() > 0) {
      walkModelCell(cell?.children);
    }
  });
};
interface nodeLink {
  id?: string;
  cellUniqueKey?: string;
  style?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  parentNodes?: nodeLink[];
  nextNode?: nodeLink[];
  businessData?: Record<string, any>;
  bpmnNode?: boolean;
  value?: string;
}

let rootId = '0';
const buildNode = (cell: mxCell): nodeLink => {
  cell = cloneDeep(cell);
  const geometry = cell.getGeometry();
  const businessData = cell?.businessData || {};
  let res = {
    id: cell.getId(),
    cellUniqueKey: cell.getCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY),
    style: cell.getStyle(),
    x: +geometry.x.toFixed(0),
    y: +geometry.y.toFixed(0),
    width: geometry.width,
    height: geometry.height,
    nextNode: [],
    parentNodes: [],
    businessData,
    value: cell.getValue(),
  };
  res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD] = (res.businessData[
    mxConstants.CUSTOM_BPMN_NODE_CHILD
  ] || {}) as bpmnNodeChildType;
  res.businessData[mxConstants.CUSTOM_BPMN_DATA_KEY] = {
    ...(res?.businessData[mxConstants.CUSTOM_BPMN_DATA_KEY] || {}),
    id: cell.getId(),
    name: cell.getValue(),
  };
  const tooltip = cell?.getCustomData(mxConstants.CUSTOM_TOOLTIP);
  if (tooltip) {
    res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD].documentation = tooltip;
  }
  res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD].outgoing = [];
  res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD].incoming = [];
  cell?.edges?.forEach((edge) => {
    const tId = edge?.target?.id;
    const sId = edge?.source?.id;
    if (cell.getId() !== tId) {
      // eslint-disable-next-line no-unused-expressions
      !(res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD]?.outgoing).includes(edge.id)
        ? res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD].outgoing.push(edge.id)
        : '';
    }
    if (cell.getId() !== sId) {
      // eslint-disable-next-line no-unused-expressions
      !(res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD].incoming as string[]).includes(edge.id)
        ? res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD].incoming.push(edge.id)
        : '';
    }
  });
  allNodes[cell.getId()] = res;
  return res;
};

const buildStructJson = (edges: mxCell[]) => {
  edges.forEach((cell) => {
    const s = cell.source;
    const t = cell.target;
    if (s && t) {
      const sId = s?.id;
      const tId = t?.id;
      useCellIds.push(sId);
      useCellIds.push(tId);
      const start = allVertex[sId];
      const end = allVertex[tId];
      const sNode = allNodes[sId] || buildNode(start);
      const eNode = allNodes[tId] || buildNode(end);
      sNode.nextNode.push(eNode);
      eNode.parentNodes.push(sNode);
      if (sNode.parentNodes.length === 0) {
        rootId = sId;
      }
    }
  });
};
// 将mxgraph node 转换为json
export const transform2Json = (model: mxGraphModel): nodeLink[] => {
  walkModelCell(model?.root?.children);
  buildStructJson(allEdge);
  let rootNode = allNodes[rootId];
  if (rootNode?.parentNodes.length > 0) {
    keys(allNodes).forEach((key) => {
      if (allNodes[key].parentNodes.length === 0) {
        rootNode = allNodes[key];
      }
    });
  }
  if (!rootNode) {
    if (keys(allVertex)?.length > 0) {
      const res = [];
      res.push();
      keys(allVertex)?.forEach((key) => {
        if (!useCellIds.includes(key)) {
          res.push(buildNode(allVertex[key]));
        }
      });
      clear();
      return res;
    }
    clear();
    return [];
  }

  const oldEdgeInfo: Record<string, any>[] = Array.from(
    rootNode.businessData[mxConstants.CUSTOM_BPMN_EDGE_INFOS] || []
  );
  rootNode.businessData[mxConstants.CUSTOM_BPMN_EDGE_INFOS] = allEdge.map((item: mxCell) => ({
    ...(oldEdgeInfo.find((edge) => edge.id === item.id) || {}),
    id: item.id,
    sourceRef: item?.source?.id,
    targetRef: item?.target?.id,
    name: item.value || '',
    'xsi:flowStyle': item.style,
  })) as bpmnForGraphEdge[];
  rootNode.businessData[mxConstants.CUSTOM_BPMN_PROCESS_INFO] = getGraphInfo();
  const res = [rootNode];
  res.push();
  keys(allVertex)?.forEach((key) => {
    if (!useCellIds.includes(key)) {
      res.push(buildNode(allVertex[key]));
    }
  });
  clear();
  return res;
};
// 根据nodelink 画图
export const setGraphFromJson = (graph: MyGraph, node: nodeLink[], offsetX = 0, offsetY = 0) => {
  graph?.getModel()?.clear();
  const bpmnEdgeInfo =
    (node?.length > 0 && node[0]?.businessData?.[mxConstants.CUSTOM_BPMN_EDGE_INFOS]) || [];
  const edges: { sId: string; tId: string }[] = [];
  const addEdge = (sId, tId) => {
    if (edges.some((it) => it.sId === sId && it.tId === tId)) {
      return;
    }
    edges.push({ sId, tId });
  };
  const findEdgeInfo = (sId, tId) => {
    const edgeInfo: bpmnForGraphEdge = bpmnEdgeInfo.find(
      (item) => item.sourceRef === sId && item.targetRef === tId
    );
    return {
      name: edgeInfo?.name || '',
      id: edgeInfo?.id || nanoid(),
      style: edgeInfo['xsi:flowStyle'],
    };
  };
  const renderEdge = () => {
    edges.forEach((item) => {
      const info = findEdgeInfo(item.sId, item.tId);

      graph.insertEdge(
        null,
        info.id,
        info.name,
        graph.findById(item.sId),
        graph.findById(item.tId),
        info?.style || 'endArrow=classic;html=1;shadow=0;edgeStyle=orthogonalEdgeStyle;'
      );
    });
  };
  const insetCell = (node: nodeLink, parent: nodeLink = null) => {
    if (!node) {
      return;
    }
    const { x, y, width, height, style, cellUniqueKey, businessData, value, id } = node;

    const bpmnNodeChild = businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD];
    bpmnNodeChild?.documentation &&
      (businessData[mxConstants.CUSTOM_TOOLTIP] = bpmnNodeChild.documentation);
    const svgIndex = allSvgs.findIndex(
      (item) => item.key === cellUniqueKey || item.style === cellUniqueKey
    );
    const svg = svgIndex > -1 ? allSvgs[svgIndex] : { value: '' };
    if (svg.type === 'function') {
      if (parent) {
        addEdge(parent?.id, id);
      }
      const cellRender = graph.findById(id);
      if (cellRender) {
        return;
      }
      svg.func(graph, x + offsetX, y + offsetY, width, height, id, value, businessData);
      return;
    }
    if (parent) {
      addEdge(parent?.id, id);
    }
    const cellRender = graph.findById(id);
    if (cellRender) {
      return;
    }
    const cell = graph.insertVertetByConfig({
      id,
      style,
      x: offsetX + x,
      y: offsetY + y,
      width,
      height,
      type: 'vertex',
      value,
    });
    cell.businessData = businessData;
    cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, cellUniqueKey);
  };
  const setChild = (nodes: nodeLink[], parent: nodeLink = null) => {
    nodes.forEach((node) => {
      insetCell(node, parent);
      if (node?.nextNode?.length > 0) {
        setChild(node?.nextNode, node);
      }
    });
  };
  const c_node = node.shift();
  insetCell(c_node);
  if (c_node?.nextNode?.length > 0) {
    setChild(c_node.nextNode, c_node);
  }
  node.forEach((n) => {
    insetCell(n, null);
  });
  graph.refresh();
  renderEdge();
};
// bpmnXml2json解析bpmn
interface bpmnNode extends Node {
  attributes?: NamedNodeMap;
  outerHTML?: string;
}
interface bpmnEdgeChildType {
  documentation?: string;
  conditionExpression?: string;
}
interface bpmnForGraphEdge {
  id?: string;
  sourceRef?: string;
  targetRef?: string;
  name?: string;
  bpmnEdgeChild?: bpmnEdgeChildType;
  'xsi:flowStyle'?: string;
  [x: string]: any;
}
interface multiInstanceLoopCharacteristicsType {
  isSequential?: boolean; // 是否串行
  xml?: string;
}
export interface bpmnNodeChildType {
  outgoing?: string[];
  incoming?: string[];
  documentation?: string;
  multiInstanceLoopCharacteristics?: multiInstanceLoopCharacteristicsType;
}
interface bpmnForGraphNode {
  id?: string;
  name?: string;
  width?: string;
  height?: string;
  type?: (typeof bpmnNodeNames)[number];
  bpmnNodeChild?: bpmnNodeChildType;
  x?: string;
  y?: string;
  [x: string]: any;
}
const bpmnNodeNames = [
  'startEvent',
  'userTask',
  'task',
  'intermediateThrowEvent',
  'endEvent',
  'exclusiveGateway',
  'parallelGateway',
];
const bpmn2MxGraphMap = {
  startEvent: '开始',
  endEvent: '结束',
  intermediateThrowEvent: '结束',
  userTask: '审批',
  task: '审批',
  exclusiveGateway: '判断5',
  parallelGateway: '判断4',
};

let allBpmnNode: Record<string, bpmnForGraphNode> = {};
let allBpmnEdge: bpmnForGraphEdge[] = [];
let bpmnEdge = 'sequenceFlow';
let allBuildBpmnNode: Record<string, nodeLink> = {};
let useBpmnIds = [];
let bpmnRootId = '0';
let sourceBpmnNodeAttr = {};
const clearBpmn = () => {
  allBpmnNode = {};
  allBpmnEdge = [];
  allBuildBpmnNode = {};
  useBpmnIds = [];
  bpmnRootId = '0';
  sourceBpmnNodeAttr = {};
  clear();
};
const getAllAttrs = (nodeMap: NamedNodeMap): Record<string, any> => {
  const allAttrs = {};
  for (let i = 0; i < nodeMap.length; i++) {
    const item = nodeMap.item(i);
    allAttrs[item.nodeName] = item.value;
  }
  return allAttrs;
};
const buildNodeAttribute = (nodeMap: NamedNodeMap) => {
  const allAttrs = getAllAttrs(nodeMap);
  sourceBpmnNodeAttr[nodeMap?.getNamedItem('id')?.value] = allAttrs;
  return {
    ...allAttrs,
    id: nodeMap?.getNamedItem('id')?.value,
    name: nodeMap?.getNamedItem('name')?.value,
  };
};

const buildEdgeAttribute = (nodeMap: NamedNodeMap): bpmnForGraphEdge => {
  return {
    ...getAllAttrs(nodeMap),
    id: nodeMap?.getNamedItem('id')?.value,
    sourceRef: nodeMap?.getNamedItem('sourceRef')?.value,
    targetRef: nodeMap?.getNamedItem('targetRef')?.value,
  };
};
const getEdgeChild = (node: bpmnNode): bpmnEdgeChildType => {
  const nodes = Array.from(node.childNodes);
  return {
    documentation: nodes.find((node) => node.nodeName === 'documentation')?.textContent || '',
    conditionExpression:
      (nodes.find((node) => node.nodeName === 'conditionExpression') as bpmnNode)?.outerHTML || '',
  };
};
const buildNodeOutIn = (node: bpmnNode): bpmnNodeChildType => {
  const childNodes = Array.from(node.childNodes);
  const seq: bpmnNode = childNodes.find(
    (node) => node.nodeName === 'multiInstanceLoopCharacteristics'
  );
  if (seq) {
    const xml = seq?.outerHTML;
    const attrs = seq?.attributes;
    return {
      outgoing: (() => {
        return childNodes
          .filter((node) => node.nodeName === 'outgoing')
          .map((item) => item?.textContent) as string[];
      })(),
      incoming: (() => {
        return childNodes
          .filter((node) => node.nodeName === 'incoming')
          .map((item) => item?.textContent) as string[];
      })(),
      documentation: (() => {
        const doc = childNodes.find((node) => node.nodeName === 'documentation')?.textContent;
        return doc === 'undefined' ? '' : doc || '';
      })(),
      multiInstanceLoopCharacteristics: {
        isSequential: attrs?.getNamedItem('isSequential')?.value === 'true',
        xml,
      },
    };
  }

  return {
    outgoing: (() => {
      return childNodes
        .filter((node) => node.nodeName === 'outgoing')
        .map((item) => item?.textContent) as string[];
    })(),
    incoming: (() => {
      return childNodes
        .filter((node) => node.nodeName === 'incoming')
        .map((item) => item?.textContent) as string[];
    })(),
    documentation: (() => {
      const doc = childNodes.find((node) => node.nodeName === 'documentation')?.textContent;
      return doc === 'undefined' ? '' : doc || '';
    })(),
  };
};
const walkAllNode = (nodes: bpmnNode[]) => {
  nodes.forEach((node) => {
    const nodeName = node?.nodeName;
    if (bpmnNodeNames.includes(nodeName)) {
      const attributes = buildNodeAttribute(node?.attributes);
      allBpmnNode[attributes.id] = {
        ...attributes,
        type: nodeName,
        bpmnNodeChild: buildNodeOutIn(node),
      };
    }
    if (nodeName === bpmnEdge) {
      const attributes = buildEdgeAttribute(node?.attributes);
      allBpmnEdge.push({
        ...attributes,
        bpmnEdgeChild: getEdgeChild(node),
      });
    }
    if (node.childNodes.length > 0) {
      walkAllNode(Array.from(node.childNodes));
    }
  });
};
const buildDiagramAttr = (node: bpmnNode) => {
  const nodeMap = node.attributes;
  const childNodes = node.childNodes;
  const bounds: bpmnNode = Array.from(childNodes).find((item) => item.nodeName === 'omgdc:Bounds');
  const attrs = bounds.attributes;
  return {
    bpmnElement: nodeMap?.getNamedItem('bpmnElement')?.value,
    x: attrs?.getNamedItem('x')?.value,
    y: attrs?.getNamedItem('y')?.value,
    width: attrs?.getNamedItem('width')?.value,
    height: attrs?.getNamedItem('height')?.value,
  };
};
const walkAllDiagram = (nodes: bpmnNode[]) => {
  nodes.forEach((node) => {
    const nodeName = node?.nodeName;
    if (nodeName === 'bpmndi:BPMNShape') {
      const attr = buildDiagramAttr(node);
      allBpmnNode[attr.bpmnElement] = { ...allBpmnNode[attr.bpmnElement], ...attr };
    }
    if (node.childNodes.length > 0) {
      walkAllDiagram(Array.from(node.childNodes));
    }
  });
};

const buildBpmnNode = (node: bpmnForGraphNode): nodeLink => {
  const graphKey = bpmn2MxGraphMap[node.type];
  const svg = allSvgs.find((item) => item.key === graphKey);
  let res: nodeLink = {
    id: node.id,
    cellUniqueKey: graphKey,
    style: svg.style,
    x: +node.x,
    y: +node.y,
    width: svg.tw || svg.w,
    height: svg.th || svg.h,
    nextNode: [],
    parentNodes: [],
    businessData: {},
    value: node.name || svg.value,
  };
  res.businessData[mxConstants.CUSTOM_BPMN_DATA_KEY] = sourceBpmnNodeAttr[node.id];
  res.businessData[mxConstants.CUSTOM_BPMN_LABEL] = node.type;
  res.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD] = node.bpmnNodeChild;
  allBuildBpmnNode[node.id] = res;
  return res;
};

const buildBpmnStructJson = (edges: bpmnForGraphEdge[]) => {
  edges.forEach((node) => {
    const sId = node.sourceRef;
    const tId = node.targetRef;
    if (sId && tId) {
      useBpmnIds.push(sId);
      useBpmnIds.push(tId);
      const start = allBpmnNode[sId];
      const end = allBpmnNode[tId];
      const sNode = allBuildBpmnNode[sId] || buildBpmnNode(start);
      const eNode = allBuildBpmnNode[tId] || buildBpmnNode(end);
      sNode.nextNode.push(eNode);
      eNode.parentNodes.push(sNode);
      if (sNode.parentNodes.length === 0) {
        bpmnRootId = sId;
      }
    }
  });
};
// 将bpmn转换为json
export const bpmnXmlToJson = (xml: string): nodeLink[] => {
  clearBpmn();
  const xmlDoc = mxUtils.parseXml(xml);
  const docEle = xmlDoc.documentElement;
  const c_nodes = docEle.childNodes;
  const nodeArr = Array.from(c_nodes);
  const process: bpmnNode = nodeArr.find((item) => item.nodeName === 'process');
  const id = process?.attributes?.getNamedItem('id')?.value;
  const name = process?.attributes?.getNamedItem('name')?.value;
  const diagram = nodeArr?.find((item) => item.nodeName === 'bpmndi:BPMNDiagram');
  const diagrams = Array.from(diagram?.childNodes)?.find(
    (item) => item?.nodeName === 'bpmndi:BPMNPlane'
  );
  walkAllNode(Array.from(process.childNodes));
  walkAllDiagram(Array.from(diagrams.childNodes));
  buildBpmnStructJson(allBpmnEdge);
  let rootNode = allBuildBpmnNode[bpmnRootId];
  if (rootNode?.parentNodes?.length > 0) {
    forIn(allBuildBpmnNode, (value) => {
      if (value?.parentNodes?.length === 0) {
        rootNode = value;
      }
    });
  }
  const res = [];
  if (rootNode) {
    // 根节点存储线条信息
    rootNode.businessData[mxConstants.CUSTOM_BPMN_EDGE_INFOS] = allBpmnEdge;
    // 根节点存储流程基本信息
    rootNode.businessData[mxConstants.CUSTOM_BPMN_PROCESS_INFO] = { id, name };
    res.push(rootNode);
  }
  setGraphInfo(id, name);
  keys(allBpmnNode).forEach((key) => {
    if (!useBpmnIds.includes(key)) {
      res.push(buildBpmnNode(allBpmnNode[key]));
    }
  });
  clearBpmn();
  return res;
};
// json2bpmnXml
let j2xAllNodes: nodeLink[] = [];
let j2xAllEdges: Record<string, bpmnForGraphEdge> = {};
let tempAllEdgesInfo: bpmnForGraphEdge[] = [];
const j2xClear = () => {
  j2xAllNodes = [];
  j2xAllEdges = {};
  tempAllEdgesInfo = [];
};
const findTagByUniqueKey = (uniqueKey: string) => {
  let res = null;
  forIn(bpmn2MxGraphMap, (value, key) => {
    if (res === null && value === uniqueKey) {
      res = key;
    }
  });
  return res || 'task';
};
const walkNodeAndEdge = (nodes: nodeLink[], parent: nodeLink = null) => {
  nodes.forEach((node) => {
    !j2xAllNodes.some((item) => item.id === node.id) && j2xAllNodes.push(node);
    node.businessData[mxConstants.CUSTOM_BPMN_LABEL] =
      node.businessData[mxConstants.CUSTOM_BPMN_LABEL] ||
      findTagByUniqueKey(node.businessData[mxConstants.CUSTOM_CELL_UNIQUE_KEY]);
    //////////////////////////////////////////////////////////
    const bpmnNodeChild: bpmnNodeChildType = node.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD];
    tempAllEdgesInfo =
      tempAllEdgesInfo.length === 0
        ? node.businessData[mxConstants.CUSTOM_BPMN_EDGE_INFOS] || []
        : tempAllEdgesInfo;

    const { incoming, outgoing } = bpmnNodeChild;
    if (incoming) {
      // 构建线条
      incoming.forEach((inc) => {
        const edgeInfo = tempAllEdgesInfo.find((item) => item.id === inc);
        j2xAllEdges[inc] = j2xAllEdges[inc] || edgeInfo || {};
        j2xAllEdges[inc].id = inc || j2xAllEdges[inc].id;
        j2xAllEdges[inc].targetRef = node.id || j2xAllEdges[inc].targetRef;
      });
    }
    if (outgoing) {
      outgoing.forEach((out) => {
        const edgeInfo = tempAllEdgesInfo.find((item) => item.id === out);
        j2xAllEdges[out] = j2xAllEdges[out] || edgeInfo || {};
        j2xAllEdges[out].id = out || j2xAllEdges[out].id;
        j2xAllEdges[out].sourceRef = node.id || j2xAllEdges[out].sourceRef;
      });
    }
    if (node.nextNode.length > 0) {
      walkNodeAndEdge(node.nextNode, node);
    }
  });
};

const writeBpmnNodeAndFlow = () => {
  let nodesStr = '';
  // 输出位置定义
  let posStr = '';
  const getFlowKey = (key: string) => (key.startsWith('Flow_') ? key : `Flow_${key}`);
  j2xAllNodes.forEach((node) => {
    const attrs = node.businessData[mxConstants.CUSTOM_BPMN_DATA_KEY] || {};
    const tag = node.businessData[mxConstants.CUSTOM_BPMN_LABEL];
    const bpmnNodeChild: bpmnNodeChildType =
      node.businessData[mxConstants.CUSTOM_BPMN_NODE_CHILD] || {};
    let attrStr = '';
    forIn(attrs, (value, key) => {
      attrStr += ` ${key}="${value}" `;
    });
    let inNodeStr = '';
    forIn(bpmnNodeChild, (value, key) => {
      if (value && key !== 'multiInstanceLoopCharacteristics') {
        if (['incoming', 'outgoing'].includes(key)) {
          (value as string[])?.forEach((v) => {
            v = `${getFlowKey(v as string)}`;
            inNodeStr += `<${key}>${v}</${key}> ${mxConstants.CUSTOM_EOL}`;
          });
        } else {
          inNodeStr += `<${key}>${value}</${key}> ${mxConstants.CUSTOM_EOL}`;
        }
      }
    });
    if (bpmnNodeChild?.multiInstanceLoopCharacteristics) {
      inNodeStr += bpmnNodeChild?.multiInstanceLoopCharacteristics?.xml;
    }
    nodesStr += `<${tag} ${attrStr}>
            ${inNodeStr}
        </${tag}> ${mxConstants.CUSTOM_EOL}`;
    posStr += `<bpmndi:BPMNShape id="${node.id}_di" bpmnElement="${node.id}">
                <omgdc:Bounds x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape> ${mxConstants.CUSTOM_EOL}`;
  });
  let edgesStr = '';
  let edgePosStr = '';
  const getNodeRightPos = (node: nodeLink) => {
    if (!node) {
      console.log('数据错误');
      return { x: 0, y: 0 };
    }
    return { x: node?.x + node?.width, y: node?.y + node?.height / 2 };
  };
  const getNodeLeftPos = (node: nodeLink) => {
    if (!node) {
      console.log('数据错误');
      return { x: 0, y: 0 };
    }
    return { x: node?.x, y: node?.y + node?.height / 2 };
  };
  forIn(j2xAllEdges, (value) => {
    edgesStr += `<sequenceFlow ${(() => {
      let res = '';
      forIn(value, (value1, key) => {
        if (key === 'id') {
          value1 = `${getFlowKey(value1 as string)}`;
        }
        if (key !== 'bpmnEdgeChild') {
          res += ` ${key}="${value1}"`;
        }
      });
      return res;
    })()}>${mxConstants.CUSTOM_EOL}<documentation>${
      value?.bpmnEdgeChild?.documentation
    }</documentation>${mxConstants.CUSTOM_EOL}
            ${value?.bpmnEdgeChild?.conditionExpression || ''}
            ${mxConstants.CUSTOM_EOL}
            </sequenceFlow> ${mxConstants.CUSTOM_EOL}`;
    const { x: x1, y: y1 } = getNodeRightPos(
      j2xAllNodes.find((item) => item.id === value.sourceRef)
    );
    const { x: x2, y: y2 } = getNodeLeftPos(
      j2xAllNodes.find((item) => item.id === value.targetRef)
    );
    edgePosStr += `<bpmndi:BPMNEdge 
            id="${getFlowKey(value.id as string)}_di"
            bpmnElement="${getFlowKey(value.id as string)}">
                <di:waypoint x="${x1}" y="${y1}" />
                <di:waypoint x="${x2}" y="${y2}" />
            </bpmndi:BPMNEdge> ${mxConstants.CUSTOM_EOL}`;
  });
  j2xClear();
  return { nodesStr, edgesStr, posStr, edgePosStr };
};
const getBmpXml = (id, name, nodesStr, edgesStr, posStr, edgePosStr) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions
        xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
        xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
        xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
        xmlns:flowable="http://flowable.org/bpmn"
        xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">
    <process id="${id}" name="${name}">
        ${nodesStr}
        ${edgesStr}
    </process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
        <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="${id}">
           ${posStr}
            ${edgePosStr}
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</definitions>
`;
};
// 将nodelinke 转换为bpmnxml
export const writeBpmnXml = (nodes: nodeLink[]): string => {
  walkNodeAndEdge(nodes);
  const { nodesStr, edgesStr, posStr, edgePosStr } = writeBpmnNodeAndFlow();
  if (nodes?.length === 0) {
    return;
  }
  const rootNode = nodes[0];
  const info = rootNode?.businessData[mxConstants.CUSTOM_BPMN_PROCESS_INFO];
  return getBmpXml(info?.id, info?.name, nodesStr, edgesStr, posStr, edgePosStr);
};

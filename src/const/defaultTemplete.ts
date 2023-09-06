// @ts-expect-error
import multiDemoXml from '../xml/multiDemoXml.xml?raw';
// @ts-expect-error
import gridXml from '../xml/gridXml.xml?raw';
// @ts-expect-error
import timeLine from '../xml/timeLine.xml?raw';
export const graphTemplate = [
  {
    name: '简单模板',
    xml: '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="uYDwLACotQpNy3yG0z0iz" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="90" y="170" width="120" height="60" as="geometry"/></mxCell><mxCell id="_Dl8rGlPDyQbnGMeh5cBK" value="" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="290" y="160" width="120" height="60" as="geometry"/></mxCell><mxCell id="2" value="" style="edgeStyle=orthogonalEdgeStyle;editable=1" edge="1" parent="1" source="uYDwLACotQpNy3yG0z0iz" target="_Dl8rGlPDyQbnGMeh5cBK"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>',
  },
  {
    name: '复杂模板',
    xml: multiDemoXml,
  },
  {
    name: '线条模板',
    xml: gridXml,
  },
  {
    name: '时间轴',
    xml: timeLine,
  },
];

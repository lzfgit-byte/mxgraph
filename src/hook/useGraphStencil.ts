// @ts-expect-error
import bpmn from '../xml/bpmn.xml?raw';
// @ts-expect-error
import arrows from '../xml/arrows.xml?raw';
// @ts-expect-error
import basic from '../xml/basic.xml?raw';
// @ts-expect-error
import flowchart from '../xml/flowchart.xml?raw';
import mx from '../hook/useGraphFactory';
const { mxUtils, mxStencilRegistry, mxStencil, mxConstants } = mx;
const parseStencilSet = (root) => {
  if (root.nodeName === 'stencils') {
    let shapes = root.firstChild;

    while (shapes != null) {
      if (shapes.nodeName === 'shapes') {
        parseStencilSet(shapes);
      }

      shapes = shapes.nextSibling;
    }
  } else {
    let shape = root.firstChild;
    let packageName = '';
    let name = root.getAttribute('name');

    if (name != null) {
      packageName = `${name}.`;
    }

    while (shape != null) {
      if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
        name = shape.getAttribute('name');

        if (name != null) {
          packageName = packageName.toLowerCase();
          let stencilName = name.replace(/ /g, '_');

          mxStencilRegistry.addStencil(
            packageName + stencilName.toLowerCase(),
            new mxStencil(shape)
          );
        }
      }
      shape = shape.nextSibling;
    }
  }
};
export default () => {
  [bpmn, arrows, basic, flowchart].forEach((item) => {
    const xmlDoc = mxUtils.parseXml(item);
    parseStencilSet(xmlDoc.documentElement);
  });
};

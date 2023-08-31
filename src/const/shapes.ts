import mx from '../hook/useGraphFactory';
const {
  mxSwimlane,
  mxUtils,
  mxShape,
  mxRectangleShape,
  mxConstants,
  mxCellRenderer,
  mxCylinder,
  mxActor,
  mxPoint,
  mxRhombus,
  mxEllipse,
  mxTriangle,
  mxPerimeter,
  mxLine,
  mxStyleRegistry,
  mxDoubleEllipse,
  mxArrowConnector,
  mxConnector,
  mxMarker,
  mxArrow,
  mxCloud,
  mxLabel,
  mxImageShape,
  mxConnectionConstraint,
  mxHexagon,
  mxRectangle,
} = mx;
let urlParams: any = (function (url) {
  let result = {};
  let idx = url.lastIndexOf('?');

  if (idx > 0) {
    let params = url.substring(idx + 1).split('&');

    for (let i = 0; i < params.length; i++) {
      idx = params[i].indexOf('=');

      if (idx > 0) {
        result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
      }
    }
  }

  return result;
})(window.location.href);

function TableShape() {
  mxSwimlane.call(this);
}

mxUtils.extend(TableShape, mxSwimlane);

TableShape.prototype.getLabelBounds = function (rect) {
  let start = this.getTitleSize();

  if (start === 0) {
    return mxShape.prototype.getLabelBounds.apply(this, arguments);
  } else {
    return mxSwimlane.prototype.getLabelBounds.apply(this, arguments);
  }
};

TableShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  // LATER: Split background to add striping
  // paintTableBackground(this.state, c, x, y, w, h);

  let start = this.getTitleSize();

  if (start === 0) {
    mxRectangleShape.prototype.paintBackground.apply(this, arguments);
  } else {
    mxSwimlane.prototype.paintVertexShape.apply(this, arguments);
    c.translate(-x, -y);
  }

  this.paintForeground(c, x, y, w, h);
};

TableShape.prototype.paintForeground = function (c, x, y, w, h) {
  if (this.state !== null) {
    let flipH = this.flipH;
    let flipV = this.flipV;

    if (
      this.direction === mxConstants.DIRECTION_NORTH ||
      this.direction === mxConstants.DIRECTION_SOUTH
    ) {
      let tmp = flipH;
      flipH = flipV;
      flipV = tmp;
    }

    // Negative transform to avoid save/restore
    c.rotate(-this.getShapeRotation(), flipH, flipV, x + w / 2, y + h / 2);

    let s = this.scale;
    x = this.bounds.x / s;
    y = this.bounds.y / s;
    w = this.bounds.width / s;
    h = this.bounds.height / s;
    this.paintTableForeground(c, x, y, w, h);
  }
};

TableShape.prototype.paintTableForeground = function (c, x, y, w, h) {
  let graph = this.state.view.graph;
  let start = graph.getActualStartSize(this.state.cell);
  let rows = graph.model.getChildCells(this.state.cell, true);

  if (rows.length > 0) {
    let rowLines = mxUtils.getValue(this.state.style, 'rowLines', '1') !== '0';
    let columnLines = mxUtils.getValue(this.state.style, 'columnLines', '1') !== '0';

    // Paints row lines
    if (rowLines) {
      for (let i = 1; i < rows.length; i++) {
        let geo = graph.getCellGeometry(rows[i]);

        if (geo !== null) {
          c.begin();
          c.moveTo(x + start.x, y + geo.y);
          c.lineTo(x + w - start.width, y + geo.y);
          c.end();
          c.stroke();
        }
      }
    }

    if (columnLines) {
      let cols = graph.model.getChildCells(rows[0], true);

      // Paints column lines
      for (let i = 1; i < cols.length; i++) {
        let geo = graph.getCellGeometry(cols[i]);

        if (geo !== null) {
          c.begin();
          c.moveTo(x + geo.x + start.x, y + start.y);
          c.lineTo(x + geo.x + start.x, y + h - start.height);
          c.end();
          c.stroke();
        }
      }
    }
  }
};

mxCellRenderer.registerShape('table', TableShape);

// Cube Shape, supports size style
function CubeShape() {
  mxCylinder.call(this);
}
mxUtils.extend(CubeShape, mxCylinder);
CubeShape.prototype.size = 20;
CubeShape.prototype.darkOpacity = 0;
CubeShape.prototype.darkOpacity2 = 0;

CubeShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  let s = Math.max(
    0,
    Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))))
  );
  let op = Math.max(
    -1,
    Math.min(1, parseFloat(mxUtils.getValue(this.style, 'darkOpacity', this.darkOpacity)))
  );
  let op2 = Math.max(
    -1,
    Math.min(1, parseFloat(mxUtils.getValue(this.style, 'darkOpacity2', this.darkOpacity2)))
  );
  c.translate(x, y);

  c.begin();
  c.moveTo(0, 0);
  c.lineTo(w - s, 0);
  c.lineTo(w, s);
  c.lineTo(w, h);
  c.lineTo(s, h);
  c.lineTo(0, h - s);
  c.lineTo(0, 0);
  c.close();
  c.end();
  c.fillAndStroke();

  if (!this.outline) {
    c.setShadow(false);

    if (op !== 0) {
      c.setFillAlpha(Math.abs(op));
      c.setFillColor(op < 0 ? '#FFFFFF' : '#000000');
      c.begin();
      c.moveTo(0, 0);
      c.lineTo(w - s, 0);
      c.lineTo(w, s);
      c.lineTo(s, s);
      c.close();
      c.fill();
    }

    if (op2 !== 0) {
      c.setFillAlpha(Math.abs(op2));
      c.setFillColor(op2 < 0 ? '#FFFFFF' : '#000000');
      c.begin();
      c.moveTo(0, 0);
      c.lineTo(s, s);
      c.lineTo(s, h);
      c.lineTo(0, h - s);
      c.close();
      c.fill();
    }

    c.begin();
    c.moveTo(s, h);
    c.lineTo(s, s);
    c.lineTo(0, 0);
    c.moveTo(s, s);
    c.lineTo(w, s);
    c.end();
    c.stroke();
  }
};
CubeShape.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let s = parseFloat(mxUtils.getValue(this.style, 'size', this.size)) * this.scale;

    return new mxRectangle(s, s, 0, 0);
  }

  return null;
};

mxCellRenderer.registerShape('cube', CubeShape);

let tan30 = Math.tan(mxUtils.toRadians(30));
let tan30Dx = (0.5 - tan30) / 2;

// Cube Shape, supports size style
function IsoRectangleShape() {
  mxActor.call(this);
}
mxUtils.extend(IsoRectangleShape, mxActor);
IsoRectangleShape.prototype.size = 20;
IsoRectangleShape.prototype.redrawPath = function (path, x, y, w, h) {
  let m = Math.min(w, h / tan30);

  path.translate((w - m) / 2, (h - m) / 2 + m / 4);
  path.moveTo(0, 0.25 * m);
  path.lineTo(0.5 * m, m * tan30Dx);
  path.lineTo(m, 0.25 * m);
  path.lineTo(0.5 * m, (0.5 - tan30Dx) * m);
  path.lineTo(0, 0.25 * m);
  path.close();
  path.end();
};

mxCellRenderer.registerShape('isoRectangle', IsoRectangleShape);

// Cube Shape, supports size style
function IsoCubeShape() {
  mxCylinder.call(this);
}
mxUtils.extend(IsoCubeShape, mxCylinder);
IsoCubeShape.prototype.size = 20;
IsoCubeShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
  let m = Math.min(w, h / (0.5 + tan30));

  if (isForeground) {
    path.moveTo(0, 0.25 * m);
    path.lineTo(0.5 * m, (0.5 - tan30Dx) * m);
    path.lineTo(m, 0.25 * m);
    path.moveTo(0.5 * m, (0.5 - tan30Dx) * m);
    path.lineTo(0.5 * m, (1 - tan30Dx) * m);
    path.end();
  } else {
    path.translate((w - m) / 2, (h - m) / 2);
    path.moveTo(0, 0.25 * m);
    path.lineTo(0.5 * m, m * tan30Dx);
    path.lineTo(m, 0.25 * m);
    path.lineTo(m, 0.75 * m);
    path.lineTo(0.5 * m, (1 - tan30Dx) * m);
    path.lineTo(0, 0.75 * m);
    path.close();
    path.end();
  }
};

mxCellRenderer.registerShape('isoCube', IsoCubeShape);

// DataStore Shape, supports size style
function DataStoreShape() {
  mxCylinder.call(this);
}
mxUtils.extend(DataStoreShape, mxCylinder);

DataStoreShape.prototype.redrawPath = function (c, x, y, w, h, isForeground) {
  let dy = Math.min(h / 2, Math.round(h / 8) + this.strokewidth - 1);

  if ((isForeground && this.fill !== null) || (!isForeground && this.fill === null)) {
    c.moveTo(0, dy);
    c.curveTo(0, 2 * dy, w, 2 * dy, w, dy);

    // Needs separate shapes for correct hit-detection
    if (!isForeground) {
      c.stroke();
      c.begin();
    }

    c.translate(0, dy / 2);
    c.moveTo(0, dy);
    c.curveTo(0, 2 * dy, w, 2 * dy, w, dy);

    // Needs separate shapes for correct hit-detection
    if (!isForeground) {
      c.stroke();
      c.begin();
    }

    c.translate(0, dy / 2);
    c.moveTo(0, dy);
    c.curveTo(0, 2 * dy, w, 2 * dy, w, dy);

    // Needs separate shapes for correct hit-detection
    if (!isForeground) {
      c.stroke();
      c.begin();
    }

    c.translate(0, -dy);
  }

  if (!isForeground) {
    c.moveTo(0, dy);
    c.curveTo(0, -dy / 3, w, -dy / 3, w, dy);
    c.lineTo(w, h - dy);
    c.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy);
    c.close();
  }
};
DataStoreShape.prototype.getLabelMargins = function (rect) {
  return new mxRectangle(
    0,
    2.5 * Math.min(rect.height / 2, Math.round(rect.height / 8) + this.strokewidth - 1),
    0,
    0
  );
};

mxCellRenderer.registerShape('datastore', DataStoreShape);

// Note Shape, supports size style
function NoteShape() {
  mxCylinder.call(this);
}
mxUtils.extend(NoteShape, mxCylinder);
NoteShape.prototype.size = 30;
NoteShape.prototype.darkOpacity = 0;

NoteShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  let s = Math.max(
    0,
    Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))))
  );
  let op = Math.max(
    -1,
    Math.min(1, parseFloat(mxUtils.getValue(this.style, 'darkOpacity', this.darkOpacity)))
  );
  c.translate(x, y);

  c.begin();
  c.moveTo(0, 0);
  c.lineTo(w - s, 0);
  c.lineTo(w, s);
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.lineTo(0, 0);
  c.close();
  c.end();
  c.fillAndStroke();

  if (!this.outline) {
    c.setShadow(false);

    if (op !== 0) {
      c.setFillAlpha(Math.abs(op));
      c.setFillColor(op < 0 ? '#FFFFFF' : '#000000');
      c.begin();
      c.moveTo(w - s, 0);
      c.lineTo(w - s, s);
      c.lineTo(w, s);
      c.close();
      c.fill();
    }

    c.begin();
    c.moveTo(w - s, 0);
    c.lineTo(w - s, s);
    c.lineTo(w, s);
    c.end();
    c.stroke();
  }
};

mxCellRenderer.registerShape('note', NoteShape);

// Note Shape, supports size style
function NoteShape2() {
  NoteShape.call(this);
}
mxUtils.extend(NoteShape2, NoteShape);

mxCellRenderer.registerShape('note2', NoteShape2);

// Flexible cube Shape
function IsoCubeShape2() {
  mxShape.call(this);
}
mxUtils.extend(IsoCubeShape2, mxShape);
IsoCubeShape2.prototype.isoAngle = 15;

IsoCubeShape2.prototype.paintVertexShape = function (c, x, y, w, h) {
  let isoAngle =
    (Math.max(
      0.01,
      Math.min(94, parseFloat(mxUtils.getValue(this.style, 'isoAngle', this.isoAngle)))
    ) *
      Math.PI) /
    200;
  let isoH = Math.min(w * Math.tan(isoAngle), h * 0.5);

  c.translate(x, y);

  c.begin();
  c.moveTo(w * 0.5, 0);
  c.lineTo(w, isoH);
  c.lineTo(w, h - isoH);
  c.lineTo(w * 0.5, h);
  c.lineTo(0, h - isoH);
  c.lineTo(0, isoH);
  c.close();
  c.fillAndStroke();

  c.setShadow(false);

  c.begin();
  c.moveTo(0, isoH);
  c.lineTo(w * 0.5, 2 * isoH);
  c.lineTo(w, isoH);
  c.moveTo(w * 0.5, 2 * isoH);
  c.lineTo(w * 0.5, h);
  c.stroke();
};

mxCellRenderer.registerShape('isoCube2', IsoCubeShape2);

// (LEGACY) Flexible cylinder Shape
function CylinderShape() {
  mxShape.call(this);
}

mxUtils.extend(CylinderShape, mxShape);

CylinderShape.prototype.size = 15;

CylinderShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  let size = Math.max(
    0,
    Math.min(h * 0.5, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
  );

  c.translate(x, y);

  if (size === 0) {
    c.rect(0, 0, w, h);
    c.fillAndStroke();
  } else {
    c.begin();
    c.moveTo(0, size);
    c.arcTo(w * 0.5, size, 0, 0, 1, w * 0.5, 0);
    c.arcTo(w * 0.5, size, 0, 0, 1, w, size);
    c.lineTo(w, h - size);
    c.arcTo(w * 0.5, size, 0, 0, 1, w * 0.5, h);
    c.arcTo(w * 0.5, size, 0, 0, 1, 0, h - size);
    c.close();
    c.fillAndStroke();

    c.setShadow(false);

    c.begin();
    c.moveTo(w, size);
    c.arcTo(w * 0.5, size, 0, 0, 1, w * 0.5, 2 * size);
    c.arcTo(w * 0.5, size, 0, 0, 1, 0, size);
    c.stroke();
  }
};

mxCellRenderer.registerShape('cylinder2', CylinderShape);

// Flexible cylinder3 Shape with offset label
function CylinderShape3(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);
  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = strokewidth !== null ? strokewidth : 1;
}

mxUtils.extend(CylinderShape3, mxCylinder);

CylinderShape3.prototype.size = 15;

CylinderShape3.prototype.paintVertexShape = function (c, x, y, w, h) {
  let size = Math.max(
    0,
    Math.min(h * 0.5, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
  );
  let lid = mxUtils.getValue(this.style, 'lid', true);

  c.translate(x, y);

  if (size === 0) {
    c.rect(0, 0, w, h);
    c.fillAndStroke();
  } else {
    c.begin();

    if (lid) {
      c.moveTo(0, size);
      c.arcTo(w * 0.5, size, 0, 0, 1, w * 0.5, 0);
      c.arcTo(w * 0.5, size, 0, 0, 1, w, size);
    } else {
      c.moveTo(0, 0);
      c.arcTo(w * 0.5, size, 0, 0, 0, w * 0.5, size);
      c.arcTo(w * 0.5, size, 0, 0, 0, w, 0);
    }

    c.lineTo(w, h - size);
    c.arcTo(w * 0.5, size, 0, 0, 1, w * 0.5, h);
    c.arcTo(w * 0.5, size, 0, 0, 1, 0, h - size);
    c.close();
    c.fillAndStroke();

    c.setShadow(false);

    if (lid) {
      c.begin();
      c.moveTo(w, size);
      c.arcTo(w * 0.5, size, 0, 0, 1, w * 0.5, 2 * size);
      c.arcTo(w * 0.5, size, 0, 0, 1, 0, size);
      c.stroke();
    }
  }
};

mxCellRenderer.registerShape('cylinder3', CylinderShape3);

// Switch Shape, supports size style
function SwitchShape() {
  mxActor.call(this);
}
mxUtils.extend(SwitchShape, mxActor);
SwitchShape.prototype.redrawPath = function (c, x, y, w, h) {
  let curve = 0.5;
  c.moveTo(0, 0);
  c.quadTo(w / 2, h * curve, w, 0);
  c.quadTo(w * (1 - curve), h / 2, w, h);
  c.quadTo(w / 2, h * (1 - curve), 0, h);
  c.quadTo(w * curve, h / 2, 0, 0);
  c.end();
};

mxCellRenderer.registerShape('switch', SwitchShape);

// Folder Shape, supports tabWidth, tabHeight styles
function FolderShape() {
  mxCylinder.call(this);
}
mxUtils.extend(FolderShape, mxCylinder);
FolderShape.prototype.tabWidth = 60;
FolderShape.prototype.tabHeight = 20;
FolderShape.prototype.tabPosition = 'right';
FolderShape.prototype.arcSize = 0.1;

FolderShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.translate(x, y);

  let dx = Math.max(
    0,
    Math.min(w, parseFloat(mxUtils.getValue(this.style, 'tabWidth', this.tabWidth)))
  );
  let dy = Math.max(
    0,
    Math.min(h, parseFloat(mxUtils.getValue(this.style, 'tabHeight', this.tabHeight)))
  );
  let tp = mxUtils.getValue(this.style, 'tabPosition', this.tabPosition);
  let rounded = mxUtils.getValue(this.style, 'rounded', false);
  let absArcSize = mxUtils.getValue(this.style, 'absoluteArcSize', false);
  let arcSize = parseFloat(mxUtils.getValue(this.style, 'arcSize', this.arcSize));

  if (!absArcSize) {
    arcSize = Math.min(w, h) * arcSize;
  }

  arcSize = Math.min(arcSize, w * 0.5, (h - dy) * 0.5);

  dx = Math.max(dx, arcSize);
  dx = Math.min(w - arcSize, dx);

  if (!rounded) {
    arcSize = 0;
  }

  c.begin();

  if (tp === 'left') {
    c.moveTo(Math.max(arcSize, 0), dy);
    c.lineTo(Math.max(arcSize, 0), 0);
    c.lineTo(dx, 0);
    c.lineTo(dx, dy);
  }
  // Right is default
  else {
    c.moveTo(w - dx, dy);
    c.lineTo(w - dx, 0);
    c.lineTo(w - Math.max(arcSize, 0), 0);
    c.lineTo(w - Math.max(arcSize, 0), dy);
  }

  if (rounded) {
    c.moveTo(0, arcSize + dy);
    c.arcTo(arcSize, arcSize, 0, 0, 1, arcSize, dy);
    c.lineTo(w - arcSize, dy);
    c.arcTo(arcSize, arcSize, 0, 0, 1, w, arcSize + dy);
    c.lineTo(w, h - arcSize);
    c.arcTo(arcSize, arcSize, 0, 0, 1, w - arcSize, h);
    c.lineTo(arcSize, h);
    c.arcTo(arcSize, arcSize, 0, 0, 1, 0, h - arcSize);
  } else {
    c.moveTo(0, dy);
    c.lineTo(w, dy);
    c.lineTo(w, h);
    c.lineTo(0, h);
  }

  c.close();
  c.fillAndStroke();

  c.setShadow(false);

  let sym = mxUtils.getValue(this.style, 'folderSymbol', null);

  if (sym === 'triangle') {
    c.begin();
    c.moveTo(w - 30, dy + 20);
    c.lineTo(w - 20, dy + 10);
    c.lineTo(w - 10, dy + 20);
    c.close();
    c.stroke();
  }
};

mxCellRenderer.registerShape('folder', FolderShape);

// Folder Shape, supports tabWidth, tabHeight styles
function UMLStateShape() {
  mxCylinder.call(this);
}
mxUtils.extend(UMLStateShape, mxCylinder);
UMLStateShape.prototype.arcSize = 0.1;

UMLStateShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.translate(x, y);

  //		let dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'tabWidth', this.tabWidth))));
  //		let dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'tabHeight', this.tabHeight))));
  //		let tp = mxUtils.getValue(this.style, 'tabPosition', this.tabPosition);
  let rounded = mxUtils.getValue(this.style, 'rounded', false);
  let absArcSize = mxUtils.getValue(this.style, 'absoluteArcSize', false);
  let arcSize = parseFloat(mxUtils.getValue(this.style, 'arcSize', this.arcSize));
  let connPoint = mxUtils.getValue(this.style, 'umlStateConnection', null);

  if (!absArcSize) {
    arcSize = Math.min(w, h) * arcSize;
  }

  arcSize = Math.min(arcSize, w * 0.5, h * 0.5);

  if (!rounded) {
    arcSize = 0;
  }

  let dx = 0;

  if (connPoint !== null) {
    dx = 10;
  }

  c.begin();
  c.moveTo(dx, arcSize);
  c.arcTo(arcSize, arcSize, 0, 0, 1, dx + arcSize, 0);
  c.lineTo(w - arcSize, 0);
  c.arcTo(arcSize, arcSize, 0, 0, 1, w, arcSize);
  c.lineTo(w, h - arcSize);
  c.arcTo(arcSize, arcSize, 0, 0, 1, w - arcSize, h);
  c.lineTo(dx + arcSize, h);
  c.arcTo(arcSize, arcSize, 0, 0, 1, dx, h - arcSize);
  c.close();
  c.fillAndStroke();

  c.setShadow(false);

  let sym = mxUtils.getValue(this.style, 'umlStateSymbol', null);

  if (sym === 'collapseState') {
    c.roundrect(w - 40, h - 20, 10, 10, 3, 3);
    c.stroke();
    c.roundrect(w - 20, h - 20, 10, 10, 3, 3);
    c.stroke();
    c.begin();
    c.moveTo(w - 30, h - 15);
    c.lineTo(w - 20, h - 15);
    c.stroke();
  }

  if (connPoint === 'connPointRefEntry') {
    c.ellipse(0, h * 0.5 - 10, 20, 20);
    c.fillAndStroke();
  } else if (connPoint === 'connPointRefExit') {
    c.ellipse(0, h * 0.5 - 10, 20, 20);
    c.fillAndStroke();

    c.begin();
    c.moveTo(5, h * 0.5 - 5);
    c.lineTo(15, h * 0.5 + 5);
    c.moveTo(15, h * 0.5 - 5);
    c.lineTo(5, h * 0.5 + 5);
    c.stroke();
  }
};

mxCellRenderer.registerShape('umlState', UMLStateShape);

// Card shape
function CardShape() {
  mxActor.call(this);
}
mxUtils.extend(CardShape, mxActor);
CardShape.prototype.size = 30;
CardShape.prototype.isRoundable = function () {
  return true;
};
CardShape.prototype.redrawPath = function (c, x, y, w, h) {
  let s = Math.max(
    0,
    Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))))
  );
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [new mxPoint(s, 0), new mxPoint(w, 0), new mxPoint(w, h), new mxPoint(0, h), new mxPoint(0, s)],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('card', CardShape);

// Tape shape
function TapeShape() {
  mxActor.call(this);
}
mxUtils.extend(TapeShape, mxActor);
TapeShape.prototype.size = 0.4;
TapeShape.prototype.redrawPath = function (c, x, y, w, h) {
  let dy =
    h * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let fy = 1.4;

  c.moveTo(0, dy / 2);
  c.quadTo(w / 4, dy * fy, w / 2, dy / 2);
  c.quadTo((w * 3) / 4, dy * (1 - fy), w, dy / 2);
  c.lineTo(w, h - dy / 2);
  c.quadTo((w * 3) / 4, h - dy * fy, w / 2, h - dy / 2);
  c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2);
  c.lineTo(0, dy / 2);
  c.close();
  c.end();
};

TapeShape.prototype.getLabelBounds = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let size = mxUtils.getValue(this.style, 'size', this.size);
    let w = rect.width;
    let h = rect.height;

    if (
      this.direction === null ||
      this.direction === mxConstants.DIRECTION_EAST ||
      this.direction === mxConstants.DIRECTION_WEST
    ) {
      let dy = h * size;

      return new mxRectangle(rect.x, rect.y + dy, w, h - 2 * dy);
    } else {
      let dx = w * size;

      return new mxRectangle(rect.x + dx, rect.y, w - 2 * dx, h);
    }
  }

  return rect;
};

mxCellRenderer.registerShape('tape', TapeShape);

// Document shape
function DocumentShape() {
  mxActor.call(this);
}
mxUtils.extend(DocumentShape, mxActor);
DocumentShape.prototype.size = 0.3;

DocumentShape.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    return new mxRectangle(
      0,
      0,
      0,
      parseFloat(mxUtils.getValue(this.style, 'size', this.size)) * rect.height
    );
  }

  return null;
};
DocumentShape.prototype.redrawPath = function (c, x, y, w, h) {
  let dy =
    h * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let fy = 1.4;

  c.moveTo(0, 0);
  c.lineTo(w, 0);
  c.lineTo(w, h - dy / 2);
  c.quadTo((w * 3) / 4, h - dy * fy, w / 2, h - dy / 2);
  c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2);
  c.lineTo(0, dy / 2);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('document', DocumentShape);

let cylinderGetCylinderSize = mxCylinder.prototype.getCylinderSize;

mxCylinder.prototype.getCylinderSize = function (x, y, w, h) {
  let size = mxUtils.getValue(this.style, 'size');

  if (size !== null) {
    return h * Math.max(0, Math.min(1, size));
  } else {
    return cylinderGetCylinderSize.apply(this, arguments);
  }
};

mxCylinder.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let size = mxUtils.getValue(this.style, 'size', 0.15) * 2;

    return new mxRectangle(0, Math.min(this.maxHeight * this.scale, rect.height * size), 0, 0);
  }

  return null;
};

CylinderShape3.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let size = mxUtils.getValue(this.style, 'size', 15);

    if (!mxUtils.getValue(this.style, 'lid', true)) {
      size /= 2;
    }

    return new mxRectangle(
      0,
      Math.min(rect.height * this.scale, size * 2 * this.scale),
      0,
      Math.max(0, size * 0.3 * this.scale)
    );
  }

  return null;
};

FolderShape.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let sizeY = mxUtils.getValue(this.style, 'tabHeight', 15) * this.scale;

    if (mxUtils.getValue(this.style, 'labelInHeader', false)) {
      let sizeX = mxUtils.getValue(this.style, 'tabWidth', 15) * this.scale;
      let sizeY = mxUtils.getValue(this.style, 'tabHeight', 15) * this.scale;
      let rounded = mxUtils.getValue(this.style, 'rounded', false);
      let absArcSize = mxUtils.getValue(this.style, 'absoluteArcSize', false);
      let arcSize = parseFloat(mxUtils.getValue(this.style, 'arcSize', this.arcSize));

      if (!absArcSize) {
        arcSize = Math.min(rect.width, rect.height) * arcSize;
      }

      arcSize = Math.min(arcSize, rect.width * 0.5, (rect.height - sizeY) * 0.5);

      if (!rounded) {
        arcSize = 0;
      }

      if (mxUtils.getValue(this.style, 'tabPosition', this.tabPosition) === 'left') {
        return new mxRectangle(
          arcSize,
          0,
          Math.min(rect.width, rect.width - sizeX),
          Math.min(rect.height, rect.height - sizeY)
        );
      } else {
        return new mxRectangle(
          Math.min(rect.width, rect.width - sizeX),
          0,
          arcSize,
          Math.min(rect.height, rect.height - sizeY)
        );
      }
    } else {
      return new mxRectangle(0, Math.min(rect.height, sizeY), 0, 0);
    }
  }

  return null;
};

UMLStateShape.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let connPoint = mxUtils.getValue(this.style, 'umlStateConnection', null);

    if (connPoint !== null) {
      return new mxRectangle(10 * this.scale, 0, 0, 0);
    }
  }

  return null;
};

NoteShape2.prototype.getLabelMargins = function (rect) {
  if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
    let size = mxUtils.getValue(this.style, 'size', 15);

    return new mxRectangle(
      0,
      Math.min(rect.height * this.scale, size * this.scale),
      0,
      Math.max(0, size * this.scale)
    );
  }

  return null;
};

// Parallelogram shape
function ParallelogramShape() {
  mxActor.call(this);
}
mxUtils.extend(ParallelogramShape, mxActor);
ParallelogramShape.prototype.size = 0.2;
ParallelogramShape.prototype.fixedSize = 20;
ParallelogramShape.prototype.isRoundable = function () {
  return true;
};
ParallelogramShape.prototype.redrawPath = function (c, x, y, w, h) {
  let fixed = mxUtils.getValue(this.style, 'fixedSize', '0') !== '0';

  let dx = fixed
    ? Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'size', this.fixedSize))))
    : w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [new mxPoint(0, h), new mxPoint(dx, 0), new mxPoint(w, 0), new mxPoint(w - dx, h)],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('parallelogram', ParallelogramShape);

// Trapezoid shape
function TrapezoidShape() {
  mxActor.call(this);
}
mxUtils.extend(TrapezoidShape, mxActor);
TrapezoidShape.prototype.size = 0.2;
TrapezoidShape.prototype.fixedSize = 20;
TrapezoidShape.prototype.isRoundable = function () {
  return true;
};
TrapezoidShape.prototype.redrawPath = function (c, x, y, w, h) {
  let fixed = mxUtils.getValue(this.style, 'fixedSize', '0') !== '0';

  let dx = fixed
    ? Math.max(
        0,
        Math.min(w * 0.5, parseFloat(mxUtils.getValue(this.style, 'size', this.fixedSize)))
      )
    : w * Math.max(0, Math.min(0.5, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [new mxPoint(0, h), new mxPoint(dx, 0), new mxPoint(w - dx, 0), new mxPoint(w, h)],
    this.isRounded,
    arcSize,
    true
  );
};

mxCellRenderer.registerShape('trapezoid', TrapezoidShape);

// Curly Bracket shape
function CurlyBracketShape() {
  mxActor.call(this);
}
mxUtils.extend(CurlyBracketShape, mxActor);
CurlyBracketShape.prototype.size = 0.5;
CurlyBracketShape.prototype.redrawPath = function (c, x, y, w, h) {
  c.setFillColor(null);
  let s = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(w, 0),
      new mxPoint(s, 0),
      new mxPoint(s, h / 2),
      new mxPoint(0, h / 2),
      new mxPoint(s, h / 2),
      new mxPoint(s, h),
      new mxPoint(w, h),
    ],
    this.isRounded,
    arcSize,
    false
  );
  c.end();
};

mxCellRenderer.registerShape('curlyBracket', CurlyBracketShape);

// Parallel marker shape
function ParallelMarkerShape() {
  mxActor.call(this);
}
mxUtils.extend(ParallelMarkerShape, mxActor);
ParallelMarkerShape.prototype.redrawPath = function (c, x, y, w, h) {
  c.setStrokeWidth(1);
  c.setFillColor(this.stroke);
  let w2 = w / 5;
  c.rect(0, 0, w2, h);
  c.fillAndStroke();
  c.rect(2 * w2, 0, w2, h);
  c.fillAndStroke();
  c.rect(4 * w2, 0, w2, h);
  c.fillAndStroke();
};

mxCellRenderer.registerShape('parallelMarker', ParallelMarkerShape);

/**
 * Adds handJiggle style (jiggle=n sets jiggle)
 */
function HandJiggle(canvas, defaultVariation) {
  this.canvas = canvas;

  // Avoids "spikes" in the output
  this.canvas.setLineJoin('round');
  this.canvas.setLineCap('round');

  this.defaultVariation = defaultVariation;

  this.originalLineTo = this.canvas.lineTo;
  this.canvas.lineTo = mxUtils.bind(this, HandJiggle.prototype.lineTo);

  this.originalMoveTo = this.canvas.moveTo;
  this.canvas.moveTo = mxUtils.bind(this, HandJiggle.prototype.moveTo);

  this.originalClose = this.canvas.close;
  this.canvas.close = mxUtils.bind(this, HandJiggle.prototype.close);

  this.originalQuadTo = this.canvas.quadTo;
  this.canvas.quadTo = mxUtils.bind(this, HandJiggle.prototype.quadTo);

  this.originalCurveTo = this.canvas.curveTo;
  this.canvas.curveTo = mxUtils.bind(this, HandJiggle.prototype.curveTo);

  this.originalArcTo = this.canvas.arcTo;
  this.canvas.arcTo = mxUtils.bind(this, HandJiggle.prototype.arcTo);
}

HandJiggle.prototype.moveTo = function (endX, endY) {
  this.originalMoveTo.apply(this.canvas, arguments);
  this.lastX = endX;
  this.lastY = endY;
  this.firstX = endX;
  this.firstY = endY;
};

HandJiggle.prototype.close = function () {
  if (this.firstX !== null && this.firstY !== null) {
    this.lineTo(this.firstX, this.firstY);
    this.originalClose.apply(this.canvas, arguments);
  }

  this.originalClose.apply(this.canvas, arguments);
};

HandJiggle.prototype.quadTo = function (x1, y1, x2, y2) {
  this.originalQuadTo.apply(this.canvas, arguments);
  this.lastX = x2;
  this.lastY = y2;
};

HandJiggle.prototype.curveTo = function (x1, y1, x2, y2, x3, y3) {
  this.originalCurveTo.apply(this.canvas, arguments);
  this.lastX = x3;
  this.lastY = y3;
};

HandJiggle.prototype.arcTo = function (rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
  this.originalArcTo.apply(this.canvas, arguments);
  this.lastX = x;
  this.lastY = y;
};

HandJiggle.prototype.lineTo = function (endX, endY) {
  // LATER: Check why this.canvas.lastX cannot be used
  if (this.lastX !== null && this.lastY !== null) {
    let dx = Math.abs(endX - this.lastX);
    let dy = Math.abs(endY - this.lastY);
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 2) {
      this.originalLineTo.apply(this.canvas, arguments);
      this.lastX = endX;
      this.lastY = endY;

      return;
    }

    let segs = Math.round(dist / 10);
    let variation = this.defaultVariation;

    if (segs < 5) {
      segs = 5;
      variation /= 3;
    }

    function sign(x) {
      return typeof x === 'number' ? (x ? (x < 0 ? -1 : 1) : 0) : NaN;
    }

    let stepX = (sign(endX - this.lastX) * dx) / segs;
    let stepY = (sign(endY - this.lastY) * dy) / segs;

    let fx = dx / dist;
    let fy = dy / dist;

    for (let s = 0; s < segs; s++) {
      let x = stepX * s + this.lastX;
      let y = stepY * s + this.lastY;

      let offset = (Math.random() - 0.5) * variation;
      this.originalLineTo.call(this.canvas, x - offset * fy, y - offset * fx);
    }

    this.originalLineTo.call(this.canvas, endX, endY);
    this.lastX = endX;
    this.lastY = endY;
  } else {
    this.originalLineTo.apply(this.canvas, arguments);
    this.lastX = endX;
    this.lastY = endY;
  }
};

HandJiggle.prototype.destroy = function () {
  this.canvas.lineTo = this.originalLineTo;
  this.canvas.moveTo = this.originalMoveTo;
  this.canvas.close = this.originalClose;
  this.canvas.quadTo = this.originalQuadTo;
  this.canvas.curveTo = this.originalCurveTo;
  this.canvas.arcTo = this.originalArcTo;
};

// Installs hand jiggle for comic and sketch style
mxShape.prototype.defaultJiggle = 1.5;

let shapeBeforePaint = mxShape.prototype.beforePaint;
mxShape.prototype.beforePaint = function (c) {
  shapeBeforePaint.apply(this, arguments);

  if (c.handJiggle === null) {
    c.handJiggle = this.createHandJiggle(c);
  }
};

let shapeAfterPaint = mxShape.prototype.afterPaint;
mxShape.prototype.afterPaint = function (c) {
  shapeAfterPaint.apply(this, arguments);

  if (c.handJiggle !== null) {
    c?.handJiggle?.destroy();
    delete c.handJiggle;
  }
};

// Returns a new HandJiggle canvas
mxShape.prototype.createComicCanvas = function (c) {
  return new HandJiggle(c, mxUtils.getValue(this.style, 'jiggle', this.defaultJiggle));
};

// Overrides to avoid call to rect
mxShape.prototype.createHandJiggle = function (c) {
  if (!this.outline && this.style !== null && mxUtils.getValue(this.style, 'comic', '0') !== '0') {
    return this.createComicCanvas(c);
  }

  return null;
};
// Sets default jiggle for diamond
mxRhombus.prototype.defaultJiggle = 2;

// Overrides to avoid call to rect
let mxRectangleShapeIsHtmlAllowed0 = mxRectangleShape.prototype.isHtmlAllowed;
mxRectangleShape.prototype.isHtmlAllowed = function () {
  return (
    !this.outline &&
    (this.style === null ||
      (mxUtils.getValue(this.style, 'comic', '0') === '0' &&
        mxUtils.getValue(this.style, 'sketch', urlParams.rough === '1' ? '1' : '0') === '0')) &&
    mxRectangleShapeIsHtmlAllowed0.apply(this, arguments)
  );
};

let mxRectangleShapePaintBackground0 = mxRectangleShape.prototype.paintBackground;
mxRectangleShape.prototype.paintBackground = function (c: any, x, y, w, h) {
  if (c?.handJiggle === null || c?.handJiggle?.constructor !== HandJiggle) {
    mxRectangleShapePaintBackground0.apply(this, arguments);
  } else {
    let events = true;

    if (this.style !== null) {
      events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') === '1';
    }

    if (
      events ||
      (this.fill !== null && this.fill !== mxConstants.NONE) ||
      (this.stroke !== null && this.stroke !== mxConstants.NONE)
    ) {
      if (!events && (this.fill === null || this.fill === mxConstants.NONE)) {
        c.pointerEvents = false;
      }

      c.begin();

      if (this.isRounded) {
        let r = 0;

        if (mxUtils.getValue(this.style, mxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
          r = Math.min(
            w / 2,
            Math.min(
              h / 2,
              mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2
            )
          );
        } else {
          let f =
            mxUtils.getValue(
              this.style,
              mxConstants.STYLE_ARCSIZE,
              mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
            ) / 100;
          r = Math.min(w * f, h * f);
        }

        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadTo(x, y, x + r, y);
      } else {
        c.moveTo(x, y);
        c.lineTo(x + w, y);
        c.lineTo(x + w, y + h);
        c.lineTo(x, y + h);
        c.lineTo(x, y);
      }

      // LATER: Check if close is needed here
      c.close();
      c.end();

      c.fillAndStroke();
    }
  }
};

/**
 * Disables glass effect with hand jiggle.
 */
let mxRectangleShapePaintForeground0 = mxRectangleShape.prototype.paintForeground;
mxRectangleShape.prototype.paintForeground = function (c, x, y, w, h) {
  if (c.handJiggle === null) {
    mxRectangleShapePaintForeground0.apply(this, arguments);
  }
};

// End of hand jiggle integration

// Process Shape
function ProcessShape() {
  mxRectangleShape.call(this);
}
mxUtils.extend(ProcessShape, mxRectangleShape);
ProcessShape.prototype.size = 0.1;
ProcessShape.prototype.fixedSize = false;

ProcessShape.prototype.isHtmlAllowed = function () {
  return false;
};
ProcessShape.prototype.getLabelBounds = function (rect) {
  if (
    mxUtils.getValue(this.state.style, mxConstants.STYLE_HORIZONTAL, true) ===
    (this.direction === null ||
      this.direction === mxConstants.DIRECTION_EAST ||
      this.direction === mxConstants.DIRECTION_WEST)
  ) {
    let w = rect.width;
    let h = rect.height;
    let r = new mxRectangle(rect.x, rect.y, w, h);

    let inset =
      w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

    if (this.isRounded) {
      let f =
        mxUtils.getValue(
          this.style,
          mxConstants.STYLE_ARCSIZE,
          mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
        ) / 100;
      inset = Math.max(inset, Math.min(w * f, h * f));
    }

    r.x += Math.round(inset);
    r.width -= Math.round(2 * inset);

    return r;
  }

  return rect;
};
ProcessShape.prototype.paintForeground = function (c, x, y, w, h) {
  let isFixedSize = mxUtils.getValue(this.style, 'fixedSize', this.fixedSize);
  let inset = parseFloat(mxUtils.getValue(this.style, 'size', this.size));

  if (isFixedSize) {
    inset = Math.max(0, Math.min(w, inset));
  } else {
    inset = w * Math.max(0, Math.min(1, inset));
  }

  if (this.isRounded) {
    let f =
      mxUtils.getValue(
        this.style,
        mxConstants.STYLE_ARCSIZE,
        mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
      ) / 100;
    inset = Math.max(inset, Math.min(w * f, h * f));
  }

  // Crisp rendering of inner lines
  inset = Math.round(inset);

  c.begin();
  c.moveTo(x + inset, y);
  c.lineTo(x + inset, y + h);
  c.moveTo(x + w - inset, y);
  c.lineTo(x + w - inset, y + h);
  c.end();
  c.stroke();
  mxRectangleShape.prototype.paintForeground.apply(this, arguments);
};

mxCellRenderer.registerShape('process', ProcessShape);

// Transparent Shape
function TransparentShape() {
  mxRectangleShape.call(this);
}
mxUtils.extend(TransparentShape, mxRectangleShape);
TransparentShape.prototype.paintBackground = function (c, x, y, w, h) {
  c.setFillColor(mxConstants.NONE);
  c.rect(x, y, w, h);
  c.fill();
};
TransparentShape.prototype.paintForeground = function (c, x, y, w, h) {};

mxCellRenderer.registerShape('transparent', TransparentShape);

// Callout shape
function CalloutShape() {
  mxActor.call(this);
}
mxUtils.extend(CalloutShape, mxHexagon);
CalloutShape.prototype.size = 30;
CalloutShape.prototype.position = 0.5;
CalloutShape.prototype.position2 = 0.5;
CalloutShape.prototype.base = 20;
CalloutShape.prototype.getLabelMargins = function () {
  return new mxRectangle(
    0,
    0,
    0,
    parseFloat(mxUtils.getValue(this.style, 'size', this.size)) * this.scale
  );
};
CalloutShape.prototype.isRoundable = function () {
  return true;
};
CalloutShape.prototype.redrawPath = function (c, x, y, w, h) {
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  let s = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let dx =
    w *
    Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position', this.position))));
  let dx2 =
    w *
    Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position2', this.position2))));
  let base = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'base', this.base))));

  this.addPoints(
    c,
    [
      new mxPoint(0, 0),
      new mxPoint(w, 0),
      new mxPoint(w, h - s),
      new mxPoint(Math.min(w, dx + base), h - s),
      new mxPoint(dx2, h),
      new mxPoint(Math.max(0, dx), h - s),
      new mxPoint(0, h - s),
    ],
    this.isRounded,
    arcSize,
    true,
    [4]
  );
};

mxCellRenderer.registerShape('callout', CalloutShape);

// Step shape
function StepShape() {
  mxActor.call(this);
}
mxUtils.extend(StepShape, mxActor);
StepShape.prototype.size = 0.2;
StepShape.prototype.fixedSize = 20;
StepShape.prototype.isRoundable = function () {
  return true;
};
StepShape.prototype.redrawPath = function (c, x, y, w, h) {
  let fixed = mxUtils.getValue(this.style, 'fixedSize', '0') !== '0';
  let s = fixed
    ? Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'size', this.fixedSize))))
    : w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(0, 0),
      new mxPoint(w - s, 0),
      new mxPoint(w, h / 2),
      new mxPoint(w - s, h),
      new mxPoint(0, h),
      new mxPoint(s, h / 2),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('step', StepShape);

// Hexagon shape
function HexagonShape() {
  mxActor.call(this);
}
mxUtils.extend(HexagonShape, mxHexagon);
HexagonShape.prototype.size = 0.25;
HexagonShape.prototype.fixedSize = 20;
HexagonShape.prototype.isRoundable = function () {
  return true;
};
HexagonShape.prototype.redrawPath = function (c, x, y, w, h) {
  let fixed = mxUtils.getValue(this.style, 'fixedSize', '0') !== '0';
  let s = fixed
    ? Math.max(
        0,
        Math.min(w * 0.5, parseFloat(mxUtils.getValue(this.style, 'size', this.fixedSize)))
      )
    : w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(s, 0),
      new mxPoint(w - s, 0),
      new mxPoint(w, 0.5 * h),
      new mxPoint(w - s, h),
      new mxPoint(s, h),
      new mxPoint(0, 0.5 * h),
    ],
    this.isRounded,
    arcSize,
    true
  );
};

mxCellRenderer.registerShape('hexagon', HexagonShape);

// Plus Shape
function PlusShape() {
  mxRectangleShape.call(this);
}
mxUtils.extend(PlusShape, mxRectangleShape);
PlusShape.prototype.isHtmlAllowed = function () {
  return false;
};
PlusShape.prototype.paintForeground = function (c, x, y, w, h) {
  let border = Math.min(w / 5, h / 5) + 1;

  c.begin();
  c.moveTo(x + w / 2, y + border);
  c.lineTo(x + w / 2, y + h - border);
  c.moveTo(x + border, y + h / 2);
  c.lineTo(x + w - border, y + h / 2);
  c.end();
  c.stroke();
  mxRectangleShape.prototype.paintForeground.apply(this, arguments);
};

mxCellRenderer.registerShape('plus', PlusShape);

// Overrides painting of rhombus shape to allow for double style
let mxRhombusPaintVertexShape = mxRhombus.prototype.paintVertexShape;
mxRhombus.prototype.getLabelBounds = function (rect) {
  if (this.style.double === 1) {
    let margin =
      (Math.max(2, this.strokewidth + 1) * 2 +
        parseFloat(this.style[mxConstants.STYLE_MARGIN] || 0)) *
      this.scale;

    return new mxRectangle(
      rect.x + margin,
      rect.y + margin,
      rect.width - 2 * margin,
      rect.height - 2 * margin
    );
  }

  return rect;
};
mxRhombus.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxRhombusPaintVertexShape.apply(this, arguments);

  if (!this.outline && this.style.double === 1) {
    let margin =
      Math.max(2, this.strokewidth + 1) * 2 + parseFloat(this.style[mxConstants.STYLE_MARGIN] || 0);
    x += margin;
    y += margin;
    w -= 2 * margin;
    h -= 2 * margin;

    if (w > 0 && h > 0) {
      c.setShadow(false);

      // Workaround for closure compiler bug where the lines with x and y above
      // are removed if arguments is used as second argument in call below.
      mxRhombusPaintVertexShape.apply(this, [c, x, y, w, h]);
    }
  }
};

// CompositeShape
function ExtendedShape() {
  mxRectangleShape.call(this);
}
mxUtils.extend(ExtendedShape, mxRectangleShape);
ExtendedShape.prototype.isHtmlAllowed = function () {
  return false;
};
ExtendedShape.prototype.getLabelBounds = function (rect) {
  if (this.style.double === 1) {
    let margin =
      (Math.max(2, this.strokewidth + 1) + parseFloat(this.style[mxConstants.STYLE_MARGIN] || 0)) *
      this.scale;

    return new mxRectangle(
      rect.x + margin,
      rect.y + margin,
      rect.width - 2 * margin,
      rect.height - 2 * margin
    );
  }

  return rect;
};

mxCellRenderer.registerShape('ext', ExtendedShape);

// Tape Shape, supports size style
function MessageShape() {
  mxCylinder.call(this);
}
mxUtils.extend(MessageShape, mxCylinder);
MessageShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
  if (isForeground) {
    path.moveTo(0, 0);
    path.lineTo(w / 2, h / 2);
    path.lineTo(w, 0);
    path.end();
  } else {
    path.moveTo(0, 0);
    path.lineTo(w, 0);
    path.lineTo(w, h);
    path.lineTo(0, h);
    path.close();
  }
};

mxCellRenderer.registerShape('message', MessageShape);

// UML Actor Shape
function UmlActorShape() {
  mxShape.call(this);
}
mxUtils.extend(UmlActorShape, mxShape);
UmlActorShape.prototype.paintBackground = function (c, x, y, w, h) {
  c.translate(x, y);

  // Head
  c.ellipse(w / 4, 0, w / 2, h / 4);
  c.fillAndStroke();

  c.begin();
  c.moveTo(w / 2, h / 4);
  c.lineTo(w / 2, (2 * h) / 3);

  // Arms
  c.moveTo(w / 2, h / 3);
  c.lineTo(0, h / 3);
  c.moveTo(w / 2, h / 3);
  c.lineTo(w, h / 3);

  // Legs
  c.moveTo(w / 2, (2 * h) / 3);
  c.lineTo(0, h);
  c.moveTo(w / 2, (2 * h) / 3);
  c.lineTo(w, h);
  c.end();

  c.stroke();
};

// Replaces existing actor shape
mxCellRenderer.registerShape('umlActor', UmlActorShape);

// UML Boundary Shape
function UmlBoundaryShape() {
  mxShape.call(this);
}
mxUtils.extend(UmlBoundaryShape, mxShape);
UmlBoundaryShape.prototype.getLabelMargins = function (rect) {
  return new mxRectangle(rect.width / 6, 0, 0, 0);
};
UmlBoundaryShape.prototype.paintBackground = function (c, x, y, w, h) {
  c.translate(x, y);

  // Base line
  c.begin();
  c.moveTo(0, h / 4);
  c.lineTo(0, (h * 3) / 4);
  c.end();
  c.stroke();

  // Horizontal line
  c.begin();
  c.moveTo(0, h / 2);
  c.lineTo(w / 6, h / 2);
  c.end();
  c.stroke();

  // Circle
  c.ellipse(w / 6, 0, (w * 5) / 6, h);
  c.fillAndStroke();
};

// Replaces existing actor shape
mxCellRenderer.registerShape('umlBoundary', UmlBoundaryShape);

// UML Entity Shape
function UmlEntityShape() {
  mxEllipse.call(this);
}
mxUtils.extend(UmlEntityShape, mxEllipse);
UmlEntityShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxEllipse.prototype.paintVertexShape.apply(this, arguments);

  c.begin();
  c.moveTo(x + w / 8, y + h);
  c.lineTo(x + (w * 7) / 8, y + h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('umlEntity', UmlEntityShape);

// UML Destroy Shape
function UmlDestroyShape() {
  mxShape.call(this);
}
mxUtils.extend(UmlDestroyShape, mxShape);
UmlDestroyShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.translate(x, y);

  c.begin();
  c.moveTo(w, 0);
  c.lineTo(0, h);
  c.moveTo(0, 0);
  c.lineTo(w, h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('umlDestroy', UmlDestroyShape);

// UML Control Shape
function UmlControlShape() {
  mxShape.call(this);
}
mxUtils.extend(UmlControlShape, mxShape);
UmlControlShape.prototype.getLabelBounds = function (rect) {
  return new mxRectangle(rect.x, rect.y + rect.height / 8, rect.width, (rect.height * 7) / 8);
};
UmlControlShape.prototype.paintBackground = function (c, x, y, w, h) {
  c.translate(x, y);

  // Upper line
  c.begin();
  c.moveTo((w * 3) / 8, (h / 8) * 1.1);
  c.lineTo((w * 5) / 8, 0);
  c.end();
  c.stroke();

  // Circle
  c.ellipse(0, h / 8, w, (h * 7) / 8);
  c.fillAndStroke();
};
UmlControlShape.prototype.paintForeground = function (c, x, y, w, h) {
  // Lower line
  c.begin();
  c.moveTo((w * 3) / 8, (h / 8) * 1.1);
  c.lineTo((w * 5) / 8, h / 4);
  c.end();
  c.stroke();
};

// Replaces existing actor shape
mxCellRenderer.registerShape('umlControl', UmlControlShape);

// UML Lifeline Shape
function UmlLifeline() {
  mxRectangleShape.call(this);
}
mxUtils.extend(UmlLifeline, mxRectangleShape);
UmlLifeline.prototype.size = 40;
UmlLifeline.prototype.isHtmlAllowed = function () {
  return false;
};
UmlLifeline.prototype.getLabelBounds = function (rect) {
  let size = Math.max(
    0,
    Math.min(rect.height, parseFloat(mxUtils.getValue(this.style, 'size', this.size)) * this.scale)
  );

  return new mxRectangle(rect.x, rect.y, rect.width, size);
};
UmlLifeline.prototype.paintBackground = function (c, x, y, w, h) {
  let size = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let participant = mxUtils.getValue(this.style, 'participant');

  if (participant === null || this.state === null) {
    mxRectangleShape.prototype.paintBackground.call(this, c, x, y, w, size);
  } else {
    let ctor = this.state.view.graph.cellRenderer.getShape(participant);

    if (ctor !== null && ctor !== UmlLifeline) {
      let shape = new ctor();
      shape.apply(this.state);
      c.save();
      shape.paintVertexShape(c, x, y, w, size);
      c.restore();
    }
  }

  if (size < h) {
    c.setDashed(true);
    c.begin();
    c.moveTo(x + w / 2, y + size);
    c.lineTo(x + w / 2, y + h);
    c.end();
    c.stroke();
  }
};
UmlLifeline.prototype.paintForeground = function (c, x, y, w, h) {
  let size = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  mxRectangleShape.prototype.paintForeground.call(this, c, x, y, w, Math.min(h, size));
};

mxCellRenderer.registerShape('umlLifeline', UmlLifeline);

// UML Frame Shape
function UmlFrame() {
  mxShape.call(this);
}
mxUtils.extend(UmlFrame, mxShape);
UmlFrame.prototype.width = 60;
UmlFrame.prototype.height = 30;
UmlFrame.prototype.corner = 10;
UmlFrame.prototype.getLabelMargins = function (rect) {
  return new mxRectangle(
    0,
    0,
    rect.width - parseFloat(`${mxUtils.getValue(this.style, 'width', this.width) * this.scale}`),
    rect.height - parseFloat(`${mxUtils.getValue(this.style, 'height', this.height) * this.scale}`)
  );
};
UmlFrame.prototype.paintBackground = function (c, x, y, w, h) {
  let co = this.corner;
  let w0 = Math.min(w, Math.max(co, parseFloat(mxUtils.getValue(this.style, 'width', this.width))));
  let h0 = Math.min(
    h,
    Math.max(co * 1.5, parseFloat(mxUtils.getValue(this.style, 'height', this.height)))
  );
  let bg = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_FILLCOLOR, mxConstants.NONE);

  if (bg !== mxConstants.NONE) {
    c.setFillColor(bg);
    c.rect(x, y, w, h);
    c.fill();
  }

  if (
    this.fill !== null &&
    this.fill !== mxConstants.NONE &&
    this.gradient &&
    this.gradient !== mxConstants.NONE
  ) {
    let b = this.getGradientBounds(c, x, y, w, h);
    c.setGradient(this.fill, this.gradient, x, y, w, h, this.gradientDirection);
  } else {
    c.setFillColor(this.fill);
  }

  c.begin();
  c.moveTo(x, y);
  c.lineTo(x + w0, y);
  c.lineTo(x + w0, y + Math.max(0, h0 - co * 1.5));
  c.lineTo(x + Math.max(0, w0 - co), y + h0);
  c.lineTo(x, y + h0);
  c.close();
  c.fillAndStroke();

  c.begin();
  c.moveTo(x + w0, y);
  c.lineTo(x + w, y);
  c.lineTo(x + w, y + h);
  c.lineTo(x, y + h);
  c.lineTo(x, y + h0);
  c.stroke();
};

mxCellRenderer.registerShape('umlFrame', UmlFrame);

mxPerimeter.LifelinePerimeter = function (bounds, vertex, next, orthogonal) {
  let size = UmlLifeline.prototype.size;

  if (vertex !== null) {
    size = mxUtils.getValue(vertex.style, 'size', size) * vertex.view.scale;
  }

  let sw =
    (parseFloat(vertex.style[mxConstants.STYLE_STROKEWIDTH] || 1) * vertex.view.scale) / 2 - 1;

  if (next.x < bounds.getCenterX()) {
    sw += 1;
    sw *= -1;
  }

  return new mxPoint(
    bounds.getCenterX() + sw,
    Math.min(bounds.y + bounds.height, Math.max(bounds.y + size, next.y))
  );
};

mxStyleRegistry.putValue('lifelinePerimeter', mxPerimeter.LifelinePerimeter);

mxPerimeter.OrthogonalPerimeter = function (bounds, vertex, next, orthogonal) {
  orthogonal = true;

  return mxPerimeter.RectanglePerimeter.apply(this, arguments);
};

mxStyleRegistry.putValue('orthogonalPerimeter', mxPerimeter.OrthogonalPerimeter);

mxPerimeter.BackbonePerimeter = function (bounds, vertex, next, orthogonal) {
  let sw =
    (parseFloat(vertex.style[mxConstants.STYLE_STROKEWIDTH] || 1) * vertex.view.scale) / 2 - 1;

  if (vertex.style.backboneSize !== null) {
    sw += (parseFloat(vertex.style.backboneSize) * vertex.view.scale) / 2 - 1;
  }

  if (
    vertex.style[mxConstants.STYLE_DIRECTION] === 'south' ||
    vertex.style[mxConstants.STYLE_DIRECTION] === 'north'
  ) {
    if (next.x < bounds.getCenterX()) {
      sw += 1;
      sw *= -1;
    }

    return new mxPoint(
      bounds.getCenterX() + sw,
      Math.min(bounds.y + bounds.height, Math.max(bounds.y, next.y))
    );
  } else {
    if (next.y < bounds.getCenterY()) {
      sw += 1;
      sw *= -1;
    }

    return new mxPoint(
      Math.min(bounds.x + bounds.width, Math.max(bounds.x, next.x)),
      bounds.getCenterY() + sw
    );
  }
};

mxStyleRegistry.putValue('backbonePerimeter', mxPerimeter.BackbonePerimeter);

// Callout Perimeter
mxPerimeter.CalloutPerimeter = function (bounds, vertex, next, orthogonal) {
  return mxPerimeter.RectanglePerimeter(
    mxUtils.getDirectedBounds(
      bounds,
      new mxRectangle(
        0,
        0,
        0,
        Math.max(
          0,
          Math.min(
            bounds.height,
            parseFloat(mxUtils.getValue(vertex.style, 'size', CalloutShape.prototype.size)) *
              vertex.view.scale
          )
        )
      ),
      vertex.style
    ),
    vertex,
    next,
    orthogonal
  );
};

mxStyleRegistry.putValue('calloutPerimeter', mxPerimeter.CalloutPerimeter);

// Parallelogram Perimeter
mxPerimeter.ParallelogramPerimeter = function (bounds, vertex, next, orthogonal) {
  let fixed = mxUtils.getValue(vertex.style, 'fixedSize', '0') !== '0';
  let size = fixed ? ParallelogramShape.prototype.fixedSize : ParallelogramShape.prototype.size;

  if (vertex !== null) {
    size = mxUtils.getValue(vertex.style, 'size', size);
  }

  if (fixed) {
    size *= vertex.view.scale;
  }

  let x = bounds.x;
  let y = bounds.y;
  let w = bounds.width;
  let h = bounds.height;

  let direction =
    vertex !== null
      ? mxUtils.getValue(vertex.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST)
      : mxConstants.DIRECTION_EAST;
  let vertical =
    direction === mxConstants.DIRECTION_NORTH || direction === mxConstants.DIRECTION_SOUTH;
  let points;

  if (vertical) {
    let dy = fixed ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y),
      new mxPoint(x + w, y + dy),
      new mxPoint(x + w, y + h),
      new mxPoint(x, y + h - dy),
      new mxPoint(x, y),
    ];
  } else {
    let dx = fixed ? Math.max(0, Math.min(w * 0.5, size)) : w * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x + dx, y),
      new mxPoint(x + w, y),
      new mxPoint(x + w - dx, y + h),
      new mxPoint(x, y + h),
      new mxPoint(x + dx, y),
    ];
  }

  let cx = bounds.getCenterX();
  let cy = bounds.getCenterY();

  let p1 = new mxPoint(cx, cy);

  if (orthogonal) {
    if (next.x < x || next.x > x + w) {
      p1.y = next.y;
    } else {
      p1.x = next.x;
    }
  }

  return mxUtils.getPerimeterPoint(points, p1, next);
};

mxStyleRegistry.putValue('parallelogramPerimeter', mxPerimeter.ParallelogramPerimeter);

// Trapezoid Perimeter
mxPerimeter.TrapezoidPerimeter = function (bounds, vertex, next, orthogonal) {
  let fixed = mxUtils.getValue(vertex.style, 'fixedSize', '0') !== '0';
  let size = fixed ? TrapezoidShape.prototype.fixedSize : TrapezoidShape.prototype.size;

  if (vertex !== null) {
    size = mxUtils.getValue(vertex.style, 'size', size);
  }

  if (fixed) {
    size *= vertex.view.scale;
  }

  let x = bounds.x;
  let y = bounds.y;
  let w = bounds.width;
  let h = bounds.height;

  let direction =
    vertex !== null
      ? mxUtils.getValue(vertex.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST)
      : mxConstants.DIRECTION_EAST;
  let points = [];

  if (direction === mxConstants.DIRECTION_EAST) {
    let dx = fixed ? Math.max(0, Math.min(w * 0.5, size)) : w * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x + dx, y),
      new mxPoint(x + w - dx, y),
      new mxPoint(x + w, y + h),
      new mxPoint(x, y + h),
      new mxPoint(x + dx, y),
    ];
  } else if (direction === mxConstants.DIRECTION_WEST) {
    let dx = fixed ? Math.max(0, Math.min(w, size)) : w * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y),
      new mxPoint(x + w, y),
      new mxPoint(x + w - dx, y + h),
      new mxPoint(x + dx, y + h),
      new mxPoint(x, y),
    ];
  } else if (direction === mxConstants.DIRECTION_NORTH) {
    let dy = fixed ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y + dy),
      new mxPoint(x + w, y),
      new mxPoint(x + w, y + h),
      new mxPoint(x, y + h - dy),
      new mxPoint(x, y + dy),
    ];
  } else {
    let dy = fixed ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y),
      new mxPoint(x + w, y + dy),
      new mxPoint(x + w, y + h - dy),
      new mxPoint(x, y + h),
      new mxPoint(x, y),
    ];
  }

  let cx = bounds.getCenterX();
  let cy = bounds.getCenterY();

  let p1 = new mxPoint(cx, cy);

  if (orthogonal) {
    if (next.x < x || next.x > x + w) {
      p1.y = next.y;
    } else {
      p1.x = next.x;
    }
  }

  return mxUtils.getPerimeterPoint(points, p1, next);
};

mxStyleRegistry.putValue('trapezoidPerimeter', mxPerimeter.TrapezoidPerimeter);

// Step Perimeter
mxPerimeter.StepPerimeter = function (bounds, vertex, next, orthogonal) {
  let fixed = mxUtils.getValue(vertex.style, 'fixedSize', '0') !== '0';
  let size = fixed ? StepShape.prototype.fixedSize : StepShape.prototype.size;

  if (vertex !== null) {
    size = mxUtils.getValue(vertex.style, 'size', size);
  }

  if (fixed) {
    size *= vertex.view.scale;
  }

  let x = bounds.x;
  let y = bounds.y;
  let w = bounds.width;
  let h = bounds.height;

  let cx = bounds.getCenterX();
  let cy = bounds.getCenterY();

  let direction =
    vertex !== null
      ? mxUtils.getValue(vertex.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST)
      : mxConstants.DIRECTION_EAST;
  let points;

  if (direction === mxConstants.DIRECTION_EAST) {
    let dx = fixed ? Math.max(0, Math.min(w, size)) : w * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y),
      new mxPoint(x + w - dx, y),
      new mxPoint(x + w, cy),
      new mxPoint(x + w - dx, y + h),
      new mxPoint(x, y + h),
      new mxPoint(x + dx, cy),
      new mxPoint(x, y),
    ];
  } else if (direction === mxConstants.DIRECTION_WEST) {
    let dx = fixed ? Math.max(0, Math.min(w, size)) : w * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x + dx, y),
      new mxPoint(x + w, y),
      new mxPoint(x + w - dx, cy),
      new mxPoint(x + w, y + h),
      new mxPoint(x + dx, y + h),
      new mxPoint(x, cy),
      new mxPoint(x + dx, y),
    ];
  } else if (direction === mxConstants.DIRECTION_NORTH) {
    let dy = fixed ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y + dy),
      new mxPoint(cx, y),
      new mxPoint(x + w, y + dy),
      new mxPoint(x + w, y + h),
      new mxPoint(cx, y + h - dy),
      new mxPoint(x, y + h),
      new mxPoint(x, y + dy),
    ];
  } else {
    let dy = fixed ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x, y),
      new mxPoint(cx, y + dy),
      new mxPoint(x + w, y),
      new mxPoint(x + w, y + h - dy),
      new mxPoint(cx, y + h),
      new mxPoint(x, y + h - dy),
      new mxPoint(x, y),
    ];
  }

  let p1 = new mxPoint(cx, cy);

  if (orthogonal) {
    if (next.x < x || next.x > x + w) {
      p1.y = next.y;
    } else {
      p1.x = next.x;
    }
  }

  return mxUtils.getPerimeterPoint(points, p1, next);
};

mxStyleRegistry.putValue('stepPerimeter', mxPerimeter.StepPerimeter);

// Hexagon Perimeter 2 (keep existing one)
mxPerimeter.HexagonPerimeter2 = function (bounds, vertex, next, orthogonal) {
  let fixed = mxUtils.getValue(vertex.style, 'fixedSize', '0') !== '0';
  let size = fixed ? HexagonShape.prototype.fixedSize : HexagonShape.prototype.size;

  if (vertex !== null) {
    size = mxUtils.getValue(vertex.style, 'size', size);
  }

  if (fixed) {
    size *= vertex.view.scale;
  }

  let x = bounds.x;
  let y = bounds.y;
  let w = bounds.width;
  let h = bounds.height;

  let cx = bounds.getCenterX();
  let cy = bounds.getCenterY();

  let direction =
    vertex !== null
      ? mxUtils.getValue(vertex.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST)
      : mxConstants.DIRECTION_EAST;
  let vertical =
    direction === mxConstants.DIRECTION_NORTH || direction === mxConstants.DIRECTION_SOUTH;
  let points;

  if (vertical) {
    let dy = fixed ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(cx, y),
      new mxPoint(x + w, y + dy),
      new mxPoint(x + w, y + h - dy),
      new mxPoint(cx, y + h),
      new mxPoint(x, y + h - dy),
      new mxPoint(x, y + dy),
      new mxPoint(cx, y),
    ];
  } else {
    let dx = fixed ? Math.max(0, Math.min(w, size)) : w * Math.max(0, Math.min(1, size));
    points = [
      new mxPoint(x + dx, y),
      new mxPoint(x + w - dx, y),
      new mxPoint(x + w, cy),
      new mxPoint(x + w - dx, y + h),
      new mxPoint(x + dx, y + h),
      new mxPoint(x, cy),
      new mxPoint(x + dx, y),
    ];
  }

  let p1 = new mxPoint(cx, cy);

  if (orthogonal) {
    if (next.x < x || next.x > x + w) {
      p1.y = next.y;
    } else {
      p1.x = next.x;
    }
  }

  return mxUtils.getPerimeterPoint(points, p1, next);
};

mxStyleRegistry.putValue('hexagonPerimeter2', mxPerimeter.HexagonPerimeter2);

// Provided Interface Shape (aka Lollipop)
function LollipopShape() {
  mxShape.call(this);
}
mxUtils.extend(LollipopShape, mxShape);
LollipopShape.prototype.size = 10;
LollipopShape.prototype.paintBackground = function (c, x, y, w, h) {
  let sz = parseFloat(mxUtils.getValue(this.style, 'size', this.size));
  c.translate(x, y);

  c.ellipse((w - sz) / 2, 0, sz, sz);
  c.fillAndStroke();

  c.begin();
  c.moveTo(w / 2, sz);
  c.lineTo(w / 2, h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('lollipop', LollipopShape);

// Required Interface Shape
function RequiresShape() {
  mxShape.call(this);
}
mxUtils.extend(RequiresShape, mxShape);
RequiresShape.prototype.size = 10;
RequiresShape.prototype.inset = 2;
RequiresShape.prototype.paintBackground = function (c, x, y, w, h) {
  let sz = parseFloat(mxUtils.getValue(this.style, 'size', this.size));
  let inset = parseFloat(mxUtils.getValue(this.style, 'inset', this.inset)) + this.strokewidth;
  c.translate(x, y);

  c.begin();
  c.moveTo(w / 2, sz + inset);
  c.lineTo(w / 2, h);
  c.end();
  c.stroke();

  c.begin();
  c.moveTo((w - sz) / 2 - inset, sz / 2);
  c.quadTo((w - sz) / 2 - inset, sz + inset, w / 2, sz + inset);
  c.quadTo((w + sz) / 2 + inset, sz + inset, (w + sz) / 2 + inset, sz / 2);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('requires', RequiresShape);

// Required Interface Shape
function RequiredInterfaceShape() {
  mxShape.call(this);
}
mxUtils.extend(RequiredInterfaceShape, mxShape);

RequiredInterfaceShape.prototype.paintBackground = function (c, x, y, w, h) {
  c.translate(x, y);

  c.begin();
  c.moveTo(0, 0);
  c.quadTo(w, 0, w, h / 2);
  c.quadTo(w, h, 0, h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('requiredInterface', RequiredInterfaceShape);

// Provided and Required Interface Shape
function ProvidedRequiredInterfaceShape() {
  mxShape.call(this);
}
mxUtils.extend(ProvidedRequiredInterfaceShape, mxShape);
ProvidedRequiredInterfaceShape.prototype.inset = 2;
ProvidedRequiredInterfaceShape.prototype.paintBackground = function (c, x, y, w, h) {
  let inset = parseFloat(mxUtils.getValue(this.style, 'inset', this.inset)) + this.strokewidth;
  c.translate(x, y);

  c.ellipse(0, inset, w - 2 * inset, h - 2 * inset);
  c.fillAndStroke();

  c.begin();
  c.moveTo(w / 2, 0);
  c.quadTo(w, 0, w, h / 2);
  c.quadTo(w, h, w / 2, h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('providedRequiredInterface', ProvidedRequiredInterfaceShape);

// Module shape
function ModuleShape() {
  mxCylinder.call(this);
}
mxUtils.extend(ModuleShape, mxCylinder);
ModuleShape.prototype.jettyWidth = 20;
ModuleShape.prototype.jettyHeight = 10;
ModuleShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
  let dx = parseFloat(mxUtils.getValue(this.style, 'jettyWidth', this.jettyWidth));
  let dy = parseFloat(mxUtils.getValue(this.style, 'jettyHeight', this.jettyHeight));
  let x0 = dx / 2;
  let x1 = x0 + dx / 2;
  let y0 = Math.min(dy, h - dy);
  let y1 = Math.min(y0 + 2 * dy, h - dy);

  if (isForeground) {
    path.moveTo(x0, y0);
    path.lineTo(x1, y0);
    path.lineTo(x1, y0 + dy);
    path.lineTo(x0, y0 + dy);
    path.moveTo(x0, y1);
    path.lineTo(x1, y1);
    path.lineTo(x1, y1 + dy);
    path.lineTo(x0, y1 + dy);
    path.end();
  } else {
    path.moveTo(x0, 0);
    path.lineTo(w, 0);
    path.lineTo(w, h);
    path.lineTo(x0, h);
    path.lineTo(x0, y1 + dy);
    path.lineTo(0, y1 + dy);
    path.lineTo(0, y1);
    path.lineTo(x0, y1);
    path.lineTo(x0, y0 + dy);
    path.lineTo(0, y0 + dy);
    path.lineTo(0, y0);
    path.lineTo(x0, y0);
    path.close();
    path.end();
  }
};

mxCellRenderer.registerShape('module', ModuleShape);

// Component shape
function ComponentShape() {
  mxCylinder.call(this);
}
mxUtils.extend(ComponentShape, mxCylinder);
ComponentShape.prototype.jettyWidth = 32;
ComponentShape.prototype.jettyHeight = 12;
ComponentShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
  let dx = parseFloat(mxUtils.getValue(this.style, 'jettyWidth', this.jettyWidth));
  let dy = parseFloat(mxUtils.getValue(this.style, 'jettyHeight', this.jettyHeight));
  let x0 = dx / 2;
  let x1 = x0 + dx / 2;
  let y0 = 0.3 * h - dy / 2;
  let y1 = 0.7 * h - dy / 2;

  if (isForeground) {
    path.moveTo(x0, y0);
    path.lineTo(x1, y0);
    path.lineTo(x1, y0 + dy);
    path.lineTo(x0, y0 + dy);
    path.moveTo(x0, y1);
    path.lineTo(x1, y1);
    path.lineTo(x1, y1 + dy);
    path.lineTo(x0, y1 + dy);
    path.end();
  } else {
    path.moveTo(x0, 0);
    path.lineTo(w, 0);
    path.lineTo(w, h);
    path.lineTo(x0, h);
    path.lineTo(x0, y1 + dy);
    path.lineTo(0, y1 + dy);
    path.lineTo(0, y1);
    path.lineTo(x0, y1);
    path.lineTo(x0, y0 + dy);
    path.lineTo(0, y0 + dy);
    path.lineTo(0, y0);
    path.lineTo(x0, y0);
    path.close();
    path.end();
  }
};

mxCellRenderer.registerShape('component', ComponentShape);

// Associative entity derived from rectangle shape
function AssociativeEntity() {
  mxRectangleShape.call(this);
}
mxUtils.extend(AssociativeEntity, mxRectangleShape);
AssociativeEntity.prototype.paintForeground = function (c, x, y, w, h) {
  let hw = w / 2;
  let hh = h / 2;

  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  c.begin();
  this.addPoints(
    c,
    [
      new mxPoint(x + hw, y),
      new mxPoint(x + w, y + hh),
      new mxPoint(x + hw, y + h),
      new mxPoint(x, y + hh),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.stroke();

  mxRectangleShape.prototype.paintForeground.apply(this, arguments);
};

mxCellRenderer.registerShape('associativeEntity', AssociativeEntity);

// State Shapes derives from double ellipse
function StateShape() {
  mxDoubleEllipse.call(this);
}
mxUtils.extend(StateShape, mxDoubleEllipse);
StateShape.prototype.outerStroke = true;
StateShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  let inset = Math.min(4, Math.min(w / 5, h / 5));

  if (w > 0 && h > 0) {
    c.ellipse(x + inset, y + inset, w - 2 * inset, h - 2 * inset);
    c.fillAndStroke();
  }

  c.setShadow(false);

  if (this.outerStroke) {
    c.ellipse(x, y, w, h);
    c.stroke();
  }
};

mxCellRenderer.registerShape('endState', StateShape);

function StartStateShape() {
  StateShape.call(this);
}
mxUtils.extend(StartStateShape, StateShape);
StartStateShape.prototype.outerStroke = false;

mxCellRenderer.registerShape('startState', StartStateShape);

// Link shape
function LinkShape() {
  mxArrowConnector.call(this);
  this.spacing = 0;
}
mxUtils.extend(LinkShape, mxArrowConnector);
LinkShape.prototype.defaultWidth = 4;

LinkShape.prototype.isOpenEnded = function () {
  return true;
};

LinkShape.prototype.getEdgeWidth = function () {
  return (
    mxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1)
  );
};

LinkShape.prototype.isArrowRounded = function () {
  return this.isRounded;
};

// Registers the link shape
mxCellRenderer.registerShape('link', LinkShape);

// Generic arrow
function FlexArrowShape() {
  mxArrowConnector.call(this);
  this.spacing = 0;
}
mxUtils.extend(FlexArrowShape, mxArrowConnector);
FlexArrowShape.prototype.defaultWidth = 10;
FlexArrowShape.prototype.defaultArrowWidth = 20;

FlexArrowShape.prototype.getStartArrowWidth = function () {
  return this.getEdgeWidth() + mxUtils.getNumber(this.style, 'startWidth', this.defaultArrowWidth);
};

FlexArrowShape.prototype.getEndArrowWidth = function () {
  return this.getEdgeWidth() + mxUtils.getNumber(this.style, 'endWidth', this.defaultArrowWidth);
};

FlexArrowShape.prototype.getEdgeWidth = function () {
  return (
    mxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1)
  );
};

// Registers the link shape
mxCellRenderer.registerShape('flexArrow', FlexArrowShape);

// Manual Input shape
function ManualInputShape() {
  mxActor.call(this);
}
mxUtils.extend(ManualInputShape, mxActor);
ManualInputShape.prototype.size = 30;
ManualInputShape.prototype.isRoundable = function () {
  return true;
};
ManualInputShape.prototype.redrawPath = function (c, x, y, w, h) {
  let s = Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [new mxPoint(0, h), new mxPoint(0, s), new mxPoint(w, 0), new mxPoint(w, h)],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('manualInput', ManualInputShape);

// Internal storage
function InternalStorageShape() {
  mxRectangleShape.call(this);
}
mxUtils.extend(InternalStorageShape, mxRectangleShape);
InternalStorageShape.prototype.dx = 20;
InternalStorageShape.prototype.dy = 20;
InternalStorageShape.prototype.isHtmlAllowed = function () {
  return false;
};
InternalStorageShape.prototype.paintForeground = function (c, x, y, w, h) {
  mxRectangleShape.prototype.paintForeground.apply(this, arguments);
  let inset = 0;

  if (this.isRounded) {
    let f =
      mxUtils.getValue(
        this.style,
        mxConstants.STYLE_ARCSIZE,
        mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
      ) / 100;
    inset = Math.max(inset, Math.min(w * f, h * f));
  }

  let dx = Math.max(inset, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
  let dy = Math.max(inset, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));

  c.begin();
  c.moveTo(x, y + dy);
  c.lineTo(x + w, y + dy);
  c.end();
  c.stroke();

  c.begin();
  c.moveTo(x + dx, y);
  c.lineTo(x + dx, y + h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('internalStorage', InternalStorageShape);

// Internal storage
function CornerShape() {
  mxActor.call(this);
}
mxUtils.extend(CornerShape, mxActor);
CornerShape.prototype.dx = 20;
CornerShape.prototype.dy = 20;

// Corner
CornerShape.prototype.redrawPath = function (c, x, y, w, h) {
  let dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
  let dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));

  let s = Math.min(w / 2, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(0, 0),
      new mxPoint(w, 0),
      new mxPoint(w, dy),
      new mxPoint(dx, dy),
      new mxPoint(dx, h),
      new mxPoint(0, h),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('corner', CornerShape);

// Crossbar shape
function CrossbarShape() {
  mxActor.call(this);
}
mxUtils.extend(CrossbarShape, mxActor);

CrossbarShape.prototype.redrawPath = function (c, x, y, w, h) {
  c.moveTo(0, 0);
  c.lineTo(0, h);
  c.end();

  c.moveTo(w, 0);
  c.lineTo(w, h);
  c.end();

  c.moveTo(0, h / 2);
  c.lineTo(w, h / 2);
  c.end();
};

mxCellRenderer.registerShape('crossbar', CrossbarShape);

// Internal storage
function TeeShape() {
  mxActor.call(this);
}
mxUtils.extend(TeeShape, mxActor);
TeeShape.prototype.dx = 20;
TeeShape.prototype.dy = 20;

// Corner
TeeShape.prototype.redrawPath = function (c, x, y, w, h) {
  let dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
  let dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));
  let w2 = Math.abs(w - dx) / 2;

  let s = Math.min(w / 2, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(0, 0),
      new mxPoint(w, 0),
      new mxPoint(w, dy),
      new mxPoint((w + dx) / 2, dy),
      new mxPoint((w + dx) / 2, h),
      new mxPoint((w - dx) / 2, h),
      new mxPoint((w - dx) / 2, dy),
      new mxPoint(0, dy),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('tee', TeeShape);

// Arrow
function SingleArrowShape() {
  mxActor.call(this);
}
mxUtils.extend(SingleArrowShape, mxActor);
SingleArrowShape.prototype.arrowWidth = 0.3;
SingleArrowShape.prototype.arrowSize = 0.2;
SingleArrowShape.prototype.redrawPath = function (c, x, y, w, h) {
  let aw =
    h *
    Math.max(
      0,
      Math.min(1, parseFloat(mxUtils.getValue(this.style, 'arrowWidth', this.arrowWidth)))
    );
  let as =
    w *
    Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'arrowSize', this.arrowSize))));
  let at = (h - aw) / 2;
  let ab = at + aw;

  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(0, at),
      new mxPoint(w - as, at),
      new mxPoint(w - as, 0),
      new mxPoint(w, h / 2),
      new mxPoint(w - as, h),
      new mxPoint(w - as, ab),
      new mxPoint(0, ab),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('singleArrow', SingleArrowShape);

// Arrow
function DoubleArrowShape() {
  mxActor.call(this);
}
mxUtils.extend(DoubleArrowShape, mxActor);
DoubleArrowShape.prototype.redrawPath = function (c, x, y, w, h) {
  let aw =
    h *
    Math.max(
      0,
      Math.min(
        1,
        parseFloat(
          mxUtils.getValue(this.style, 'arrowWidth', SingleArrowShape.prototype.arrowWidth)
        )
      )
    );
  let as =
    w *
    Math.max(
      0,
      Math.min(
        1,
        parseFloat(mxUtils.getValue(this.style, 'arrowSize', SingleArrowShape.prototype.arrowSize))
      )
    );
  let at = (h - aw) / 2;
  let ab = at + aw;

  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(0, h / 2),
      new mxPoint(as, 0),
      new mxPoint(as, at),
      new mxPoint(w - as, at),
      new mxPoint(w - as, 0),
      new mxPoint(w, h / 2),
      new mxPoint(w - as, h),
      new mxPoint(w - as, ab),
      new mxPoint(as, ab),
      new mxPoint(as, h),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('doubleArrow', DoubleArrowShape);

// Data storage
function DataStorageShape() {
  mxActor.call(this);
}
mxUtils.extend(DataStorageShape, mxActor);
DataStorageShape.prototype.size = 0.1;
DataStorageShape.prototype.fixedSize = 20;
DataStorageShape.prototype.redrawPath = function (c, x, y, w, h) {
  let fixed = mxUtils.getValue(this.style, 'fixedSize', '0') !== '0';
  let s = fixed
    ? Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'size', this.fixedSize))))
    : w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

  c.moveTo(s, 0);
  c.lineTo(w, 0);
  c.quadTo(w - s * 2, h / 2, w, h);
  c.lineTo(s, h);
  c.quadTo(s - s * 2, h / 2, s, 0);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('dataStorage', DataStorageShape);

// Or
function OrShape() {
  mxActor.call(this);
}
mxUtils.extend(OrShape, mxActor);
OrShape.prototype.redrawPath = function (c, x, y, w, h) {
  c.moveTo(0, 0);
  c.quadTo(w, 0, w, h / 2);
  c.quadTo(w, h, 0, h);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('or', OrShape);

// Xor
function XorShape() {
  mxActor.call(this);
}
mxUtils.extend(XorShape, mxActor);
XorShape.prototype.redrawPath = function (c, x, y, w, h) {
  c.moveTo(0, 0);
  c.quadTo(w, 0, w, h / 2);
  c.quadTo(w, h, 0, h);
  c.quadTo(w / 2, h / 2, 0, 0);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('xor', XorShape);

// Loop limit
function LoopLimitShape() {
  mxActor.call(this);
}
mxUtils.extend(LoopLimitShape, mxActor);
LoopLimitShape.prototype.size = 20;
LoopLimitShape.prototype.isRoundable = function () {
  return true;
};
LoopLimitShape.prototype.redrawPath = function (c, x, y, w, h) {
  let s = Math.min(w / 2, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(s, 0),
      new mxPoint(w - s, 0),
      new mxPoint(w, s * 0.8),
      new mxPoint(w, h),
      new mxPoint(0, h),
      new mxPoint(0, s * 0.8),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('loopLimit', LoopLimitShape);

// Off page connector
function OffPageConnectorShape() {
  mxActor.call(this);
}
mxUtils.extend(OffPageConnectorShape, mxActor);
OffPageConnectorShape.prototype.size = 3 / 8;
OffPageConnectorShape.prototype.isRoundable = function () {
  return true;
};
OffPageConnectorShape.prototype.redrawPath = function (c, x, y, w, h) {
  let s = h * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  this.addPoints(
    c,
    [
      new mxPoint(0, 0),
      new mxPoint(w, 0),
      new mxPoint(w, h - s),
      new mxPoint(w / 2, h),
      new mxPoint(0, h - s),
    ],
    this.isRounded,
    arcSize,
    true
  );
  c.end();
};

mxCellRenderer.registerShape('offPageConnector', OffPageConnectorShape);

// Internal storage
function TapeDataShape() {
  mxEllipse.call(this);
}
mxUtils.extend(TapeDataShape, mxEllipse);
TapeDataShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxEllipse.prototype.paintVertexShape.apply(this, arguments);

  c.begin();
  c.moveTo(x + w / 2, y + h);
  c.lineTo(x + w, y + h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('tapeData', TapeDataShape);

// OrEllipseShape
function OrEllipseShape() {
  mxEllipse.call(this);
}
mxUtils.extend(OrEllipseShape, mxEllipse);
OrEllipseShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxEllipse.prototype.paintVertexShape.apply(this, arguments);

  c.setShadow(false);
  c.begin();
  c.moveTo(x, y + h / 2);
  c.lineTo(x + w, y + h / 2);
  c.end();
  c.stroke();

  c.begin();
  c.moveTo(x + w / 2, y);
  c.lineTo(x + w / 2, y + h);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('orEllipse', OrEllipseShape);

// SumEllipseShape
function SumEllipseShape() {
  mxEllipse.call(this);
}
mxUtils.extend(SumEllipseShape, mxEllipse);
SumEllipseShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxEllipse.prototype.paintVertexShape.apply(this, arguments);
  let s2 = 0.145;

  c.setShadow(false);
  c.begin();
  c.moveTo(x + w * s2, y + h * s2);
  c.lineTo(x + w * (1 - s2), y + h * (1 - s2));
  c.end();
  c.stroke();

  c.begin();
  c.moveTo(x + w * (1 - s2), y + h * s2);
  c.lineTo(x + w * s2, y + h * (1 - s2));
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('sumEllipse', SumEllipseShape);

// SortShape
function SortShape() {
  mxRhombus.call(this);
}
mxUtils.extend(SortShape, mxRhombus);
SortShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxRhombus.prototype.paintVertexShape.apply(this, arguments);

  c.setShadow(false);
  c.begin();
  c.moveTo(x, y + h / 2);
  c.lineTo(x + w, y + h / 2);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('sortShape', SortShape);

// CollateShape
function CollateShape() {
  mxEllipse.call(this);
}
mxUtils.extend(CollateShape, mxEllipse);
CollateShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.begin();
  c.moveTo(x, y);
  c.lineTo(x + w, y);
  c.lineTo(x + w / 2, y + h / 2);
  c.close();
  c.fillAndStroke();

  c.begin();
  c.moveTo(x, y + h);
  c.lineTo(x + w, y + h);
  c.lineTo(x + w / 2, y + h / 2);
  c.close();
  c.fillAndStroke();
};

mxCellRenderer.registerShape('collate', CollateShape);

// DimensionShape
function DimensionShape() {
  mxEllipse.call(this);
}
mxUtils.extend(DimensionShape, mxEllipse);
DimensionShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  // Arrow size
  let al = 10;
  let cy = y + h - al / 2;

  c.begin();
  c.moveTo(x, y);
  c.lineTo(x, y + h);
  c.moveTo(x, cy);
  c.lineTo(x + al, cy - al / 2);
  c.moveTo(x, cy);
  c.lineTo(x + al, cy + al / 2);
  c.moveTo(x, cy);
  c.lineTo(x + w, cy);

  // Opposite side
  c.moveTo(x + w, y);
  c.lineTo(x + w, y + h);
  c.moveTo(x + w, cy);
  c.lineTo(x + w - al, cy - al / 2);
  c.moveTo(x + w, cy);
  c.lineTo(x + w - al, cy + al / 2);
  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('dimension', DimensionShape);

// PartialRectangleShape
function PartialRectangleShape() {
  mxEllipse.call(this);
}
mxUtils.extend(PartialRectangleShape, mxEllipse);
PartialRectangleShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  if (!this.outline) {
    c.setStrokeColor(null);
  }

  if (this.style !== null) {
    let pointerEvents = c.pointerEvents;
    let events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') === '1';

    if (!events && (this.fill === null || this.fill === mxConstants.NONE)) {
      c.pointerEvents = false;
    }

    c.rect(x, y, w, h);
    c.fill();

    c.pointerEvents = pointerEvents;
    c.setStrokeColor(this.stroke);
    c.begin();
    c.moveTo(x, y);

    if (this.outline || mxUtils.getValue(this.style, 'top', '1') === '1') {
      c.lineTo(x + w, y);
    } else {
      c.moveTo(x + w, y);
    }

    if (this.outline || mxUtils.getValue(this.style, 'right', '1') === '1') {
      c.lineTo(x + w, y + h);
    } else {
      c.moveTo(x + w, y + h);
    }

    if (this.outline || mxUtils.getValue(this.style, 'bottom', '1') === '1') {
      c.lineTo(x, y + h);
    } else {
      c.moveTo(x, y + h);
    }

    if (this.outline || mxUtils.getValue(this.style, 'left', '1') === '1') {
      c.lineTo(x, y);
    }

    c.end();
    c.stroke();
  }
};

mxCellRenderer.registerShape('partialRectangle', PartialRectangleShape);

// LineEllipseShape
function LineEllipseShape() {
  mxEllipse.call(this);
}
mxUtils.extend(LineEllipseShape, mxEllipse);
LineEllipseShape.prototype.paintVertexShape = function (c, x, y, w, h) {
  mxEllipse.prototype.paintVertexShape.apply(this, arguments);

  c.setShadow(false);
  c.begin();

  if (mxUtils.getValue(this.style, 'line') === 'vertical') {
    c.moveTo(x + w / 2, y);
    c.lineTo(x + w / 2, y + h);
  } else {
    c.moveTo(x, y + h / 2);
    c.lineTo(x + w, y + h / 2);
  }

  c.end();
  c.stroke();
};

mxCellRenderer.registerShape('lineEllipse', LineEllipseShape);

// Delay
function DelayShape() {
  mxActor.call(this);
}
mxUtils.extend(DelayShape, mxActor);
DelayShape.prototype.redrawPath = function (c, x, y, w, h) {
  let dx = Math.min(w, h / 2);
  c.moveTo(0, 0);
  c.lineTo(w - dx, 0);
  c.quadTo(w, 0, w, h / 2);
  c.quadTo(w, h, w - dx, h);
  c.lineTo(0, h);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('delay', DelayShape);

// Cross Shape
function CrossShape() {
  mxActor.call(this);
}
mxUtils.extend(CrossShape, mxActor);
CrossShape.prototype.size = 0.2;
CrossShape.prototype.redrawPath = function (c, x, y, w, h) {
  let m = Math.min(h, w);
  let size = Math.max(
    0,
    Math.min(m, m * parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
  );
  let t = (h - size) / 2;
  let b = t + size;
  let l = (w - size) / 2;
  let r = l + size;

  c.moveTo(0, t);
  c.lineTo(l, t);
  c.lineTo(l, 0);
  c.lineTo(r, 0);
  c.lineTo(r, t);
  c.lineTo(w, t);
  c.lineTo(w, b);
  c.lineTo(r, b);
  c.lineTo(r, h);
  c.lineTo(l, h);
  c.lineTo(l, b);
  c.lineTo(0, b);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('cross', CrossShape);

// Display
function DisplayShape() {
  mxActor.call(this);
}
mxUtils.extend(DisplayShape, mxActor);
DisplayShape.prototype.size = 0.25;
DisplayShape.prototype.redrawPath = function (c, x, y, w, h) {
  let dx = Math.min(w, h / 2);
  let s = Math.min(
    w - dx,
    Math.max(0, parseFloat(mxUtils.getValue(this.style, 'size', this.size))) * w
  );

  c.moveTo(0, h / 2);
  c.lineTo(s, 0);
  c.lineTo(w - dx, 0);
  c.quadTo(w, 0, w, h / 2);
  c.quadTo(w, h, w - dx, h);
  c.lineTo(s, h);
  c.close();
  c.end();
};

mxCellRenderer.registerShape('display', DisplayShape);

// FilledEdge shape
function FilledEdge() {
  mxConnector.call(this);
}
mxUtils.extend(FilledEdge, mxConnector);

FilledEdge.prototype.origPaintEdgeShape = FilledEdge.prototype.paintEdgeShape;
FilledEdge.prototype.paintEdgeShape = function (c, pts, rounded) {
  // Markers modify incoming points array
  let temp = [];

  for (let i = 0; i < pts.length; i++) {
    temp.push(mxUtils.clone(pts[i]));
  }

  // paintEdgeShape resets dashed to false
  let dashed = c.state.dashed;
  let fixDash = c.state.fixDash;
  FilledEdge.prototype.origPaintEdgeShape.apply(this, [c, temp, rounded]);

  if (c.state.strokeWidth >= 3) {
    let fillClr = mxUtils.getValue(this.style, 'fillColor', null);

    if (fillClr !== null) {
      c.setStrokeColor(fillClr);
      c.setStrokeWidth(c.state.strokeWidth - 2);
      c.setDashed(dashed, fixDash);

      FilledEdge.prototype.origPaintEdgeShape.apply(this, [c, pts, rounded]);
    }
  }
};

// Registers the link shape
mxCellRenderer.registerShape('filledEdge', FilledEdge);

// Registers and defines the custom marker
mxMarker.addMarker('dash', function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
  let nx = unitX * (size + sw + 1);
  let ny = unitY * (size + sw + 1);

  return function () {
    c.begin();
    c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
    c.lineTo(pe.x + ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 - nx / 2);
    c.stroke();
  };
});

// Registers and defines the custom marker
mxMarker.addMarker('box', function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
  let nx = unitX * (size + sw + 1);
  let ny = unitY * (size + sw + 1);
  let px = pe.x + nx / 2;
  let py = pe.y + ny / 2;

  pe.x -= nx;
  pe.y -= ny;

  return function () {
    c.begin();
    c.moveTo(px - nx / 2 - ny / 2, py - ny / 2 + nx / 2);
    c.lineTo(px - nx / 2 + ny / 2, py - ny / 2 - nx / 2);
    c.lineTo(px + ny / 2 - (3 * nx) / 2, py - (3 * ny) / 2 - nx / 2);
    c.lineTo(px - ny / 2 - (3 * nx) / 2, py - (3 * ny) / 2 + nx / 2);
    c.close();

    if (filled) {
      c.fillAndStroke();
    } else {
      c.stroke();
    }
  };
});

// Registers and defines the custom marker
mxMarker.addMarker('cross', function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
  let nx = unitX * (size + sw + 1);
  let ny = unitY * (size + sw + 1);

  return function () {
    c.begin();
    c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
    c.lineTo(pe.x + ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 - nx / 2);
    c.moveTo(pe.x - nx / 2 + ny / 2, pe.y - ny / 2 - nx / 2);
    c.lineTo(pe.x - ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 + nx / 2);
    c.stroke();
  };
});

function circleMarker(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
  let a = size / 2;
  size = size + sw;

  let pt = pe.clone();

  pe.x -= unitX * (2 * size + sw);
  pe.y -= unitY * (2 * size + sw);

  unitX = unitX * (size + sw);
  unitY = unitY * (size + sw);

  return function () {
    c.ellipse(pt.x - unitX - size, pt.y - unitY - size, 2 * size, 2 * size);

    if (filled) {
      c.fillAndStroke();
    } else {
      c.stroke();
    }
  };
}

mxMarker.addMarker('circle', circleMarker);
mxMarker.addMarker(
  'circlePlus',
  function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    let pt = pe.clone();
    let fn = circleMarker.apply(this, arguments);
    let nx = unitX * (size + 2 * sw); // (size + sw + 1);
    let ny = unitY * (size + 2 * sw); // (size + sw + 1);

    return function () {
      fn.apply(this, arguments);

      c.begin();
      c.moveTo(pt.x - unitX * sw, pt.y - unitY * sw);
      c.lineTo(pt.x - 2 * nx + unitX * sw, pt.y - 2 * ny + unitY * sw);
      c.moveTo(pt.x - nx - ny + unitY * sw, pt.y - ny + nx - unitX * sw);
      c.lineTo(pt.x + ny - nx - unitY * sw, pt.y - ny - nx + unitX * sw);
      c.stroke();
    };
  }
);

// Registers and defines the custom marker
mxMarker.addMarker(
  'halfCircle',
  function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    let nx = unitX * (size + sw + 1);
    let ny = unitY * (size + sw + 1);
    let pt = pe.clone();

    pe.x -= nx;
    pe.y -= ny;

    return function () {
      c.begin();
      c.moveTo(pt.x - ny, pt.y + nx);
      c.quadTo(pe.x - ny, pe.y + nx, pe.x, pe.y);
      c.quadTo(pe.x + ny, pe.y - nx, pt.x + ny, pt.y - nx);
      c.stroke();
    };
  }
);

mxMarker.addMarker('async', function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
  // The angle of the forward facing arrow sides against the x axis is
  // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
  // only half the strokewidth is processed ).
  let endOffsetX = unitX * sw * 1.118;
  let endOffsetY = unitY * sw * 1.118;

  unitX = unitX * (size + sw);
  unitY = unitY * (size + sw);

  let pt = pe.clone();
  pt.x -= endOffsetX;
  pt.y -= endOffsetY;

  let f = 1;
  pe.x += -unitX * f - endOffsetX;
  pe.y += -unitY * f - endOffsetY;

  return function () {
    c.begin();
    c.moveTo(pt.x, pt.y);

    if (source) {
      c.lineTo(pt.x - unitX - unitY / 2, pt.y - unitY + unitX / 2);
    } else {
      c.lineTo(pt.x + unitY / 2 - unitX, pt.y - unitY - unitX / 2);
    }

    c.lineTo(pt.x - unitX, pt.y - unitY);
    c.close();

    if (filled) {
      c.fillAndStroke();
    } else {
      c.stroke();
    }
  };
});

function createOpenAsyncArrow(widthFactor) {
  widthFactor = widthFactor !== null ? widthFactor : 2;

  return function (c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    unitX = unitX * (size + sw);
    unitY = unitY * (size + sw);

    let pt = pe.clone();

    return function () {
      c.begin();
      c.moveTo(pt.x, pt.y);

      if (source) {
        c.lineTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor);
      } else {
        c.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor);
      }

      c.stroke();
    };
  };
}

mxMarker.addMarker('openAsync', createOpenAsyncArrow(2));

// Defines connection points for all shapes
IsoRectangleShape.prototype.constraints = [];

IsoCubeShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let tan30 = Math.tan(mxUtils.toRadians(30));
  let tan30Dx = (0.5 - tan30) / 2;
  let m = Math.min(w, h / (0.5 + tan30));
  let dx = (w - m) / 2;
  let dy = (h - m) / 2;

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, dy + 0.25 * m));
  constr.push(
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx + 0.5 * m, dy + m * tan30Dx)
  );
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx + m, dy + 0.25 * m));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx + m, dy + 0.75 * m));
  constr.push(
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx + 0.5 * m, dy + (1 - tan30Dx) * m)
  );
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, dy + 0.75 * m));

  return constr;
};

IsoCubeShape2.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let isoAngle =
    (Math.max(
      0.01,
      Math.min(94, parseFloat(mxUtils.getValue(this.style, 'isoAngle', this.isoAngle)))
    ) *
      Math.PI) /
    200;
  let isoH = Math.min(w * Math.tan(isoAngle), h * 0.5);

  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, isoH));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, h - isoH));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - isoH));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, isoH));

  return constr;
};

CalloutShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let arcSize =
    mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
  let s = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
  let dx =
    w *
    Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position', this.position))));
  let dx2 =
    w *
    Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position2', this.position2))));
  let base = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'base', this.base))));

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.25, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.75, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h - s) * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, h - s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx2, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - s) * 0.5));

  if (w >= s * 2) {
    constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  }

  return constr;
};

mxRectangleShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), true),
  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0), true),
  new mxConnectionConstraint(new mxPoint(1, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0, 1), true),
  new mxConnectionConstraint(new mxPoint(0.25, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.75, 1), true),
  new mxConnectionConstraint(new mxPoint(1, 1), true),
];
mxEllipse.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), true),
  new mxConnectionConstraint(new mxPoint(1, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 1), true),
  new mxConnectionConstraint(new mxPoint(1, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5)),
];
PartialRectangleShape.prototype.constraints = mxRectangleShape.prototype.constraints;
mxImageShape.prototype.constraints = mxRectangleShape.prototype.constraints;
mxSwimlane.prototype.constraints = mxRectangleShape.prototype.constraints;
PlusShape.prototype.constraints = mxRectangleShape.prototype.constraints;
mxLabel.prototype.constraints = mxRectangleShape.prototype.constraints;

NoteShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let s = Math.max(
    0,
    Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))))
  );

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - s) * 0.5, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s * 0.5, s * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h + s) * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));

  if (w >= s * 2) {
    constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  }

  return constr;
};

CardShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let s = Math.max(
    0,
    Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))))
  );

  constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + s) * 0.5, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s * 0.5, s * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h + s) * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));

  if (w >= s * 2) {
    constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  }

  return constr;
};

CubeShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let s = Math.max(
    0,
    Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))))
  );

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - s) * 0.5, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s * 0.5, s * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h + s) * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + s) * 0.5, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s * 0.5, h - s * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - s) * 0.5));

  return constr;
};

CylinderShape3.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let s = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, s));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false, null, 0, s));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false, null, 0, -s));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 1), false, null, 0, -s));

  constr.push(
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, s + (h * 0.5 - s) * 0.5)
  );
  constr.push(
    new mxConnectionConstraint(new mxPoint(1, 0), false, null, 0, s + (h * 0.5 - s) * 0.5)
  );
  constr.push(
    new mxConnectionConstraint(new mxPoint(1, 0), false, null, 0, h - s - (h * 0.5 - s) * 0.5)
  );
  constr.push(
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - s - (h * 0.5 - s) * 0.5)
  );

  constr.push(new mxConnectionConstraint(new mxPoint(0.145, 0), false, null, 0, s * 0.29));
  constr.push(new mxConnectionConstraint(new mxPoint(0.855, 0), false, null, 0, s * 0.29));
  constr.push(new mxConnectionConstraint(new mxPoint(0.855, 1), false, null, 0, -s * 0.29));
  constr.push(new mxConnectionConstraint(new mxPoint(0.145, 1), false, null, 0, -s * 0.29));

  return constr;
};

FolderShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let dx = Math.max(
    0,
    Math.min(w, parseFloat(mxUtils.getValue(this.style, 'tabWidth', this.tabWidth)))
  );
  let dy = Math.max(
    0,
    Math.min(h, parseFloat(mxUtils.getValue(this.style, 'tabHeight', this.tabHeight)))
  );
  let tp = mxUtils.getValue(this.style, 'tabPosition', this.tabPosition);

  if (tp === 'left') {
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx * 0.5, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, dy));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + dx) * 0.5, dy));
  } else {
    constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - dx * 0.5, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - dx, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - dx, dy));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - dx) * 0.5, dy));
  }

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h - dy) * 0.25 + dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h - dy) * 0.5 + dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h - dy) * 0.75 + dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - dy) * 0.25 + dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - dy) * 0.5 + dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - dy) * 0.75 + dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0.25, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.75, 1), false));

  return constr;
};

InternalStorageShape.prototype.constraints = mxRectangleShape.prototype.constraints;
DataStorageShape.prototype.constraints = mxRectangleShape.prototype.constraints;
TapeDataShape.prototype.constraints = mxEllipse.prototype.constraints;
OrEllipseShape.prototype.constraints = mxEllipse.prototype.constraints;
SumEllipseShape.prototype.constraints = mxEllipse.prototype.constraints;
LineEllipseShape.prototype.constraints = mxEllipse.prototype.constraints;
ManualInputShape.prototype.constraints = mxRectangleShape.prototype.constraints;
DelayShape.prototype.constraints = mxRectangleShape.prototype.constraints;

DisplayShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let dx = Math.min(w, h / 2);
  let s = Math.min(
    w - dx,
    Math.max(0, parseFloat(mxUtils.getValue(this.style, 'size', this.size))) * w
  );

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false, null));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (s + w - dx) * 0.5, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - dx, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false, null));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - dx, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (s + w - dx) * 0.5, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s, h));

  return constr;
};

ModuleShape.prototype.getConstraints = function (style, w, h) {
  let x0 = parseFloat(mxUtils.getValue(style, 'jettyWidth', ModuleShape.prototype.jettyWidth)) / 2;
  let dy = parseFloat(mxUtils.getValue(style, 'jettyHeight', ModuleShape.prototype.jettyHeight));
  let constr = [
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, x0),
    new mxConnectionConstraint(new mxPoint(0.25, 0), true),
    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
    new mxConnectionConstraint(new mxPoint(0.75, 0), true),
    new mxConnectionConstraint(new mxPoint(1, 0), true),
    new mxConnectionConstraint(new mxPoint(1, 0.25), true),
    new mxConnectionConstraint(new mxPoint(1, 0.5), true),
    new mxConnectionConstraint(new mxPoint(1, 0.75), true),
    new mxConnectionConstraint(new mxPoint(0, 1), false, null, x0),
    new mxConnectionConstraint(new mxPoint(0.25, 1), true),
    new mxConnectionConstraint(new mxPoint(0.5, 1), true),
    new mxConnectionConstraint(new mxPoint(0.75, 1), true),
    new mxConnectionConstraint(new mxPoint(1, 1), true),
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, Math.min(h - 0.5 * dy, 1.5 * dy)),
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, Math.min(h - 0.5 * dy, 3.5 * dy)),
  ];

  if (h > 5 * dy) {
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0.75), false, null, x0));
  }

  if (h > 8 * dy) {
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false, null, x0));
  }

  if (h > 15 * dy) {
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0.25), false, null, x0));
  }

  return constr;
};

LoopLimitShape.prototype.constraints = mxRectangleShape.prototype.constraints;
OffPageConnectorShape.prototype.constraints = mxRectangleShape.prototype.constraints;
mxCylinder.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.15, 0.05), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.85, 0.05), false),
  new mxConnectionConstraint(new mxPoint(0, 0.3), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.7), true),
  new mxConnectionConstraint(new mxPoint(1, 0.3), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.7), true),
  new mxConnectionConstraint(new mxPoint(0.15, 0.95), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.85, 0.95), false),
];
UmlActorShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0.1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.1), false),
  new mxConnectionConstraint(new mxPoint(0, 1 / 3), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(1, 1 / 3), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0.5), false),
];
ComponentShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 0.3), true),
  new mxConnectionConstraint(new mxPoint(0, 0.7), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.25, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.75, 1), true),
];
mxActor.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.25, 0.2), false),
  new mxConnectionConstraint(new mxPoint(0.1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.9, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.25, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.75, 1), true),
];
SwitchShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0.25), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0.75), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];
TapeShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0.35), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 0.65), false),
  new mxConnectionConstraint(new mxPoint(1, 0.35), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.65), false),
  new mxConnectionConstraint(new mxPoint(0.25, 1), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0), false),
];
StepShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0), true),
  new mxConnectionConstraint(new mxPoint(0.25, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.75, 1), true),
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
];
mxLine.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
];
LollipopShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.5, 0), false),
  new mxConnectionConstraint(new mxPoint(0.5, 1), false),
];
mxDoubleEllipse.prototype.constraints = mxEllipse.prototype.constraints;
mxRhombus.prototype.constraints = mxEllipse.prototype.constraints;
mxTriangle.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
];
mxHexagon.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.375, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.625, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.375, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.625, 1), true),
];
mxCloud.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.4, 0.1), false),
  new mxConnectionConstraint(new mxPoint(0.16, 0.55), false),
  new mxConnectionConstraint(new mxPoint(0.07, 0.4), false),
  new mxConnectionConstraint(new mxPoint(0.31, 0.8), false),
  new mxConnectionConstraint(new mxPoint(0.13, 0.77), false),
  new mxConnectionConstraint(new mxPoint(0.8, 0.8), false),
  new mxConnectionConstraint(new mxPoint(0.55, 0.95), false),
  new mxConnectionConstraint(new mxPoint(0.875, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.96, 0.7), false),
  new mxConnectionConstraint(new mxPoint(0.625, 0.2), false),
  new mxConnectionConstraint(new mxPoint(0.88, 0.25), false),
];
ParallelogramShape.prototype.constraints = mxRectangleShape.prototype.constraints;
TrapezoidShape.prototype.constraints = mxRectangleShape.prototype.constraints;
DocumentShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
];
mxArrow.prototype.constraints = null;

TeeShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
  let dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));
  let w2 = Math.abs(w - dx) / 2;

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, dy * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w * 0.75 + dx * 0.25, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + dx) * 0.5, dy));
  constr.push(
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + dx) * 0.5, (h + dy) * 0.5)
  );
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + dx) * 0.5, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - dx) * 0.5, h));
  constr.push(
    new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - dx) * 0.5, (h + dy) * 0.5)
  );
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - dx) * 0.5, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w * 0.25 - dx * 0.25, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, dy * 0.5));

  return constr;
};

CornerShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
  let dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, dy * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + dx) * 0.5, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, dy));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, (h + dy) * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx * 0.5, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 1), false));

  return constr;
};

CrossbarShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 1), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.5, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.75, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 1), false),
];

SingleArrowShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let aw =
    h *
    Math.max(
      0,
      Math.min(1, parseFloat(mxUtils.getValue(this.style, 'arrowWidth', this.arrowWidth)))
    );
  let as =
    w *
    Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'arrowSize', this.arrowSize))));
  let at = (h - aw) / 2;
  let ab = at + aw;

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, at));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - as) * 0.5, at));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - as, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - as, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - as) * 0.5, h - at));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - at));

  return constr;
};

DoubleArrowShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let aw =
    h *
    Math.max(
      0,
      Math.min(
        1,
        parseFloat(
          mxUtils.getValue(this.style, 'arrowWidth', SingleArrowShape.prototype.arrowWidth)
        )
      )
    );
  let as =
    w *
    Math.max(
      0,
      Math.min(
        1,
        parseFloat(mxUtils.getValue(this.style, 'arrowSize', SingleArrowShape.prototype.arrowSize))
      )
    );
  let at = (h - aw) / 2;
  let ab = at + aw;

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, as, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w * 0.5, at));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - as, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - as, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w * 0.5, h - at));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, as, h));

  return constr;
};

CrossShape.prototype.getConstraints = function (style, w, h) {
  let constr = [];
  let m = Math.min(h, w);
  let size = Math.max(
    0,
    Math.min(m, m * parseFloat(mxUtils.getValue(this.style, 'size', this.size)))
  );
  let t = (h - size) / 2;
  let b = t + size;
  let l = (w - size) / 2;
  let r = l + size;

  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l, t * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, r, 0));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, r, t * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, r, t));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l, h - t * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, r, h));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, r, h - t * 0.5));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, r, b));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + r) * 0.5, t));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, t));
  constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, b));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + r) * 0.5, b));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l, b));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l * 0.5, t));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, t));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, b));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l * 0.5, b));
  constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, l, t));

  return constr;
};

UmlLifeline.prototype.constraints = null;
OrShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0, 0.75), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.7, 0.1), false),
  new mxConnectionConstraint(new mxPoint(0.7, 0.9), false),
];
XorShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.175, 0.25), false),
  new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.175, 0.75), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
  new mxConnectionConstraint(new mxPoint(0.7, 0.1), false),
  new mxConnectionConstraint(new mxPoint(0.7, 0.9), false),
];
RequiredInterfaceShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
];
ProvidedRequiredInterfaceShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0, 0.5), false),
  new mxConnectionConstraint(new mxPoint(1, 0.5), false),
];

export default {
  SingleArrowShape,
  UmlLifeline,
  UmlFrame,
  ProcessShape,
  CrossShape,
  NoteShape,
  NoteShape2,
  ManualInputShape,
  DataStorageShape,
  CalloutShape,
  InternalStorageShape,
  ModuleShape,
  CornerShape,
  TeeShape,
  FolderShape,
  DocumentShape,
  TapeShape,
  IsoCubeShape2,
  CylinderShape,
  CylinderShape3,
  OffPageConnectorShape,
  StepShape,
  HexagonShape,
  CurlyBracketShape,
  DisplayShape,
  CubeShape,
  CardShape,
  LoopLimitShape,
  TrapezoidShape,
  ParallelogramShape,
};

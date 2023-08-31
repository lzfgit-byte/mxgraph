import mx from './useGraphFactory';
const { mxPanningHandler, mxEventObject, mxUtils, mxEvent, mxOutline, mxGraph } = mx;
// 修复事件
mxPanningHandler.prototype.mouseUp = function (sender, me) {
  if (this.active) {
    if (this.dx != null && this.dy != null) {
      // Ignores if scrollbars have been used for panning
      if (!this.graph.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.graph.container)) {
        let scale = this.graph.getView().scale;
        let t = this.graph.getView().translate;
        this.graph.panGraph(0, 0);
        this.panGraph(t.x + this.dx / scale, t.y + this.dy / scale);
      }

      me.consume();
    }
    this.eventListeners
      ? this.fireEvent(new mxEventObject(mxEvent.PAN_END, 'event', me))
      : this?.graph?.fireEvent(new mxEventObject(mxEvent.PAN_END, 'event', me));
  }

  this.reset();
};
// 修复outline
mxOutline.prototype.mouseUp = function (sender, me) {
  if (this.active) {
    let delta = this.getTranslateForEvent(me);
    let dx = delta.x;
    let dy = delta.y;

    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      if (!this.zoom) {
        // Applies the new translation if the source
        // has no scrollbars
        if (!this.source.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.source.container)) {
          this.source.panGraph(0, 0);
          dx /= this.outline.getView().scale;
          dy /= this.outline.getView().scale;
          let t = this.source.getView().translate;
          this.source.getView().setTranslate(t.x - dx, t.y - dy);
          this?.source?.fireEvent(new mxEventObject(mxEvent.PAN_END), this);
        }
      } else {
        // Applies the new zoom
        let w = this.selectionBorder.bounds.width;
        let scale = this.source.getView().scale;
        this.source.zoomTo(Math.max(this.minScale, scale - (dx * scale) / w), false);
      }

      this.update();
      me.consume();
    }

    // Resets the state of the handler
    this.index = null;
    this.active = false;
  }
};
export default () => {};

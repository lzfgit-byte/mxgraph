import { reactive } from 'vue';
import type { PowerGraphOpts, PowerGraphProps } from '@/components/mxGraph/src/type/graphTyped';

export default (opts: PowerGraphOpts): PowerGraphProps => {
  const {
    isReadonly,
    onLoaded,
    isSimpleModel,
    onSidebarLoaded,
    noFormPanel,
    onCellClicked,
    onCellBlur,
    onGraphChanged,
    showSidebarPanel = ['base', 'flow'],
    onGraphClick,
    allowEdgeNoTarget,
  } = opts;
  return reactive({
    isReadonly,
    onLoaded,
    isSimpleModel,
    onSidebarLoaded,
    noFormPanel,
    onCellClicked,
    onCellBlur,
    onGraphChanged,
    showSidebarPanel,
    onGraphClick,
    allowEdgeNoTarget,
  });
};

import type { Ref } from 'vue';
import { ref } from 'vue';
import type {
  PowerGraphExpose,
  PowerGraphMethods,
  PowerGraphOpts,
  PowerGraphProps,
} from '@/components/mxGraph/src/type/graphTyped';
import usePowerGraphProp from '@/components/mxGraph/src/hook/usePowerGraphProp';
import usePowerGraphMethod from '@/components/mxGraph/src/hook/usePowerGraphMethod';

export default (
  opts: PowerGraphOpts
): [Ref<PowerGraphExpose>, PowerGraphProps, PowerGraphMethods] => {
  const gRef = ref<PowerGraphExpose>();
  const props = usePowerGraphProp(opts);
  const methods = usePowerGraphMethod(opts, props, gRef);

  return [gRef, props, methods];
};

import type { Ref } from 'vue';
import { ref } from 'vue';
import type {
  PowerGraphExpose,
  PowerGraphMethods,
  PowerGraphOpts,
  PowerGraphProps,
} from '@/type/graphTyped';
import usePowerGraphProp from '@/hook/usePowerGraphProp';
import usePowerGraphMethod from '@/hook/usePowerGraphMethod';

export default (
  opts: PowerGraphOpts
): [Ref<PowerGraphExpose>, PowerGraphProps, PowerGraphMethods] => {
  const gRef = ref<PowerGraphExpose>();
  const props = usePowerGraphProp(opts);
  const methods = usePowerGraphMethod(opts, props, gRef);

  return [gRef, props, methods];
};

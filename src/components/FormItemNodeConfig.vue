<template>
  <ElForm label-position="left" label-width="60px" size="small">
    <ElFormItem label="提示">
      <ElInput v-model="tooltip" @change="handlerChange"></ElInput>
    </ElFormItem>
    <ElFormItem label="可点击">
      <ElSwitch v-model="canClick" @change="handlerCanClickChange"></ElSwitch>
    </ElFormItem>
  </ElForm>
</template>
<script setup lang="ts">
  import { ElForm, ElFormItem, ElInput, ElSwitch } from 'element-plus';
  import { ref, watchEffect } from 'vue';
  import { mxCell } from 'mxgraph';
  import MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
  import mx from '@/components/mxGraph/src/hook/useGraphFactory';
  const props = defineProps({ cell: mxCell, graph: MyGraph });
  const { mxConstants, mxEventObject, mxEvent } = mx;
  const tooltip = ref('');
  watchEffect(() => {
    tooltip.value = props?.cell?.getCustomData(mxConstants.CUSTOM_TOOLTIP);
  });
  const handlerChange = () => {
    props.cell.setCustomData(mxConstants.CUSTOM_TOOLTIP, tooltip.value);
    props?.graph.fireEvent(new mxEventObject(mxEvent.CUSTOM_NODESET_TOOLTIP), null);
    props.graph.refresh();
  };
  const canClick = ref(false);
  watchEffect(() => {
    canClick.value = props?.cell?.getCustomData(mxConstants.CUSTOM_NODESET_JUMP) === '1';
  });
  const handlerCanClickChange = () => {
    props.cell.setCustomData(mxConstants.CUSTOM_NODESET_JUMP, canClick.value ? '1' : '');
    props?.graph.fireEvent(new mxEventObject(mxEvent.CUSTOM_NODESET_TOOLTIP), null);
  };
</script>

<style scoped lang="less"></style>

<template>
  <ElButton :need-permission="false" @click="getXml">获取xml</ElButton>
  <ElButton :need-permission="false" @click="methods.setReadOnly(true)">查看模式</ElButton>
  <ElButton :need-permission="false" @click="methods.setReadOnly(false)">编辑模式</ElButton>
  <div style="width: 100%; height: 92vh">
    <PowerGraph ref="gRef" v-bind="props"></PowerGraph>
  </div>
</template>
<script setup lang="ts">
  import { ElButton, ElMessage } from 'element-plus';
  import { ref } from 'vue';
  // @ts-expect-error
  import timeLine from './xml/timeLine.xml?raw';
  import mx from './hook/useGraphFactory';
  import PowerGraph from '@/PowerGraph.vue';
  import usePowerGraph from '@/hook/usePowerGraph';
  const { mxConstants } = mx;
  let xml =
    '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="kXvipDgzVxv_EnZ8P-GoQ" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="120" y="120" width="120" height="60" as="geometry"/><Object tooltip="asdasd" as="businessData"/></mxCell></root></mxGraphModel>';
  const isSimpleModel = ref(false);
  const [gRef, props, methods] = usePowerGraph({
    isSimpleModel: isSimpleModel.value,
    onSidebarLoaded: () => {
      methods.setXml(timeLine);
      methods.setReadOnly(true);
    },
  });
  const getXml = () => {
    ElMessage.info(methods.getXml());
  };
</script>

<style scoped lang="less"></style>

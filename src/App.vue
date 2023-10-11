<template>
  <ElButton :need-permission="false" @click="getXml">获取xml</ElButton>
  <ElButton :need-permission="false" @click="methods.setReadOnly(true)">查看模式</ElButton>
  <ElButton :need-permission="false" @click="methods.setReadOnly(false)">编辑模式</ElButton>
  <ElButton :need-permission="false" @click="dialogReactive.show('')">导入xml</ElButton>
  <div style="width: 100%; height: 92vh">
    <PowerGraph ref="gRef" v-bind="props"></PowerGraph>
  </div>
  <el-dialog v-model="dialogReactive.dialogVisible" title="xml" width="1000">
    <el-input v-model="dialogReactive.textarea" :rows="20" type="textarea" />
    <template #footer>
      <ElButton @click="dialogReactive.confirm">确认</ElButton>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ElButton } from 'element-plus';
  import { reactive, ref } from 'vue';
  // @ts-expect-error
  import timeLine from './xml/timeLine.xml?raw';
  import PowerGraph from '@/PowerGraph.vue';
  import usePowerGraph from '@/hook/usePowerGraph';
  const isSimpleModel = ref(false);

  const [gRef, props, methods] = usePowerGraph({
    isSimpleModel: isSimpleModel.value,
    onSidebarLoaded: () => {
      methods.setXml(timeLine);
      methods.setReadOnly(true);
    },
  });

  const dialogReactive = reactive({
    dialogVisible: false,
    textarea: '',
    confirm: () => {
      methods.setXml(dialogReactive.textarea);
      dialogReactive.dialogVisible = false;
    },
    show: (xml) => {
      if (xml) {
        dialogReactive.textarea = xml;
      }
      dialogReactive.dialogVisible = true;
    },
  });
  const getXml = () => {
    dialogReactive.show(methods.getXml());
  };
</script>

<style scoped lang="less"></style>

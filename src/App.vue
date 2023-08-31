<template>
  <ElButton :need-permission="false" @click="getXml">获取xml</ElButton>
  <ElButton :need-permission="false" @click="setXml">设置xml</ElButton>
  <ElButton :need-permission="false" title="需要流程图里有图" @click="testSetFromJson">
    从json加载
  </ElButton>
  <ElButton :need-permission="false" @click="dialogVisible = true">解析bpmnXml</ElButton>
  <ElButton :need-permission="false" @click="methods.zoomIn">放大</ElButton>
  <ElButton :need-permission="false" @click="methods.zoomOut">缩小</ElButton>
  <ElButton :need-permission="false" @click="methods.zoomActual">正常</ElButton>
  <ElButton :need-permission="false" @click="methods.setReadOnly(true)">设置禁用</ElButton>
  <ElButton :need-permission="false" @click="methods.setReadOnly(false)">设置可用</ElButton>
  <ElButton :need-permission="false" @click="handlerSetCellColor">设置颜色为#cccccc</ElButton>
  <ElButton :need-permission="false" @click="methods.tempSave">临时保存</ElButton>
  <ElButton :need-permission="false" @click="methods.loadTempSave">加载临时保存</ElButton>
  <ElButton :need-permission="false" @click="handlerControl">切换简练模式</ElButton>
  <ElButton :need-permission="false" @click="methods.autoLayOut">自动布局</ElButton>
  <ElButton :need-permission="false" @click="handlerCheckBpmnXml">查看bpmnxml</ElButton>
  <div style="width: 100%; height: 95%">
    <PowerGraph ref="gRef" v-bind="props"></PowerGraph>
  </div>
  <el-dialog v-model="dialogVisible" title="xml" width="80%">
    <el-input v-model="textarea" :rows="20" type="textarea" placeholder="Please input" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="parsebpmn"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage,ElButton } from 'element-plus';
import { ref } from 'vue';
import mx from '../src/hook/useGraphFactory';
// @ts-expect-error
import xmlTxt from './bpmnXml.xml?raw';
import PowerGraph from '@/PowerGraph.vue';
import usePowerGraph from '@/hook/usePowerGraph';
import {
  setGraphFromJson,
  transform2Json,
} from '@/utils/Transform';
import { showConfirm } from '@/utils/kitUtil';
const { mxConstants} = mx;
let xml =
  '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="kXvipDgzVxv_EnZ8P-GoQ" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="120" y="120" width="120" height="60" as="geometry"/><Object tooltip="asdasd" as="businessData"/></mxCell></root></mxGraphModel>';
const isSimpleModel = ref(false);
const [gRef, props, methods] = usePowerGraph({ isSimpleModel: isSimpleModel.value });
const getXml = () => {
  ElMessage.info(methods.getXml());
};
const testSetFromJson = () => {
  const json = transform2Json(methods.getGraph().getModel());
  methods.getGraph().getModel().clear();
  console.log(json);
  showConfirm('已经图转换为json,从控制台查看json内容，确认后，将从json生成流程图').then(() => {
    setTimeout(() => {
      setGraphFromJson(methods.getGraph(), json);
    }, 500);
  });
};
const setXml = () => {
  methods.setXml(xml);
};
const handlerSetCellColor = () => {
  const cells = methods.getAllCells();
  cells.forEach((item) => (item.isVertex() ? methods.setCellColor(item.id, '#cccccc') : ''));
};
const handlerControl = () => {
  isSimpleModel.value = !isSimpleModel.value;
  methods.setSimpleMode(isSimpleModel.value);
};
const dialogVisible = ref(false);
const textarea = ref(xmlTxt);
const parsebpmn = () => {
  methods.covertBpmnXmlInGraph(textarea.value);
  dialogVisible.value = false;
};
const handlerCheckBpmnXml = () => {
  const a = methods.toBpmnXml();
  dialogVisible.value = true;
  textarea.value = a;
  console.log(a);
};
</script>

<style scoped lang="less"></style>

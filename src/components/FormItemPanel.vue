<template>
  <div class="form-item-container">
    <div v-if="activeCells.length > 0 && activeCells[0].isVertex()">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <ElTabPane label="样式" name="nodeSet">
          <FormItemLayout>
            <template #firstTitle>图形样式</template>
            <template #title>布局</template>
            <FormVertexSetForm
              :position-model="positionModel"
              :handle-geomerty-change="handleGeomertyChange"
              :handle-prop-change="handlePropChange"
              :handler-set-graph-color="handlerSetGraphColor"
              :handler-stroke-color="handlerStrokeColor"
            ></FormVertexSetForm>
          </FormItemLayout>
          <FormItemLineLayout>
            <template #title>文本 </template>
            <FormVertextFontSetForm
              :text-model="textModel"
              :handle-prop-change="handlePropChange"
              :handler-set-value="handlerSetValue"
            ></FormVertextFontSetForm>
          </FormItemLineLayout>
        </ElTabPane>
        <ElTabPane label="节点设置" name="nodeConfig">
          <FormItemLayout>
            <template #firstTitle>节点设置</template>
            <template #title>信息</template>
            <FormItemNodeConfig
              :graph="graph"
              :cell="activeCells.length > 0 ? activeCells[0] : null"
            ></FormItemNodeConfig>
          </FormItemLayout>
        </ElTabPane>
      </ElTabs>
    </div>
    <div v-else-if="activeCells.length > 0 && activeCells[0].isEdge()">
      <FormItemLayout>
        <template #firstTitle>线条样式</template>
        <template #title>布局</template>
        <FormEdgeSetForm
          :edge-model="edgeModel"
          :handler-stroke-color="handlerStrokeColor"
          :handler-edge-style="handlerEdgeStyle"
          :handler-set-value="handlerSetValue"
        ></FormEdgeSetForm>
      </FormItemLayout>
    </div>
    <div v-else>
      <FormItemLayout>
        <template #firstTitle>通用</template>
        <template #title>预设模板</template>
        <GraphTemplate></GraphTemplate>
      </FormItemLayout>
      <FormItemLineLayout>
        <template #title>快捷键</template>
        <GraphShortCuts></GraphShortCuts>
      </FormItemLineLayout>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { PropType } from 'vue';
  import { ElTabPane, ElTabs } from 'element-plus';
  import { ref } from 'vue';
  import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
  import useGraphFont from '@/components/mxGraph/src/hook/useGraphFont';
  import FormVertexSetForm from '@/components/mxGraph/src/components/FormVertexSetForm.vue';
  import FormVertextFontSetForm from '@/components/mxGraph/src/components/FormVertextFontSetForm.vue';
  import FormEdgeSetForm from '@/components/mxGraph/src/components/FormEdgeSetForm.vue';
  import GraphTemplate from '@/components/mxGraph/src/components/GraphTemplate.vue';
  import FormItemNodeConfig from '@/components/mxGraph/src/components/FormItemNodeConfig.vue';
  import FormItemLayout from '@/components/mxGraph/src/components/FormItemLayout.vue';
  import FormItemLineLayout from '@/components/mxGraph/src/components/FormItemLineLayout.vue';
  import GraphShortCuts from '@/components/mxGraph/src/components/GraphShortCuts.vue';
  const props = defineProps({ graph: Object as PropType<MyGraph> });
  const {
    handlePropChange,
    handleGeomertyChange,
    positionModel,
    textModel,
    activeCells,
    handlerSetGraphColor,
    edgeModel,
    handlerEdgeStyle,
    handlerStrokeColor,
    handlerSetValue,
  } = useGraphFont(props as any);
  const activeName = ref('nodeSet');
  const handleClick = () => {};
</script>

<style scoped lang="less">
  @import '../style/formPanle';
</style>

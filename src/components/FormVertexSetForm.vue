<template>
  <div style="padding-bottom: 5px; font-size: 10px">
    <span>id: {{ positionModel.id }}</span>
  </div>
  <ElForm label-position="left" label-width="60px" size="small">
    <ElFormItem label="宽度">
      <ElInputNumber
        :model-value="positionModel.width"
        controls-position="right"
        @change="handleGeomertyChange('width', $event)"
      />
      <span class="ml-1">px</span>
    </ElFormItem>
    <ElFormItem label="高度">
      <ElInputNumber
        :model-value="positionModel.height"
        controls-position="right"
        @change="handleGeomertyChange('height', $event)"
      />
      <span class="ml-1">px</span>
    </ElFormItem>
    <ElFormItem label="x">
      <ElInputNumber
        :model-value="positionModel.x"
        controls-position="right"
        @change="handleGeomertyChange('x', $event)"
      />
      <span class="ml-1">px</span>
    </ElFormItem>
    <ElFormItem label="y">
      <ElInputNumber
        :model-value="positionModel.y"
        controls-position="right"
        @change="handleGeomertyChange('y', $event)"
      />
      <span class="ml-1">px</span>
    </ElFormItem>
    <ElFormItem label="旋转">
      <ElInputNumber
        :model-value="positionModel.rotate"
        controls-position="right"
        @change="handlePropChange('rotation', $event)"
      />
      <span class="ml-1">度</span>
    </ElFormItem>
    <ElFormItem label="背景色">
      <FormDefaultColor :model-value="positionModel.fillColor" @change="handlerSetGraphColor" />
    </ElFormItem>
    <ElFormItem label="边框颜色">
      <FormDefaultColor :model-value="positionModel.strokeColor" @change="handlerStrokeColor" />
    </ElFormItem>
  </ElForm>
</template>
<script setup lang="ts">
  import { ElColorPicker, ElForm, ElFormItem, ElInputNumber } from 'element-plus';
  import type { PropType } from 'vue';
  import type { positionModelType } from '@/components/mxGraph/src/hook/useGraphFont';
  import FormDefaultColor from '@/components/mxGraph/src/components/FormDefaultColor.vue';
  defineProps({
    positionModel: Object as PropType<positionModelType>,
    handleGeomertyChange: Function,
    handlePropChange: Function,
    handlerSetGraphColor: Function,
    handlerStrokeColor: Function,
  });
</script>

<style scoped lang="less"></style>

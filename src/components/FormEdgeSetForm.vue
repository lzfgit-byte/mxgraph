<template>
  <ElForm label-position="left" label-width="60px" size="small">
    <span>id: {{ edgeModel.id }}</span>
    <ElFormItem label="颜色">
      <FormDefaultColor :model-value="edgeModel.strokeColor" @change="handlerStrokeColor" />
    </ElFormItem>
    <ElFormItem label="宽度">
      <ElInputNumber
        :model-value="+edgeModel.strokeWidth as any"
        controls-position="right"
        @change="handlerEdgeStyle('strokeWidth', $event)"
      />
      <span class="ml-1">px</span>
    </ElFormItem>
    <ElFormItem label="值">
      <ElInput v-model="valueRef" @change="handlerSetValue"></ElInput>
    </ElFormItem>
  </ElForm>
</template>
<script setup lang="ts">
  import { ElForm, ElFormItem, ElInput, ElInputNumber } from 'element-plus';
  import type { PropType } from 'vue';
  import { ref } from 'vue';
  import type { edgeModelType } from '@/hook/useGraphFont';
  import FormDefaultColor from '@/components/FormDefaultColor.vue';
  const props = defineProps({
    edgeModel: Object as PropType<edgeModelType>,
    handlerStrokeColor: Function,
    handlerEdgeStyle: Function,
    handlerSetValue: Function,
  });
  const valueRef = ref(props?.edgeModel?.value);
</script>

<style scoped lang="less"></style>

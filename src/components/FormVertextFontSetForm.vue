<template>
  <ElForm label-position="left" size="small">
    <ElFormItem label="字体">
      <ElSelect
        :model-value="textModel.fontFamily"
        @change="handlePropChange('fontFamily', $event)"
      >
        <ElOption v-for="font in fonts" :key="font" :label="font" :value="font">
          <span :style="{ fontFamily: font }">{{ font }}</span>
        </ElOption>
      </ElSelect>
    </ElFormItem>
    <ElFormItem label="字号">
      <ElInputNumber
        :model-value="textModel.fontSize"
        controls-position="right"
        @change="handlePropChange('fontSize', $event)"
      />
      <span class="ml-1">px</span>
    </ElFormItem>
    <ElFormItem label="内容">
      <ElInput v-model="content" controls-position="right" @change="handlerSetValue($event)" />
    </ElFormItem>
    <ElFormItem label="颜色">
      <FormDefaultColor
        :model-value="textModel.fontColor"
        @change="handlePropChange('fontColor', $event)"
      />
    </ElFormItem>
    <ElFormItem label="加粗">
      <ElSwitch :model-value="textModel.bold" @change="handlePropChange('bold', $event)" />
    </ElFormItem>
    <ElFormItem label="倾斜">
      <ElSwitch
        :model-value="textModel.italic"
        controls-position="right"
        @change="handlePropChange('italic', $event)"
      />
    </ElFormItem>
    <ElFormItem label="下划线">
      <ElSwitch
        :model-value="textModel.underline"
        controls-position="right"
        @change="handlePropChange('underline', $event)"
      />
    </ElFormItem>
    <ElFormItem label="文字水平方向">
      <ElSelect :model-value="textModel.align" @change="handlePropChange('align', $event)">
        <ElOption v-for="font in labelPosition" :key="font" :label="font" :value="font" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem label="文字垂直方向">
      <ElSelect
        :model-value="textModel.verticalLabelPosition"
        @change="handlePropChange('verticalLabelPosition', $event)"
      >
        <ElOption v-for="font in verticalLabelPosition" :key="font" :label="font" :value="font" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem label="垂直方向">
      <ElSelect
        :model-value="textModel.verticalAlign"
        @change="handlePropChange('verticalAlign', $event)"
      >
        <ElOption v-for="font in verticalLabelPosition" :key="font" :label="font" :value="font" />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
  import { ElForm, ElFormItem, ElInputNumber, ElOption, ElSelect, ElSwitch } from 'element-plus';
  import type { PropType } from 'vue';
  import { ref } from 'vue';
  import {
    fonts,
    labelPosition,
    verticalLabelPosition,
  } from '@/const/FormatSettingPanel';
  import type { TextConfig } from '@/hook/useGraphFont';
  import FormDefaultColor from '@/components/FormDefaultColor.vue';
  const props = defineProps({
    textModel: Object as PropType<TextConfig>,
    handlePropChange: Function,
    handlerSetValue: Function,
  });
  const content = ref(props.textModel.value);
  const bold = ref(props.textModel.bold);
  const hhh = () => {
    alert();
  };
</script>

<style scoped lang="less"></style>

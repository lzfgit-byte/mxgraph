<template>
  <div class="div-font-title bottom-line">
    <slot name="firstTitle"></slot>
  </div>
  <FormItemLineLayout>
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>
  </FormItemLineLayout>
</template>
<script setup lang="ts">
  import FormItemLineLayout from '@/components/mxGraph/src/components/FormItemLineLayout.vue';
</script>

<style scoped lang="less">
  @import '../style/formItemLayout';
</style>

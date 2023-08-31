<template>
  <ElColorPicker v-bind="$attrs" :predefine="predefine" @change="handlerChange" />
</template>
<script setup lang="ts">
  import { ElColorPicker } from 'element-plus';
  import { ref } from 'vue';
  const emits = defineEmits(['change']);
  const predefine = ref([
    '#fed8ff',
    '#9fc3fe',
    '#f7646b',
    '#fbfd01',
    '#f8a7a7',
    '#99e8f9',
    '#fdd5ab',
    '#cccccc',
  ]);
  const handlerChange = (evt) => {
    if (predefine.value.includes(evt)) {
      emits('change', evt);
      return;
    }
    predefine.value.push(evt);
    emits('change', evt);
  };
</script>

<style scoped lang="less"></style>

<template>
  <div
    v-for="(item, index) in graphTemplate"
    :key="index"
    class="tem-container"
    @click="setXml(item.xml)"
  >
    <span>{{ item.name }}</span>
  </div>
</template>
<script setup lang="ts">
  import { inject } from 'vue';
  import { graphTemplate } from '@/components/mxGraph/src/const/defaultTemplete';

  const setXml = inject('setXml');
</script>

<style scoped lang="less">
  div {
    box-sizing: border-box;
  }
  .tem-container {
    display: flex;
    width: 100%;
    height: 32px;
    justify-content: start;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #c1c1c1;
      border-radius: 3px;
    }
    &::before {
      content: ' ';
      width: 6px;
      height: 6px;
      background-color: black;
      border-radius: 3px;
      margin-right: 5px;
      margin-left: 2px;
      transform: translateY(1px);
    }
  }
</style>

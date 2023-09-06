<template>
  <div v-for="(item, index) in graphShortsMap" :key="index" class="tem-container">
    <span style="margin-right: 5px">{{ item.name }}</span>
    <span>【{{ item.key }}】</span>
  </div>
</template>
<script setup lang="ts">
  import { graphShortsMap } from '@/hook/useGraphShortcutKey';
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

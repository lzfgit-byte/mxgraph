<template>
  <div class="side-bar-container">
    <ElCollapse v-model="activeNames">
      <ElCollapseItem title="基本图形" name="base">
        <div
          v-for="(item, index) in baseSvg"
          :key="index"
          class="side-bar-element"
          :data-w="item.w"
          :data-h="item.h"
          :data-value="item.value"
          :title="item.key"
          @mousedown="handlerClick(item.key)"
        >
          <div class="sidebar-svg-container" v-html="item.svgHtml"></div>
        </div>
      </ElCollapseItem>
      <ElCollapseItem title="基本线条" name="baseEdge">
        <div
          v-for="(item, index) in baseEdgeSvg"
          :key="`${index}baseEdge`"
          class="side-bar-element"
          :data-w="item.w"
          :data-h="item.h"
          :data-value="item.value"
          :title="item.key"
          @mousedown="handlerClick(item.key)"
        >
          <div class="sidebar-svg-container" v-html="item.svgHtml"></div>
        </div>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';
  import { onMounted, ref } from 'vue';
  import { ElCollapse, ElCollapseItem } from 'element-plus';
  import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
  import useGraphDrag from '@/components/mxGraph/src/hook/useGraphDrag';
  const props = defineProps({ graph: Object as PropType<MyGraph> });
  const emits = defineEmits(['sideLoaded']);
  const { baseSvg, handlerClick, baseEdgeSvg, initDrag } = useGraphDrag(props as any);
  const activeNames = ref(['base', 'baseEdge']);
  onMounted(() => {
    setTimeout(() => {
      initDrag();
      emits('sideLoaded');
    });
  });
</script>

<style scoped lang="less">
  div {
    box-sizing: border-box;
  }
  .side-bar-container {
    width: var(--left-width);
    height: 100%;
    overflow: auto;
    .side-bar-element {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      cursor: pointer;
      border-radius: 4px;
      &:hover {
        background-color: #cccccc;
      }
    }
  }
</style>

<template>
  <div class="simple-sidebar-container">
    <ElCollapse v-model="activeNames">
      <ElCollapseItem v-show="showSidebarPanel?.includes('base')" title="基本图形" name="base">
        <div
          v-for="(item, index) in [...vertexShapeSvg, ...edgeShapeSvg]"
          :key="index"
          class="side-bar-element"
          :data-w="item.tw || item.w"
          :data-h="item.th || item.h"
          :data-value="item.value"
          :title="item.key"
          @mousedown="handlerClick(item.key)"
        >
          <div class="sidebar-svg-container" v-html="item.svgHtml"></div>
        </div>
      </ElCollapseItem>
      <ElCollapseItem v-show="showSidebarPanel?.includes('flow')" title="工作流" name="flow">
        <div
          v-for="(item, index) in flowShapeSvg"
          :key="index"
          class="side-bar-element"
          :data-w="item.tw || item.w"
          :data-h="item.th || item.h"
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
  import useGraphMultiSvg from '@/components/mxGraph/src/hook/useGraphMultiSvg';
  import type { PanelsType } from '@/components';

  const props = defineProps({
    graph: Object as PropType<MyGraph>,
    showSidebarPanel: Array as PropType<PanelsType[]>,
  });
  const emits = defineEmits(['sideLoaded']);
  const { vertexShapeSvg, edgeShapeSvg, flowShapeSvg, initDrag, handlerClick } = useGraphMultiSvg(
    props as any
  );
  const activeNames = ref(['base', 'flow']);
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
  .simple-sidebar-container {
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

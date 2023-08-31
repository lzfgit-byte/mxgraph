<template>
  <div class="tool-container">
    <div v-if="showJump" class="tools-tool" @click="emits('jumpClick')">
      <GraphSvgIcon :width="width" :height="height" type="jumped"></GraphSvgIcon>
    </div>
    <div v-if="content" class="tools-tool">
      <ElTooltip trigger="hover" placement="top" :content="content" :popper-class="popperClass">
        <div>
          <GraphSvgIcon :width="width" :height="height" type="tooltip"></GraphSvgIcon>
        </div>
      </ElTooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ElTooltip } from 'element-plus';
  import GraphSvgIcon from '@/components/GraphSvgIcon.vue';
  defineProps({
    content: String,
    showJump: Boolean,
    popperClass: String,
    width: Number,
    height: Number,
  });
  const emits = defineEmits(['jumpClick']);
</script>

<style scoped lang="less">
  .tool-container {
    display: flex;
  }
</style>

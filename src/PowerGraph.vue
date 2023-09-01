<template>
  <div class="graph-container">
    <div class="graph-left" :class="isReadonly ? ['graph-readonly'] : []">
      <Siderbar v-if="!isSimpleM" :graph="graph" @side-loaded="emits('sidebarLoaded')"></Siderbar>
      <SimpleSideBar
        v-if="isSimpleM"
        :graph="graph"
        :show-sidebar-panel="showSidebarPanel"
        @side-loaded="emits('sidebarLoaded')"
      ></SimpleSideBar>
    </div>
    <div ref="el" class="graph-editor-container">
      <div class="graph-translate">
        x:{{ state.translate.value[0] }},y:{{ state.translate.value[1] }}
      </div>
      <div class="editor-container"></div>
    </div>
    <div v-show="!noFormPanel" class="graph-right" :class="isReadonly ? ['graph-readonly'] : []">
      <FormItemPanel :graph="graph"></FormItemPanel>
    </div>
    <div
      class="editor-outline"
      :class="isReadonly || noFormPanel ? ['graph-readonly-outline'] : []"
    ></div>
  </div>
</template>
<script setup lang="ts">
  import type { PropType } from 'vue';
  import { computed, provide } from 'vue';
  import Siderbar from '@/components/Siderbar.vue';
  import FormItemPanel from '@/components/FormItemPanel.vue';
  import useGraphInit from '@/hook/useGraphInit';
  import useGraphSetting from '@/hook/useGraphSetting';
  import useGraphExpose from '@/hook/useGraphExpose';
  import { graphEmitsArr } from '@/const/emits';
  import SimpleSideBar from '@/components/SimpleSideBar.vue';
  import type { PanelsType } from '@/type/graphTyped';
  import useGraphCustomEvent from '@/hook/useGraphCustomEvent';
  import useGraphShortcutKey from '@/hook/useGraphShortcutKey';
  const props = defineProps({
    isReadonly: Boolean,
    isSimpleModel: Boolean,
    noFormPanel: Boolean,
    showSidebarPanel: Array as PropType<PanelsType[]>,
    id: String,
    name: String,
    allowEdgeNoTarget: Boolean,
  });
  const emits = defineEmits(graphEmitsArr as any);
  useGraphInit();
  const { graph, editor, state } = useGraphSetting(props as any, emits as any);
  const isSimpleM = computed(() => state.isSimpleM.value);
  const expose_ = useGraphExpose(graph, editor, props, state);
  const { el } = useGraphShortcutKey(graph, expose_, state);
  provide('setXml', expose_.setXml);
  useGraphCustomEvent(graph, editor, props, state, expose_);
  defineExpose(expose_);
</script>
<style lang="less">
  @import './style/common';
  @import './style/global';
</style>
<style scoped lang="less">
  @import './style/graph';
  .graph-container {
    --left-width: 200px;
    --right-width: 234px;
  }
</style>

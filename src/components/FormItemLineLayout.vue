<template>
  <div class="bottom-line">
    <div class="div-font-title">
      <slot name="title"></slot>
    </div>
    <div class="form-set-container">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped lang="less">
  @import '../style/formItemLayout';
  .form-set-container {
    padding-left: 22px;
  }
  .bottom-line {
    border-bottom: 1px solid #ccc;
  }
</style>

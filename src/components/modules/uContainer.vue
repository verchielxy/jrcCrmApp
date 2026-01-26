<template>
  <page-meta :page-style="'height: 100%; background-color: #f5f5f5;'" />

  <view class="u-container" :class="$attrs.class" :style="$attrs.style">
    <slot />
  </view>
</template>

<script setup>
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
.u-container {
  position: relative;
  background-color: #f5f5f5;
  box-sizing: border-box;
}
</style>

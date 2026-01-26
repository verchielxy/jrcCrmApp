<template>
  <page-meta :page-style="'height: 100%; background-color: #f5f5f5;'" />

  <view class="u-page" :class="$attrs.class" :style="$attrs.style">
    <!--    <scroll-view-->
    <!--        scroll-y-->
    <!--        class="u-scroll"-->
    <!--        :refresher-enabled="enableRefresh"-->
    <!--        @refresherpulling="onPull"-->
    <!--        @refresherrefresh="onRefresh"-->
    <!--        @refresherrestore="onRestore"-->
    <!--        @refresherabort="onAbort"-->
    <!--    >-->
    <!--      <slot />-->
    <!--    </scroll-view>-->
    <slot />
  </view>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  enableRefresh: {
    type: Boolean,
    default: false,
  },
})

const onPull = () => {}
const onRestore = () => {}
const onAbort = () => {}
const onRefresh = () => {
  uni.$emit('refresh')
}
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
.u-page {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.u-scroll {
  flex: 1;
  overflow: hidden;
}
</style>

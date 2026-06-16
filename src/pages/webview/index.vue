<template>
  <view>
    <web-view :src="viewerUrl"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      viewerUrl: '' // 最终要展示的网页链接
    };
  },
  onLoad(options) {
    // 接收从上一个页面传递过来的 url 参数
    if (options.url) {
      // 核心：必须用 decodeURIComponent 解码，因为传过来的时候被 encodeURIComponent 编码了
      this.viewerUrl = decodeURIComponent(options.url);
      console.log('App 内部 WebView 正在加载外链：', this.viewerUrl);
    }
  }
}
</script>

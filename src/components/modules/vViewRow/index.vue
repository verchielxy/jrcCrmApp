<template>
  <up-cell-group :class="componentClass">
    <template v-for="item in rows">
      <up-cell :title="item.title" :title-style="{ 'width': labelWidth, 'flex': 'none' }" v-if="item.type === 'text'">
        <template #value>
          <text class="right-text">{{ formData[item.name] }}</text>
        </template>
      </up-cell>

      <up-cell :title="item.title" :title-style="{ 'width': labelWidth, 'flex': 'none' }" v-else-if="item.type === 'image'">
        <template #value>
          <up-image :show-loading="true" shape="square" :src="$imageUrl(formData[item.name])" width="80px" height="80px"></up-image>
        </template>
      </up-cell>

      <up-cell :title="item.title" :title-style="{ 'width': labelWidth, 'flex': 'none' }" v-else-if="item.type === 'status'">
        <template #value>
          <text class="right-text">
            <u-tag plain :type="formData[item.name].badge" v-if="formData[item.name]">{{ formData[item.name].label }}</u-tag>
          </text>
        </template>
      </up-cell>

      <up-cell :title="item.title" :title-style="{ 'width': labelWidth, 'flex': 'none' }" v-else-if="item.type === 'download'">
        <template #value>
          <text class="right-text" @click="handleDownloadClick(formData[item.name])" v-if="formData[item.name]">
            <MaterialSymbol class="middle-icon c-primary" name="download_2" :size="20" type="sharp"></MaterialSymbol>
            下载
          </text>
        </template>
      </up-cell>

      <up-cell :title="item.title" :title-style="{ 'width': labelWidth, 'flex': 'none' }" v-else-if="item.type === 'content'">
        <template #value>
          <text class="right-text" v-html="formData[item.name]"></text>
        </template>
      </up-cell>

      <up-cell :title="item.title" :title-style="{ 'width': labelWidth, 'flex': 'none' }" v-else-if="item.type === 'slotList'">
        <template #value>
          <slot :name="item.slot" :list="formData && formData[item.name] ? formData[item.name] : []"></slot>
        </template>
      </up-cell>
    </template>
  </up-cell-group>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import uploadConfig from "@/config/upload";

export default defineComponent({
  name: 'vFormRow',
  components: {
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: 'default',
      required: false,
    },
    labelWidth: {
      type: String,
      default: '90px',
      required: false,
    },
    class: {
      type: String,
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const rows = toRef(props, 'rows');
    const formData = toRef(props, 'formData');
    const column = toRef(props, 'column');
    const size = toRef(props, 'size');
    const labelWidth = toRef(props, 'labelWidth');
    const componentClass = toRef(props, 'class');

    const handleDownloadClick = (fileUrl) => {
      uni.showLoading({ title: '准备下载...' });

      uni.downloadFile({
        url: fileUrl, // 后端提供的下载接口地址
        header: {
          // 如果需要 token，记得在这里加上
          // 'Authorization': 'Bearer ' + store.state.token
          ...uploadConfig.config.headers(),
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const tempFilePath = res.tempFilePath;

            // 成功获取临时路径后，建议直接打开预览 (支持 doc, xls, pdf 等)
            uni.openDocument({
              filePath: tempFilePath,
              showMenu: true, // 允许用户分享或另存为
              success: () => {
                console.log('文件打开成功');
              },
              fail: (err) => {
                uni.showToast({ title: '暂不支持预览此格式', icon: 'none' });
              }
            });
          } else {
            // 如果是 404, 500 等，在这里处理
            const errMsg = res.statusCode === 404 ? '文件不存在(404)' : '服务器错误(' + res.statusCode + ')';
            uni.showToast({
              title: errMsg,
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.showToast({ title: '下载失败', icon: 'none' });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    }

    return {
      rows,
      formData,
      column,
      size,
      labelWidth,
      componentClass,
      handleDownloadClick,
    };
  },
});
</script>

<style src="./index.less" lang="less" scoped></style>

<style scoped lang="less">
</style>

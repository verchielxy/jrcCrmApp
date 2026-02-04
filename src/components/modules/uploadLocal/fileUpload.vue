<template>
  <view :class="['full-width relative', $attrs['class']]">
    <up-upload
        :fileList="fileList"
        accept="file"
        name="file"
        multiple
        :maxCount="limit"
        :maxSize="uploadSize * 1024 * 1024"
        :autoDelete="true"
        uploadText="上传文件"
        @afterRead="afterRead"
    ></up-upload>
  </view>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, defineModel, watch } from 'vue';
import { useStore } from 'vuex';
import uploadConfig from '@/config/upload';
import {
  getFileNameFromFilePath,
  getFileTypeFromFilePath,
  getFileIconFromFilePath,
  getBase64FromFile
} from '@/utils/file';

export default defineComponent({
  name: 'fileUpload',
  components: {
  },
  props: {
    files: {
      type: Array,
      default: [],
    },
    placeholder: {
      type: String,
      default: '上传图片',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 1,
    },
    download: {
      type: Boolean,
      default: false,
    },
    uploadUrl: {
      type: String,
      default: () => {
        return uploadConfig.file.url;
      },
    },
    uploadKey: {
      type: String,
      default: () => {
        return uploadConfig.file.key;
      },
    },
    uploadMethod: {
      type: String,
      default: 'post',
    },
    uploadHeaders: {
      type: Object,
      default: () => {
        return {};
      },
    },
    uploadParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    uploadAccepts: {
      type: Array,
      default: () => {
        return uploadConfig.file.accepts;
      },
    },
    uploadSize: {
      type: Number,
      default: () => {
        return uploadConfig.file.size;
      },
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const files = toRef(props, 'files');
    const placeholder = toRef(props, 'placeholder');
    const disabled = toRef(props, 'disabled');
    const limit = toRef(props, 'limit');
    const download = toRef(props, 'download');

    const uploadKey = toRef(props, 'uploadKey');
    const uploadMethod = toRef(props, 'uploadMethod');
    const uploadHeaders = toRef(props, 'uploadHeaders');
    const uploadParams = toRef(props, 'uploadParams');
    const uploadSize = toRef(props, 'uploadSize');

    const uploadFormatHeaders = ref({ ...uploadConfig.config.headers(), ...uploadHeaders.value });
    const uploadFormatParams = ref({ ...uploadConfig.config.params(), ...uploadParams.value });

    const fileList = ref([]);

    const afterRead = async (event) => {
      let lists = [].concat(event.file);
      let fileListLen = fileList.value.length;
      lists.map((item) => {
        fileList.value.push({
          ...item,
          status: 'uploading',
          message: '上传中',
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const response = await uploadFilePromise(lists[i].url);
        let item = fileList.value[fileListLen];
        fileList.value.splice(fileListLen, 1, {
          ...item,
          status: 'success',
          message: '',
          url: uploadConfig.file.generatorUrl(response.result, 'preview'),
          value: response.result,
        });
        fileListLen++;
      }
      // console.log(fileList.value)
      context.emit('uploadChange', fileList.value[fileList.value.length - 1], fileList.value);
    }

    const uploadFilePromise = (tempFilePath) => {
      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: uploadConfig.file.url, // 仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: uploadConfig.file.key,
          header: {
            ...uploadFormatHeaders.value,
          },
          formData: {
            ...uploadFormatParams.value,
          },
          success: (res) => {
            setTimeout(() => {
              resolve(JSON.parse(res.data));
            }, 1000);
          },
        });
      });
    };

    watch(files, (nowValue, prevValue) => {
      // console.log(value.value);
      if (nowValue) {
        files.value.map((url) => {
          fileList.value.push({
            message: '',
            status: "success",
            name: getFileNameFromFilePath(url),
            value: url,
            url: uploadConfig.file.generatorUrl(url, 'preview'),
            thumb: uploadConfig.file.generatorUrl(url, 'preview'),
            type: getFileTypeFromFilePath(url),
          })
        })
      }
    }, { immediate : true });

    return {
      getFileTypeFromFilePath,
      getFileIconFromFilePath,
      files,
      placeholder,
      disabled,
      limit,
      download,
      uploadKey,
      uploadMethod,
      uploadFormatHeaders,
      uploadFormatParams,
      uploadSize,
      fileList,
      afterRead,
    };
  },
});
</script>

<style scoped lang="less">
</style>

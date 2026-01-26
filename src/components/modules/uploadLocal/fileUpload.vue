<template>
  <div class="clearfix" :style="{ minHeight: (imageHeight + 8) + 'px' }">
    <a-upload
        class="v-upload-file"
        v-model:file-list="fileList"
        :maxCount="limit"
        :action="uploadUrl"
        :method="uploadMethod"
        :name="uploadKey"
        :headers="uploadFormatHeaders"
        :data="uploadFormatParams"
        :accept="uploadFormatAccepts"
        :beforeUpload="handleBeforeUpload"
        @preview="handleOpenModalPreview"
        @change="handleChange"
    >
      <a-button class="v-upload-action" :disabled="fileList.length >= limit">
        <upload-outlined />
        {{ placeholder }}
      </a-button>

      <a-tooltip overlayClassName="v-tooltip" @click.stop="() => { return false }">
        <template #title v-if="uploadAccepts.length > 0">
          <div>支持格式：{{ uploadAccepts.join(',') }}</div>
          <div>大小限制：{{ uploadSize }} MB</div>
        </template>

        <QuestionCircleOutlined class="ml10px font16px c-info" />
      </a-tooltip>

      <template #itemRender="{ file, actions }">
        <div :class="['v-upload-item', file.status === 'error' ? 'v-upload-item-error' : '' ]">
          <div class="item-inner">
            <div class="item-preview">
              <loading-outlined class="c-success" v-if="file.status === 'uploading'" />
              <component :is="$antIcons[getFileIconFromFilePath(file.name)]" v-else></component>
            </div>
            <div class="text-ellipsis">
              <a-tooltip :title="file.name" :overlayClassName="['v-tooltip', file.status === 'error' ? 'v-tooltip-error' : '']">
                {{ file.name }}
              </a-tooltip>
            </div>
            <div class="item-options">
              <template v-if="file.status === 'done'">
                <a-tooltip title="预览" overlayClassName="v-tooltip">
                  <a @click="actions.preview"> <EyeOutlined /> </a>
                </a-tooltip>
                <a-tooltip title="下载" overlayClassName="v-tooltip" v-if="download">
                  <a :href="file.download" target="_blank"> <DownloadOutlined /> </a>
                </a-tooltip>
                <a-tooltip title="删除" overlayClassName="v-tooltip">
                  <a @click="actions.remove"> <DeleteOutlined /> </a>
                </a-tooltip>
              </template>
              <template v-else-if="file.status === 'uploading'">
              </template>
              <template v-else-if="file.status === 'error'">
                <a-tooltip :title="file.message" overlayClassName="v-tooltip v-tooltip-error">
                  <InfoCircleOutlined />
                </a-tooltip>
                <a-tooltip title="删除" overlayClassName="v-tooltip v-tooltip-error">
                  <a @click="actions.remove"> <DeleteOutlined /> </a>
                </a-tooltip>
              </template>
            </div>
            <div class="item-progress-box" v-if="file.status === 'uploading'">
              <a-progress class="item-progress" :percent="file.percent" size="small" />
            </div>
          </div>
        </div>
      </template>
    </a-upload>

    <a-modal :open="modalPreviewVisible" :title="modalPreviewTitle" :footer="null" @cancel="handleCloseModalPreview">
      <img class="full-width" :src="previewFile.preview" v-if="previewFile.type === 'image'" />
      <div class="py3em center" v-else>
        暂不支持预览
      </div>
    </a-modal>
  </div>
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
  name: 'imageUpload',
  components: {
  },
  props: {
    files: {
      type: Array,
      default: [],
    },
    placeholder: {
      type: String,
      default: '请上传文件',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 1,
    },
    listHeight: {
      type: [Number, String],
      default: 'auto',
    },
    download: {
      type: Boolean,
      default: true,
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
        return uploadConfig.image.size;
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
    const listHeight = toRef(props, 'listHeight');
    const download = toRef(props, 'download');

    const uploadKey = toRef(props, 'uploadKey');
    const uploadMethod = toRef(props, 'uploadMethod');
    const uploadHeaders = toRef(props, 'uploadHeaders');
    const uploadParams = toRef(props, 'uploadParams');
    const uploadAccepts = toRef(props, 'uploadAccepts');
    const uploadSize = toRef(props, 'uploadSize');
    const uploadFormatAcceptsBuild = () => {
      let accepts = [];
      uploadAccepts.value.map(function (item, index) {
        accepts = [
          ...accepts,
          ...uploadConfig.fileTypes[item],
        ]
      });
      return accepts.join(', ');
    }
    const uploadFormatHeaders = ref({ ...uploadConfig.config.headers(), ...uploadHeaders.value });
    const uploadFormatParams = ref({ ...uploadConfig.config.params(), ...uploadParams.value });
    const uploadFormatAccepts = ref(uploadFormatAcceptsBuild());

    const fileList = ref([]);
    const previewFile = ref('');
    const modalPreviewVisible = ref(false);
    const modalPreviewTitle = ref('');

    const handleBeforeUpload = async (file) => {
      // console.log(file)
      // if (!file.preview) {
      //   file.preview = await getBase64FromFile(file);
      // }

      let result = true;
      if (file.size / 1024 / 1024 > uploadSize.value) {
        let message = '请上传小于' + uploadSize.value + 'MB的文件';
        file.status = 'error';
        file.message = message;
        proxy.$message.warning(message);
        result = false;
      }

      return result;
    }
    const handleOpenModalPreview = (file) => {
      previewFile.value = file;
      modalPreviewTitle.value = file.name || getFileNameFromFilePath(file.url);
      modalPreviewVisible.value = true;
    }
    const handleCloseModalPreview = () => {
      modalPreviewVisible.value = false;
    }
    const handleChange = ({ file, fileList }) => {
      const response = file.response;
      // console.log(response);

      if (file.status === 'done') {
        if (uploadConfig.config.responseIsSuccess(response)) {
          const responseValue = uploadConfig.config.responseGetValue(response);
          const responseFileUrl = uploadConfig.config.responseGetFileUrl(response);
          file.name = getFileNameFromFilePath(responseFileUrl);
          file.value = responseValue;
          file.url =responseFileUrl;
          file.preview = uploadConfig.file.generatorUrl(responseFileUrl, 'preview');
          file.download = uploadConfig.file.generatorUrl(responseFileUrl, 'download');
          file.type = getFileTypeFromFilePath(responseFileUrl);
        } else {
          file.status = 'error';
          file.message = uploadConfig.config.responseGetMessage(response);
        }
      } else if (file.status === 'removed') {
      } else if (file.status === 'error') {
        file.message = uploadConfig.config.responseGetMessage(response);
      }

      context.emit('uploadChange', file, fileList);
    }

    watch(files, (nowValue, prevValue) => {
      // console.log(value.value);
      fileList.value = files.value.map(function (item) {
        return {
          status: 'done',
          // status: 'uploading',
          // percent: 50,
          name: getFileNameFromFilePath(item.url),
          value: item.value,
          url: item.url,
          preview: uploadConfig.file.generatorUrl(item.url, 'preview'),
          download: uploadConfig.file.generatorUrl(item.url, 'download'),
          type: getFileTypeFromFilePath(item.url),
        };
      })

    }, { immediate : true });

    return {
      getFileTypeFromFilePath,
      getFileIconFromFilePath,
      files,
      placeholder,
      disabled,
      limit,
      listHeight,
      download,
      uploadKey,
      uploadMethod,
      uploadFormatHeaders,
      uploadFormatParams,
      uploadFormatAccepts,
      fileList,
      previewFile,
      modalPreviewVisible,
      modalPreviewTitle,
      handleBeforeUpload,
      handleOpenModalPreview,
      handleCloseModalPreview,
      handleChange,
    };
  },
});
</script>

<style scoped lang="less">
</style>

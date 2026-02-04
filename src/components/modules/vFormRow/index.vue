<template>
  <view>
    <template v-for="(item, index) in rows" :key="index">
      <up-form-item
          v-if="
            (isNullOrUndefined(item.show) ? true : item.show) &&
            (isNullOrUndefined(item.hide) ? true : !item.hide)
          "
          :class="'form-item-' + item.type "
          :label="item.title"
          :prop="item.name"
          :rules="item.rule ? item.rule : []"
          :labelWidth="labelWidth"
          :required="formItemRequired(item)"
      >
        <view v-if="item.type === 'plain'">
          {{ formData[item.name] }}
        </view>
        <up-input
            v-else-if="item.type === 'text' || item.type === 'password' || item.type === 'number' || item.type === 'digit' || item.type === 'idcard' "
            :type="item.type"
            v-model="formData[item.name]"
            :placeholder="item.placeholder"
            :placeholderStyle="item.placeholderStyle"
            :clearable="item.clearable"
            :inputAlign="item.inputAlign"
            :fontSize="item.fontSize"
            :maxlength="item.maxlength"
            :disabled="item.disabled"
        ></up-input>
        <up-number-box
            v-else-if="item.type === 'numberBox'"
            v-model="formData[item.name]"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :intege="item.integer"
            :buttonWidth="!isNullOrUndefined(item.buttonWidth) ? item.buttonWidth : 30"
            :buttonSize="!isNullOrUndefined(item.buttonSize) ? item.buttonSize : 30"
            :color="!isNullOrUndefined(item.color) ? item.color : '#323233'"
            :inputBgColor="!isNullOrUndefined(item.inputBgColor) ? item.inputBgColor : '#EBECEE'"
            :bgColor="!isNullOrUndefined(item.bgColor) ? item.bgColor : '#EBECEE'"
            :disabled="item.disabled"
        ></up-number-box>
        <up-textarea
            v-else-if="item.type === 'textarea' || item.type ===  'editor' || item.type ===  'editorMini'"
            v-model="formData[item.name]"
            :placeholder="item.placeholder"
            :height="item.height ? item.height : 70"
            :autoHeight="item.autoHeight"
            :count="item.count"
            :maxlength="item.maxlength"
            :disabled="item.disabled"
        ></up-textarea>
        <up-radio-group
            v-else-if="item.type === 'radio'"
            v-model="formData[item.name]"
            :placement="item.placement"
            :shape="item.shape"
            :activeColor="item.activeColor"
            :inactiveColor="item.inactiveColor"
            :labelSize="item.labelSize"
            :labelColor="item.labelColor"
            :size="item.size"
            :borderBottom="item.borderBottom"
            :disabled="item.disabled"
        >
          <up-radio
              v-for="(listItem, index) in item.list"
              :key="listItem.key"
              :label="listItem.label"
              :name="listItem.key"
              :customStyle="{ margin: item.placement === 'column' ? '0 0 5px' : '10px', }"
          >
          </up-radio>
        </up-radio-group>
        <up-subsection
            v-else-if="item.type === 'radioButton'"
            :list="item.list"
            :fontSize="item.fontSize"
            keyName="label"
            mode="subsection"
            :current="item.current"
            @change="(index) => { radioButtonChange(item, index) }"
        ></up-subsection>
        <up-checkbox-group
            v-else-if="item.type === 'checkbox'"
            v-model="formData[item.name]"
            :placement="item.placement"
            :shape="item.shape"
            :activeColor="item.activeColor"
            :inactiveColor="item.inactiveColor"
            :labelSize="item.labelSize"
            :labelColor="item.labelColor"
            :size="item.size"
            :borderBottom="item.borderBottom"
            :disabled="item.disabled"
        >
          <up-checkbox
              v-for="(listItem, index) in item.list"
              :key="listItem.key"
              :label="listItem.label"
              :name="listItem.key"
              :customStyle="{ margin: item.placement === 'column' ? '0 0 10px 0' : '10px', }"
          >
          </up-checkbox>
        </up-checkbox-group>
        <vSelect
            v-else-if="item.type === 'select'"
            v-model="formData[item.name]"
            :placeholder="item.placeholder"
            :placeholderStyle="item.placeholderStyle"
            :list="item.list"
            :inputAlign="item.inputAlign"
            :fontSize="item.fontSize"
            :disabled="item.disabled"
            @confirm="(label, key, selectItem) => { selectConfirm(item, label, key, selectItem) }"
        ></vSelect>
        <up-datetime-picker
            v-else-if="item.type === 'time' || item.type === 'date' || item.type === 'datetime' || item.type === 'year' || item.type === 'month'"
            v-model="item.tmpVlaue"
            :placeholder="item.placeholder"
            :format="item.format"
            :mode="item.mode"
            hasInput
            :inputProps="{
							border: 'surround',
							shape: 'square',
							inputAlign: 'left',
							suffixIcon: 'calendar'
						}"
            :maxDate="item.maxDate"
            :minDate="item.minDate"
            :maxMinute="item.maxMinute"
            :minMinute="item.minMinute"
            :filter="item.filter"
            :visibleItemCount="item.visibleItemCount"
            :closeOnClickOverlay="item.closeOnClickOverlay"
            :itemHeight="item.itemHeight"
            @confirm="(value) => { upDatePickerConfirm(item, value) }"
        >
        </up-datetime-picker>
        <view v-else-if="item.type === 'dateRange' || item.type === 'datetimeRange' || item.type === 'yearRange' || item.type === 'monthRange'">

        </view>
        <view class="full-width" v-else-if="item.type === 'timeRange'">
          <up-datetime-picker
              class="mb10px"
              v-model="formData[item.names[0]]"
              :placeholder="!isNullOrUndefined(item.placeholder[0]) ? item.placeholder[0] : null"
              :format="item.format"
              :mode="item.mode"
              hasInput
              :inputProps="{
                border: 'surround',
                shape: 'square',
                inputAlign: 'left',
                suffixIcon: 'calendar'
              }"
              :closeOnClickOverlay="item.closeOnClickOverlay"
              :itemHeight="item.itemHeight"
              @confirm="(value) => { upDatePickerRangeConfirm(item, 'start', value) }"
          ></up-datetime-picker>
          <up-datetime-picker
              v-model="formData[item.names[1]]"
              :placeholder="!isNullOrUndefined(item.placeholder[1]) ? item.placeholder[1] : null"
              :format="item.format"
              :mode="item.mode"
              hasInput
              :inputProps="{
                border: 'surround',
                shape: 'square',
                inputAlign: 'left',
                suffixIcon: 'calendar'
              }"
              :closeOnClickOverlay="item.closeOnClickOverlay"
              :itemHeight="item.itemHeight"
              @confirm="(value) => { upDatePickerRangeConfirm(item, 'end', value) }"
          ></up-datetime-picker>
        </view>
        <up-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.name]"
            :space="!isNullOrUndefined(item.space) ? item.space : 2 "
            :activeColor="!isNullOrUndefined(item.activeColor) ? item.activeColor : '#f9ae3d'"
            :inactiveColor="!isNullOrUndefined(item.inactiveColor) ? item.inactiveColor : '#E6E6E6'"
            :activeValue="!isNullOrUndefined(item.activeValue) ? item.activeValue : true"
            :inactiveValue="!isNullOrUndefined(item.inactiveValue) ? item.inactiveValue : false"
            :disabled="item.disabled"
        >
        </up-switch>
        <imageUpload
            v-else-if="item.type === 'imageUpload'"
            :images="item.images"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :limit="item.limit"
            :imageWidth="item.imageWidth"
            :imageHeight="item.imageHeight"
            :uploadUrl="item.uploadUrl"
            :uploadKey="item.uploadKey"
            :uploadMethod="item.uploadMethod"
            :uploadHeaders="item.uploadHeaders"
            :uploadParams="item.uploadParams"
            :uploadAccepts="item.uploadAccepts"
            :uploadSize="item.uploadSize"
            @uploadChange="(file, files) => imageUploadChange(item, file, files)"
        ></imageUpload>
        <fileUpload
            v-else-if="item.type === 'fileUpload'"
            :files="item.files"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :limit="item.limit"
            :uploadUrl="item.uploadUrl"
            :uploadKey="item.uploadKey"
            :uploadMethod="item.uploadMethod"
            :uploadHeaders="item.uploadHeaders"
            :uploadParams="item.uploadParams"
            :uploadAccepts="item.uploadAccepts"
            :uploadSize="item.uploadSize"
            @uploadChange="(file, files) => fileUploadChange(item, file, files)"
        ></fileUpload>
      </up-form-item>
    </template>
  </view>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { isNullOrUndefined } from '@/utils/tools';
import dayjs from 'dayjs';
import imageUpload from '@components/modules/uploadLocal/imageUpload.vue';
import fileUpload from '@components/modules/uploadLocal/fileUpload.vue';

export default defineComponent({
  name: 'vFormRow',
  components: {
    imageUpload,
    fileUpload,
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
    labelWidth: {
      type: Number,
      default: 75,
      required: false,
    },
    span: {
      type: Number,
      required: false,
      default: 8,
    },
    onlyText: {
      type: Boolean,
      required: false,
      default: false,
    },
    aFormItemClass: {
      type: String,
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const rows = toRef(props, 'rows');
    const formData = toRef(props, 'formData');
    const labelWidth = toRef(props, 'labelWidth');
    const span = toRef(props, 'span');
    const onlyText = toRef(props, 'onlyText');
    const aFormItemClass = toRef(props, 'aFormItemClass');

    const spinning = ref(false);
    const spinningTime = ref(500);

    const datetimeFormat = {
      time: 'HH:mm',
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm',
      year: 'YYYY',
      month: 'YYYY-MM',
      timeRange: 'HH:mm',
      dateRange: 'YYYY-MM-DD',
      yearRange: 'YYYY',
      monthRange: 'YYYY-MM',
    }
    const datetimeMode = {
      time: 'time',
      date: 'date',
      datetime: 'datetime',
      year: 'year-month',
      month: 'year-month',
      timeRange: 'time',
      dateRange: 'date',
      yearRange: 'year-month',
      monthRange: 'year-month',
    }
    rows.value.map((item) => {
      if (
          item.type === 'time' || item.type === 'date' || item.type === 'datetime'
          || item.type === 'year' || item.type === 'month'
      ) {
        if (isNullOrUndefined(item.format)) {
          item.format = datetimeFormat[item.type];
        }
        if (isNullOrUndefined(item.mode)) {
          item.mode = datetimeMode[item.type];
        }
        if (!isNullOrUndefined(formData.value[item.name])) {
          item.tmpVlaue = dayjs(formData.value[item.name]).valueOf();
        }
      } else if (
          item.type === 'timeRange' || item.type === 'dateRange' || item.type === 'yearRange' || item.type === 'monthRange'
      ) {
        if (isNullOrUndefined(item.format)) {
          item.format = datetimeFormat[item.type];
        }
        if (isNullOrUndefined(item.mode)) {
          item.mode = datetimeMode[item.type];
        }
        if (!isNullOrUndefined(formData.value[item.name])) {
          if (item.type === 'timeRange'){
            formData.value[item.names[0]] = formData.value[item.name][0];
            formData.value[item.names[1]] = formData.value[item.name][1];
          } else {
            formData.value[item.names[0]] = dayjs(formData.value[item.name][0]).valueOf();
            formData.value[item.names[1]] = dayjs(formData.value[item.name][1]).valueOf();
          }
        }
      } else if (item.type === 'imageUpload') {
        if (isNullOrUndefined(item.valueSingle)) {
          item.valueSingle = false;
        }
      } else if (item.type === 'radioButton') {
        item.current = 0;

        if (!isNullOrUndefined(formData.value[item.name])) {
          let index = item.list.findIndex(one => one.key === formData.value[item.name]);
          if (index >= 0) {
            item.current = index;
          }
        }
      }
    })

    const startSpinning = () => {
      spinning.value = true;
    };

    const stopSpinning = () => {
      spinning.value = false;
    };

    const formItemRequired = (formItem) => {
      let required = false;
      if (formItem.rule && formItem.rule.length > 0) {
        for (const item of formItem.rule) {
          if (item.required) {
            required = true;
            break;
          }
        }
      }

      return required;
    }

    const selectConfirm = (item, label, key, selectItem) => {
      // console.log(selectItem)
    }

    const upDatePickerConfirm = (item, value) => {
      // console.log(value)
      // console.log(item.tmpVlaue);

      item.tmpVlaue = value.value;

      let formatValue;

      if (item.type === 'time') {
        formatValue = value.value;
      } else {
        formatValue = dayjs(value.value).format(item.format);
      }

      formData.value[item.name] = formatValue;

      context.emit('update:formData', formData);
    }

    const upDatePickerRangeConfirm = (item, type, value) => {
      // console.log(value)
      // console.log(item.tmpVlaue);
      let formatValue;

      if (item.type === 'timeRange') {
        formatValue = value.value;
      } else {
        formatValue = dayjs(value.value).format(item.format);
      }

      if (type === 'start') {
        formData.value[item.name][0] = formatValue;
      } else {
        formData.value[item.name][1] = formatValue;
      }

      context.emit('update:formData', formData);
    }

    const radioButtonChange = (item, index) => {
      formData.value[item.name] = item.list[index].key;
    }

    const imageUploadChange = (item, file, files) => {
      if (item.valueSingle) {
        formData.value[item.name] = '';
        if (file) {
          formData.value[item.name] = file.value;
        }
      } else {
        formData.value[item.name] = [];
        if (files.length > 0) {
          formData.value[item.name] = files.map(fileItem => fileItem.value);
        }
      }

      context.emit('update:formData', formData);

      if (item.changeEvent) {
        context.emit(item.changeEvent.name, item, file, files);
      }
    };

    const fileUploadChange = (item, file, files) => {
      if (item.valueSingle) {
        formData.value[item.name] = '';
        if (file) {
          formData.value[item.name] = file.value;
        }
      } else {
        formData.value[item.name] = [];
        if (files.length > 0) {
          formData.value[item.name] = files.map(fileItem => fileItem.value);
        }
      }

      context.emit('update:formData', formData);

      if (item.changeEvent) {
        context.emit(item.changeEvent.name, item, file, files);
      }
    };

    return {
      isNullOrUndefined,
      rows,
      formData,
      labelWidth,
      span,
      onlyText,
      aFormItemClass,
      startSpinning,
      stopSpinning,
      formItemRequired,
      selectConfirm,
      upDatePickerConfirm,
      upDatePickerRangeConfirm,
      radioButtonChange,
      imageUploadChange,
      fileUploadChange,
    };
  },
});
</script>

<style src="./index.less" lang="less" scoped></style>

<style scoped lang="less">
</style>

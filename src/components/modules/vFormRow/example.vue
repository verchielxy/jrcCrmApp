<template>
  <div>
    <a-form :model="formData" ref="formRef">
      <vFormRow
        :rows="formRows.one"
        v-model:formData="formData"
        :labelWidth="80"
        :span="12"
        :onlyText="false"
      ></vFormRow>
    </a-form>
  </div>
</template>


<script>
  import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
  import { useStore } from 'vuex';
  import vFormRow from "@components/modules/vFormRow";

  export default defineComponent({
    components: {
      vFormRow,
    },
    props: {
    },
    setup(props, context) {
      const { proxy } = getCurrentInstance();
      const store = useStore();

      const test = ref(1);

      const formRows = ref({
        one: [
          {
            title: '文本框',
            placeholder: '文本框',
            type: 'text',
            name: 'inputText',
            show: computed(() => test.value === 1),
            hide: computed(() => test.value === 1),
            rule: [
              { required: true, message: '这里需要填写' },
            ],
          },
          {
            title: '密码框',
            placeholder: '密码框',
            type: 'password',
            name: 'inputPassword',
            span: 24,
            rule: [
              { required: true, message: '这里需要填写' },
            ],
            hide: true,
          },
          {
            title: '年月日',
            placeholder: '年月日',
            type: 'date',
            name: 'inputDate',
          },
          {
            title: '选择框',
            placeholder: '选择框',
            type: 'select',
            name: 'inputSelect',
            list: [],
            mode: 'multiple',
            maxTagCount: 'responsive',
          },
          {
            placeholder: ['请输入开始时间','请输入结束时间'],
            type: 'dateLimitRange',
            name: 'time',
            limit: 7,
            allowClear: false,
            allowDate: 'past',
          },
          {
            title: '单选',
            placeholder: '单选',
            type: 'radio',
            name: 'inputRadio',
            list: [],
          },
          {
            title: '多选框',
            placeholder: '多选框',
            type: 'checkbox',
            name: 'inputCheckbox',
            list: [],
          },
          {
            title: '单选按钮',
            placeholder: '单选按钮',
            type: 'radioButton',
            name: 'inputRadioButton',
            list: [],
          },
          {
            title: '开关',
            type: 'switch',
            name: 'switch',
            checkedValue: 1,
            unCheckedValue: 0,
          },
          {
            title: '文本域',
            placeholder: '文本域',
            type: 'textarea',
            name: 'inputTextarea',
          },
          {
            title: '富文本编辑器',
            placeholder: '富文本编辑器',
            type: 'editor', // editor || editorSimple || editorMini
            name: 'inputEditor',
            config: {},
          },
          {
            title: '单个图片上传',
            placeholder: '单个图片上传',
            type: 'imageSingleUpload',
            name: 'inputImageSingleUpload',
            span: 24,
            image: {
              url: '/1.jpg',
              value: '/1.jpg'
            },
          },
          {
            title: '自定义',
            placeholder: '自定义',
            type: 'slot',
            name: 'mySlot',
          },
          {
            title: '图片上传',
            placeholder: '图片上传',
            type: 'imageUpload',
            name: 'inputImageUpload',
            span: 24,
            images: [
              {
                url: '/1.jpg',
                value: '/1.jpg',
              },
            ],
            limit: 2,
            valueSingle: false,
            uploadAccepts: ['jpg','png','gif','webp'],
          },
          {
            title: '文件上传',
            placeholder: '请上传文件',
            type: 'fileUpload',
            name: 'inputFileUpload',
            span: 24,
            files: [
              {
                url: '/1.text',
                value: '/1.text',
              },
              {
                url: '/2.doc',
                value: '/2.doc',
              },
            ],
            limit: 5,
            valueSingle: true,
            uploadAccepts: ['xls','xlsx','doc','docx'],
          },
        ],
      });
      const formData = ref({});
      const formRef = ref();

      return {
        formRows,
        formData,
        formRef,
      };
    },
  });
</script>

<style scoped lang="less">
</style>

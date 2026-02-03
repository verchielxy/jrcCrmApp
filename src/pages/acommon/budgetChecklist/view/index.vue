<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">预算清单详情</u-title>
      <vViewRow
          :rows="viewRows"
          v-model:formData="target"
          labelWidth="105px"
          size="small"
          class="mb20px"
      >
      </vViewRow>
    </view>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">产品清单</u-title>
      <view class="p10px" v-if="tableData.length > 0">
        <u-table2
            :data="tableData"
            :columns="tableColumns"
            stripe
            border
        >
        </u-table2>
      </view>
      <view class="center px10px py3em" v-else>
        没有产品
      </view>
    </view>
  </uContainer>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import dataTableColumns from '../data/tableColumns';

export default defineComponent({
  components: {
  },
  props: {
    api: {
      type: Object,
      required: true,
    },
    api2: {
      type: Object,
      required: true,
    },
    targetId: {
      type: [Number, String],
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = props.api;
    const api2 = props.api2;
    const targetId = toRef(props, 'targetId');

    const loading = ref(false);
    const target = ref();
    const viewRows = ref([
      {
        title: '项目名称',
        type: 'text',
        name: 'projectName',
      },
      {
        title: '项目类型',
        type: 'text',
        name: 'projectTypeText',
      },
      {
        title: '项目评级',
        type: 'text',
        name: 'projectGradeText',
      },
      {
        title: '客户',
        type: 'text',
        name: 'customName',
      },
    ]);

    const tableColumns = ref(dataTableColumns);
    const tableData = ref([]);
    const tableDataPagination = reactive({
      page: 1,
      size: -1,
      total: 0,
    });

    const loadTarget = () => {
      loading.value = true;

      target.value = uni.getStorageSync('TEMP_DETAIL');

      getTableData();
    }

    const getTableData = () => {
      api2.get(tableDataPagination.page, tableDataPagination.size, {}, targetId.value).then((res) => {
        const json = res.result;

        tableData.value = json.records;
        tableDataPagination.total = res.total;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    onMounted(() => {
      loadTarget();
    });

    onLoad((options) => {
    })

    return {
      api,
      api2,
      targetId,
      loading,
      target,
      viewRows,
      tableColumns,
      tableData,
    };
  },
});
</script>

<style scoped lang="less">
</style>

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
            :showOverflowTooltip="false"
            @row-click="handleRowClick"
        >
          <template #cell="{ row, index, column }">
            <text v-if="column.key === 'goodsName'">
              {{ row.goodsName }}
            </text>
            <text v-else>
              {{ row[column.key] }}
            </text>
          </template>
        </u-table2>
      </view>
      <view class="center px10px py3em" v-else>
        没有产品
      </view>
    </view>

    <view class="operation-box bg-white p20px">
      <up-button type="success" @click="handleRowAdd">新增产品</up-button>
    </view>

    <up-popup
        v-model:show="modalShow"
        :round="5"
        :closeable="true"
        :zIndex="99"
        mode="bottom"
        @close="modalShow = false"
    >
      <view class="center p10px font16px mt5px">
        {{ modalItem ? '编辑':'新增' }}产品
      </view>

      <blockForm
        :api="api2"
        :budgetId="targetId"
        :budget="target"
        :targetId="modalItem?.id"
      ></blockForm>
    </up-popup>
  </uContainer>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import dataTableColumns from '../data/tableColumns';
import blockForm from "./blockForm.vue";

export default defineComponent({
  components: {
    blockForm,
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
    const modalShow = ref(false);
    const modalItem = ref();

    const loadTarget = () => {
      loading.value = true;

      target.value = uni.getStorageSync('TEMP_DETAIL');

      getTableData();
    }

    const getTableData = (callback) => {
      api2.get(tableDataPagination.page, tableDataPagination.size, {}, targetId.value).then((res) => {
        const json = res.result;

        tableData.value = json.records;
        tableDataPagination.total = res.total;

      }).finally(() => {
        if (callback) {
          callback();
        }
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    };

    const handleRowAdd = () => {
      modalItem.value = undefined;
      modalShow.value = true;
    };

    const handleRowClick = (record) => {
      modalItem.value = record;
      modalShow.value = true;
    };

    const submitCallback = () => {
      tableDataPagination.page = 1;
      tableDataPagination.total = 0;
      tableData.value = [];
      getTableData(() => {
        modalShow.value = false;
      });
    }

    onMounted(() => {
      loadTarget();

      uni.$on('SUBMIT_SUCCESS', submitCallback);
    });

    onLoad((options) => {
      uni.$off('SUBMIT_SUCCESS', submitCallback);
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
      modalShow,
      modalItem,
      handleRowAdd,
      handleRowClick,
    };
  },
});
</script>

<style scoped lang="less">
.operation-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: #eee solid 1px;
}

:deep(.u-table-cell) {
  // height: 80px;
  // /* 2. 核心：开启换行 */
  // white-space: normal !important;
  // word-break: break-all !important;
  //
  // /* 3. 调整对齐 */
  // display: flex;
  // align-items: center;
  // height: auto !important; /* 确保行高能被文字撑开 */
  // padding: 10rpx 4rpx !important;
}
:deep(.u-table-cell uni-view) {
  // white-space: normal !important;
  // word-break: break-all !important;

}
</style>

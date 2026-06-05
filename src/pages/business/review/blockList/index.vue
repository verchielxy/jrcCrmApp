<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-search
          placeholder="请输入审批标题"
          v-model="searchParams.title"
          :clearabled="true"
          @search="handleSearch"
          @custom="handleSearch"
      ></up-search>
    </view>

    <view class="list-box p10px">
      <up-list
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index">
          <view class="data-item bg-white p10px radius3px">
            <view class="float-right-bottom">
              <up-button type="primary" size="small" @click="handleClick(item)">查看详情</up-button>
            </view>
            <view class="mb10px ">
              <text class="font16px">{{ item.title }}</text>

              <view class="pull-right">
                <up-tag plain size="mini" text="标签" v-if="item.flowStatus === '0'">待提交</up-tag>
                <up-tag plain size="mini" text="标签" v-if="item.flowStatus === '1'">审批中</up-tag>
                <up-tag plain size="mini" text="标签" type="success" v-if="item.flowStatus === '2'">审批通过</up-tag>
                <up-tag plain size="mini" text="标签" type="error" v-if="item.flowStatus === '4'">终止</up-tag>
                <up-tag plain size="mini" text="标签" type="error" v-if="item.flowStatus === '5'">作废</up-tag>
                <up-tag plain size="mini" text="标签" type="warning" v-if="item.flowStatus === '6'">撤销</up-tag>
                <up-tag plain size="mini" text="标签" type="success" v-if="item.flowStatus === '8'">已完成</up-tag>
                <up-tag plain size="mini" text="标签" type="warning" v-if="item.flowStatus === '9'">已退回</up-tag>
                <up-tag plain size="mini" text="标签" type="warning" v-if="item.flowStatus === '10'">失效</up-tag>
                <up-tag plain size="mini" text="标签" v-if="item.flowStatus === '11'">拿回</up-tag>
              </view>
            </view>

            <view class="data-item-line">
              <text>审批类型：</text>{{ item.categoryName }}审批
            </view>

            <view class="data-item-line" v-for="(row, rowIndex) in item.listRows" :key="rowIndex">
              <text>{{ row.label }}：</text>{{ row.value }}
            </view>
          </view>
        </up-list-item>

        <up-loadmore class="py20px" :status="pagination.status" @loadmore="loadmore" />
      </up-list>
    </view>
  </uPage>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import jumpTo from '@utils/jumpTo';

export default defineComponent({
  components: {
  },
  props: {
    apiGet: {
      type: Object,
      required: true,
    },
    viewUrl: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const apiGet = props.apiGet;
    const viewUrl = props.viewUrl;

    const loading = ref(false);
    const searchParams = ref({
      title: undefined,
    });
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
      status: 'loadmore',
    });
    const data = ref([]);

    const getData = () => {
      pagination.status = 'loading';

      apiGet(pagination.page, pagination.size, searchParams.value).then((res) => {
        const json = res.result;

        if (json.records.length > 0) {
          const records = json.records.map((item) => {
            const summaryObj = item.summary ? JSON.parse(item.summary) : {};
            const cardFieldsArr = item.cardFields ? JSON.parse(item.cardFields) : [];
            const detailFieldsArr = item.detailFields ? JSON.parse(item.detailFields) : [];

            const addValue = (fieldsArr) => {
              return fieldsArr.map(field => ({
                ...field,
                value: summaryObj[field.key] ?? null
              }));
            }

            return {
              ...item,
              listRows: addValue(cardFieldsArr),
              viewRows: addValue(detailFieldsArr),
              valueData: summaryObj,
            }
          });
          data.value.push(...records);
        }

        if (json.records.length >= pagination.size) {
          pagination.page ++;
          pagination.status = 'loadmore';
        } else if (json.records.length < pagination.size) {
          pagination.done = true;
          pagination.status = 'nomore';
        }

        pagination.total = json.total;

      }).catch((error) => {
        loading.value = false;
        pagination.status = 'loadmore';
      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const loadmore = () => {
      if (!pagination.done) {
        getData();
      }
    }

    const onRefresh = () => {
      pagination.page = 1;
      pagination.done = false;
      pagination.status = 'loadmore';
      data.value = [];
      getData();
    }

    const handleSearch = () => {
      onRefresh()
    }

    const handleClick = (item) => {

      store.commit('setCurrentItem', item)
      uni.setStorageSync('currentItem', JSON.stringify(item));

      jumpTo({
        url: viewUrl,
        params: {
          id: item.id,
        }
      })
    }

    onMounted( () => {
      loading.value = true;
      getData();

      uni.$on('REFRESH_LIST', onRefresh);
    });

    onUnmounted(() => {
      uni.$off('REFRESH_LIST', onRefresh)
    })

    return {
      loading,
      searchParams,
      pagination,
      data,
      loadmore,
      onRefresh,
      handleSearch,
      handleClick,
    };
  },
});
</script>

<style scoped lang="less">
.data-item {
  position: relative;

  .data-item-line {
    margin-bottom: 10px;
  }
  .data-item-line:last-child {
    margin-bottom: 0;
  }
  .float-right-bottom {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}

</style>

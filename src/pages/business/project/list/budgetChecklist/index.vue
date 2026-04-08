<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-row :gutter="20" class="mb10px">
        <up-col :span="8">
          项目：<text v-if="target">{{ target.name }}</text>
        </up-col>
        <up-col :span="4">
          <up-button size="small" type="primary" @click="handleCreate">发起请求</up-button>
        </up-col>
      </up-row>

      <up-row :gutter="20">
        <up-col :span="8">
          预算总价格：<text v-if="target">0 元</text>
        </up-col>
        <up-col :span="4">
          <up-button size="small" type="primary" @click="handleOpenModal">查看请求 ({{ pagination2.total }})</up-button>
        </up-col>
      </up-row>
    </view>

    <view class="list-box p10px">
      <up-list
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index">
          <view class="data-item bg-white radius3px">
            <view class="p10px relative">
              <view class="data-item-line">
                <text>产品名称：</text>{{ item.goodsName }}
              </view>
              <view class="data-item-line">
                <text>规格参数：</text>{{ item.goodsSpec }}
              </view>
              <view class="data-item-line">
                <text>产品型号：</text>{{ item.goodsModel }}
              </view>
              <view class="data-item-line">
                <text>数量：</text> {{ item.amount }}
              </view>
              <view class="data-item-line">
                <text>单价：</text> {{ item.salePrice }}
              </view>
              <view class="data-item-line">
                <text>总价：</text> {{ item.totalMoney }}
              </view>
              <view class="data-item-line">
                <text>部门：</text> {{ item.typeText }}
              </view>
              <view class="data-item-line">
                <text>创建信息：</text>  {{ item.createBy?.name }} {{ item.createTime }}
              </view>
              <view class="data-item-line">
                <text>报价信息：</text> {{ item.offerBy?.name }} {{ item.offerTime }}
              </view>
            </view>
          </view>
        </up-list-item>

        <up-loadmore class="py20px" :status="pagination.status" @loadmore="loadmore" />
      </up-list>
    </view>
  </uPage>

  <up-modal
      :show="modalShow"
      :showConfirmButton="false"
      :showCancelButton="true"
      cancelText="关闭"
      @cancel="modalShow = false"
  >
    <view class="full-width">
      <view class="mb5px" v-for="(item, index) in data2" :key="index">
        <text>{{ item.createTime }}</text>
        <up-tag class="ml5px" :text="item2.label" size="mini" type="success" v-for="(item2) in item.types"></up-tag>
      </view>
    </view>
  </up-modal>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import authentication from "@/authentication";
import jumpTo from "@utils/jumpTo";

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();

    const id = ref();

    const loading = ref(false);
    const api = proxy.$api.projectBudgetItem;
    const api2 = proxy.$api.projectBudget;
    const target = ref();
    const searchParams = ref({
      projectId: computed(() => { return id.value; }),
      name: undefined,
    });
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
      status: 'loadmore',
    });
    const data = ref([]);

    const modalShow = ref(false);
    const searchParams2 = ref({
      projectId: computed(() => { return id.value; }),
    });
    const pagination2 = reactive({
      page: 1,
      size: 9999,
      total: 0,
    });
    const data2 = ref([]);

    const loadTarget = () => {
      proxy.$api.project.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        getData();
        getData2();

      }).catch((error) => {
        loading.value = false;
      });
    }

    const getData = () => {
      // loading.value = true;
      pagination.status = 'loading';

      if (!loading.value) {
        uni.showLoading({
          title: '正在加载',
          mask: true
        });
      }

      api.get(pagination.page, pagination.size, searchParams.value).then((res) => {
        const json = res.result;

        if (json.records.length > 0) {
          data.value.push(...json.records);
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
          uni.hideLoading();
          loading.value = false;
        }, 500);
      });
    }

    const getData2 = () => {

      api2.get(pagination2.page, pagination2.size, searchParams2.value).then((res) => {
        const json = res.result;

        json.records.map((item)=>{
          item.types = item.types.split(',').map(function (typeId) {
            return proxy.$constant.convertItem(proxy.$constant.BUSINESS.DEPARTMENTS, typeId);
          });
        })

        data2.value = json.records;

        pagination2.total = json.total;

      }).catch((error) => {

      }).finally(() => {

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

    const handleCreate = () => {
      jumpTo({
        url: '/pages/business/project/list/budgetChecklist/create',
        params: {
          projectId: id.value,
        }
      })
    }

    const handleOpenModal = () => {
      modalShow.value = true;
    }

    onMounted(() => {
      loading.value = true;
      loadTarget();

      uni.$on('REFRESH_LIST', onRefresh);

      uni.$on('UPDATE_LIST_ITEM', (params) => {
        const index = data.value.findIndex(item => item.id === params.id);
        if (index !== -1) {
          // data.value[index] = { ...params.newData };
          onRefresh();
        }
      });
    });

    onUnmounted(() => {
      uni.$off('REFRESH_LIST', onRefresh);

      uni.$off('UPDATE_LIST_ITEM');
    })

    onLoad((options) => {
      id.value = options.id;
    })

    return {
      id,
      api,
      api2,
      loading,
      target,
      searchParams,
      pagination,
      data,
      modalShow,
      searchParams2,
      pagination2,
      data2,
      loadmore,
      onRefresh,
      handleSearch,
      handleCreate,
      handleOpenModal,
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
    right: 5px;
    bottom: 5px;
  }
}

.c-default {
  color: #aaa;
}
</style>

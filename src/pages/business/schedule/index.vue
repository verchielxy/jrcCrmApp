<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-row :gutter="20">
        <up-col :span="9">
          <up-search
              placeholder="请输入项目名称"
              v-model="searchParams.projectName"
              :clearabled="true"
              @search="handleSearch"
              @custom="handleSearch"
          ></up-search>
        </up-col>
        <up-col :span="3">
          <up-button size="small" type="primary" @click="handleCreate">创建日程</up-button>
        </up-col>
      </up-row>
    </view>

    <view class="list-box p10px">
      <up-list
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index" @click="handleView(item)">
          <view class="data-item bg-white p10px radius3px">
            <view class="float-right-bottom" v-if="scheduleConfig.canOperate(item, user)">
              <view @tap.stop>
                <up-row :gutter="5">
                  <up-col :span="6">
                    <up-button type="primary" size="small" @click="handleUpdate(item)">编辑</up-button>
                  </up-col>
                  <up-col :span="6">
                    <up-button type="primary" size="small" @click="handleUpdateFlow(item)">记录</up-button>
                  </up-col>
                </up-row>
              </view>
            </view>

            <view class="mb10px font17px">
              {{ scheduleConfig.title(item) }}
            </view>

            <view class="data-item-line">
              <text>日程类型：</text>
              <u-tag v-if="item.category === 'customer'" plain>{{ item.categoryText }}</u-tag>
              <u-tag v-if="item.category === 'project'" plain type="success">{{ item.categoryText }}</u-tag>
              <u-tag v-if="item.category === 'customize'" plain type="warning">{{ item.categoryText }}</u-tag>
            </view>
            <view class="data-item-line">
              <text>日程日期：</text>{{ item.flowDate }}
            </view>
            <view class="data-item-line">
              <text>日程时间：</text>{{ item.startTime }} ~ {{ item.endTime }}
            </view>
            <view class="data-item-line">
              <text>创建人：</text>{{ item.createByName }}
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
import scheduleConfig from '@/config/business/schedule';
import authentication from '@/authentication';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();

    const loading = ref(false);
    const api = proxy.$api.schedule;
    const searchParams = ref({
      projectName: undefined,
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
        url: '/pages/business/schedule/create',
      })
    }

    const handleUpdate = (item) => {
      jumpTo({
        url: '/pages/business/schedule/update',
        params: {
          id: item.id,
        }
      })
    }

    const handleUpdateFlow = (item) => {
      jumpTo({
        url: '/pages/business/schedule/flow',
        params: {
          id: item.id,
        }
      })
    }

    const handleView = (item) => {
      jumpTo({
        url: '/pages/business/schedule/view',
        params: {
          id: item.id,
        }
      })
    }

    onMounted( () => {
      loading.value = true;
      getData();

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

    return {
      scheduleConfig,
      user,
      loading,
      searchParams,
      pagination,
      data,
      loadmore,
      onRefresh,
      handleSearch,
      handleCreate,
      handleUpdate,
      handleUpdateFlow,
      handleView,
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

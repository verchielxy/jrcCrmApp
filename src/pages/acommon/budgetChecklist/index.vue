<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-search
          placeholder="请输入项目名称"
          v-model="searchParams.projectName"
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
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index" @click="handleView(item)">
          <view class="data-item bg-white radius3px">
            <view class="p10px relative">
              <view class="float-right-bottom">
                <view @tap.stop>
                  <up-button type="primary" size="small" @click="handleUpdate(item)">清单产品</up-button>
                </view>
              </view>

              <view class="mb10px font17px">
                {{ item.projectName }}
              </view>
              <view class="data-item-line">
                <text>项目类型：</text>{{ item.projectTypeText }}
              </view>
              <view class="data-item-line">
                <text>项目评级：</text>{{ item.projectGradeText }}
              </view>
              <view class="data-item-line">
                <text>客户：</text>{{ item.customName }}
              </view>
              <view class="data-item-line">
                <text>清单产品数量：</text>{{ item.productNum }}
              </view>
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
import authentication from '@/authentication';

export default defineComponent({
  components: {
  },
  props: {
    api: {
      type: Object,
      required: true,
    },
    updateUrl: {
      type: String,
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

    const user = authentication.user();

    const api = props.api;
    const updateUrl = toRef(props, 'updateUrl');
    const viewUrl = toRef(props, 'viewUrl');

    const loading = ref(false);
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

    const handleUpdate = (item) => {
      uni.setStorageSync('TEMP_DETAIL', item);

      jumpTo({
        url: updateUrl.value,
        params: {
          id: item.id,
        },
      })
    }

    const handleView = (item) => {
      uni.setStorageSync('TEMP_DETAIL', item);

      jumpTo({
        url: viewUrl.value,
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
      user,
      api,
      updateUrl,
      viewUrl,
      loading,
      searchParams,
      pagination,
      data,
      loadmore,
      onRefresh,
      handleSearch,
      handleUpdate,
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
    right: 5px;
    bottom: 5px;
  }
}
</style>

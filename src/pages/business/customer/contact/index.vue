<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-row :gutter="20">
        <up-col :span="9">
          <up-search
              placeholder="请输入姓名"
              v-model="searchParams.contactsName"
              :clearabled="true"
              @search="handleSearch"
              @custom="handleSearch"
          ></up-search>
        </up-col>
        <up-col :span="3">
          <up-button size="small" type="primary" @click="handleCreate">创建联系人</up-button>
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
            <view class="float-right-bottom">
              <view @tap.stop>
                <up-row :gutter="10">
                  <up-col :span="6">
                    <up-button type="error" size="small" @click="handleDelete(item)">删除</up-button>
                  </up-col>
                  <up-col :span="6">
                    <up-button type="primary" size="small" @click="handleUpdate(item)">编辑</up-button>
                  </up-col>
                </up-row>
              </view>
            </view>

            <view class="mb10px font17px">
              {{ item.contactsName }}
            </view>

            <view class="data-item-line">
              <text>客户：</text>{{ item.customName }}
            </view>
            <view class="data-item-line">
              <text>电话：</text>{{ item.phone }}
            </view>
            <view class="data-item-line">
              <text>部门：</text>{{ item.department }}
            </view>
            <view class="data-item-line">
              <text>职务：</text> {{ item.position }}
            </view>
            <view class="data-item-line">
              <text>微信：</text> {{ item.wechat }}
            </view>
            <view class="data-item-line">
              <text>QQ：</text> {{ item.qq }}
            </view>
            <view class="data-item-line">
              <text>关键决策人：</text> {{ item.decisionMakerText }}
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
import projectConfig from '@/config/business/project';
import authentication from '@/authentication';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();

    const loading = ref(false);
    const api = proxy.$api.customerContact;
    const searchParams = ref({
      contactsName: undefined,
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
        url: '/pages/business/customer/contact/create',
      })
    }

    const handleUpdate = (item) => {
      jumpTo({
        url: '/pages/business/customer/contact/update',
        params: {
          id: item.id,
        }
      })
    }

    const handleView = (item) => {
      jumpTo({
        url: '/pages/business/customer/contact/view',
        params: {
          id: item.id,
        }
      })
    }

    const handleDelete = (item) => {
      uni.showModal({
        title: '是否删除',
        content: '确认删除该条数据吗？',
        confirmColor: '#2979ff',
        success: (res) => {
          if (res.confirm) {
            // 调用后端接口
            uni.showLoading({
              title: '正在删除...',
              zIndex: 999,
              mask: true
            });

            api.delete(item.id).then((res) => {

              setTimeout(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '删除成功',
                  icon: 'success', // 显示绿色的勾
                  duration: 1500,
                  mask: true,
                  success: () => {
                    onRefresh();
                  }
                });
              }, 1000);

            }).catch((error) => {
              uni.hideLoading();
            }).finally(() => {
            });
          }
        }
      });
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
      projectConfig,
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
      handleView,
      handleDelete,
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

<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-row :gutter="20">
        <up-col :span="8">
          <up-search
              placeholder="请输入部门名称"
              v-model="searchParams.name"
              :clearabled="true"
              @search="handleSearch"
              @custom="handleSearch"
          ></up-search>
        </up-col>
        <up-col :span="4">
          <up-button size="small" type="primary" @click="handleCreate">新建技术支持</up-button>
        </up-col>
      </up-row>
    </view>

    <view class="list-box p10px">
      <up-list
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index" @click="handleView(item)">
          <view class="data-item bg-white radius3px">
            <view class="p10px relative">
              <view class="data-item-line">
                <text>部门：</text>{{ item.typeText }}
              </view>
              <view class="data-item-line">
                <text>要求日期：</text>{{ item.supportDate }}
              </view>
              <view class="data-item-line">
                <text>支持人：</text>{{ item.supportUserName }}
              </view>
              <view class="data-item-line">
                <text>支持时间：</text> {{ item.replyDate }}
              </view>
              <view class="data-item-line">
                <text>状态：</text>
                <text :class="'c-' + item.statusConstant.badge" v-if="item.statusConstant">
                  {{ item.statusConstant.label }}
                </text>
              </view>
            </view>

            <view @tap.stop v-if="item.status === 0">
              <up-row :gutter="5">
                <up-col :span="4">
                  <up-button type="error" size="small" @click="handleDelete(item)">删除</up-button>
                </up-col>
                <up-col :span="4">
                  <up-button type="primary" size="small" @click="handleUpdate(item)">编辑</up-button>
                </up-col>
                <up-col :span="4">
                  <up-button type="success" size="small" @click="handlePush(item)">发布</up-button>
                </up-col>
              </up-row>
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
    const api = proxy.$api.projectSupport;
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

    const loadTarget = () => {
      proxy.$api.project.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        getData();

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
        url: '/pages/business/project/list/support/create',
        params: {
          projectId: id.value,
        }
      })
    }

    const handleUpdate = (item) => {
      jumpTo({
        url: '/pages/business/project/list/support/update',
        params: {
          projectId: id.value,
          id: item.id,
        }
      })
    }

    const handleView = (item) => {
      jumpTo({
        url: '/pages/business/project/list/support/view',
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

    const handlePush = (item) => {
      uni.showModal({
        title: '是否发布',
        content: '确认发布该记录吗？',
        confirmColor: '#2979ff',
        success: (res) => {
          if (res.confirm) {
            // 调用后端接口
            uni.showLoading({
              title: '正在提交...',
              mask: true
            });

            api.push(item.id).then((res) => {
              let json = res.result;

              uni.hideLoading();

              uni.showToast({
                title: '保存成功',
                icon: 'success', // 显示绿色的勾
                duration: 2000,
                success: () => {
                  // 如果需要保存后返回上一页，可以在这里写逻辑
                  onRefresh();
                }
              });
            }).catch((error) => {
            }).finally(() => {
            });
          }
        }
      });
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
      loading,
      target,
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
      handlePush,
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

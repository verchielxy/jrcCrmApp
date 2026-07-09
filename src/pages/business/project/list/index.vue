<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-row :gutter="20">
        <up-col :span="9">
          <up-search
              placeholder="请输入项目名称"
              v-model="searchParams.name"
              :clearabled="true"
              @search="handleSearch"
              @custom="handleSearch"
          ></up-search>
        </up-col>
        <up-col :span="3">
          <up-button size="small" type="primary" @click="handleCreate">创建项目</up-button>
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
              <view class="mb10px font17px">
                {{ item.name }}
              </view>

              <view class="data-item-line">
                <text>项目类型：</text>{{ item.typeText }}
              </view>
              <view class="data-item-line">
                <text>项目评级：</text>{{ item.gradeText }}
              </view>
              <view class="data-item-line">
                <text>客户名称：</text>{{ item.customName }}
              </view>
              <view class="data-item-line">
                <text>联系人姓名：</text> {{ item.contactsName }}
              </view>
              <view class="data-item-line">
                <text>联系人电话：</text> {{ item.contactsPhone }}
              </view>
              <view class="data-item-line">
                <text>负责人：</text> {{ item.headUserName }}
              </view>
              <view class="data-item-line">
                <text>状态：</text>
                <text :class="'c-' + item.statusConstant.badge" v-if="item.statusConstant">
                  {{ item.statusConstant.label }}
                </text>
              </view>
            </view>

            <view @tap.stop>
              <up-row class="mb10px" :gutter="5">
                <up-col :span="3">
                  <up-button type="error" size="small" @click="handleDelete(item)">删除</up-button>
                </up-col>
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleSupport(item)" :disabled="!projectConfig.canSupport(item.status)">技术支持</up-button>
                </up-col>
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleBudgetChecklist(item)" :disabled="!projectConfig.canBudgetChecklist(item.status)">预算清单</up-button>
                </up-col>
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleUpdate(item)">编辑</up-button>
                </up-col>
              </up-row>

              <up-row :gutter="5">
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleContract(item)" :disabled="!projectConfig.canContract(item.status)">销售合同上传</up-button>
                </up-col>
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleTechnology(item)" :disabled="!projectConfig.canTechnology(item.status, item)">技术协议上传</up-button>
                </up-col>
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleConstruction(item)" :disabled="!projectConfig.canConstruction(item.status)">施工转接上传</up-button>
                </up-col>
                <up-col :span="3">
                  <up-button type="primary" size="small" @click="handleUndeveloped(item)" :disabled="!projectConfig.canSettlement(item.status, item.financeSettlementEnd, item.settlementStatus)">项目决算</up-button>
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
    const api = proxy.$api.project;
    const searchParams = ref({
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
        url: '/pages/business/project/list/create',
      })
    }

    const handleUpdate = (item) => {
      jumpTo({
        url: '/pages/business/project/list/update',
        params: {
          id: item.id,
        }
      })
    }

    const handleView = (item) => {
      jumpTo({
        url: '/pages/business/project/list/view/index',
        params: {
          id: item.id,
        }
      })
    }

    const handleSupport = (item) => {
      // uni.showToast({
      //   title: '该功能暂未上线，请去pc端操作...',
      //   icon: 'none',
      //   duration: 2000
      // });

      jumpTo({
        url: '/pages/business/project/list/support/index',
        params: {
          id: item.id,
        }
      })
    }

    const handleBudgetChecklist = (item) => {
      // uni.showToast({
      //   title: '该功能暂未上线，请去pc端操作...',
      //   icon: 'none',
      //   duration: 2000
      // });

      jumpTo({
        url: '/pages/business/project/list/budgetChecklist/index',
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

    const handleContract = (item) => {
      jumpTo({
        url: '/pages/business/project/list/contract',
        params: {
          id: item.id,
        }
      })
    }

    const handleTechnology = (item) => {
      jumpTo({
        url: '/pages/business/project/list/technology',
        params: {
          id: item.id,
        }
      })
    }

    const handleConstruction = (item) => {
      jumpTo({
        url: '/pages/business/project/list/construction',
        params: {
          id: item.id,
        }
      })
    }

    const handleUndeveloped = (item) => {
      uni.showToast({
        title: '该功能暂未上线，请去pc端操作...',
        icon: 'none',
        duration: 2000
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
      handleSupport,
      handleBudgetChecklist,
      handleDelete,
      handleContract,
      handleTechnology,
      handleConstruction,
      handleUndeveloped,
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

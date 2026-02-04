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
                <u-tag plain :type="item.statusConstant.badge" v-if="item.statusConstant">
                  {{ item.statusConstant.label }}
                </u-tag>
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
                <text>要求日期：</text>{{ item.supportDate }}
              </view>
              <view class="data-item-line">
                <text>支持人：</text>
                {{ item.supportUser ? item.supportUser.name : '( - )' }}
              </view>
            </view>

            <view v-if="item.status === 1">
              <view @tap.stop>
                <up-row :gutter="5">
                  <up-col :span="4" v-if="item.status === 1">
                    <up-button type="primary" size="small" @click="handleUpdateUser(item)">
                      设置支持人
                    </up-button>
                  </up-col>
                  <up-col :span="4" v-if="item.status === 1">
                    <up-button type="primary" size="small" @click="handleUpdate(item)">回复</up-button>
                  </up-col>
                  <up-col :span="4" v-if="item.status === 1">
                    <up-button type="success" size="small" @click="handlePush(item)">发布</up-button>
                  </up-col>
                </up-row>
              </view>
            </view>
          </view>
        </up-list-item>

        <up-loadmore class="py20px" :status="pagination.status" @loadmore="loadmore" />
      </up-list>
    </view>
  </uPage>

  <up-picker
      v-if="modalShow"
      :show="modalShow"
      v-model="modalSelectUser"
      title="设置支持人"
      :columns="modalUsers"
      valueName="id"
      keyName="name"
      @cancel="() => modalShow = false"
      @confirm="handleModalConfirm"
  ></up-picker>
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
    const modalShow = ref(false);
    const modalItem = ref(null);
    const modalUsers = ref([]);
    const modalSelectUser = ref([]);

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

    const handleUpdateUser = (item) => {

      modalItem.value = item;
      modalSelectUser.value = [];
      modalUsers.value = [];

      if (item.supportUser) {
        modalSelectUser.value = [ item.supportUser.id ];
      }

      uni.showLoading({
        title: '正在加载...',
        mask: true
      });

      api.users(1, -1, {}).then((res) => {
        let json = res.result;

        modalUsers.value = [json.records];

        modalShow.value = true;
        uni.hideLoading();

      }).catch((error) => {
      }).finally(() => {
      });
    }

    const handleUpdate = (item) => {
      jumpTo({
        url: updateUrl.value,
        params: {
          id: item.id,
        }
      })
    }

    const handlePush = (item) => {
      uni.showModal({
        title: '是否发布',
        content: '确认发布该回复吗？',
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

    const handleView = (item) => {
      jumpTo({
        url: viewUrl.value,
        params: {
          id: item.id,
        }
      })
    }

    const handleModalConfirm = () => {
      if (modalSelectUser.value.length > 0) {
        let userId = modalSelectUser.value[0];

        uni.showLoading({
          title: '正在保存...',
          mask: true
        });

        api.assign(modalItem.value.id, {
          userId: userId,
        }).then((res) => {
          let json = res.result;

          let assignUser = modalUsers.value[0].find((one) => one.id === userId);

          if (assignUser) {

            const index = data.value.findIndex(one => one.id === modalItem.value.id);
            if (index !== -1) {
              data.value[index] = {
                ...data.value[index],
                supportUser: {
                  id: assignUser.id,
                  name: assignUser.name,
                }
              };
            }

            // data.value = [...data.value];
          }

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 2000,
            success: () => {
              uni.hideLoading();
              modalShow.value = false;
            }
          });

        }).catch((error) => {
        }).finally(() => {
        });
      } else {
        uni.showToast({ title: '请选择一个数据', icon: 'none' });
      }
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
      modalShow,
      modalItem,
      modalUsers,
      modalSelectUser,
      loadmore,
      onRefresh,
      handleSearch,
      handleUpdateUser,
      handleUpdate,
      handlePush,
      handleView,
      handleModalConfirm,
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

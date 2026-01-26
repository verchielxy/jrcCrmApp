<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="relative" v-if="target" style="padding-bottom: 75px;">
      <view class="bg-white mb20px">
        <view class="p15px">
          <MaterialSymbol class="middle-icon c-primary" name="info" :size="20" type="sharp"></MaterialSymbol>
          基本信息
        </view>

        <up-cell-group>
          <up-cell title="调拨编号">
            <template #value>
              <text class="right-text">{{ target.code }}</text>
            </template>
          </up-cell>

          <up-cell title="调拨类型">
            <template #value>
              <text class="right-text">{{ target.typeText }}</text>
            </template>
          </up-cell>

          <up-cell title="调入部门">
            <template #value>
              <text class="right-text">{{ target.toDepText }}</text>
            </template>
          </up-cell>

          <up-cell title="申请人">
            <template #value>
              <text class="right-text">{{ target.applyUserText }}</text>
            </template>
          </up-cell>

          <up-cell title="申请时间">
            <template #value>
              <text class="right-text">{{ target.applyTime }}</text>
            </template>
          </up-cell>
        </up-cell-group>
      </view>

      <view class="bg-white mb20px">
        <view class="p15px" style="border-bottom: 1px solid #eee;">
          <MaterialSymbol class="middle-icon c-primary" name="psychology_alt" :size="20" type="sharp"></MaterialSymbol>
          申请理由
        </view>

        <view class="p15px">
          {{ target.applyReason }}
        </view>
      </view>

      <view class="bg-white mb20px" v-if="targetEquipments && targetEquipments.length > 0">
        <view class="p15px" style="border-bottom: 1px solid #eee;">
          <MaterialSymbol class="middle-icon c-primary" name="list_alt" :size="20" type="sharp"></MaterialSymbol>
          调拨的设备
        </view>

        <view style="border-bottom: 1px solid #eee;">
          <up-collapse>
            <up-collapse-item :title="item.name" name="Docs guide" v-for="item in targetEquipments">
              <view style="margin: -12px 0;">
                <up-cell-group :border="false" :customStyle="{'padding': '0'}">
                  <up-cell title="编号">
                    <template #value>
                      <text class="right-text">{{ item.deviceNo }}</text>
                    </template>
                  </up-cell>

                  <up-cell title="类别">
                    <template #value>
                      <text class="right-text">{{ item.cate?.name }}</text>
                    </template>
                  </up-cell>

                  <up-cell title="原属部门">
                    <template #value>
                      <text class="right-text">{{ item.belongOffice?.name }}</text>
                    </template>
                  </up-cell>

                  <up-cell title="规格型号">
                    <template #value>
                      <text class="right-text">{{ item.spec }}</text>
                    </template>
                  </up-cell>

                  <up-cell title="功能位置">
                    <template #value>
                      <text class="right-text">{{ item.functionAddr }}</text>
                    </template>
                  </up-cell>
                </up-cell-group>
              </view>
            </up-collapse-item>
          </up-collapse>
        </view>
      </view>

      <view class="bg-white" v-if="target.checkStatus === 3 || target.checkStatus === 4">
        <view class="p15px" style="border-bottom: 1px solid #eee;">
          <MaterialSymbol class="middle-icon c-primary" name="approval" :size="20" type="sharp"></MaterialSymbol>
          审核意见
        </view>

        <view>
          <up-cell-group :border="false" :customStyle="{'padding': '0'}">
            <up-cell title="审核意见">
              <template #value>
                <text class="right-text">{{ target.opinion }}</text>
              </template>
            </up-cell>
          </up-cell-group>
        </view>
      </view>

      <view class="btn-box p10px">
        <up-row :gutter="20">
          <up-col :span="6">
            <up-button  type="success" @click="handleAgree">同意</up-button>
          </up-col>

          <up-col :span="6">
            <up-button type="error" @click="handleDisagree">不同意</up-button>
          </up-col>
        </up-row>
      </view>
    </view>

    <up-modal v-model:show="modalShow" width="300px" :buttonReverse="true" :showConfirmButton="true" :showCancelButton="true" @confirm="handleConfirm">
      <view style="width: 100%" v-if="modalStatus === 3">
        <up-form :model="formData" :rules="formRules" ref="formRef">
          <vFormRow
              :rows="formRows.one"
              v-model:formData="formData"
              :labelWidth="1"
              :onlyText="false"
          ></vFormRow>
        </up-form>
      </view>
      <view v-else>
        确定通过审核吗？
      </view>
    </up-modal>
  </uPage>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.approvalChangeTransfer;
    const loading = ref(false);
    const target = ref();
    const targetEquipments = ref([]);

    const formRows = ref({
      one: [
        {
          title: '',
          placeholder: '不同意时，请输入审核意见',
          type: 'textarea',
          name: 'opinion',
          rule: [
            {required: true, message: '这里需要填写'},
          ],
        },
      ]
    });
    const formData = ref({
      opinion: undefined,
    })
    const formRules = ref({
      opinion: [],
    });
    const formRef = ref();
    const modalShow = ref(false);
    const modalStatus = ref();

    const getTarget = (tmpTarget) => {
      // console.log(tmpTarget);
      loading.value = true;

      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        getEquipments();

      }).catch((err) => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      }).finally(() => {

      });
    }

    const getEquipments = () => {
      let existIds = target.value.deviceList?.map(item => item.deviceId);

      if (existIds && existIds.length > 0) {
        proxy.$api.common.equipments(1, -1,{
          existIds: existIds,
        }).then((res) => {
          const json = res.result;

          targetEquipments.value = json.records;

        }).finally(() => {
          setTimeout(function () {
            loading.value = false;
          }, 500);
        });
      } else {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      }
    }

    const handleAgree = () => {
      modalStatus.value = 4;
      modalShow.value = true;
    }

    const handleDisagree = () => {
      modalStatus.value = 3;
      modalShow.value = true;
    }

    const handleConfirm = () => {
      if (modalStatus.value === 3) {
        formRef.value.validate().then(valid => {
          if (valid) {
            handleApproval();
          } else {
            uni.$u.toast('校验失败')
          }
        }).catch(() => {
          // 处理验证错误
          uni.$u.toast('请输入理由')
        });
      } else {
        handleApproval();
      }
    }

    const handleApproval = () => {
      loading.value = true;
      api.approval(id.value, {
        opinion: formData.value.opinion,
        result: modalStatus.value,
      }).then((res) => {
        const json = res.result;

        uni.$u.toast('审核成功');

        uni.$emit('refreshFromDetail')
        uni.navigateBack({});

      }).finally(() => {
        loading.value = false;
      });
    }

    onMounted(() => {

    });

    onLoad((options) => {
      id.value = options.id;
      // name.value = decodeURIComponent(options.name)
      getTarget();
    })

    return {
      id,
      loading,
      target,
      targetEquipments,
      formRows,
      formData,
      formRules,
      formRef,
      modalShow,
      modalStatus,
      handleAgree,
      handleDisagree,
      handleConfirm,
      handleApproval,
    };
  },
});
</script>

<style scoped lang="less">
.btn-box {
  background-color: #fff;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>

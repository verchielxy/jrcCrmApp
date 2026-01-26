<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view v-if="target">
      <view class="bg-white mb20px">
        <view class="p15px">
          <MaterialSymbol class="middle-icon c-primary" name="info" :size="20" type="sharp"></MaterialSymbol>
          工单信息
        </view>

        <up-cell-group>
          <up-cell title="工单编号">
            <template #value>
              <text class="right-text">{{ target.code }}</text>
            </template>
          </up-cell>

          <up-cell title="申请人">
            <template #value>
              <text class="right-text">{{ target.applyUser.name }}</text>
            </template>
          </up-cell>

          <up-cell title="申请时间">
            <template #value>
              <text class="right-text">{{ target.applyTime }}</text>
            </template>
          </up-cell>

          <up-cell title="工单时间">
            <template #value>
              <text class="right-text">{{ target.startDate }} ~ {{ target.endDate }}</text>
            </template>
          </up-cell>
        </up-cell-group>
      </view>

      <view class="bg-white mb20px" v-if="target.device">
        <view class="p15px">
          <MaterialSymbol class="middle-icon c-primary" name="component_exchange" :size="20" type="sharp"></MaterialSymbol>
          设备信息
        </view>

        <up-cell-group>
          <up-cell title="设备名称">
            <template #value>
              <text class="right-text">{{ target.device.name }}</text>
            </template>
          </up-cell>

          <up-cell title="设备编号">
            <template #value>
              <text class="right-text">{{ target.device.deviceNo }}</text>
            </template>
          </up-cell>

          <up-cell title="规格型号">
            <template #value>
              <view style="max-width: 70%">
                <text class="right-text">{{ target.device.spec }}</text>
              </view>
            </template>
          </up-cell>

          <up-cell title="所属部门">
            <template #value>
              <text class="right-text">{{ target.device.belongOffice?.name }}</text>
            </template>
          </up-cell>

          <up-cell title="功能位置">
            <template #value>
              <view style="max-width: 70%">
                <text class="right-text">{{ target.device.functionAddr }}</text>
              </view>
            </template>
          </up-cell>
        </up-cell-group>
      </view>

      <view class="bg-white mb20px">
        <view class="p15px" style="border-bottom: 1px solid #eee;">
          <MaterialSymbol class="middle-icon c-primary" name="description" :size="20" type="sharp"></MaterialSymbol>
          故障描述
        </view>

        <view class="bg-white p15px" style="border-bottom: 1px solid #eee;" v-html="target.content">
        </view>
      </view>

      <view class="bg-white">
        <view class="p15px" style="border-bottom: 1px solid #eee;">
          <MaterialSymbol class="middle-icon c-primary" name="edit_note" :size="20" type="sharp"></MaterialSymbol>
          维修填写
        </view>

        <view>
          <up-form class="p15px" :model="formData" :rules="formRules" ref="formRef" v-if="target.status === 1">
            <vFormRow
                :rows="formRows.one"
                v-model:formData="formData"
                :labelWidth="80"
                :onlyText="false"
            ></vFormRow>

            <up-button class="mt10px" type="success" @click="handleSubmit">保存</up-button>
          </up-form>

          <up-cell-group :border="false" :customStyle="{'padding': '0'}" v-else>
            <up-cell title="维修记录">
              <template #value>
                <view style="max-width: 70%;">
                  <text class="right-text" v-html="target.endRemarks"></text>
                </view>
              </template>
            </up-cell>

            <up-cell title="照片">
              <template #value>
                <up-image :show-loading="true" shape="square" :src="$imageUrl(target.endPic)" width="80px" height="80px"></up-image>
              </template>
            </up-cell>
          </up-cell-group>
        </view>
      </view>
    </view>
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

    const api = proxy.$api.myRepair;
    const loading = ref(false);
    const target = ref();

    const formRows = ref({
      one: [
        {
          title: '维修记录',
          placeholder: '请输入维修记录',
          type: 'textarea',
          name: 'endRemarks',
          rule: [
            {required: true, message: '这里需要填写', trigger: ['blur', 'change']},
          ],
        },
        {
          title: '照片',
          placeholder: '请上传照片',
          type: 'imageUpload',
          name: 'endPic',
          images: [],
          limit: 1,
          valueSingle: true,
        },
      ]
    });
    const formData = ref({
      endRemarks: undefined,
    })
    const formRules = ref({
      endRemarks: [],
    });
    const formRef = ref();

    const getTarget = (tmpTarget) => {
      // console.log(tmpTarget);
      loading.value = true;

      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        getEquipment();

      }).catch((err) => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      }).finally(() => {

      });
    }

    const getEquipment = () => {
      if (target.value.device?.id) {
        proxy.$api.common.equipmentView(target.value.device.id, {}).then((res) => {
          const json = res.result;

          target.value.device = json;

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

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          loading.value = true;
          api.update(id.value, formData.value).then((res) => {
            const json = res.result;

            uni.$u.toast('保存成功');

            uni.$emit('refreshFromDetail')
            uni.navigateBack({});

          }).finally(() => {
            setTimeout(function () {
              loading.value = false;
            }, 500);
          });

        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    onMounted(() => {
    });

    onLoad((options) => {
      id.value = options.id;
      // name.value = decodeURIComponent(options.name)
      let tmpTarget = uni.getStorageSync('temp_data_item');

      getTarget(tmpTarget);
    })

    return {
      id,
      loading,
      target,
      formRows,
      formData,
      formRules,
      formRef,
      handleSubmit,
    };
  },
});
</script>

<style scoped lang="less">
</style>

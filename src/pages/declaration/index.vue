<!--
  * @author baoyuhao
  * @date 2023/8/9 10:31:37
  * @description 报单
  * @version 0.8.0
-->
<template>
  <t-navbar title="报单" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="declaration-container">
    <div class="cellGroup">
      <t-cell-group theme="card">
        <t-cell title="商品名称" :note="goodsInfo.commodity"/>
        <t-cell title="剩余额度" :note="isNotEmpty(goodsInfo.remainAmount)?goodsInfo.remainAmount+' 元':''"/>
      </t-cell-group>
    </div>

    <div style="width:100%;padding: 0 16px;">
      <t-form
          ref="form"
          class="formStyle"
          :data="declarationForm.formData"
          :rules="declarationForm.formDataRules"
          reset-type="initial"
          labelWidth="110px"
          label-align="left"
          colon
          @submit="declarationFormSubmit"
      >
        <t-form-item label="订单号" name="orderId">
          <t-input v-model="declarationForm.formData.orderId" borderless placeholder="请输入订单号"/>
        </t-form-item>
        <t-form-item label="方案" name="scheme" arrow>
          <t-input v-model="declarationForm.formData.scheme" borderless placeholder="请选择方案" readonly
                   @click="schemeVisible = true"/>
          <t-action-sheet v-model="schemeVisible" description="选择方案" :items="schemeList"
                          @selected="selectedScheme"/>
        </t-form-item>
        <t-form-item label="实付金额" name="payAmount">
          <t-input v-model="declarationForm.formData.payAmount" borderless placeholder="请输入实付金额">
            <template #suffixIcon>
              <div style="font-size: 15px">元</div>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item label="预计返款金额" name="expectPayback">
          <t-input type="number" v-model="declarationForm.formData.expectPayback" borderless
                   placeholder="预计返款金额" readonly disabled>
            <template #suffixIcon>
              <div style="font-size: 15px">元</div>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="declarationForm.formData.notes" borderless placeholder="请输入备注" :maxlength="50"
                      indicator/>
        </t-form-item>
        <t-form-item label="下单图" style="display: flex;flex-direction: column" name="orderPic">
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: center;">
            <t-upload
                ref="uploadOrderPic"
                :default-files="orderPic"
                v-model="orderPic"
                :abridge-name="[10,8]"
                :auto-upload="false"
                :multiple="false"
                :max="1"
                theme="image"
                accept="image/*"
                :before-upload="beforeUpload"
                :size-limit="{ size: 3, unit: 'MB' }"
                @validate="validateFile"
                @fail="uploadFail"
            />
            <div style="margin-top: 10px;font-size: 13px;color: red;">
              下单截图尽量拼成一张图，图片要看到订单号/金额/下单时间，辛苦各位小宝贝～
            </div>
          </div>
        </t-form-item>
        <div class="button-group">
          <t-button theme="primary" variant="outline" @click="to_home">首页</t-button>
          <t-button theme="primary" type="submit" :loading="declarationForm.submitBtnLoading"
                    :loading-props="{theme: 'dots'}">提交
          </t-button>
        </div>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {h, onMounted, reactive, ref} from "vue";
import {ActionSheet, Toast} from "tdesign-mobile-vue";
import {useRoute, useRouter} from "vue-router";
import {BASE_URL} from "./constants";
import {ErrorCircleIcon, InfoCircleIcon} from "tdesign-icons-vue-next";
import {uploadFile, validateFile, validateFileType} from "@/utils/files";
import {setObjToUrlParams} from "@/utils/request/utils";
import {request} from "@/utils/request";
import {isNotEmpty} from "@/utils/validate";
import {ActionSheetItem} from "tdesign-mobile-vue/es/action-sheet";

const route = useRoute();
const router = useRouter();

/**
 * data
 */
const commodityId = route.query.id;
const goodsInfo = reactive({
  commodity: "",
  remainAmount: 0
});

const uploadOrderPic = ref();
const orderPic = ref([]);
/**
 * data
 */
const declarationForm = reactive({
  formData: {
    commodityId: commodityId,
    scheme: "",
    schemeId: "",
    expectPayback: 0,
    notes: "",
    orderId: "",
    orderPic: "",
    payAmount: null
  },
  formDataRules: {
    orderId: [{required: true, message: "订单号必填", type: "error"}],
    scheme: [{required: true, message: "方案必选", type: "error"}],
    payAmount: [
      {validator: (val: any) => /^\d+(\.\d{1,2})?$/.test(val), message: '实付金额不合法'},
      {
        validator: (val: any) => parseFloat(val) < 10000,
        message: '实付金额必须小于10000元'
      },
      {required: true}
    ]
  },
  submitBtnLoading: false
})

// 方案
const schemeVisible = ref(false);
const schemeList = ref([]);

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  console.log(commodityId);
  getScheme();
  getCommodity();
});

/**
 * 操作钩子
 */
const handleClick = () => {
  window.history.back();
}
// 上传文件失败钩子
const uploadFail = ({file}) => {
  Toast({
    icon: () => h(ErrorCircleIcon),
    direction: 'column',
    message: `文件 ${file.name} 上传失败`,
  })
};
/**
 * 业务相关
 */
// 获取方案
const getCommodity = () => {
  request.get({
    url: setObjToUrlParams(BASE_URL.getCommodityById, {commodityId: commodityId})
  }).then(res => {
    Object.assign(goodsInfo, {
      commodity: res.commodityName,
      remainAmount: res.remainAmount
    })
  }).catch(err => {
    Toast.error(err.message)
  })
}
// 获取方案
const getScheme = () => {
  request.post({
    url: setObjToUrlParams(BASE_URL.listScheme, {id: commodityId})
  }).then(res => {
    console.log(res);
    res.map((item: any) => {
      let obj = {
        label: item.schemeName,
        schemeId: item.schemeId,
        expectPayback: item.expectPayback
      }
      schemeList.value.push(obj);
    })
  }).catch(err => {
    Toast.error(err.message)
  })
}
// 选择方案
const selectedScheme = (selected: ActionSheetItem) => {
  Object.assign(declarationForm.formData, {
    scheme: selected.label,
    schemeId: selected.schemeId,
    expectPayback: selected.expectPayback
  })
  ActionSheet.close();
};
/**
 * 上传
 */
const beforeUpload = (file: { type: string; }) => {
  return validateFileType("image/*", file.type);
};

// 提交
const declarationFormSubmit = async ({validateResult}) => {
  if (declarationForm.formData.payAmount > goodsInfo.remainAmount) {
    Toast({
      icon: () => h(InfoCircleIcon),
      direction: 'column',
      message: "实付金额不能大于剩余额度",
    });
    return;
  }
  // 上传下单图改为非必填 --- 2023/11/06 需求
  // if (isEmpty(orderPic.value)) {
  //   Toast({
  //     icon: () => h(InfoCircleIcon),
  //     direction: 'column',
  //     message: "请上传下单图",
  //   });
  //   return;
  // }
  if (validateResult === true) {
    declarationForm.submitBtnLoading = true;
    try {
      await request.post({
        url: setObjToUrlParams(BASE_URL.isRepeatOrderId, {orderId: declarationForm.formData.orderId})
      })
      if (isNotEmpty(orderPic.value)) {
        let fileFormData = new FormData();
        fileFormData.append("file", orderPic.value[0].raw);
        let params = {
          orderId: declarationForm.formData.orderId,
          fileFlag: 0
        }
        let requestUrl = setObjToUrlParams(BASE_URL.uploadImgFile, params);
        let uploadRes = await uploadFile(requestUrl, fileFormData, percentCompleted => {
          orderPic.value[0].percent = percentCompleted;
          if (percentCompleted === 100) {
            orderPic.value[0].status = "success";
          }
        })
        Object.assign(declarationForm.formData, {
          orderPic: uploadRes
        })
      }
      request.post({
        url: BASE_URL.declaration,
        data: declarationForm.formData
      }).then(res => {
        Toast.success("报单成功")
        window.location.reload();
      }).catch(err => {
        Toast({
          icon: () => h(ErrorCircleIcon),
          direction: 'column',
          message: err.message,
        });
      }).finally(() => {
        declarationForm.submitBtnLoading = false;
      })
    } catch (e) {
      Toast({
        icon: () => h(ErrorCircleIcon),
        direction: 'column',
        message: e.message,
      });
      declarationForm.submitBtnLoading = false;
    }
  } else {
    declarationForm.submitBtnLoading = false;
  }
}
const to_home = () => {
  router.push("/home");
}
</script>

<style lang="less" scoped>
.declaration-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 30px;

  .cellGroup {
    width: 100%;
    margin-top: 58px;

    .t-input {
      margin: 0;
      padding: 0;
    }
  }

  .formStyle {
    width: 100%;
    border-radius: 10px;
    margin-top: 10px;

    .button-group {
      padding: 10px;
      display: flex;
      justify-content: space-between;

      .t-button {
        width: 47%;
      }
    }
  }
}
</style>
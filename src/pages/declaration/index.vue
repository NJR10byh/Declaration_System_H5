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
        <t-cell title="剩余额度" :note="goodsInfo.remainAmount"/>
      </t-cell-group>
    </div>

    <div style="width: 90%">
      <t-form
          ref="form"
          class="formStyle"
          :data="declarationForm.formData"
          :rules="declarationForm.formDataRules"
          reset-type="initial"
          labelWidth="110px"
          label-align="left"
          requiredMark
          @submit="declarationFormSubmit"
      >
        <t-form-item label="订单号" name="orderId">
          <t-input v-model="declarationForm.formData.orderId" borderless placeholder="请输入订单号"/>
        </t-form-item>
        <t-form-item label="实付金额" name="payAmount">
          <t-input v-model="declarationForm.formData.payAmount" borderless placeholder="请输入实付金额">
            <template #suffixIcon>
              <div style="font-size: 15px">元</div>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item label="预计返款金额" name="expectPayback">
          <t-input v-model="declarationForm.formData.expectPayback" borderless placeholder="请输入预计返款金额">
            <template #suffixIcon>
              <div style="font-size: 15px">元</div>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item label="备注" name="notes">
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
                :request-method="uploadPic_order"
                :size-limit="{ size: 10, unit: 'MB' }"
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
import {Toast} from "tdesign-mobile-vue";
import {useRoute, useRouter} from "vue-router";
import {BASE_URL} from "./constants";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";
import {uploadFile, validateFile, validateFileType} from "@/utils/files";
import {isEmpty, isNotEmpty} from "@/utils/validate";
import {setObjToUrlParams} from "@/utils/request/utils";
import {request} from "@/utils/request";

const route = useRoute();
const router = useRouter();

/**
 * data
 */
const goodsInfo = route.query;

const uploadOrderPic = ref();
const orderPic = ref([]);
/**
 * data
 */
const declarationForm = reactive({
  formData: {
    commodityId: goodsInfo.id,
    expectPayback: "",
    notes: "",
    orderId: "",
    orderPic: "",
    payAmount: ""
  },
  formDataRules: {
    commodityId: [{required: true, message: "商品id必填", type: "error"}],
    expectPayback: [{required: true, message: "预计返款金额必填", type: "error"}],
    notes: [{required: true, message: "备注必填", type: "error"}],
    orderId: [{required: true, message: "订单号必填", type: "error"}],
    payAmount: [{required: true, message: "实付金额必填", type: "error"}]
  },
  submitBtnLoading: false
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  console.log(goodsInfo);
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

// 提交
const declarationFormSubmit = async ({validateResult}) => {
  declarationForm.submitBtnLoading = true;
  await uploadOrderPic.value.uploadFiles();
  setTimeout(() => {
    console.log(declarationForm.formData)
    console.log(validateResult)
    if (validateResult === true) {
      console.log(declarationForm.formData)
      if (isEmpty(declarationForm.formData.orderPic)) {
        Toast({
          icon: () => h(ErrorCircleIcon),
          direction: 'column',
          message: "请上传下单图",
        });
        declarationForm.submitBtnLoading = false;
        return;
      }
      request.post({
        url: BASE_URL.declaration,
        data: declarationForm.formData
      }).then(res => {
        console.log(res);
        Toast({
          theme: "success",
          direction: 'column',
          message: "报单成功",
        });
        router.push("/home");
      }).catch(err => {
        Toast({
          icon: () => h(ErrorCircleIcon),
          direction: 'column',
          message: err.message,
        });
      }).finally(() => {
        declarationForm.submitBtnLoading = false;
      })
    } else {
      declarationForm.submitBtnLoading = false;
    }
  }, 800)
}

/**
 * 业务相关
 */
/**
 * 上传
 */
const beforeUpload = (file: { type: string; }) => {
  return validateFileType("image/*", file.type);
};


// 上传收款码-下单图
const uploadPic_order = (file: any) => {
  if (isNotEmpty(file.raw)) {
    return new Promise((resolve, reject) => {
      let params = {
        orderId: declarationForm.formData.orderId,
        fileFlag: 0
      }
      let fileFormData = new FormData();
      fileFormData.append("file", file.raw);
      let requestUrl = setObjToUrlParams(BASE_URL.uploadImgFile, params);
      uploadFile(requestUrl, fileFormData, percentCompleted => {
        orderPic.value[0].percent = percentCompleted;
        if (percentCompleted === 100) {
          orderPic.value[0].status = "success";
        }
      }).then(res => {
        Object.assign(declarationForm.formData, {
          orderPic: String(res)
        });
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      }).finally(() => {
      })
    })
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
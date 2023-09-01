<!--
  * @author baoyuhao
  * @date 2023/8/14 13:44:20
  * @description 
  * @version 0.8.0
-->
<template>
  <t-navbar title="申请返款" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="apply-backMoney-container">
    <t-cell-group class="cellGroup" theme="card">
      <t-cell>
        <span style="color: red;font-weight: bold;font-size: 14px;">
          注意：订单确认收货完成满七天后填写，不到时间不要上传！
        </span>
      </t-cell>
      <t-cell title="商品名称" :note="route.query.commodity"/>
      <t-cell title="实付金额">
        <template #note>
          <span>{{ applyForRefundFormData.actualPayback }}</span>元
        </template>
      </t-cell>
      <t-cell title="物流单号">
        <template #note>
          <t-input v-model="applyForRefundFormData.trackNum" borderless align="right" placeholder="请填写物流单号"
                   clearable/>
        </template>
      </t-cell>
      <t-cell title="预计返款金额">
        <template #note>
          <span>{{ applyForRefundFormData.examineTime }}</span>元
        </template>
      </t-cell>
    </t-cell-group>

    <t-form
        ref="form"
        :data="applyForRefundFormData"
        :rules="declarationRules"
        reset-type="initial"
        labelWidth="110px"
        show-error-message
        label-align="left"
        @submit="declarationFormSubmit"
        class="formStyle"
    >
      <t-form-item label="订单完成图" style="display: flex;flex-direction: column">
        <t-upload
            ref="uploadFinish"
            :default-files="finishPic"
            v-model="finishPic"
            :abridge-name="[10,8]"
            :auto-upload="false"
            :multiple="false"
            :max="1"
            theme="image"
            accept="image/*"
            :before-upload="beforeUpload"
            :request-method="uploadFinishPic"
            :size-limit="{ size: 10, unit: 'MB' }"
            @validate="validateFile"
            @fail="uploadFail"
        />
      </t-form-item>
      <div class="button-group">
        <t-button theme="primary" type="submit" :loading="submitBtnLoading"
                  :loading-props="{theme: 'dots'}">提交
        </t-button>
      </div>
    </t-form>

    <t-cell-group class="Tips" theme="card">
      <t-cell>
        <div class="example">
          <p class="textInfo">
            示例图：必须显示订单状态+金额+完成时间+商品
          </p>
          <div class="imageInfo">
            <t-image class="image-container" :src="examplePic[0]" @click="examplePicVisible=true"/>
            <t-image-viewer v-model:images="examplePic" v-model:visible="examplePicVisible" style="margin-top: 48px;"/>
          </div>
        </div>
      </t-cell>
    </t-cell-group>
  </div>
</template>

<script setup lang="ts">
import {h, onMounted, reactive, ref} from "vue";
import {Toast} from "tdesign-mobile-vue";
import {useRoute, useRouter} from "vue-router";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";
import {BASE_URL} from "./constants";
import {request} from "@/utils/request";
import {setObjToUrlParams} from "@/utils/request/utils";
import {uploadFile, validateFile, validateFileType} from "@/utils/files";
import {isEmpty, isNotEmpty} from "@/utils/validate";

const route = useRoute();
const router = useRouter();

const declarationId = route.query.id;
/**
 * data
 */
const uploadFinish = ref();
const finishPic = ref([]);

// 报单表单数据
const applyForRefundFormData = reactive({
  actualPayback: "",
  applyPaybackTime: "",
  commodityId: "",
  examineNotes: "",
  examineTime: "",
  finishPic: "",
  notes: "",
  orderId: "",
  orderPic: "",
  payAmount: "",
  payStatId: "",
  paybackTime: "",
  reportTime: "",
  reporterId: "",
  status: "",
  trackNum: ""
})

// 报单表单校验
const declarationRules = reactive([])

// 提交按钮loading
const submitBtnLoading = ref(false);

// 示例图片
const examplePicVisible = ref(false);
const examplePic = reactive([
  'http://47.113.188.245:8900/userReport/file/tip.jpeg'
]);
/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  getDeclarationDetails(declarationId);
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
// 获取报单详情
const getDeclarationDetails = (id: any) => {
  request.get({
    url: setObjToUrlParams(BASE_URL.getReportDetails, {reportId: id})
  }).then(res => {
    console.log(res);
    Object.assign(applyForRefundFormData, res);
    if (isNotEmpty(res.finishPic) && res.finishPic.indexOf("http") !== -1) {
      finishPic.value = [{
        url: res.finishPic,
        name: 'finishPic.png',
        type: 'image',
      }]
    }
  }).catch(err => {
    Toast({
      icon: () => h(ErrorCircleIcon),
      direction: 'column',
      message: err.message,
    });
  })
}

/**
 * 上传
 */
const beforeUpload = (file: { type: string; }) => {
  return validateFileType("image/*", file.type);
};
// 上传订单完成图
const uploadFinishPic = (file: any) => {
  if (isNotEmpty(file.raw)) {
    let params = {
      orderId: applyForRefundFormData.orderId,
      fileFlag: 1
    }
    let fileFormData = new FormData();
    fileFormData.append("file", file.raw);
    let requestUrl = setObjToUrlParams(BASE_URL.uploadImgFile, params);
    uploadFile(requestUrl, fileFormData, percentCompleted => {
      finishPic.value[0].percent = percentCompleted;
      if (percentCompleted === 100) {
        finishPic.value[0].status = "success";
      }
    }).then(res => {
      Object.assign(applyForRefundFormData, {
        finishPic: String(res)
      });
    }).catch(err => {
      console.error(err);
    }).finally(() => {
    })
  }
}
// 申请返款确认
const declarationFormSubmit = async () => {
  submitBtnLoading.value = true;
  if (isEmpty(applyForRefundFormData.trackNum)) {
    Toast({
      theme: "error",
      direction: 'column',
      message: "请填写物流单号",
    });
    submitBtnLoading.value = false;
    return;
  }
  uploadFinish.value.uploadFiles();
  setTimeout(() => {
    console.log(applyForRefundFormData.finishPic);
    if (isEmpty(applyForRefundFormData.finishPic)) {
      Toast({
        theme: "error",
        direction: 'column',
        message: "请上传订单完成图",
      });
      submitBtnLoading.value = false;
      return;
    }
    request.post({
      url: BASE_URL.applyForRefund,
      data: applyForRefundFormData
    }).then(res => {
      console.log(res);
      Toast({
        theme: "success",
        direction: 'column',
        message: "申请返款成功",
      });
      window.history.back();
    }).catch(err => {
      Toast({
        icon: () => h(ErrorCircleIcon),
        direction: 'column',
        message: err.message,
      });
    }).finally(() => {
      submitBtnLoading.value = false;
    })
  }, 1500)
}
</script>

<style lang="less" scoped>
.apply-backMoney-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 20px;

  .cellGroup {
    width: 100%;
    margin-top: 58px;

    .t-input {
      margin: 0;
      padding: 0;
    }
  }

  .formStyle {
    width: 90%;
    border-radius: 10px;
    margin-top: 10px;

    .button-group {
      padding: 10px;

      .t-button {
        width: 100%;
      }
    }
  }

  .Tips {
    width: 100%;
    margin-top: 10px;

    .example {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .textInfo {
        width: 100%;
        color: red;
        font-weight: bold;
        font-size: 14px;
      }

      .imageInfo {
        width: 90%;
        height: auto;
        margin-top: 10px;
      }
    }
  }
}
</style>
<!--
  * @author baoyuhao
  * @date 2023/8/14 16:06:55
  * @description 个人信息
  * @version 0.8.0
-->
<template>
  <t-navbar title="个人信息修改" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="userInfo-container">
    <t-form
        ref="userInfoForm"
        :data="userInfoFormData"
        :rules="userInfoFormDataRules"
        reset-type="initial"
        show-error-message
        label-align="left"
        label-width="110px"
        @submit="onSubmit"
        colon
        :requiredMark="false"
        class="formStyle"
    >
      <t-form-item label="手机号" name="phone">
        <t-input v-model="userInfoFormData.phone" borderless placeholder="请输入手机号"/>
      </t-form-item>
      <t-form-item label="姓名" name="name">
        <t-input v-model="userInfoFormData.name" borderless placeholder="请输入姓名"/>
      </t-form-item>
      <t-form-item label="开户行名称" name="bankName">
        <t-input v-model="userInfoFormData.bankName" borderless placeholder="请输入开户行名称"/>
      </t-form-item>
      <t-form-item label="银行卡号" name="bankCard">
        <t-input v-model="userInfoFormData.bankCard" borderless placeholder="请输入银行卡号"/>
      </t-form-item>
      <t-form-item label="支付宝收款码" name="alipayCode">
        <t-upload
            :default-files="userInfoFormData.alipayCode"
            v-model:value="userInfoFormData.alipayCode"
            :multiple="false"
            :max="1"
            :size-limit="{ size: 3000000, unit: 'B' }"
            accept="image/*"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            @validate="onValidate"
        />
      </t-form-item>
      <t-form-item label="微信收款码" name="wechatCode">
        <t-upload
            :default-files="userInfoFormData.wechatCode"
            v-model:value="userInfoFormData.wechatCode"
            :multiple="false"
            :max="1"
            :size-limit="{ size: 3000000, unit: 'B' }"
            accept="image/*"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            @validate="onValidate"
        />
      </t-form-item>
      <div class="button-group">
        <t-button theme="primary" type="submit" :loading="submitBtnLoading">提交修改</t-button>
      </div>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Message} from "tdesign-mobile-vue";

/**
 * data
 */
const submitBtnLoading = ref(false)
const userInfoFormData = reactive({
  phone: "",
  name: "",
  bankName: "",
  bankCard: "",
  alipayCode: [
    {
      url: 'http://182.43.37.55:6002/static/img/tip.jpeg',
      name: 'uploaded1.png',
      type: 'image',
    }
  ],
  wechatCode: [
    {
      url: 'https://tdesign.gtimg.com/miniprogram/images/example4.png',
      name: 'uploaded1.png',
      type: 'image',
    }
  ]
})
const userInfoFormDataRules = reactive([])

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {

});

/**
 * 操作钩子
 */
const handleClick = () => {
  window.history.back();
}
const onValidate = (context: { type: string; }) => {
  if (context.type === 'FILE_OVER_SIZE_LIMIT') {
    Message.warning('文件大小超出上限');
  }
}
const onSubmit = () => {

}

/**
 * 业务相关
 */
</script>

<style lang="less" scoped>
.userInfo-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

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
}
</style>
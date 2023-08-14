<!--
  * @author baoyuhao
  * @date 2023/8/14 16:31:05
  * @description 修改密码
  * @version 0.8.0
-->
<template>
  <t-navbar title="修改密码" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="change-password-container">
    <t-form
        ref="userInfoForm"
        :data="changePasswordFormData"
        :rules="changePasswordFormDataRules"
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
        <t-input v-model="changePasswordFormData.phone" borderless placeholder="请输入手机号"/>
      </t-form-item>
      <t-form-item label="密码" name="password">
        <t-input type="password" v-model="changePasswordFormData.password" borderless placeholder="请输入密码"/>
      </t-form-item>
      <t-form-item label="确认密码" name="confirmPassword">
        <t-input type="password" v-model="changePasswordFormData.confirmPassword" borderless placeholder="请确认密码"/>
      </t-form-item>
      <t-form-item label="开户行名称" name="bankName">
        <t-input v-model="changePasswordFormData.bankName" borderless placeholder="请输入开户行名称"/>
      </t-form-item>
      <t-form-item label="银行卡号" name="bankCard">
        <t-input v-model="changePasswordFormData.bankCard" borderless placeholder="请输入银行卡号"/>
      </t-form-item>
      <t-form-item label="支付宝收款码" name="alipayCode">
        <t-upload
            :default-files="changePasswordFormData.alipayCode"
            v-model:value="changePasswordFormData.alipayCode"
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
            :default-files="changePasswordFormData.wechatCode"
            v-model:value="changePasswordFormData.wechatCode"
            :multiple="false"
            :max="1"
            :size-limit="{ size: 3000000, unit: 'B' }"
            accept="image/*"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            @validate="onValidate"
        />
      </t-form-item>
      <t-form-item label="验证码" name="verificationCode">
        <t-input v-model="changePasswordFormData.verificationCode" borderless placeholder="输入验证码">
          <template #suffix>
            <div class="suffix">
              <div class="suffix--line"></div>
              <t-image
                  class="image"
                  src="https://wwcdn.weixin.qq.com/node/wework/images/202010241547.ac6876be9c.png"
                  mode="heightFix"
                  aria-role="img"
                  aria-label="验证码"
              />
            </div>
          </template>
        </t-input>
      </t-form-item>
      <div class="button-group">
        <t-button theme="primary" type="submit" :loading="submitBtnLoading">提交修改</t-button>
        <t-button theme="primary" variant="outline">返回登录</t-button>
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
const changePasswordFormData = reactive({
  phone: "",
  name: "",
  password: "",
  confirmPassword: "",
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
  ],
  verificationCode: ""
})
const changePasswordFormDataRules = reactive([])

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
.change-password-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .formStyle {
    width: 90%;
    border-radius: 10px;
    margin-top: 10px;

    .suffix {
      display: flex;
      align-items: center;

      .suffix--line {
        width: 1px;
        height: 24px;
        background-color: #f6f6f6;
        margin-right: 16px;
      }

      .image {
        width: 72px;
        height: 36px;
        display: block;
        margin-top: -6px;
        margin-bottom: -6px;
      }
    }

    .button-group {
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .t-button {
        width: 100%;
        margin-top: 10px;

        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
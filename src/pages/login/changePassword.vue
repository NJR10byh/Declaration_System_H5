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

        class="formStyle"
    >
      <t-form-item label="手机号" name="phone">
        <t-input v-model="changePasswordFormData.phoneNum" borderless placeholder="请输入手机号"/>
      </t-form-item>
      <t-form-item label="密码" name="password">
        <t-input type="password" v-model="changePasswordFormData.password" borderless placeholder="请输入密码"/>
      </t-form-item>
      <t-form-item label="确认密码" name="confirmPassword">
        <t-input type="password" v-model="changePasswordFormData.confirmPassword" borderless placeholder="请确认密码"/>
      </t-form-item>
      <div class="button-group">
        <t-button theme="primary" type="submit" :loading="submitBtnLoading" :loading-props="{theme: 'dots'}">提交修改
        </t-button>
      </div>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import {h, onMounted, reactive, ref} from "vue";
import {useUserStore} from "@/store";
import {Toast} from "tdesign-mobile-vue";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";

const userStore = useUserStore();
const {userInfo} = userStore;

/**
 * data
 */
const submitBtnLoading = ref(false)
const changePasswordFormData = reactive({
  phoneNum: "",
  password: "",
  confirmPassword: "",
})
const changePasswordFormDataRules = reactive({
  phoneNum: [{required: true, message: "手机号必填", type: "error"}],
  password: [{required: true, message: "密码必填", type: "error"}],
  confirmPassword: [{required: true, message: "确认密码必填", type: "error"}],
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  Object.assign(changePasswordFormData, {
    phoneNum: userInfo.phoneNum,
    password: "",
    confirmPassword: "",
  })
});

/**
 * 操作钩子
 */
const handleClick = () => {
  window.history.back();
}

/**
 * 业务相关
 */
const onSubmit = () => {
  if (changePasswordFormData.password !== changePasswordFormData.confirmPassword) {
    Toast({
      icon: () => h(ErrorCircleIcon),
      direction: 'column',
      message: '两次密码不一致',
    });
    return;
  }
  submitBtnLoading.value = true;
  request.post({
    url: BASE_URL.updatePassword,
    data: changePasswordFormData
  }).then(res => {
    Toast.success("修改成功")
    window.history.back();
  }).catch(err => {
    Toast.error(err.message)
  }).finally(() => {
    submitBtnLoading.value = false;
  });
}
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
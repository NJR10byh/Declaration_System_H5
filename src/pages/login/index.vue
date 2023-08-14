<template>
  <div class="login-container">
    <div class="box">
      <div class="title">
        智慧报单系统
      </div>
      <t-form
          ref="loginForm"
          :data="loginFormData"
          :rules="loginFormDataRules"
          reset-type="initial"
          show-error-message
          label-align="left"
          @submit="onSubmit"
          colon
          :requiredMark="false"
          class="formStyle"
      >
        <t-form-item label="手机号" name="username">
          <t-input v-model="loginFormData.username" borderless placeholder="请输入手机号"/>
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input v-model="loginFormData.password" borderless type="password" placeholder="请输入密码"/>
        </t-form-item>
        <div class="button-group">
          <t-button theme="primary" type="submit" :loading="loginBtnLoading">登 录</t-button>
        </div>
      </t-form>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "LoginIndex"
};
</script>
<script setup lang="ts">
import {reactive, ref} from "vue";
import {checkAuth, userInfoToCache} from "@/utils/auth";
import md5 from "js-md5";
import {request} from "@/utils/request";
import {Toast} from "tdesign-mobile-vue";

const type = ref("login");

const loginFormData = reactive({
  username: "cxy",
  password: "abc123123"
});

const loginFormDataRules = reactive({
  username: [
    {required: true, message: "手机号必填", trigger: "blur"}
  ],
  password: [
    {required: true, message: "密码必填", trigger: "blur"}
  ]
});

const loginBtnLoading = ref(false);

const onSubmit = async ({validateResult}) => {
  if (validateResult === true) {
    loginBtnLoading.value = true;
    if (!checkAuth()) {
      loginFormData.password = md5(loginFormData.password);
      let requestUrl = "/authorize/loginByPassword";
      await request.post({
        url: requestUrl,
        data: loginFormData
      }).then(async res => {
        await userInfoToCache(res);
      }).catch(err => {
        Toast.error(err.message)
      }).finally(() => {
        loginBtnLoading.value = false;
      });
    } else {
      loginBtnLoading.value = false;
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 23px;
      font-weight: bold;
      color: var(--td-brand-color-8);
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
  }
}
</style>

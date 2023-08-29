<template>
  <div class="login-container">
    <div class="box">
      <div class="title">
        智慧报单系统
      </div>
      <t-form
          ref="loginForm"
          :data="loginParams.formData"
          :rules="loginParams.formDataRules"
          reset-type="initial"
          show-error-message
          label-align="left"
          @submit="onSubmit"
          colon
          :requiredMark="false"
          class="formStyle"
      >
        <t-form-item label="手机号" name="username">
          <t-input v-model="loginParams.formData.phoneNum" borderless placeholder="请输入手机号"/>
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input v-model="loginParams.formData.password" borderless type="password" placeholder="请输入密码"/>
        </t-form-item>
        <div class="button-group">
          <t-button theme="primary" type="submit" :loading="loginParams.btnLoading">登 录</t-button>
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
import {BASE_URL} from "@/pages/login/constants";

const loginParams = reactive({
  btnLoading: false,
  formData: {
    phoneNum: "17939647821",
    password: "notfound"
  },
  formDataRules: {
    phoneNum: [
      {required: true, message: "手机号必填", trigger: "blur"}
    ],
    password: [
      {required: true, message: "密码必填", trigger: "blur"}
    ]
  }
})

const userInfo = reactive({
  bankName: "中国建设银行",
  bankNum: "card1111111111",
  id: "1",
  phoneNum: "19825089387",
  userName: "石磊",
  zfbNum: "19825089387",
  role: "superadmin"
});

const onSubmit = ({validateResult}) => {
  if (validateResult === true) {
    loginParams.btnLoading = true;
    if (!checkAuth()) {
      localStorage.removeItem("token");
      request.post({
        url: BASE_URL.login,
        data: loginParams.formData
      }).then(res => {
        console.log(res)
        localStorage.setItem("token", res.token);
        userInfoToCache(res.userInfo);
      }).catch(err => {
        Toast.error(err.message)
      }).finally(() => {
        loginParams.btnLoading = false;
      });
    } else {
      loginParams.btnLoading = false;
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

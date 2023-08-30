<template>
  <div class="login-container">
    <div class="box">
      <div class="title">
        智慧报单系统
      </div>
      <t-tabs :value="tabValue" :list="tabList" @change="tabChange" class="tabStyle">
        <t-tab-panel v-for="item in tabList" :key="item.value" :value="item.value" class="tabPanelStyle">
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
              v-show="tabValue==='登录'"
          >
            <t-form-item label="手机号" name="username">
              <t-input v-model="loginParams.formData.phoneNum" borderless placeholder="请输入手机号"/>
            </t-form-item>
            <t-form-item label="密码" name="password">
              <t-input v-model="loginParams.formData.password" borderless type="password" placeholder="请输入密码"/>
            </t-form-item>
            <div class="button-group">
              <t-button theme="primary" type="submit" :loading="loginParams.btnLoading"
                        :loading-props="{theme: 'dots'}">
                登 录
              </t-button>
            </div>
          </t-form>
          <t-form
              ref="userInfoForm"
              :data="registerForm.formData"
              :rules="registerForm.formDataRules"
              reset-type="initial"
              show-error-message
              label-align="left"
              label-width="120px"
              @submit="registerConfirm"
              colon
              class="formStyle"
              v-show="tabValue==='注册'"
          >
            <t-form-item label="手机号" name="phoneNum">
              <t-input v-model="registerForm.formData.phoneNum" borderless placeholder="请输入手机号"/>
            </t-form-item>
            <t-form-item label="姓名" name="userName">
              <t-input v-model="registerForm.formData.userName" borderless placeholder="请输入姓名"/>
            </t-form-item>
            <t-form-item label="密码" name="password">
              <t-input v-model="registerForm.formData.password" borderless placeholder="请输入密码"/>
            </t-form-item>
            <t-form-item label="确认密码" name="confirmPassword">
              <t-input v-model="registerForm.formData.confirmPassword" borderless placeholder="请确认密码"/>
            </t-form-item>
            <t-form-item label="开户行名称" name="bankName">
              <t-input v-model="registerForm.formData.bankName" borderless placeholder="请输入开户行名称"/>
            </t-form-item>
            <t-form-item label="银行卡号" name="bankNum">
              <t-input v-model="registerForm.formData.bankNum" borderless placeholder="请输入银行卡号"/>
            </t-form-item>
            <t-form-item label="支付宝收款码" name="zfbPic">
              <t-upload
                  :default-files="registerForm.zfbPic"
                  v-model:value="registerForm.zfbPic"
                  :multiple="false"
                  :max="1"
                  :size-limit="{ size: 3000000, unit: 'B' }"
                  accept="image/*"
                  action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                  @validate="onValidate"
              />
            </t-form-item>
            <t-form-item label="微信收款码" name="wxPic">
              <t-upload
                  :default-files="registerForm.wxPic"
                  v-model:value="registerForm.wxPic"
                  :multiple="false"
                  :max="1"
                  :size-limit="{ size: 3000000, unit: 'B' }"
                  accept="image/*"
                  action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                  @validate="onValidate"
              />
            </t-form-item>
            <t-form-item label="邀请码" name="wxPic">
              <t-input v-model="registerForm.formData.verifyCode" borderless placeholder="请输入邀请码"/>
            </t-form-item>
            <div class="button-group">
              <t-button theme="primary" variant="light" type="submit" :loading="registerForm.submitBtnLoading"
                        :loading-props="{theme: 'dots'}">
                注册
              </t-button>
            </div>
          </t-form>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "LoginIndex"
};
</script>
<script setup lang="ts">
import {h, reactive, ref} from "vue";
import {checkAuth, userInfoToCache} from "@/utils/auth";
import md5 from "js-md5";
import {request} from "@/utils/request";
import {Message, Toast} from "tdesign-mobile-vue";
import {BASE_URL} from "@/pages/login/constants";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";
import {isNotEmpty, validateMobilePhone} from "@/utils/validate";
import {rule} from "postcss";
import windingLine from "zrender/lib/contain/windingLine";

const tabValue = ref('登录');
const tabList = [
  {
    value: '登录',
    label: '登录',
  },
  {
    value: '注册',
    label: '注册',
  }
];

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

const registerForm = reactive({
  visible: false,
  confirmBtn: {
    content: '确认',
    variant: 'text',
    size: 'large',
  },
  cancelBtn: {
    content: '取消',
    variant: 'text',
    size: 'large',
  },
  formData: {
    bankName: '',
    bankNum: '',
    confirmPassword: '',
    password: '',
    phoneNum: '',
    registerTime: '',
    status: '',
    userName: '',
    verifyCode: '',
    wxPic: '',
    zfbNum: '',
    zfbPic: ''
  },
  formDataRules: {
    bankName: [{required: true, message: "开户行名称必填", trigger: "blur"}],
    bankNum: [{required: true, message: "银行卡号必填", trigger: "blur"}],
    confirmPassword: [{required: true, message: "确认密码必填", trigger: "blur"}],
    password: [{required: true, message: "密码必填", trigger: "blur"}],
    phoneNum: [{required: true, message: "手机号必填", trigger: "blur"}],
    userName: [{required: true, message: "姓名必填", trigger: "blur"}],
    verifyCode: [{required: true, message: "邀请码必填", trigger: "blur"}],
    wxPic: [{required: true, message: "微信收款码必填", trigger: "blur"}],
    zfbNum: [{required: true, message: "支付宝账号必填", trigger: "blur"}],
    zfbPic: [{required: true, message: "支付宝收款码必填", trigger: "blur"}]
  },
  zfbPic: [],
  wxPic: [],
  submitBtnLoading: false
});

const userInfo = reactive({
  bankName: "中国建设银行",
  bankNum: "card1111111111",
  id: "1",
  phoneNum: "19825089387",
  userName: "石磊",
  zfbNum: "19825089387",
  role: "superadmin"
});

const tabChange = (value: any) => {
  tabValue.value = value;
}

const onValidate = (context: { type: string; }) => {
  if (context.type === 'FILE_OVER_SIZE_LIMIT') {
    Message.warning('文件大小超出上限');
  }
}
const onSubmit = ({validateResult}) => {
  if (validateResult === true) {
    loginParams.btnLoading = true;
    if (!checkAuth()) {
      localStorage.removeItem("token");
      // userInfoToCache(userInfo);
      request.post({
        url: BASE_URL.login,
        data: loginParams.formData
      }).then(res => {
        console.log(res)
        localStorage.setItem("token", res.token);
        userInfoToCache(res.userInfo);
      }).catch(err => {
        Toast({
          icon: () => h(ErrorCircleIcon),
          theme: "error",
          direction: 'column',
          message: err.message,
        });
      }).finally(() => {
        loginParams.btnLoading = false;
      });
    } else {
      loginParams.btnLoading = false;
    }
  }
};

// 注册确认
const registerConfirm = ({validateResult}) => {
  if (validateResult) {
    if (registerForm.formData.confirmPassword !== registerForm.formData.password) {
      Toast({
        theme: "error",
        direction: 'column',
        message: "两次密码不一致",
      });
      return;
    }
    registerForm.submitBtnLoading = true;
    request.post({
      url: BASE_URL.register,
      data: registerForm.formData
    }).then(res => {
      console.log(res);
      Toast({
        theme: "success",
        direction: 'column',
        message: "注册成功",
      });
      tabValue.value = "登录";
    }).catch(err => {
      Toast({
        icon: () => h(ErrorCircleIcon),
        theme: "error",
        direction: 'column',
        message: err.message,
      });
    }).finally(() => {
      registerForm.submitBtnLoading = false;
    })
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0;


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

    .tabStyle {
      width: 90%;
      margin-top: 20px;

      .tabPanelStyle {

        .formStyle {
          width: 100%;

          .button-group {
            padding: 10px;

            .t-button {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

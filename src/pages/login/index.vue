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
              requiredMark
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
            <t-form-item label="支付宝账号" name="zfbNum">
              <t-input v-model="registerForm.formData.zfbNum" borderless placeholder="请输入支付宝账号"/>
            </t-form-item>
            <t-form-item label="支付宝收款码" name="zfbPic">
              <t-upload
                  ref="uploadZfbPic"
                  v-model="zfbPic"
                  :abridge-name="[10,8]"
                  :auto-upload="false"
                  :multiple="false"
                  :max="1"
                  theme="image"
                  accept="image/*"
                  :before-upload="beforeUpload"
                  :size-limit="{ size: 1, unit: 'MB' }"
                  @validate="validateFile"
                  @fail="uploadFail"
              />
            </t-form-item>
            <t-form-item label="微信收款码" name="wxPic">
              <t-upload
                  ref="uploadWxPic"
                  :default-files="wxPic"
                  v-model="wxPic"
                  :abridge-name="[10,8]"
                  :auto-upload="false"
                  :multiple="false"
                  :max="1"
                  theme="image"
                  accept="image/*"
                  :before-upload="beforeUpload"
                  :size-limit="{ size: 1, unit: 'MB' }"
                  @validate="validateFile"
                  @fail="uploadFail"
              />
            </t-form-item>
            <t-form-item label="邀请码" name="verifyCode">
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
import {request} from "@/utils/request";
import {Toast} from "tdesign-mobile-vue";
import {BASE_URL} from "@/pages/login/constants";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";
import {isEmpty, isNotEmpty} from "@/utils/validate";
import {uploadFile, validateFile, validateFileType} from "@/utils/files";
import {setObjToUrlParams} from "@/utils/request/utils";

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
    phoneNum: "",
    password: ""
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

const uploadZfbPic = ref();
const uploadWxPic = ref();
const zfbPic = ref([]);
const wxPic = ref([]);

const zfbPicFile = ref();
const wxPicFile = ref();

const registerForm = reactive({
  visible: false,
  confirmBtn: {
    content: "确认",
    variant: "text",
    size: "large"
  },
  cancelBtn: {
    content: "取消",
    variant: "text",
    size: "large"
  },
  formData: {
    bankName: "",
    bankNum: "",
    confirmPassword: "",
    password: "",
    phoneNum: "",
    userName: "",
    verifyCode: "",
    zfbNum: "",
    zfbPic: "",
    wxPic: ""
  },
  formDataRules: {
    bankName: [{required: true, message: "开户行名称必填", trigger: "blur"}],
    bankNum: [{required: true, message: "银行卡号必填", trigger: "blur"}],
    confirmPassword: [{required: true, message: "确认密码必填", trigger: "blur"}],
    password: [{required: true, message: "密码必填", trigger: "blur"}],
    phoneNum: [{required: true, message: "手机号必填", trigger: "blur"}],
    userName: [{required: true, message: "姓名必填", trigger: "blur"}],
    verifyCode: [{required: true, message: "邀请码必填", trigger: "blur"}],
    zfbNum: [{required: true, message: "支付宝账号必填", trigger: "blur"}]
  },
  zfbPic: [],
  wxPic: [],
  submitBtnLoading: false
});

const tabChange = (value: any) => {
  tabValue.value = value;
}

// 上传文件失败钩子
const uploadFail = ({file}) => {
  Toast({
    icon: () => h(ErrorCircleIcon),
    direction: 'column',
    message: `文件 ${file.name} 上传失败`,
  })
};
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

/**
 * 上传
 */
const beforeUpload = (file: { type: string; }) => {
  return validateFileType("image/*", file.type);
};

// 注册确认
const registerConfirm = async ({validateResult}) => {
  if (isEmpty(zfbPic.value)) {
    Toast({
      theme: "error",
      direction: 'column',
      message: "请上传支付宝收款码",
    });
    return;
  }
  if (isEmpty(wxPic.value)) {
    Toast({
      theme: "error",
      direction: 'column',
      message: "请上传微信收款码",
    });
    return;
  }
  if (validateResult === true) {
    if (registerForm.formData.confirmPassword !== registerForm.formData.password) {
      Toast({
        theme: "error",
        direction: 'column',
        message: "两次密码不一致",
      });
      return;
    }
    registerForm.submitBtnLoading = true;
    /**
     * 支付宝付款码上传
     */
    let zfbParams = {
      phoneNum: registerForm.formData.phoneNum,
      userName: registerForm.formData.userName,
      fileFlag: 2
    }
    console.log(zfbPic.value)
    let zfbFileFormData = new FormData();
    zfbFileFormData.append("file", zfbPic.value[0].raw);
    let zfbRequestUrl = setObjToUrlParams(BASE_URL.uploadRegisterImg, zfbParams);
    let uploadZfbRes = await uploadFile(zfbRequestUrl, zfbFileFormData, percentCompleted => {
      zfbPic.value[0].percent = percentCompleted;
      if (percentCompleted === 100) {
        zfbPic.value[0].status = "success";
      }
    })
    Object.assign(registerForm.formData, {
      zfbPic: uploadZfbRes
    });
    /**
     * 微信付款码上传
     */
    let wxParams = {
      phoneNum: registerForm.formData.phoneNum,
      userName: registerForm.formData.userName,
      fileFlag: 3
    }
    let wxFileFormData = new FormData();
    wxFileFormData.append("file", wxPic.value[0].raw);
    let requestUrl = setObjToUrlParams(BASE_URL.uploadRegisterImg, wxParams);
    let uploadWxRes = await uploadFile(requestUrl, wxFileFormData, percentCompleted => {
      wxPic.value[0].percent = percentCompleted;
      if (percentCompleted === 100) {
        wxPic.value[0].status = "success";
      }
    })
    Object.assign(registerForm.formData, {
      wxPic: uploadWxRes
    });
    request.post({
      url: BASE_URL.register,
      data: registerForm.formData
    }).then(res => {
      Toast.success("注册成功")
      tabValue.value = "登录";
    }).catch(err => {
      Toast.error(err.message)
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

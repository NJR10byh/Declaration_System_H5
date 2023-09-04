<!--
  * @author baoyuhao
  * @date 2023/8/14 16:06:55
  * @description 个人信息
  * @version 0.8.0
-->
<template>
  <t-navbar :title="navbarTitle" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
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

        class="formStyle"
    >
      <t-form-item label="手机号" name="phone">
        <t-input v-model="userInfoFormData.phoneNum" borderless placeholder="请输入手机号"/>
      </t-form-item>
      <t-form-item label="姓名" name="name">
        <t-input v-model="userInfoFormData.userName" borderless placeholder="请输入姓名"/>
      </t-form-item>
      <t-form-item label="开户行名称" name="bankName">
        <t-input v-model="userInfoFormData.bankName" borderless placeholder="请输入开户行名称"/>
      </t-form-item>
      <t-form-item label="银行卡号" name="bankCard">
        <t-input v-model="userInfoFormData.bankNum" borderless placeholder="请输入银行卡号"/>
      </t-form-item>
      <t-form-item label="支付宝收款码" name="zfbPic">
        <t-upload
            ref="uploadZfbPic"
            :default-files="zfbPic"
            v-model="zfbPic"
            :abridge-name="[10,8]"
            :auto-upload="false"
            :multiple="false"
            :max="1"
            theme="image"
            accept="image/*"
            :before-upload="beforeUpload"
            :request-method="uploadALiPayCode"
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
            :request-method="uploadWeChatCode"
            :size-limit="{ size: 1, unit: 'MB' }"
            @validate="validateFile"
            @fail="uploadFail"
        />
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
import {Toast} from "tdesign-mobile-vue";
import {useUserStore} from "@/store";
import {BASE_URL} from "./constants";
import {uploadFile, validateFile, validateFileType} from "@/utils/files";
import {isNotEmpty} from "@/utils/validate";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";
import {request} from "@/utils/request";
import router from "@/router";
import {setObjToUrlParams} from "@/utils/request/utils";

const userStore = useUserStore();
const {userInfo} = userStore;

/**
 * data
 */
const navbarTitle = ref("修改个人信息");

const submitBtnLoading = ref(false)
const userInfoFormData = reactive({
  id: "",
  phoneNum: "",
  userName: "",
  bankName: "",
  bankNum: "",
  zfbPic: "",
  wxPic: ""
})
const userInfoFormDataRules = reactive([])

const uploadZfbPic = ref();
const uploadWxPic = ref();
const zfbPic = ref([]);
const wxPic = ref([]);

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  Object.assign(userInfoFormData, {
    id: userInfo.id,
    phoneNum: userInfo.phoneNum,
    userName: userInfo.userName,
    bankName: userInfo.bankName,
    bankNum: userInfo.bankNum,
    zfbPic: userInfo.zfbPic,
    wxPic: userInfo.wxPic,
  });
  zfbPic.value = [{
    url: userInfo.zfbPic,
    name: userInfo.zfbPic
  }];
  wxPic.value = [{
    url: userInfo.wxPic,
    name: userInfo.wxPic
  }];
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
const onSubmit = async () => {
  await Promise.all([uploadZfbPic.value.uploadFiles(), uploadWxPic.value.uploadFiles()]);
  console.log(userInfoFormData)
  submitBtnLoading.value = true;
  setTimeout(() => {
    request.post({
      url: BASE_URL.editPersonalInfo,
      data: userInfoFormData
    }).then(res => {
      if (res) {
        Toast.success("修改成功");
        userStore.getUserInfo(res);
        router.push("/user")
      }
    }).catch(err => {
      Toast({
        icon: () => h(ErrorCircleIcon),
        direction: 'column',
        message: err.message,
      });
    }).finally(() => {
      submitBtnLoading.value = false;
    });
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


// 上传收款码-支付宝
const uploadALiPayCode = (file: any) => {
  if (isNotEmpty(file.raw)) {
    return new Promise((resolve, reject) => {
      let params = {
        phoneNum: userInfo.phoneNum,
        userName: userInfo.userName,
        fileFlag: 2
      }
      let fileFormData = new FormData();
      fileFormData.append("file", file.raw);
      let requestUrl = setObjToUrlParams(BASE_URL.uploadImgFile, params);
      uploadFile(requestUrl, fileFormData, percentCompleted => {
        zfbPic.value[0].percent = percentCompleted;
        if (percentCompleted === 100) {
          zfbPic.value[0].status = "success";
        }
      }).then(res => {
        Object.assign(userInfoFormData, {
          zfbPic: String(res)
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
// 上传收款码-微信
const uploadWeChatCode = (file: any) => {
  if (isNotEmpty(file.raw)) {
    return new Promise((resolve, reject) => {
      let params = {
        phoneNum: userInfo.phoneNum,
        userName: userInfo.userName,
        fileFlag: 3
      }
      let fileFormData = new FormData();
      fileFormData.append("file", file.raw);
      let requestUrl = setObjToUrlParams(BASE_URL.uploadImgFile, params);
      uploadFile(requestUrl, fileFormData, percentCompleted => {
        wxPic.value[0].percent = percentCompleted;
        if (percentCompleted === 100) {
          wxPic.value[0].status = "success";
        }
      }).then(res => {
        Object.assign(userInfoFormData, {
          wxPic: String(res)
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
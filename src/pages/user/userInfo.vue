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
            :default-files="zfbPic"
            v-model:value="zfbPic"
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
            :default-files="wxPic"
            v-model:value="wxPic"
            :multiple="false"
            :max="1"
            :size-limit="{ size: 3000000, unit: 'B' }"
            accept="image/*"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            @validate="onValidate"
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
import {onMounted, reactive, ref} from "vue";
import {Message, Toast} from "tdesign-mobile-vue";
import {useUserStore} from "@/store";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";
import router from "@/router";

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
    zfbPic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1fULU9.img?w=768&h=507&m=6&x=433&y=125&s=78&d=78",
    wxPic: "https://lqimg.dftoutiao.com/news/20230828/20230828114116_f4db414c5c94da55ca3759177d308345_2.png",
  });
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
  console.log(userInfoFormData)
  submitBtnLoading.value = true;
  request.post({
    url: BASE_URL.editPersonalInfo,
    data: userInfoFormData
  }).then(res => {
    if (res) {
      Toast.success("修改成功");
    }
  }).catch(err => {
    Toast.error(err.message);
  }).finally(() => {
    submitBtnLoading.value = false;
    router.push("/user")
  });
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
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
      <t-cell title="商品名称" :note="declarationInfo.goodsName"/>
      <t-cell title="实付金额">
        <template #note>
          <span>{{ declarationInfo.relMoney }}</span>元
        </template>
      </t-cell>
      <t-cell title="物流单号">
        <template #note>
          <span>{{ declarationInfo.preBackMoney }}</span>
        </template>
      </t-cell>
      <t-cell title="预计返款金额">
        <template #note>
          <span>{{ declarationInfo.preBackMoney }}</span>元
        </template>
      </t-cell>
    </t-cell-group>

    <t-form
        ref="form"
        :data="declarationFormData"
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
            v-model="declarationFormData.orderPic"
            :multiple="false"
            :max="1"
            :size-limit="{ size: 3000000, unit: 'B' }"
            accept="image/*"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            @validate="onValidate"
        />
      </t-form-item>
      <div class="button-group">
        <t-button theme="primary" type="submit">提交</t-button>
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
import {onMounted, reactive, ref} from "vue";
import {Message} from "tdesign-mobile-vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

const declarationInfo = route.query;
/**
 * data
 */
// 报单表单数据
const declarationFormData = reactive({
  wechatName: "",
  orderId: "",
  relMoney: "",
  preBackMoney: 0,
  remark: "",
  orderPic: "",
})

// 报单表单校验
const declarationRules = reactive([])

// 示例图片
const examplePicVisible = ref(false);
const examplePic = reactive([
  'http://182.43.37.55:6002/static/img/tip.jpeg'
]);
/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  console.log(declarationInfo);

});

/**
 * 操作钩子
 */
const handleClick = () => {
  window.history.back();
}
const onValidate = (context: any) => {
  if (context.type === 'FILE_OVER_SIZE_LIMIT') {
    Message.warning('文件大小超出上限');
  }
};

const declarationFormSubmit = () => {
  console.log(declarationFormData)
}

/**
 * 业务相关
 */
const to_home = () => {
  router.push("/home");
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
    width: 90%;
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
    width: 90%;
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
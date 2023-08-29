<!--
  * @author baoyuhao
  * @date 2023/8/9 10:31:37
  * @description 报单
  * @version 0.8.0
-->
<template>
  <t-navbar title="报单" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="declaration-container">
    <t-cell-group class="cellGroup" theme="card">
      <t-cell title="商品名称" :note="goodsInfo.commodity"/>
      <t-cell title="剩余额度" :note="goodsInfo.remainAmount"/>
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
      <t-form-item label="微信名">
        <t-input v-model="declarationFormData.wechatName" borderless placeholder="请输入微信名"/>
      </t-form-item>
      <t-form-item label="订单号">
        <t-input v-model="declarationFormData.orderId" borderless placeholder="请输入订单号"/>
      </t-form-item>
      <t-form-item label="实付金额">
        <t-input v-model="declarationFormData.relMoney" borderless placeholder="请输入实付金额"/>
      </t-form-item>
      <t-form-item label="预计返款金额">
        <t-input v-model="declarationFormData.preBackMoney" borderless placeholder="请输入预计返款金额" readonly>
          <template #suffixIcon>
            <div style="font-size: 15px">元</div>
          </template>
        </t-input>
      </t-form-item>
      <t-form-item label="备注">
        <t-textarea v-model="declarationFormData.remark" borderless placeholder="请输入备注" :maxlength="50" indicator/>
      </t-form-item>
      <t-form-item label="下单图" style="display: flex;flex-direction: column">
        <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: center;">
          <t-upload
              v-model="declarationFormData.orderPic"
              :multiple="false"
              :max="1"
              :size-limit="{ size: 3000000, unit: 'B' }"
              accept="image/*"
              action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              @validate="onValidate"
          />
          <div style="margin-top: 10px;font-size: 13px;color: red;">
            下单截图尽量拼成一张图，图片要看到订单号/金额/下单时间，辛苦各位小宝贝～
          </div>
        </div>
      </t-form-item>
      <div class="button-group">
        <t-button theme="primary" variant="outline" @click="to_home">首页</t-button>
        <t-button theme="primary" type="submit">提交</t-button>
      </div>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {Message} from "tdesign-mobile-vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

/**
 * data
 */
const goodsInfo = route.query;

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
/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  console.log(goodsInfo);

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
.declaration-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

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
      display: flex;
      justify-content: space-between;

      .t-button {
        width: 47%;
      }
    }
  }
}
</style>
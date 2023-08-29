<!--
  * @author baoyuhao
  * @date 2023/8/13 21:13:11
  * @description 报单卡片
  * @version 0.8.0
-->
<template>
  <t-collapse theme="card" style="margin-top: 10px;" :expandIcon="false" class="collapse">
    <t-collapse-panel value="0">
      <template #header>
        <div class="declarationHeader">
          <div class="declarationTitle">
            <t-tag variant="outline" theme="primary">{{ declarationInfo.index }}</t-tag>
            <div>{{ declarationInfo.commodity }}</div>
          </div>
          <div class="declarationInfo">
            <div>{{ declarationInfo.payAmount }}</div>
            <div>{{ timestampToDateTime(declarationInfo.payTime) }}</div>
          </div>
          <div class="declarationOptions">
            <t-tag variant="light" theme="primary" style="margin-right: 0;">
              {{ statusCodeToText(declarationInfo.status) }}
            </t-tag>
          </div>
        </div>
      </template>
      <div class="declarationContent">
        <div class="contentInfo">
          <div style="width: 100%;">订单号：{{ declarationInfo.orderId }}</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;overflow: hidden;">微信名：{{ declarationInfo.userName }}</div>
        </div>


        <div class="contentInfo">
          <div style="width: 50%;">实付金额：{{ declarationInfo.payAmount }} 元</div>
          <div style="width: 50%;">预计返款金额：{{ declarationInfo.actualPayback }} 元</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">报单时间：{{ timestampToDateTime(declarationInfo.reportTime) }}</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">订单备注：{{ declarationInfo.examineNotes }}</div>
        </div>
        <div class="contentInfo" style="margin-top: 20px;">
          <div style="width: 100%;">申请返款时间：{{ timestampToDateTime(declarationInfo.paybackTime) }}</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">结算ID：{{ declarationInfo.payStatId }}</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">结算时间：{{ timestampToDateTime(declarationInfo.payTime) }}</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">结算金额：{{ declarationInfo.settlementAmount }} 元</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">审核备注：{{ declarationInfo.examineNotes }}</div>
        </div>
        <div class="contentBtns">
          <t-button theme="light" size="small" style="margin-right: 5px;">修改订单</t-button>
          <t-button theme="primary" size="small" @click="applyBackMoney(declarationInfo)">申请返款</t-button>
        </div>
      </div>
    </t-collapse-panel>
  </t-collapse>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import router from "@/router";
import {timestampToDateTime} from "../../utils/date";
import {statusCodeToText} from "../../utils/goodStatus";

const props = defineProps({
  declarationInfo: Object
});
/**
 * data
 */
const declarationInfo = reactive(props.declarationInfo);

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

/**
 * 业务相关
 */
const applyBackMoney = (declarationInfo: any) => {
  console.log(declarationInfo);
  router.push({
    path: '/applyBackMoney',
    query: declarationInfo
  })
}
</script>

<style lang="less" scoped>
.collapse {
  width: 95%;

  .declarationHeader {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;

    .t-tag {
      margin-right: 10px;
    }

    .declarationTitle {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .declarationInfo {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      color: #aaa;
    }

    .declarationOptions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 10px;
    }
  }

  .declarationContent {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .contentInfo {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 14px;
      font-weight: bold;
    }

    .contentBtns {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
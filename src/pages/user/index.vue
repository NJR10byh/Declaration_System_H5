<!--
  * @author baoyuhao
  * @date 2023/8/9 14:26:23
  * @description 
  * @version 0.8.0
-->
<template>
  <div class="user-container">
    <t-avatar image="https://tdesign.gtimg.com/mobile/demos/avatar_1.png" size="large"
              style="margin-top: 60px"></t-avatar>
    <div style="margin-top: 10px;font-size: 15px;color: #888;">测试用户</div>
    <div class="grid-demo">
      <t-grid :column="4" theme="card" border>
        <t-grid-item text="已报单" @click="to_business('已报单')">
          <template #image>
            <t-icon name="task-checked" size="2em"/>
          </template>
        </t-grid-item>
        <t-grid-item text="待审核" @click="to_business('待审核')">
          <template #image>
            <t-icon name="info-circle" size="2em"/>
          </template>
        </t-grid-item>
        <t-grid-item text="待返款" @click="to_business('待返款')">
          <template #image>
            <t-icon name="wallet" size="2em"/>
          </template>
        </t-grid-item>
        <t-grid-item text="已返款" @click="to_business('已返款')">
          <template #image>
            <t-icon name="check-circle" size="2em"/>
          </template>
        </t-grid-item>
      </t-grid>
    </div>

    <div class="cell-group">
      <t-cell-group theme="card">
        <t-cell title="我的报单" arrow @click="to_business('全部')">
          <template #leftIcon>
            <t-icon name="catalog"/>
          </template>
        </t-cell>
        <t-cell title="我的账单" arrow @click="to_myBill">
          <template #leftIcon>
            <t-icon name="root-list"/>
          </template>
        </t-cell>
        <t-cell title="个人信息" arrow @click="to_userInfo">
          <template #leftIcon>
            <t-icon name="user"/>
          </template>
        </t-cell>
        <t-cell title="修改密码" arrow @click="to_changePassword">
          <template #leftIcon>
            <t-icon name="rotate-locked"/>
          </template>
        </t-cell>
        <t-cell title="退出登录" arrow @click="handleLogout">
          <template #leftIcon>
            <t-icon name="logout"/>
          </template>
        </t-cell>
      </t-cell-group>
    </div>
  </div>
  <t-tab-bar v-model="barValue" :split="false">
    <t-tab-bar-item v-for="item in barList" :key="item.value" :value="item.value" @click="switchTab(item)">
      {{ item.label }}
      <template #icon>
        <t-icon :name="item.icon"/>
      </template>
    </t-tab-bar-item>
  </t-tab-bar>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import router from "@/router";
import {request} from "@/utils/request";
import {Toast} from "tdesign-mobile-vue";

/**
 * data
 */
const barValue = ref('user');
const barList = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
]);

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
// 切换tab
const switchTab = (item: any) => {
  router.push({
    path: `/${item.value}`
  });
}

/**
 * 业务相关
 */
const to_business = (page: any) => {
  router.push({
    path: '/business',
    query: {
      page: page
    }
  });
}

const to_myBill = () => {
  router.push("/myBill");
}

const to_userInfo = () => {
  router.push("/userInfo");
}
const to_changePassword = () => {
  router.push("/changePassword");
}

const handleLogout = async () => {
  request.post({
    url: "/logout"
  }).then(res => {
    if (res.code === 200) {
      Toast.success("登出成功")
      localStorage.removeItem("token");
      router.push("/login");
    }
  }).catch(err => {
    Toast.error(err.message)
  }).finally(() => {
  });
};
</script>

<style lang="less" scoped>
.user-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .grid-demo {
    width: 100%;
    margin-top: 70px;

    .t-grid-item /deep/ .t-grid-item__image {
      background: #fff;
    }
  }

  .cell-group {
    width: 100%;
    margin-top: 15px;

    .t-icon {
      color: #000;
    }
  }
}
</style>
/**
 * @author baoyuhao
 * @date 2023/8/8 17:01:34
 * @description
 * @version 0.1.0
 */
export default [
    {
        path: "/home",
        name: "home",
        component: () => import("@/pages/home/index.vue"),
        meta: {title: "首页", rolePermission: ["superadmin"]}
    },
    {
        path: "/user",
        name: "user",
        component: () => import("@/pages/user/index.vue"),
        meta: {title: "我的", rolePermission: ["superadmin"]}
    },
    {
        path: "/declaration",
        name: "declaration",
        component: () => import("@/pages/declaration/index.vue"),
        meta: {title: "报单", rolePermission: ["superadmin"]}
    },
    {
        path: "/business",
        name: "business",
        component: () => import("@/pages/business/index.vue"),
        meta: {title: "概览", rolePermission: ["superadmin"]}
    },
    {
        path: "/applyBackMoney",
        name: "applyBackMoney",
        component: () => import("@/pages/applyBackMoney/index.vue"),
        meta: {title: "申请返款", rolePermission: ["superadmin"]}
    },
    {
        path: "/myBill",
        name: "myBill",
        component: () => import("@/pages/myBill/index.vue"),
        meta: {title: "我的账单", rolePermission: ["superadmin"]}
    },
    {
        path: "/billDetail",
        name: "billDetail",
        component: () => import("@/pages/myBill/detail.vue"),
        meta: {title: "账单详情", rolePermission: ["superadmin"]}
    }
];
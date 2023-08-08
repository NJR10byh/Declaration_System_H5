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
    }
];
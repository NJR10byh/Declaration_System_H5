/**
 * @author baoyuhao
 * @date 2022/12/17 15:31:04
 * @description
 * @version 0.1.0
 */
import {getPermissionStore, getUserStore, usePermissionStore, useUserStore} from "@/store";
import {Toast} from "tdesign-mobile-vue";
import {reactive} from "vue";
import {isNotEmpty} from "@/utils/validate";
import router from "@/router";

const userStore = useUserStore();
const permissionStore = usePermissionStore();
const userInfo = reactive({
    id: "",
    bankName: "",
    bankNum: "",
    phoneNum: "",
    userName: "",
    zfbNum: "",
    role: ""
});

export const checkAuth = () => {
    const userStore = getUserStore();
    const permissionStore = getPermissionStore();
    const {role} = userStore;
    console.log("已登录权限：" + role);
    if (isNotEmpty(role)) {
        permissionStore.initRoutes(role);
        return true;
    } else {
        return false;
    }
};

/**
 * 用户个人信息进入缓存
 * @param info
 */
export const userInfoToCache = async (info: any) => {
    userInfo.bankName = info.bankName;
    userInfo.bankNum = info.bankNum;
    userInfo.id = info.id;
    userInfo.phoneNum = info.phoneNum;
    userInfo.userName = info.userName;
    userInfo.zfbNum = info.zfbNum;
    userInfo.role = info.role;
    userStore.getUserInfo(userInfo);
    await permissionStore.initRoutes(info.role);

    Toast.success("欢迎您，" + info.userName)
    await router.push("/home");
};


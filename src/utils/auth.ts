/**
 * @author baoyuhao
 * @date 2022/12/17 15:31:04
 * @description
 * @version 0.1.0
 */
import {getPermissionStore, getUserStore, usePermissionStore, useSettingStore, useUserStore} from "@/store";
import {request} from "@/utils/request";
import {Toast} from "tdesign-mobile-vue";
import {reactive, ref} from "vue";
import STYLE_CONFIG from "@/config/style";
import {chargeTheme} from "@/utils/date";
import {isNotEmpty} from "@/utils/validate";
import router from "@/router";

const userStore = useUserStore();
const permissionStore = usePermissionStore();
const userInfo = reactive({
    userName: "",
    userDepartment: "",
    userGh: "",
    userPhone: "",
    userEmail: "",
    userIdCard: "",
    role: "",
    roles: [],
    authorities: []
});
const settingStore = useSettingStore();

const initStyleConfig = () => {
    const styleConfig = STYLE_CONFIG;
    for (const key in styleConfig) {
        if (Object.prototype.hasOwnProperty.call(styleConfig, key)) {
            styleConfig[key] = settingStore[key];
        }
    }

    return styleConfig;
};

const formData = ref({...initStyleConfig()});


const getUserContactInfoUrl = ref("/user/getUserContactInfo");


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
export const userInfoToCache = async (info: {
    userName: string;
    userDepartment: string;
    userGh: string;
    role: string;
    roles: any[];
    authorities: any[];
}) => {
    userInfo.userName = info.userName;
    userInfo.userDepartment = info.userDepartment;
    userInfo.userGh = info.userGh;
    userInfo.role = info.role;
    userInfo.roles = info.roles;
    userInfo.authorities = info.authorities;
    await permissionStore.initRoutes(info.role);
    await request.get({
        url: getUserContactInfoUrl.value
    }).then(res => {
        console.log(res);
        userInfo.userPhone = res.userPhone;
        userInfo.userEmail = res.userEmail;
        userInfo.userIdCard = res.userIdCard;
        userStore.getUserInfo(userInfo);
    }).catch(err => {
        Toast.error(err.message)
    }).finally(() => {
    });
    /* 处理主题 */
    formData.value.mode = chargeTheme(); // 根据当前系统时间切换主题模式（light、dark）

    Toast.success("欢迎您，" + info.userName)


    /* 分权限处理 默认跳转页 */
    switch (userInfo.role) {
        case "superadmin":
            formData.value.brandTheme = "default";
            settingStore.updateConfig(formData.value);
            await router.push("/home");
            break;
        case "teacher":
            formData.value.brandTheme = "purple";
            settingStore.updateConfig(formData.value);
            await router.push("/home");
            break;
    }
};

/**
 * 获取权限名称
 * @param role
 */
export const getRoleName = (role: any) => {
    let roleName = "";
    switch (role) {
        case "superadmin":
            roleName = "产学研超级管理员";
            break;
        case "teacher":
            roleName = "教师";
            break;
    }
    return roleName;
};


<template>
  <div
    class="token-login"
    v-loading="loginLoading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="登录中..."
  ></div>
</template>

<script>
import {
  getEnvConfig,
  authLogin,
  loginJumpCustomerId,
  getUserInfoByCustomer,
} from "@/apis/global";

export default {
  name: "token-login",
  data() {
    return {
      loginLoading: false,
    };
  },

  created() {
    this.loginLoading = true;
    let self = this;

    // 获取系统环境配置
    getEnvConfig()
      .then((res) => {
        sessionStorage.setItem("appInfo", JSON.stringify(res.data.appInfo));

        authLogin().then((authRes) => {
          sessionStorage.setItem("userInfo", JSON.stringify(authRes.data.user));
          loginJumpCustomerId().then((loginRes) => {
            if (loginRes.code == 200 && loginRes.data) {
              getUserInfoByCustomer({ customerId: loginRes.data }).then(
                (infoRes) => {
                  let userInfo = infoRes.data.userInfo;
                  userInfo.userName = authRes.data.user.userName;
                  userInfo.isChild = true;
                  userInfo.parentCustomerId =
                    authRes.data.user.customerId ||
                    authRes.data.user.belongToNetwork;
                  userInfo.parentUserType = authRes.data.user.userType;
                  sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
                  self.$router.push({ path: "/index" });
                }
              );
            } else {
              self.$router.push({ path: "/index" });
            }
          });
        });
      })
      .catch((error) => {
        this.$message({
          message: "获取环境配置失败",
          type: "error",
        });
        this.loginLoading = false;
      });
  },
};
</script>
<style>
.token-login {
  height: 100%;
  height: 100vh;
  min-height: 400px;
}
</style>


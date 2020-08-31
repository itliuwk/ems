<template>
  <div class="index" v-loading="loading">
    <div class="header">
      <div class="header-left dl">
        <!-- <img src="../../assets/images/logo.png" alt="logo" /> -->
        <img class="logo" :src="logoUrl" alt="logo" @error="imgerrorfun()" />
        <span class="title">储能EMS系统</span>
        <span class="child">{{isChild?' - '+ childName:''}}</span>
      </div>
      <div class="header-center dl">
        <ul class="ov">
          <li :class="[filed=='EnergyStorage'?'active':'']" @click="tabClick('EnergyStorage')">
            <div>
              <div>
                <svg-icon icon-class="储能概览" />
              </div>
              <span>储能概览</span>
            </div>
          </li>
          <li :class="[filed=='PCSMonitor'?'active':'']" @click="tabClick('PCSMonitor')">
            <div>
              <div>
                <svg-icon icon-class="PCS监测" />
              </div>
              <span>PCS监测</span>
            </div>
          </li>
          <li :class="[filed=='BMSmonitor'?'active':'']" @click="tabClick('BMSmonitor')">
            <div>
              <div>
                <svg-icon icon-class="BMS监测" />
              </div>
              <span>BMS监测</span>
            </div>
          </li>
          <li :class="[filed=='EventDynamics'?'active':'']" @click="tabClick('EventDynamics')">
            <div>
              <div>
                <svg-icon icon-class="事件动态" />
              </div>
              <span>事件动态</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="header-right">
        <div class="header-back dl curp" @click="backBaseTeam">
          <!-- <img src="../../assets/images/返回首页.png" alt="logo" /> -->
          <svg-icon icon-class="返回首页" />
          <span>返回首页</span>
        </div>
        <div class="header-customer dl curp" v-if="parentUserType=='1'">
          <el-popover placement="bottom" width="700" popper-class="customer-b" trigger="hover">
            <div class="customer-content">
              <div class="search">
                搜索客户：
                <el-input
                  v-model="customerVal"
                  style="width:200px"
                  @keyup.enter.native="search"
                  placeholder="请输入关键字搜索"
                ></el-input>
              </div>
              <div class="customer-c">
                <div>客户</div>
                <div class="names">
                  <p
                    v-for="(item,idx) in customerList"
                    @click="customerHandle(item)"
                    :key="idx"
                  >{{item.shortName}}</p>
                </div>
              </div>
            </div>
            <el-button slot="reference">
              <svg-icon icon-class="切换" />
              <span>客户切换</span>
            </el-button>
          </el-popover>
          <!-- <img src="../../assets/images/返回首页.png" alt="logo" /> -->
        </div>
        <div class="header-user dl">
          <!-- <img class="header-user-img" :src="userInfo.imgurl" /> -->
          <!-- <img class="header-user-img" src="../../assets/images/登录账号icon.png" /> -->
          <svg-icon icon-class="登录账号" />

          <span class="header-user-text otw">{{userInfo.userName||'测试'}}</span>
          <span @click="logout" class="header-sign-out curp">退出</span>
        </div>
      </div>
    </div>
    <div class="container" :loading="showSlide">
      <transition name="slide-fade">
        <component
          :is="filed"
          v-if="showSlide"
          :key="key+1"
          :userInfo="userInfo"
          :toEventVal="toEventVal"
          :childCustomerId="childCustomerId"
          @toEvent="toEvent"
        ></component>
      </transition>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import EnergyStorage from "../energyStorage/";
import PCSMonitor from "../PCSMonitor/";
import BMSmonitor from "../BMSmonitor/";
import EventDynamics from "../eventDynamics/";
import { logout, queryCustomerList, getLogoById } from "@/apis/global";

export default {
  name: "homeindex",

  data() {
    return {
      loading: false,
      showSlide: true,
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || {},
      appInfo: JSON.parse(sessionStorage.getItem("appInfo")) || {},
      menus: JSON.parse(sessionStorage.getItem("menus")) || {},
      filed: "EnergyStorage",
      key: 0,
      customerList: [],
      copyCustomerList: [],
      childCustomerId: "",
      customerVal: "",
      childInfo: {},
      toEventVal: {}, //查看更多传输的参数
    };
  },
  components: {
    EnergyStorage,
    PCSMonitor,
    BMSmonitor,
    EventDynamics,
  },

  computed: {
    customerId() {
      return (
        this.userInfo.parentCustomerId ||
        this.userInfo.customerId ||
        this.userInfo.belongToNetwork
      );
    },
    parentUserType() {
      return this.userInfo.parentUserType || this.userInfo.userType;
    },
    isChild() {
      return this.childInfo.isChild || this.userInfo.isChild;
    },
    childName() {
      return this.childInfo.shortName || this.userInfo.customerName;
    },
    logoUrl() {
      return this.userInfo.imgLogo
        ? this.domain + this.userInfo.imgLogo
        : "https://imgfs.sunwuu.com/images/4707300763354112";
    },
  },
  created() {
    let imgfs = this.appInfo.find((n) => {
      return n.appName == "imgfs";
    });

    if (imgfs) {
      this.userInfo.imgurl =
        imgfs.viewExtranetBaseUri + "/images/" + this.userInfo.imgLogo;
    } else {
      this.userInfo.imgurl = "../../../../static/temp/avatar.png";
    }
  },
  mounted() {
    if (this.parentUserType == "1") {
      this.queryCustomerList();
    }
  },
  beforeDestroy() {},
  methods: {
    tabClick(val, is) {
      // if (val == "EnergyStorage") {
      //   window.location.reload();
      // }
      this.filed = val;
      this.showSlide = false;
      this.key++;
      if (!is) {
        this.toEventVal = {};
      }
      setTimeout(() => {
        this.showSlide = true;
      }, 500);
      // this.$router.push("/" + val);
    },
    toEvent(val) {
      this.toEventVal = val;
      this.tabClick("EventDynamics", true);
    },
    search() {
      let val = this.customerVal;
      let customerList = this.customerList;
      let copyCustomerList = this.copyCustomerList;
      if (!val) {
        this.customerList = JSON.parse(JSON.stringify(copyCustomerList));
        return;
      }
      let newArr = [];
      copyCustomerList.map((item) => {
        if (item.shortName.indexOf(val) != -1) {
          newArr.push(item);
        }
        return item;
      });
      this.customerList = newArr;
    },
    customerHandle(val) {
      this.childCustomerId = val.customerId;
      val.isChild = true;
      this.childInfo = val;
      getLogoById({ customerId: val.customerId, isNetworkId: 0 }).then(
        (res) => {
          this.userInfo = {
            ...this.userInfo,
            imgLogo: res.data,
          };
        }
      );
    },
    /**
     * 获取中心下的所有客户
     */
    queryCustomerList() {
      queryCustomerList({ networkId: this.customerId, sysName: "ESEMS" }).then(
        (res) => {
          if (res.code == 200 && res.data) {
            this.customerList = res.data;
            this.copyCustomerList = res.data;
          }
        }
      );
    },
    logout() {
      let target = this.appInfo.find((n) => {
        return n.appName == "esems";
      });
      if (target) {
        window.location.href = target.extranetBaseUri + "/logout";
      } else {
        throw Error("配置错误，跳转失败");
      }
    },
    // 回到统一的工作台
    backBaseTeam: function () {
      let target = this.appInfo.find((n) => {
        return n.appName == "base";
      });

      if (target) {
        window.location.href = target.viewExtranetBaseUri;
      } else {
        throw Error("配置错误，跳转失败");
      }
    },
    imgerrorfun() {
      var img = event.srcElement;
      img.src = "../../../static/img/4707300763354112.jpg";
      img.onerror = null;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.index {
  height: 100%;
  overflow: hidden;
}

.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.05s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(50px);
  opacity: 0;
}

.header {
  height: 82px;
  width: 100%;
  display: flex;
  background: #01031b;
  color: #fff;
  .header-left {
    max-width: 450px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    padding-left: 1vw;
    img {
      width: 186px;
      // padding-right: 15px;
      margin-right: 15px;
    }
    .logo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .title {
      padding-right: 10px;
      font-size: 20px;
      font-weight: bold;
    }
    .child {
      font-size: 18px;
    }
  }

  .header-center {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    ul {
      height: 100%;
      li {
        height: 100%;
        float: left;
        width: 100px;
        color: rgba(255, 255, 255, 1);
        opacity: 0.4;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
          > div {
            margin-bottom: 4px;
          }
        }
        .svg-icon {
          font-size: 30px;
          width: 20px;
          height: 20px;
        }
      }
      li.active {
        color: #00a0e9;
        background: url("../../assets/images/border.png") no-repeat;
        background-size: 100% 100%;
        // animation: move 2s ease-in-out;
        opacity: 1;
      }
      @keyframes move {
        0% {
          transform: rotate(-30deg);
        }
        50% {
          transform: rotate(30deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
    }
  }

  .header-right {
    min-width: 400px;
    display: flex;
    justify-content: flex-end;
    padding-right: 12px;
    align-items: center;
    img {
      vertical-align: top;
    }
    .header-back {
      span {
        vertical-align: bottom;
      }
      span {
        font-size: 16px;
      }
    }
    .header-customer {
      padding-left: 30px;
      span {
        font-size: 16px;
        vertical-align: middle;
      }
    }
    .header-user {
      padding-left: 30px;
      .header-sign-out::before {
        content: "|";
        padding: 12px;
        color: #fff;
        font-weight: bold;
      }
      span {
        font-size: 16px;
      }
      .header-user-text {
        display: inline-block;
        max-width: 120px;
      }
      .header-user-text,
      .header-sign-out {
        vertical-align: bottom;
      }
      img {
        // width: 20px;
        max-width: 100%;
      }
    }
  }
}

.customer-content {
  padding: 30px;
  box-sizing: border-box;
  .search {
    color: #fff;
    font-size: 12px;
  }
  .customer-c {
    display: flex;
    margin-top: 30px;
    > div:nth-child(1) {
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background: rgba(0, 160, 233, 1);
      border-radius: 50%;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-right: 30px;
    }

    .names {
      flex: 9;
      min-height: 200px;
      p {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
      }
      p:hover {
        color: #00a0e9;
      }
    }
  }
}

.container {
  background: #0e0e2c url("../../assets/images/网格.png");
  height: calc(100% - 80px);
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.el-button {
  background: transparent;
  border: none;
  color: #fff;
}
</style>

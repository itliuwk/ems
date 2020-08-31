<template>
  <!-- <homeindex name="PCSMonitor"> -->
  <div class="psc-wrapper">
    <div class="psc-l">
      <p class="pTit">整机状态</p>
      <div class="status bgBorder">
        <div>
          <el-select v-model="value" placeholder="请选择" @change="equipmentChange" class="sel120">
            <el-option
              v-for="item in options"
              :key="item.equipmentId"
              :label="item.equipmentName"
              :value="item.equipmentId"
            ></el-option>
          </el-select>
        </div>
        <div class="psc-complete-machine">
          <ul>
            <li>
              <p>运行状态</p>
              <div class="complete-machine-info">{{pcsInvData.runningState|filterRunningState}}</div>
            </li>
            <li>
              <p>系统状态</p>
              <div class="complete-machine-info">{{pcsDcdcData.chargingState|filterChargingState}}</div>
            </li>
            <li>
              <p>并网状态</p>
              <div class="complete-machine-info">{{pcsInvData.onGridState|filterOnGridState}}</div>
            </li>
            <li>
              <p>手动/自动</p>
              <div class="complete-machine-info">{{pcsData.movementMode||'-'}}</div>
            </li>
            <li>
              <p>本地/远程</p>
              <div class="complete-machine-info">{{pcsData.operationMode||'-'}}</div>
            </li>
            <li>
              <p>BMS使能</p>
              <div class="complete-machine-info">{{pcsData.bmsEnable||'-'}}</div>
            </li>
            <li>
              <p>STS接入</p>
              <div class="complete-machine-info">{{pcsData.stsState||'-'}}</div>
            </li>
            <li>
              <p>当前时段</p>
              <div class="complete-machine-info">{{pcsData.humpType||'-'}}</div>
            </li>
          </ul>
        </div>
        <div class="data-info">
          <div class="direct">
            <p class="title-style">
              <span>直流侧数据</span>
            </p>
            <div class="info">
              <div>
                <p class="text-tit">直流侧电压</p>
                <p class="text-num">{{pcsDcdcData.directCurV||0}}V</p>
              </div>
              <div>
                <p class="text-tit">直流侧电流</p>
                <p class="text-num">{{pcsDcdcData.directCurI||0}}A</p>
              </div>
              <div>
                <p class="text-tit">直流侧功率</p>
                <p class="text-num">{{pcsDcdcData.directCurP||0}}kW</p>
              </div>
            </div>
          </div>
          <div class="communication">
            <p class="title-style">
              <span>交流侧数据</span>
            </p>
            <div class="info">
              <div>
                <p class="text-tit">交流侧电压</p>
                <p class="text-num">
                  <span>UA：</span>
                  <span>{{pcsData.pcsLineAbV||0}}V</span>
                </p>
                <p class="text-num">
                  <span>UB：</span>
                  <span>{{pcsData.pcsLineBcV||0}}V</span>
                </p>
                <p class="text-num">
                  <span>UC：</span>
                  <span>{{pcsData.pcsLineCaV||0}}V</span>
                </p>
              </div>
              <div>
                <p class="text-tit">交流侧电流</p>
                <p class="text-num">
                  <span>IA：</span>
                  <span>{{pcsData.pcsOutputiA||0}}A</span>
                </p>
                <p class="text-num">
                  <span>IB：</span>
                  <span>{{pcsData.pcsOutputiB||0}}A</span>
                </p>
                <p class="text-num">
                  <span>IC：</span>
                  <span>{{pcsData.pcsOutputiC||0}}A</span>
                </p>
              </div>
              <div>
                <p class="text-tit">交流侧功率</p>
                <p class="text-num">
                  <span>A相：</span>
                  <span>{{pcsData.pcsActiveAp||0}}kW</span>
                </p>
                <p class="text-num">
                  <span>B相：</span>
                  <span>{{pcsData.pcsActiveBp||0}}kW</span>
                </p>
                <p class="text-num">
                  <span>C相：</span>
                  <span>{{pcsData.pcsActiveCp||0}}kW</span>
                </p>
                <p class="text-num">
                  <span>总和：</span>
                  <span>{{pcsData.pcsTotalActiveP||0}}kW</span>
                </p>
              </div>
              <div>
                <p class="text-tit">交流侧频率</p>
                <p class="text-num">{{pcsData.pcsFreqA||0}}Hz</p>
                <!-- <p class="text-num">B：{{pcsData.pcsFreqB||0}}HZ</p>
                <p class="text-num">C：{{pcsData.pcsFreqC||0}}HZ</p>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="psc-r">
      <div class="power">
        <p class="pTit">实时功率曲线</p>
        <div
          class="chart bgBorder"
          v-loading="timeLoading"
          element-loading-background="rgba(0, 0, 0, 0.5)"
        >
          <screenLine @dateChange="dateChange" filed="date"></screenLine>
          <infoLine
            :lineId="'timeLine'"
            v-if="!timeLoading"
            :loading="timeLoading"
            :option="timeLineOption"
            :width="'100%'"
            style="width: 100%;height:calc(100% - 50px)"
          ></infoLine>
        </div>
      </div>
      <div class="dynamic">
        <div>
          <p class="pTit dl">PCS动态</p>
          <p class="dl view-detail curp" @click="more">
            查看更多
            <i class="iconfont icon-gengduo"></i>
          </p>
        </div>
        <div
          class="chart bgBorder dynamic-card"
          v-loading="realtimeLoading"
          element-loading-background="rgba(0, 0, 0, 0.5)"
        >
          <el-scrollbar v-if="realtimeSoeData.length" style="width:100%;height:100%">
            <ul class="dynamic-u">
              <li v-for="(item,index) in realtimeSoeData" :key="index">
                <p class="otw" :class="index%2?'right':'left'">
                  <span>
                    <svg-icon :icon-class="item.svg"></svg-icon>
                  </span>
                  {{item.customerName}} - {{item.soeNote}}
                </p>
                <p :class="index%2?'pright':'pleft'">{{item.createDate}}</p>
              </li>
            </ul>
          </el-scrollbar>
          <p v-else class="not-data">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
  <!-- </homeindex> -->
</template>

<script>
import Homeindex from "../homeIndex/index";
import infoLine from "@components/line";
import infoList from "@components/list";
import ScreenLine from "@components/screenLine";
import moment from "moment";
import {
  getEquipmentListByType,
  getPcsActiveDataByCustomer,
  getPcsStateData,
  getSystemDynamicsData,
} from "@/apis/views/index";
export default {
  name: "",
  props: {},
  data() {
    return {
      options: [],
      value: "",
      timeLineOption: {},
      timeLoading: false,
      resize: true,
      userInfo: this.$attrs.userInfo,
      pcsData: {},
      pcsDcdcData: {},
      pcsInvData: {},
      realtimeSoeData: [],
      realtimeLoading: false,
      autoTimer: null,
      currVal: {},
    };
  },
  components: {
    infoLine,
    infoList,
    Homeindex,
    ScreenLine,
  },
  watch: {
    childCustomerId(val) {
      this.getEquipmentListByType();
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
  },
  computed: {
    customerId() {
      //  || this.userInfo.belongToNetwork;
      return this.userInfo.customerId;
    },
  },
  mounted() {
    let that = this;
    this.getEquipmentListByType();
    this.autoTimer = setInterval(() => {
      this.getEquipmentListByType();
    }, 120000);
  },
  beforeDestroy() {
    clearInterval(this.autoTimer);
  },
  props: {
    childCustomerId: {},
  },
  methods: {
    /**
     * 设备列表
     */
    getEquipmentListByType() {
      getEquipmentListByType({
        customerId: this.childCustomerId || this.customerId,
        type: "PCS",
      })
        .then((res) => {
          if (this.loading) {
            this.loading.close();
          }
          if (res.code == 200 && res.data && res.data.length) {
            this.options = res.data;
            this.value = res.data[0].equipmentId;
            if (JSON.stringify(this.currVal) == "{}") {
              this.currVal = res.data[0];
            }
            this.getPcsActiveDataByCustomer(this.currVal);
            this.getPcsStateData(res.data[0]);
            this.getSystemDynamicsData(res.data[0]);
          } else {
            this.pcsData = {};
            this.pcsDcdcData = {};
            this.pcsInvData = {};
            this.realtimeSoeData = [];
            this.$nextTick(() => {
              this.setLineOption([], []);
            });
          }
        })
        .catch((err) => {
          if (this.loading) {
            this.loading.close();
          }
        });
    },
    /**
     * PCS状态
     */
    getPcsStateData(obj) {
      getPcsStateData({
        customerId: this.childCustomerId || this.customerId,
        addrIP: obj.addrIP,
        addrIPOrder: obj.addrIPOrder,
        equipmentId: obj.equipmentId,
      }).then((res) => {
        this.pcsData = res.data.pcsData;
        this.pcsDcdcData = res.data.pcsDcdcData;
        this.pcsInvData = res.data.pcsInvData;
      });
    },
    dateChange(val) {
      this.currVal = {
        ...this.currVal,
        ...val,
      };
      this.getPcsActiveDataByCustomer(this.currVal);
    },
    /**
     * PCS功率曲线
     */
    getPcsActiveDataByCustomer(obj) {
      this.timeLoading = true;
      getPcsActiveDataByCustomer({
        customerId: this.childCustomerId || this.customerId,
        equipmentId: obj.equipmentId,
        beginTime: obj.beginTime,
        endTime: obj.endTime,
      })
        .then((res) => {
          this.timeLoading = false;
          let xAxis = [],
            series = [];
          res.data.map((item) => {
            xAxis.push(item.time);
            series.push(item.value);
            return item;
          });

          this.$nextTick(() => {
            this.setLineOption(xAxis, series);
          });
        })
        .catch((err) => {
          this.timeLoading = false;
        });
    },
    /**
     * PCS动态
     */
    getSystemDynamicsData(obj) {
      this.realtimeLoading = true;

      let isNetworkId = 0;
      if (this.userInfo.userType == 1) {
        isNetworkId = 1;
      }
      if (this.childCustomerId) {
        isNetworkId = 0;
      }

      getSystemDynamicsData({
        id: this.childCustomerId || this.customerId,
        isNetworkId,
        addrIP: obj.addrIP,
        addrIPOrder: obj.addrIPOrder,
        equipmentId: obj.equipmentId,
      })
        .then((res) => {
          this.realtimeLoading = false;
          if (res.code == 200) {
            let realtimeSoeData = res.data.list.realtimeSoeData.map((item) => {
              switch (item.status) {
                case "0":
                  item.svg = "通知";
                  break;
                case "1":
                  item.svg = "通知";
                  break;
                case "2":
                  item.svg = "并网";
                  break;
                case "3":
                  item.svg = "离网";
                  break;
                case "4":
                  item.svg = "充电";
                  break;
                case "5":
                  item.svg = "放电";
                  break;
                case "6":
                  item.svg = "通知";
                  break;
                default:
                  item.svg = "通知";
                  break;
              }
              return item;
            });
            this.realtimeLoading = false;
            this.realtimeSoeData = realtimeSoeData || [];
          }
        })
        .catch((err) => {
          this.realtimeLoading = false;
        });
    },
    /**
     * 下拉选择事件
     */
    equipmentChange(val) {
      let obj = {};
      this.options.map((item) => {
        if (val == item.equipmentId) {
          obj = item;
        }
        return item;
      });
      this.currVal = obj;
      this.getPcsStateData(obj);
      this.getSystemDynamicsData(obj);
      this.getPcsActiveDataByCustomer(obj);
    },
    /**
     * 查看更多
     */
    more() {
      this.$emit("toEvent", this.currVal);
    },
    setLineOption(xAxis, series) {
      this.timeLineOption = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: 50,
          right: 50,
        },
        xAxis: {
          type: "category",
          data: xAxis,
          axisLabel: {
            color: "#84A0B6",
          },
          axisLine: {
            lineStyle: {
              color: "#84A0B6",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "功率(kW)",
          splitLine: {
            show: false,
          },
          lineStyle: {
            color: "#84A0B6",
          },
          nameTextStyle: {
            color: "#84A0B6",
          },
          axisLabel: {
            color: "#84A0B6",
          },
          axisLine: {
            lineStyle: {
              color: "#84A0B6",
            },
          },
        },
        series: [
          {
            data: series,
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#00A3E0",
                },
              },
            },
          },
        ],
      };
    },
  },
  filters: {
    filterRunningState(val) {
      switch (val) {
        case "0":
          return "停机";
          break;
        case "1":
          return "运行";
          break;
        default:
          return "-";
          break;
      }
    },
    filterChargingState(val) {
      switch (val) {
        case "1":
          return "充电";
          break;
        case "2":
          return "放电";
          break;
        case "3":
          return "静置";
          break;
        default:
          return "-";
          break;
      }
    },
    filterOnGridState(val) {
      switch (val) {
        case "0":
          return "离网";
          break;
        case "1":
          return "并网";
          break;
        default:
          return "-";
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/common.scss";
.psc-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .psc-l {
    width: 550px;

    .status {
      height: calc(100% - 30px) !important;
      background: url("../../assets/images/整机状态左侧.png") no-repeat;
    }
    .psc-complete-machine {
      margin-top: 14px;
      ul {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        li {
          // height: 80px;
          // height: 7vh;
          background: $bgColor;
          margin-bottom: 12px;
          box-sizing: border-box;
          > p {
            padding: 6px;
            font-size: 12px;
            color: rgba(132, 160, 182, 1);
          }
          .complete-machine-info {
            padding: 10px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: $numStatusColor;
          }
        }

        > li:nth-child(odd) {
          width: calc(50% - 6px);
          margin-right: 6px;
        }
        > li:nth-child(even) {
          width: calc(50% - 6px);
          margin-left: 6px;
        }
      }
    }
    .data-info {
      margin-top: 50px;
      .direct,
      .communication {
        .info {
          display: flex;
          margin: 20px 0;
          > div {
            flex: 1;
            text-align: center;
            font-size: 12px;
            .text-num {
              color: $numStatusColor;
              font-size: 14px;
              font-weight: bold;
              margin-top: 10px;
              display: flex;
              justify-content: center;
              span:nth-child(1) {
                display: inline-block;
                width: 50px;
                text-align: right;
              }
              span {
                flex: 1;
                text-align: left;
              }
            }
            .text-tit {
              font-size: 12px;
              font-weight: 400;
              color: $textColor;
            }
          }
        }
      }
      .communication {
        margin-top: 50px;
      }
    }
  }
  .psc-r {
    width: calc(100% - 562px);
    // flex: 1;
    margin-left: 12px;
    display: flex;
    flex-flow: column;
    > div {
      height: 500px;
      overflow: hidden;
      flex: 1;
      .chart {
        height: calc(100% - 32px) !important;
        background: url("../../assets/images/右侧.png") no-repeat;
      }
    }
    .power {
      margin-bottom: 12px;
    }
    .dynamic {
      .view-detail {
        float: right;
        font-size: 12px;
        font-weight: 400;
        color: rgba(132, 160, 182, 1);
        vertical-align: middle;
        position: relative;
        top: 8px;
        right: 5px;
        i {
          vertical-align: middle;
          color: $numStatusColor;
        }
      }
      .pTit {
        min-width: 120px;
      }
      .dynamic-card {
        display: flex;
        > div {
          flex: 1;
          box-sizing: border-box;
          width: 50%;
        }
        .dynamic-u {
          height: 100%;
          overflow: auto;
          width: 100%;
          li {
            width: 50%;
            float: left;
            display: flex;
            color: $textColor;
            font-size: 14px;
            height: 25px;
            line-height: 25px;
            p {
              flex: 1.2;
              span {
                vertical-align: middle;
              }
            }
            p:first-child {
              flex: 3;
            }
            p:last-child {
              text-align: right;
            }
            .pleft {
              padding-right: 15px;
              border-right: 2px solid $textColor;
            }
            .right {
              padding-left: 15px;
            }

            .svg-icon {
              width: 14px;
              height: 14px;
              vertical-align: initial;
            }
          }
        }
      }
    }
  }
}
</style>
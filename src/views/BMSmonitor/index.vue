<template>
  <div class="bms-wrapper">
    <div class="left dl">
      <p>电池组整体信息</p>
      <div class="bms-info bgBorder" ref="bmsInfo">
        <div class="bms-content" ref="bmsContent">
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

          <div class="bms-status">
            <div class="status-t">
              <p>
                <span class="text-tit">SOC：</span>
                <span class="text-val">{{cellGroupData.socState}}%</span>
              </p>
              <div class="dl">
                <svg-icon icon-class="电池" />
              </div>
              <p>
                <span class="text-tit">SOH：</span>
                <span class="text-val">{{cellGroupData.sohState}}%</span>
              </p>
            </div>
            <div class="status-b">
              <div>上电状态</div>
              <div>总正继电状态{{cellGroupData.electricRelayState=='0'?'：断开':'：闭合'}}</div>
              <div>{{cellGroupData.chargingState | filterChargingState}}状态</div>
            </div>
          </div>

          <div class="bms-table">
            <div class="left">
              <p class="title-style">
                <span>电池数据信息</span>
              </p>
              <div class="wbl-d">
                <div class="wbl-item">
                  <p class="item-k">电池总电压</p>
                  <p class="item-n">{{cellGroupData.totalV||0}}V</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">电池充放电总电流</p>
                  <p class="item-n">{{cellGroupData.totalI||0}}A</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">单体电池最高温度</p>
                  <p class="item-n">{{cellGroupData.singleMaxTemp||0}}°C</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">单体电池最低温度</p>
                  <p class="item-n">{{cellGroupData.singleMinTemp||0}}°C</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">单体电池平均温度</p>
                  <p class="item-n">{{cellGroupData.singleAvgTemp||0}}°C</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">单体电池最高电压</p>
                  <p class="item-n">{{cellGroupData.singleMaxV||0}}V</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">单体电池最低电压</p>
                  <p class="item-n">{{cellGroupData.singleMinV||0}}V</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">最大充电电流</p>
                  <p class="item-n">{{cellGroupData.maxChargeI||0}}A</p>
                </div>
                <div class="wbl-item">
                  <p class="item-k">最大放电电流</p>
                  <p class="item-n">{{cellGroupData.maxDisChargeI||0}}A</p>
                </div>
              </div>
            </div>
            <div class="right">
              <p class="title-style">
                <span>故障告警信息</span>
              </p>
              <div class="fault-info">
                <ul>
                  <li :class="cellGroupData.singleVdiff!='0'?'active':''">
                    <p>单体压差过大</p>
                  </li>
                  <li :class="cellGroupData.singleVhigh!='0'?'active':''">
                    <p>单体过压</p>
                  </li>
                  <li :class="cellGroupData.singleVlow!='0'?'active':''">
                    <p>单体欠压</p>
                  </li>
                  <li :class="cellGroupData.totalVhigh!='0'?'active':''">
                    <p>电池组过压</p>
                  </li>
                  <li :class="cellGroupData.totalVlow!='0'?'active':''">
                    <p>电池组欠压</p>
                  </li>
                  <li :class="cellGroupData.chargeOver!='0'?'active':''">
                    <p>电池组充电过流</p>
                  </li>
                  <li :class="cellGroupData.dischargeOver!='0'?'active':''">
                    <p>电池组放电过流</p>
                  </li>
                  <li :class="cellGroupData.shortFault!='0'?'active':''">
                    <p>短路故障</p>
                  </li>
                  <li :class="cellGroupData.highTempProtect!='0'?'active':''">
                    <p>高温保护</p>
                  </li>
                  <li :class="cellGroupData.lowTempProtect!='0'?'active':''">
                    <p>低温保护</p>
                  </li>
                  <li :class="cellGroupData.tempDiffOver!='0'?'active':''">
                    <p>温差过大</p>
                  </li>
                  <li :class="cellGroupData.insulationState!='0'?'active':''">
                    <p>系统绝缘过低</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bms-chart"
          v-loading="isChartLoading"
          element-loading-background="rgba(0, 0, 0, 0.5)"
        >
          <p class="title-style">
            <span>实时功率曲线</span>
          </p>
          <div v-if="chartH" :style="{'width': '100%','height':chartH}">
            <screenLine @dateChange="dateChange" filed="date"></screenLine>
            <infoLine
              v-if="!isChartLoading"
              :lineId="'timeLine1'"
              :loading="isChartLoading"
              :option="timeLineOption"
              :width="'100%'"
              style="width: 100%;height:calc(100% - 50px)"
            ></infoLine>
          </div>
        </div>
      </div>
    </div>
    <div
      class="right dl"
      v-loading="isbmuDataLoading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <div class="r-tab">
        <p
          v-for="(item,idx) in bmuDatas"
          :key="idx"
          @click="bmuhandler(idx)"
          :class="item.checked?'active':''"
        >{{item.bmuCode}}#BMU</p>
      </div>
      <div class="r-content" v-if="bmuDatas.length">
        <el-row :gutter="20">
          <el-col :span="4" v-for="(item,idx) in bmuDatas[bmuDataIdx].cellDatas" :key="idx">
            <div class="grid-content bg-purple">
              <!-- 电池单体 -->
              <p>{{bmuDatas[bmuDataIdx].bmuCode + ' - '+item.cellCode}}</p>
              <div class="g-item">
                <svg-icon icon-class="电池"></svg-icon>
                <div class="g-item-info">
                  <p>
                    <span>电压：</span>
                    <span>{{item.voltage}}V</span>
                  </p>
                  <p>
                    <span>温度：</span>
                    <span>{{item.temp}}°C</span>
                  </p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import infoLine from "@components/line";
import ScreenLine from "@components/screenLine";
import Homeindex from "../homeIndex/index";
import moment from "moment";
import {
  getEquipmentListByType,
  getBmsActiveDataByCustomerId,
  getBmsCellgroupData,
} from "@/apis/views/index";
export default {
  name: "",
  components: {
    infoLine,
    Homeindex,
    ScreenLine,
  },
  data() {
    return {
      options: [],
      value: "",
      timeLineOption: {},
      timeLoading: false,
      chartH: "",
      userInfo: this.$attrs.userInfo,
      cellGroupData: {},
      bmuDatas: [],
      bmuDataIdx: 0,
      isbmuDataLoading: false,
      isChartLoading: false,
      autoTimer: null,
      dateRadio: "today",
      dateValue: null,
      currVal: {},
    };
  },
  props: {
    childCustomerId: {},
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
    dateRadio(val) {
      if (val != "costom") {
        this.dateValue = null;
        let obj = {};
        if (val == "today") {
          obj.beginTime = moment().format("YYYY-MM-DD") + " 00:00:00";
          obj.endTime = moment().format("YYYY-MM-DD") + " 23:59:29";
        } else if (val == "yesterday") {
          obj.beginTime =
            moment().subtract(1, "days").format("YYYY-MM-DD") + " 00:00:00";
          obj.endTime =
            moment().subtract(1, "days").format("YYYY-MM-DD") + " 23:59:29";
        }
        this.currVal = {
          ...this.currVal,
          ...obj,
        };
        this.getBmsActiveDataByCustomer(this.currVal);
      }
    },
    dateValue(val) {
      if (val) {
        this.dateRadio = "costom";
      }
    },
  },
  computed: {
    customerId() {
      // || this.userInfo.belongToNetwork;
      return this.userInfo.customerId;
    },
  },
  created() {
    this.resetData();
  },
  mounted() {
    this.resetData();
    this.getEquipmentListByType();
    this.autoTimer = setInterval(() => {
      this.getEquipmentListByType();
    }, 120000);
  },
  beforeDestroy() {
    clearInterval(this.autoTimer);
  },
  methods: {
    /**
     * 设备列表
     */
    getEquipmentListByType(childCustomerId) {
      getEquipmentListByType({
        customerId: this.childCustomerId || this.customerId,
        type: "BMS",
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
            this.getBmsActiveDataByCustomer(this.currVal);
            this.getBmsCellgroupData(res.data[0]);
          } else {
            this.resetData();
          }
        })
        .catch((err) => {
          if (this.loading) {
            this.loading.close();
            this.resetData();
          }
        });
    },
    /**
     * 重置data
     */
    resetData() {
      this.bmuDatas = [];
      this.cellGroupData = {};
      this.setLineOption([], []);
    },
    dateChange(val) {
      this.currVal = {
        ...this.currVal,
        ...val,
      };
      this.getBmsActiveDataByCustomer(this.currVal);
    },
    /**
     * bms功率曲线
     */
    getBmsActiveDataByCustomer(obj) {
      this.isChartLoading = true;
      let params = {
        addrIP: obj.addrIP,
        addrIPOrder: obj.addrIPOrder,
        meterType: obj.meterType,
        beginTime: obj.beginTime,
        endTime: obj.endTime,
      };
      getBmsActiveDataByCustomerId(params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.isChartLoading = false;
            let xAxis = [],
              series = [];
            res.data.map((item) => {
              xAxis.push(item.time);
              series.push(item.value);
              return item;
            });
            let contentH = this.$refs["bmsContent"].offsetHeight;
            let infoH = this.$refs["bmsInfo"].offsetHeight;
            this.chartH = infoH - contentH - 55 + "px";
            if (this.chartH) {
              this.$nextTick(() => {
                this.setLineOption(xAxis, series);
              });
            }
          }
        })
        .catch((err) => {
          this.isChartLoading = false;
        });
    },
    /**
     * bms电池组数据
     */
    getBmsCellgroupData(obj) {
      this.isbmuDataLoading = true;
      let params = {
        addrIP: obj.addrIP,
        addrIPOrder: obj.addrIPOrder,
        meterType: obj.meterType,
      };
      getBmsCellgroupData(params)
        .then((res) => {
          this.isbmuDataLoading = false;
          if (res.code == 200) {
            this.cellGroupData = res.data.cellGroupData;
            if (res.data.bmuDatas) {
              this.bmuDataIdx = 0;
              res.data.bmuDatas.map((item, idx) => {
                item.checked = false;
                if (idx == 0) {
                  item.checked = true;
                }
                return item;
              });
              this.bmuDatas = res.data.bmuDatas;
            } else {
              this.bmuDatas = [];
            }
          }
        })
        .catch((err) => {
          this.isbmuDataLoading = false;
        });
    },
    bmuhandler(idx) {
      this.bmuDataIdx = idx;
      this.bmuDatas.map((item, index) => {
        item.checked = false;
        if (idx == index) {
          item.checked = true;
        }
        return item;
      });
    },
    equipmentChange(val) {
      let obj = {};
      this.options.map((item) => {
        if (val == item.equipmentId) {
          obj = item;
        }
        return item;
      });
      this.currVal = obj;
      this.getBmsActiveDataByCustomer(obj);
      this.getBmsCellgroupData(obj);
    },
    setLineOption(xAxis, series) {
      this.timeLineOption = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 20,
          top: 50,
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
    filterStatus(val) {
      console.log(val);
    },
    filterChargingState(val) {
      let chargingState = "静置";
      if (val === "0") {
        chargingState = "静置";
      } else if (val === "1") {
        chargingState = "充电";
      } else if (val === "2") {
        chargingState = "放电";
      }
      return chargingState;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/common.scss";
$mt15: 15px;
.bms-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .svg-icon {
    width: 80px;
    height: 36px;
  }
  > .left {
    width: 700px;
    height: 100%;
    float: left;
    > p {
      width: 180px;
      line-height: 30px;
      background: rgba(0, 160, 233, 0.2);
      border: 1px solid rgba(0, 160, 233, 1);
      font-size: 14px;
      font-weight: bold;
      text-indent: 1em;
      color: rgba(0, 160, 233, 1);
    }
    > div {
      height: calc(100% - 30px) !important;
      background: url("../../assets/images/电池组整体信息底框.png") no-repeat;
    }

    .bms-status {
      margin-top: $mt15;
      .status-t {
        text-align: center;
        > div {
          vertical-align: middle;
          margin: 0 30px;
          img {
            width: 60px;
          }
        }
        > p {
          display: inline-block;
          vertical-align: middle;
          .text-val {
            color: $numStatusColor;
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
          }
          .text-tit {
            font-size: 12px;
            font-weight: 400;
            color: $textColor;
          }
        }
      }
      .status-b {
        display: flex;
        margin-top: $mt15;
        > div {
          flex: 1;
          height: 30px;
          text-align: center;
          background: rgba(0, 160, 233, 1);
          border-radius: 4px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          line-height: 30px;
          font-size: 14px;
          cursor: pointer;
        }
        > div:nth-child(2) {
          margin: 0 12px;
        }
      }
    }

    .bms-table {
      margin-top: $mt15;
      display: flex;
      > div {
        flex: 1;
      }
      .left {
        margin-right: 12px;
        > p {
          margin-bottom: 12px;
        }
        .wbl-d {
          width: 100%;
          overflow: hidden;
          > div {
            height: 100%;
          }
          .wbl-item {
            width: 100%;
            font-size: 0;
            display: flex;
            p {
              border: 1px solid #046ba3;
              // opacity: 0.4;
              line-height: 28px;
              padding-left: 6px;
              // font-size: 10px;
              display: inline-block;
              flex: 1;
              border-bottom: none;
            }
            p:nth-child(2) {
              font-weight: bold;
              border-left: none;
              border-bottom: none;
            }
            .item-k {
              color: $textColor;
              background: $bgColor;
              flex: 1.5;
              font-size: 14px;
            }
            .item-n {
              color: $numStatusColor;
              font-size: 14px;
            }
          }
        }
        .wbl-item:last-child p {
          border-bottom: 1px solid #046ba3;
        }
        .wbl-item:last-child p:nth-child(2) {
          border-bottom: 1px solid #046ba3;
        }
      }

      .right {
        > p {
          margin-bottom: 12px;
        }
        .fault-info {
          ul {
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;
            li {
              background: $bgColor;
              margin-bottom: 10px;
              box-sizing: border-box;
              line-height: 32px;
              text-align: center;
              font-size: 12px;
              font-weight: bold;
              color: $numStatusColor;
              border-radius: 4px;
              p {
                font-size: 12px;
              }
            }

            li.active {
              background: rgba(242, 32, 82, 1);
              color: #ffffff;
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
      }
    }

    .bms-chart {
      margin-top: $mt15;
    }
  }
  > .right {
    float: left;
    margin-left: 12px;
    width: calc(100% - 712px);
    height: 100%;
    overflow: hidden;
    .r-tab {
      margin: 0 54px;
      box-sizing: border-box;
      height: 46px;
      line-height: 46px;
      background: url("../../assets/images/电池组切换底框.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      padding: 0 30px;
      > p {
        width: 120px;
        flex: 1;
        background: rgba(0, 160, 233, 0.2);
        margin: 0 12px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        color: rgba(0, 160, 233, 1);
      }
      p.active {
        background: rgba(0, 160, 233, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
    .r-content {
      margin: 25px 0;
      height: calc(100% - 90px);
      overflow: auto;
      text-align: center;
      padding-bottom: 50px;
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .grid-content {
        > p {
          width: 100px;
          height: 24px;
          background: rgba(0, 160, 233, 1);
          border-radius: 6px 6px 0px 0px;
          display: inline-block;
          line-height: 24px;
          color: rgba(254, 255, 255, 1);
          font-size: 12px;
          font-weight: bold;
        }
        .g-item {
          height: calc(100% - 24px);
          background: url("../../assets/images/电池单体底框.png") no-repeat;
          background-size: 100% 100%;
        }
        .svg-icon {
          transform: rotate(-90deg);
          margin-top: 50px;
          top: 50px;
          width: 120px;
        }
        .g-item-info {
          margin-top: 30px;
          font-size: 14px;
          p {
            margin-bottom: 20px;
            font-weight: bold;
            span:nth-child(1) {
              color: #84a0b6;
            }
            span:nth-child(2) {
              color: $numStatusColor;
            }
          }
        }
      }

      >>> .el-col-4 {
        padding: 10px;
        box-sizing: border-box;
      }

      .bg-purple {
        height: 220px;
      }
      .grid-content {
        min-height: 36px;
      }
      .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
      }
    }
  }
}

>>> .el-dialog {
  background: transparent;
}
>>> .el-dialog__header,
>>> .el-dialog__body {
  padding: 0;
}
</style>
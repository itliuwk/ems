<template>
  <div class="wrapper">
    <div class="wrapper-top">
      <div class="bgBorder svg">
        <SvgPanZoom
          v-if="svgHtmlStr"
          v-cloak
          style="width: 100%; height: 100%; padding:20px;box-sizing: border-box;"
          :zoomEnabled="true"
          :controlIconsEnabled="false"
          :fit="true"
          :center="true"
          @svgpanzoom="registerSvgPanZoom"
          class="test11"
        >
          <!-- 储能概览图 -->
          <!-- <svg-icon class="svg-overview" icon-class="储能概览图1"></svg-icon> -->
          <svg id="svg-test" v-html="svgHtmlStr" />
        </SvgPanZoom>
      </div>
    </div>
    <div class="wrapper-bottom">
      <div class="wrapper-bottom-l">
        <p class="title">基本信息</p>
        <div class="bgBorder wbl-d basic">
          <div>
            <div class="wbl-item">
              <p class="item-k">站点地址</p>
              <p class="item-n">{{basicData.bmsAddr}}</p>
            </div>
            <div class="wbl-item">
              <p class="item-k">PCS台数</p>
              <p class="item-n">{{basicData.pcsCount||0}}台</p>
            </div>
            <div class="wbl-item">
              <p class="item-k">电池数量</p>
              <p class="item-n">{{basicData.batteryCount||0}}个</p>
            </div>
            <div class="wbl-item">
              <p class="item-k">额定容量</p>
              <p class="item-n">{{basicData.capacity||0}}kWh</p>
            </div>
            <div class="wbl-item">
              <p class="item-k">额定功率</p>
              <p class="item-n">{{basicData.ratedPower||0}}kW</p>
            </div>
            <div class="wbl-item">
              <p class="item-k">累计充电电量</p>
              <p class="item-n">{{basicData.totalChargeCapacity||0}}kWh</p>
            </div>
            <div class="wbl-item">
              <p class="item-k">累计放电电量</p>
              <p class="item-n">{{basicData.totalDischargeCapacity||0}}kWh</p>
            </div>
          </div>
        </div>
      </div>
      <div class="wrapper-bottom-c">
        <p class="title">数据统计</p>
        <div class="statistics bgBorder">
          <ul class="data-statistics">
            <li>
              <p>需量(kW)</p>
              <div>
                <ul>
                  <li>
                    <p class="text-num">{{statisticsData.demand.max || ' - '}}</p>
                    <p class="text-tit">最大</p>
                  </li>
                  <li>
                    <p class="text-num">{{statisticsData.demand.average|| ' - '}}</p>
                    <p class="text-tit">平均</p>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <p>日用电量(kWh)</p>
              <div>
                <ul>
                  <li>
                    <p class="text-num">{{statisticsData.dailyElectric.day || ' - '}}</p>
                    <p class="text-tit">日累计</p>
                  </li>
                  <li>
                    <p class="text-num">{{statisticsData.dailyElectric.month || ' - '}}</p>
                    <p class="text-tit">月累计</p>
                  </li>
                  <li>
                    <p class="text-num">{{statisticsData.dailyElectric.total || ' - '}}</p>
                    <p class="text-tit">总累计</p>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <p>累计峰谷移调次数</p>
              <div>
                <ul>
                  <li>
                    <p class="text-num">{{statisticsData.transpositionCount.today|| ' - '}}</p>
                    <p class="text-tit">本日</p>
                  </li>
                  <li class="curp" @click="dialogDetail('1','累计峰谷移调次数','次数')">
                    <p class="text-num">{{statisticsData.transpositionCount.thisMonth || ' - '}}</p>
                    <p class="text-tit">本月</p>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <p>累计峰谷移调电量(kWh)</p>
              <div>
                <ul>
                  <li>
                    <p class="text-num">{{statisticsData.transpositionElectric.today || ' - '}}</p>
                    <p class="text-tit">本日</p>
                  </li>
                  <li class="curp" @click="dialogDetail('2','累计峰谷移调电量','电量(kWh)')">
                    <p class="text-num">{{statisticsData.transpositionElectric.thisMonth || ' - '}}</p>
                    <p class="text-tit">本月</p>
                  </li>
                  <li>
                    <p class="text-num">{{statisticsData.transpositionElectric.total || ' - '}}</p>
                    <p class="text-tit">总移调电量</p>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <p>最大调峰功率(kW)</p>
              <div>
                <ul>
                  <li>
                    <p class="text-num">{{statisticsData.maxPower.today || ' - '}}</p>
                    <p class="text-tit">本日</p>
                  </li>
                  <li class="curp" @click="dialogDetail('3','最大调峰功率','功率(kW)')">
                    <p class="text-num">{{statisticsData.maxPower.thisMonth || ' - '}}</p>
                    <p class="text-tit">本月</p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="wrapper-bottom-r">
        <p class="title-r">
          <span class="ptit">系统动态</span>
          <span class="view-detail" @click="more">
            查看更多
            <i class="iconfont icon-gengduo"></i>
          </span>
        </p>
        <div
          class="bgBorder dynamic"
          v-loading="realtimeLoading"
          element-loading-background="rgba(0, 0, 0, 0.5)"
        >
          <InfoList :realtimeSoeData="realtimeSoeData"></InfoList>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="isDialog" :show-close="false" width="430px">
      <div class="dialog-detail">
        <div>
          <p>{{dialogTit}}</p>
          <p @click="closeDialog">
            <svg-icon class="icon-close" icon-class="关闭"></svg-icon>
          </p>
        </div>
        <div class="svg-detail bgBorder">
          <!-- 首次设置 -->
          <div v-if="!isJrcpe" class="first">
            <p class="tips">
              <svg-icon icon-class="tips"></svg-icon>
              <span>{{dialogTips}}</span>
            </p>
            <div class="svg-opi">
              <div>
                <span>密码:</span>
                <el-input
                  class="widthIpt"
                  type="password"
                  placeholder="请填写密码"
                  v-model="dialogParams.password"
                ></el-input>
              </div>
              <div>
                <span>确认密码:</span>
                <el-input
                  class="widthIpt"
                  type="password"
                  placeholder="请确认密码"
                  v-model="dialogParams.newPassword"
                ></el-input>
              </div>
            </div>
            <div class="mt40">
              <el-button @click="submit" type="primary">确认</el-button>
              <el-button @click="closeDialog">取消</el-button>
            </div>
          </div>

          <div v-else class="inputPassword">
            <!-- 输入密码 -->
            <div v-if="!isUpdatePass">
              <p class="tips" :style="dialogTips?'visibility: initial':'visibility: hidden;'">
                <svg-icon
                  icon-class="tips"
                  :style="dialogTips?'display: inline-block':'display: none;'"
                ></svg-icon>
                <span>{{dialogTips}}</span>
              </p>
              <div class="svg-opi">
                <div>
                  <span>请输入密码:</span>
                  <el-input
                    class="widthIpt"
                    type="password"
                    placeholder="请输入密码"
                    v-model="dialogParams.password"
                  ></el-input>
                </div>
              </div>
              <div class="mt40">
                <el-button @click="submit" type="primary">确认</el-button>
                <el-button @click="closeDialog">取消</el-button>
              </div>
              <el-button class="mt40" @click="updatePass" type="text">修改密码</el-button>
            </div>
            <!-- 修改密码 -->
            <div v-else>
              <p class="tips" :style="dialogTips?'visibility: initial':'visibility: hidden;'">
                <svg-icon
                  icon-class="tips"
                  :style="dialogTips?'display: inline-block':'display: none;'"
                ></svg-icon>
                <span>{{dialogTips}}</span>
              </p>
              <div class="svg-opi">
                <div>
                  <span>旧密码:</span>
                  <el-input
                    class="widthIpt"
                    type="password"
                    placeholder="请输入旧密码"
                    v-model="dialogParams.oldPassword"
                  ></el-input>
                </div>
                <div>
                  <span>新密码:</span>
                  <el-input
                    class="widthIpt"
                    type="password"
                    placeholder="请输入新密码"
                    v-model="dialogParams.password"
                  ></el-input>
                </div>
                <div>
                  <span>确认新密码:</span>
                  <el-input
                    class="widthIpt"
                    type="password"
                    placeholder="确认新密码"
                    v-model="dialogParams.newPassword"
                  ></el-input>
                </div>
              </div>
              <div class="mt30">
                <el-button @click="submit" type="primary">确认</el-button>
                <el-button @click="closeDialog">取消</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isDialogData" :show-close="false" width="60%">
      <div class="dialog-detail1">
        <div>
          <p>{{dialogTit}}</p>
          <p @click="closeDialog">
            <svg-icon class="icon-close" icon-class="关闭"></svg-icon>
          </p>
        </div>
        <div class="detail bgBorder">
          <screenLine
            @dateChange="dateChange"
            v-if="isDialogData"
            filed="month"
            :screenParams="screenParams"
          ></screenLine>
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
    </el-dialog>
  </div>
</template>

<script>
import InfoList from "@components/list";
import infoLine from "@components/line";
import ScreenLine from "@components/screenLine";
import SvgPanZoom from "vue-svg-pan-zoom";
import Homeindex from "../homeIndex/index";
import moment from "moment";
import {
  getSvgDataByCustomerId,
  getStatisticsData,
  getSystemDynamicsData,
  getDataByCustomerId,
  getMicrofractureStatus,
  getBmsStaDetailed,
  checkStatisticsData,
  postSrcp,
  postVerifyPassword,
  postMrcp,
  postExecute,
} from "@/apis/views/index";
import { svgHtml } from "@/utils/index";
export default {
  name: "",
  components: {
    InfoList,
    SvgPanZoom,
    Homeindex,
    infoLine,
    ScreenLine,
  },
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {
      isSvg: false,
      realtimeLoading: false,
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || {},
      svgHtmlStr: "",
      svgpanzoom: null,
      statisticsData: {
        dailyElectric: {},
        demand: {},
        maxPower: {},
        transpositionCount: {},
        transpositionElectric: {},
      },
      realtimeSoeData: [],
      basicData: {},
      isJrcpe: null, //是否配置了下行密码
      isDialogData: false,
      timeLineOption: {},
      screenParams: {},
      timeLoading: false,
      isDialog: false,
      dialogTit: "下行控制",
      dialogTips: "首次进行下行控制需要设置密码，设置后请谨记，谢谢！",
      isUpdatePass: false,
      dialogParams: {
        oldPassword: "",
        password: "",
        newPassword: "",
      },
      executeValue: "0", //  0 合闸  1 分闸
      autoTimer: null,
    };
  },
  watch: {
    childCustomerId(val) {
      this.init();
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
      // || this.userInfo.belongToNetwork
      return this.userInfo.customerId;
    },
    isNetworkId() {
      return this.childCustomerId || this.userInfo.userType == 1;
    },
  },
  props: {
    childCustomerId: {},
  },
  mounted() {
    this.svgHtmlStr = $("#icon-test").html();
    this.init();
    this.autoTimer = setInterval(() => {
      this.init();
    }, 120000);
  },
  methods: {
    init() {
      this.getSvgDataByCustomerId();
      this.getStatisticsData();
      this.getSystemDynamicsData();
      this.getDataByCustomerId();
    },
    /**
     * 数据统计
     */
    async getStatisticsData() {
      let data = await checkStatisticsData({
        customerId: this.childCustomerId || this.customerId,
      });
      if (data.code == 200) {
        getStatisticsData({
          customerId: this.childCustomerId || this.customerId,
        }).then((res) => {
          if (res.code == 200) {
            this.statisticsData = res.data;
          }
        });
      }
    },
    /**
     * 系统动态
     */
    getSystemDynamicsData() {
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
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },
    /**
     * 基本信息
     */
    getDataByCustomerId() {
      getDataByCustomerId({
        customerId: this.childCustomerId || this.customerId,
      }).then((res) => {
        if (res.code == 200) {
          this.basicData = res.data;
        }
      });
    },
    /**
     * svg数据
     */
    getSvgDataByCustomerId() {
      let that = this;
      getSvgDataByCustomerId({
        customerId: this.childCustomerId || this.customerId,
      })
        .then((res) => {
          if (this.loading) {
            this.loading.close();
          }
          this.isJrcpe = res.data.isHasPassword;
          let pcsData = res.data.pcsData || {};
          let pcsDcdcData = res.data.pcsDcdcData || {};
          let bmsCellGroupData = res.data.bmsCellGroupData || {};
          this.$nextTick(() => {
            setTimeout(() => {
              that.jqText(res, pcsData, pcsDcdcData, bmsCellGroupData);
            }, 1000);
          });
        })
        .catch((err) => {
          if (this.loading) {
            this.loading.close();
          }
        });
    },
    /**
     * jq  text 给SVG赋值
     */
    jqText(res, pcsData, pcsDcdcData, bmsCellGroupData) {
      let that = this;

      for (let index = 0; index < 7; index++) {
        $(".addpath").removeClass("path" + (index + 1));
      }
      if (res.data.direction) {
        $(".addpath").addClass("path" + res.data.direction); // 添加路径动画
      }

      that.getMicrofractureStatus();

      let V = "V";
      let A = "A";
      let kw = "kW";
      let kwh = "kWh";

      if (pcsData) {
        //市电测电压
        $(".SDUA").text("UA：" + (pcsData.cityElecAv || 0) + V);
        $(".SDUB").text("UB：" + (pcsData.cityElecBv || 0) + V);
        $(".SDUC").text("UC：" + (pcsData.cityElecCv || 0) + V);

        //市电测电流
        $(".SDIA").text("IA：" + (pcsData.cityElecAi || 0) + A);
        $(".SDIC").text("IB：" + (pcsData.cityElecBi || 0) + A);
        $(".SDIB").text("IC：" + (pcsData.cityElecCi || 0) + A);

        //市电测功率
        $(".SDAX").text("A相：" + (pcsData.cityActiveAp || 0) + kw);
        $(".SDBX").text("B相：" + (pcsData.cityActiveBp || 0) + kw);
        $(".SDCX").text("C相：" + (pcsData.cityActiveCp || 0) + kw);

        //累计充放电
        $(".LJCD").text((pcsDcdcData.directCharge || 0) + kwh);
        $(".LJFD").text((pcsDcdcData.directDischarge || 0) + kwh);

        //交流测电压
        $(".JLUA").text("UA：" + (pcsData.pcsLineAbV || 0) + V);
        $(".JLUB").text("UB：" + (pcsData.pcsLineBcV || 0) + V);
        $(".JLUC").text("UC：" + (pcsData.pcsLineCaV || 0) + V);

        //交流测电流
        $(".JLIA").text("IA：" + (pcsData.pcsOutputiA || 0) + A);
        $(".JLIB").text("IB：" + (pcsData.pcsOutputiB || 0) + A);
        $(".JLIC").text("IC：" + (pcsData.pcsOutputiC || 0) + A);

        //交流测功率
        $(".JLAX").text("A相：" + (pcsData.pcsActiveAp || 0) + kw);
        $(".JLBX").text("B相：" + (pcsData.pcsActiveBp || 0) + kw);
        $(".JLCX").text("C相：" + (pcsData.pcsActiveCp || 0) + kw);
        $(".JLALLX").text("总和：" + (pcsData.pcsTotalActiveP || 0) + kw);

        //交流测频率
        $(".JLHZA").text((pcsData.pcsFreqA || 0) + "Hz");
        // $(".JLHZB").text("B：" + (pcsData.pcsFreqB || 0) + "Hz");
        // $(".JLHZC").text("C：" + (pcsData.pcsFreqC || 0) + "Hz");
      }

      if (pcsDcdcData) {
        //直流测功率
        $(".ZLCDY").text((pcsDcdcData.directCurV || 0) + V);
        $(".ZLCDL").text((pcsDcdcData.directCurI || 0) + A);
        $(".ZLCGL").text((pcsDcdcData.directCurP || 0) + kw);
      }
      if (bmsCellGroupData) {
        //电池组
        let chargingState = bmsCellGroupData.chargingState || "0";
        if (chargingState === "0") {
          chargingState = "静置";
        } else if (chargingState === "1") {
          chargingState = "充电";
        } else if (chargingState === "2") {
          chargingState = "放电";
        }

        $(".SOC").text((bmsCellGroupData.socState || 0) + "%");
        $(".CNGZ").text(bmsCellGroupData.runStatus || 0);
        $(".CFD").text(chargingState);
      }

      $("#svg-test").on("click", ".switchOn", function (event) {
        that.switchOn();
      });

      $("#svg-test").on("click", ".opening", function (event) {
        that.opening();
      });
    },

    /**
     * 查看更多
     */
    more() {
      this.$emit("toEvent", {});
    },
    /**
     * 空调运行状态查询
     */
    getMicrofractureStatus() {
      getMicrofractureStatus({ equipId: "5035291749270528" }).then((res) => {
        $(".KT").text(res.data == "0" ? "停机中" : "运行中");
      });
    },
    /**
     * 合闸
     */
    switchOn() {
      this.isDialog = true;
      if (this.isJrcpe) {
        this.dialogTips = "";
        this.executeValue = "0";
        this.dialogTit = "下行控制 - 合闸";
      } else {
        this.dialogTips = "首次进行下行控制需要设置密码，设置后请谨记，谢谢！";
      }
    },
    /**
     * 分闸
     */
    opening() {
      this.isDialog = true;
      if (this.isJrcpe) {
        this.dialogTips = "";
        this.executeValue = "1";
        this.dialogTit = "下行控制 - 分闸";
      } else {
        this.dialogTips = "首次进行下行控制需要设置密码，设置后请谨记，谢谢！";
      }
    },
    submit() {
      let { password, newPassword, oldPassword } = this.dialogParams;
      if (!this.isJrcpe) {
        // 首次设置
        if (!password || !newPassword) {
          this.dialogTips = "密码不能为空";
          return false;
        }
        if (password != newPassword) {
          this.dialogTips = "两次密码输入不一致";
          return false;
        }

        postSrcp({
          newPassword,
          customerId: this.childCustomerId || this.customerId,
        }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "设置成功",
              type: "success",
            });
            this.isJrcpe = true;
            this.closeDialog();
          } else {
            this.$message({
              message: "设置失败，请重试",
              type: "error",
            });
          }
        });
      } else {
        if (!this.isUpdatePass) {
          // 输入
          if (!password) {
            this.dialogTips = "密码不能为空";
            return false;
          }
          postVerifyPassword({
            password,
            customerId: this.childCustomerId || this.customerId,
          }).then((res) => {
            if (res.code == 200 && res.data) {
              this.postExecute();
            } else {
              this.dialogTips = "密码不正确";
            }
          });
        } else {
          // 修改密码

          if (!password || !newPassword || !oldPassword) {
            this.dialogTips = "密码不能为空";
            return false;
          }

          if (password != newPassword) {
            this.dialogTips = "新密码输入不一致";
            return false;
          }
          postMrcp({
            ...this.dialogParams,
            customerId: this.childCustomerId || this.customerId,
          }).then((res) => {
            if (res.code == 200 && res.data) {
              this.$message({
                message: "修改成功",
                type: "success",
              });

              this.closeDialog();
            } else {
              this.dialogTips = "旧密码不正确";
            }
          });
        }
      }
    },
    postExecute() {
      postExecute({ equipmentId: "", value: this.executeValue }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getSvgDataByCustomerId();
          this.closeDialog();
        } else {
          this.$message("equipmentId 参数现在缺失");
        }
      });
    },
    updatePass() {
      this.isUpdatePass = true;
      this.dialogTit = "下行控制修改密码";
      this.dialogTips = "";
      this.dialogParams = {
        password: "",
        newPassword: "",
        oldPassword: "",
      };
    },
    closeDialog() {
      this.isDialog = false;
      this.isDialogData = false;
      this.isUpdatePass = false;
      this.dialogTit = "下行控制";
      this.dialogParams = {
        password: "",
        newPassword: "",
        oldPassword: "",
      };
    },

    dialogDetail(val, title, unit) {
      this.isDialogData = true;
      this.dialogTit = title;
      this.currDialogType = val;
      let beginTime = moment().format("YYYY-MM") + "-01";
      let endTime = moment().format("YYYY-MM-DD");
      this.screenParams = { beginTime, endTime, queryType: val };
      this.getBmsStaDetailed(this.screenParams, unit);
    },
    getBmsStaDetailed(val, unit) {
      this.timeLoading = true;
      getBmsStaDetailed({
        customerId: this.childCustomerId || this.customerId,
        queryType: val.queryType,
        beginDate: val.beginTime,
        endDate: val.endTime,
      })
        .then((res) => {
          this.timeLoading = false;
          if (res.code == 200) {
            let xAxis = [],
              series = [];
            res.data.map((item) => {
              xAxis.push(item.staDate);
              series.push(item.queryValue);
              return item;
            });
            this.$nextTick(() => {
              this.setLineOption(xAxis, series, unit);
            });
          }
        })
        .catch((err) => {
          this.timeLoading = false;
        });
    },
    dateChange(val) {
      let obj = {
        ...val,
        queryType: this.currDialogType,
      };
      this.getBmsStaDetailed(obj);
    },
    setLineOption(xAxis, series, unit) {
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
          name: unit ? unit : "次数",
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
  beforeDestroy() {
    this.isDialog = false;
    this.isUpdatePass = false;
    clearInterval(this.autoTimer);
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/common.scss";
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .wrapper-top {
    flex: 1;
    margin-bottom: 12px;
  }
  .svg {
    background: url("../../assets/images/储能概览上底框.png") no-repeat;
  }

  .basic {
    background: url("../../assets/images/基本信息底框.png") no-repeat;
  }
  .statistics {
    background: url("../../assets/images/数据统计底框.png") no-repeat;
  }
  .dynamic {
    background: url("../../assets/images/系统动态底框.png") no-repeat;
  }
  .svg-overview {
    width: 100%;
    height: 100%;
  }

  .wrapper-bottom {
    display: flex;
    box-sizing: border-box;
    height: 352px;
    > div {
      > .title {
        width: 138px;
        line-height: 28px;
        background: rgba(0, 160, 233, 0.1);
        border: 1px solid rgba(0, 160, 233, 1);
        font-size: 16px;
        font-weight: bold;
        text-indent: 1em;
        color: rgba(0, 160, 233, 1);
      }
      > .title-r {
        .ptit {
          display: inline-block;
          width: 138px;
          line-height: 30px;
          background: rgba(0, 160, 233, 0.1);
          border: 1px solid rgba(0, 160, 233, 1);
          font-size: 16px;
          font-weight: bold;
          text-indent: 1em;
          color: rgba(0, 160, 233, 1);
        }
        .view-detail {
          float: right;
          position: relative;
          font-size: 14px;
          cursor: pointer;
          color: $textColor;
          top: 5px;
          i {
            color: rgba(0, 160, 233, 1);
          }
        }
      }
      > div {
        height: calc(100% - 30px) !important;
      }
    }
    .wrapper-bottom-l {
      width: 25%;
      height: 100%;
      .wbl-d {
        width: 100%;
        overflow: hidden;
        > div {
          overflow: auto;
          height: 100%;
        }
        .wbl-item {
          width: 100%;
          font-size: 0;
          display: flex;
          height: calc(100% / 7);
          box-sizing: border-box;
          p {
            border: 1px solid #046ba3;
            padding-left: 12px;
            font-size: 14px;
            display: inline-block;
            line-height: 40px;
            flex: 1;
            border-bottom: none;
            box-sizing: border-box;
          }
          p:nth-child(2) {
            font-weight: bold;
            border-left: none;
            border-bottom: none;
          }
          .item-k {
            color: $textColor;
            background: $bgColor;
          }
          .item-n {
            color: $numStatusColor;
          }
        }
        .wbl-item:last-child {
          border-bottom: 1px solid #046ba3;
        }
      }
    }
    .wrapper-bottom-c {
      width: 45%;
      margin: 0 12px;
      box-sizing: border-box;
      .data-statistics {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        > li {
          height: 90px;
          background: $bgColor;
          margin-bottom: 12px;
          box-sizing: border-box;
          > p {
            padding: 6px 6px 0;
            font-size: 12px;
            color: $textColor;
          }
          ul {
            padding: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            li {
              flex: 1;
              text-align: center;
            }
            .text-num {
              color: $numStatusColor;
              font-size: 18px;
              font-weight: bold;
            }
            .text-tit {
              font-size: 12px;
              font-weight: 400;
              color: $textColor;
            }
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
        li:last-child {
          margin: 0;
        }
      }
    }
    .wrapper-bottom-r {
      width: 30%;
      .dynamic {
        overflow: hidden;
      }
    }
  }
}
#svg-test {
  width: 100%;
  height: 100%;
}

.dialog-detail {
  width: 100%;
  height: 300px;
  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    p:nth-child(1) {
      width: 138px;
      max-width: 150px;
      line-height: 30px;
      background: rgba(0, 160, 233, 0.2);
      border: 1px solid rgba(0, 160, 233, 1);
      font-size: 14px;
      font-weight: bold;
      text-indent: 1em;
      color: rgba(0, 160, 233, 1);
    }
    p:nth-child(2) {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 160, 233, 0.2);
      border: 1px solid rgba(0, 160, 233, 1);
      display: inline-block;
      cursor: pointer;
      .svg-icon {
        width: 1em;
        height: 1em;
        color: $numStatusColor;
      }
    }
  }

  > div:nth-child(2) {
    height: calc(100% - 30px) !important;
    background: url("../../assets/images/dialog.png") no-repeat #060218;
  }

  .svg-detail {
    height: calc(100% - 30px);
    overflow: hidden;
    text-align: center;
    padding: 20px !important;
    box-sizing: border-box;
    .tips {
      margin: 0 20px;
      padding: 5px 0;
      font-size: 12px;
      font-weight: bold;
      color: rgba(212, 35, 122, 1);
      background: rgba(212, 35, 122, 0.3);
      span {
        vertical-align: middle;
        font-size: 12px;
      }

      .svg-icon {
        width: 12px;
        height: 12px;
      }
    }
    .inputPassword {
      .tips {
        background: transparent;
      }
    }
    .widthIpt {
      width: 190px;
    }
    .mt40 {
      margin-top: 40px;
    }
    .mt30 {
      margin-top: 30px;
    }
    .svg-opi {
      margin-top: 20px;
      > div {
        margin-top: 20px;
        span {
          width: 80px;
          display: inline-block;
          text-align: right;
          padding-right: 10px;
          font-size: 12px;
          color: rgba(132, 160, 182, 1);
        }
      }
    }
  }
}

.dialog-detail1 {
  width: 100%;
  height: 500px;
  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    p:nth-child(1) {
      width: 138px;
      max-width: 150px;
      line-height: 30px;
      background: rgba(0, 160, 233, 0.2);
      border: 1px solid rgba(0, 160, 233, 1);
      font-size: 14px;
      font-weight: bold;
      text-indent: 1em;
      color: rgba(0, 160, 233, 1);
    }
    p:nth-child(2) {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 160, 233, 0.2);
      border: 1px solid rgba(0, 160, 233, 1);
      display: inline-block;
      cursor: pointer;
      .svg-icon {
        width: 1em;
        height: 1em;
        color: $numStatusColor;
      }
    }
  }

  > div.detail {
    height: calc(100% - 30px) !important;
    background: url("../../assets/images/右侧.png") no-repeat #060218;
    background-size: 100% 100%;
  }

  .screen-date {
    margin-top: 0;
    text-align: center;
  }
}

>>> .el-button + .el-button {
  margin-left: 50px;
  background: rgba(0, 160, 233, 0.2);
  color: rgba(0, 160, 233, 1);
}

>>> .el-dialog {
  background: transparent;
}
>>> .el-dialog__header,
>>> .el-dialog__body {
  padding: 0;
}
</style>

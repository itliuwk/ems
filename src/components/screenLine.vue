<template>
  <div class="screen-date">
    <el-radio-group v-model="dateRadio">
      <el-radio label="today">{{this.filed=='month'?'本月':'今日'}}</el-radio>
      <el-radio label="yesterday">{{this.filed=='month'?'上月':'昨日'}}</el-radio>
      <el-radio label="costom">自定义</el-radio>
    </el-radio-group>
    <el-date-picker
      class="w200"
      v-model="dateValue"
      clearable
      range-separator="至"
      :type="this.filed=='month'?'daterange':'datetimerange'"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-button class="btn" :disabled="!dateValue" @click="btnScreen" type="primary">确定</el-button>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "",
  components: {},
  props: {
    screenParams: {
      type: Object,
    },
    filed: {
      type: String,
    },
  },
  data() {
    return {
      dateRadio: "today",
      dateValue: null,
    };
  },
  watch: {
    dateRadio(val) {
      if (val != "costom") {
        this.dateValue = null;
        let obj = {};
        if (this.filed == "date") {
          if (val == "today") {
            obj.beginTime = moment().format("YYYY-MM-DD") + " 00:00:00";
            obj.endTime = moment().format("YYYY-MM-DD") + " 23:59:59";
          } else if (val == "yesterday") {
            obj.beginTime =
              moment().subtract(1, "days").format("YYYY-MM-DD") + " 00:00:00";
            obj.endTime =
              moment().subtract(1, "days").format("YYYY-MM-DD") + " 23:59:59";
          }
        } else {
          if (val == "today") {
            obj.beginTime = moment().add("month", 0).format("YYYY-MM") + "-01";
            obj.endTime = moment(obj.beginTime)
              .add("month", 1)
              .add("days", -1)
              .format("YYYY-MM-DD");
          } else if (val == "yesterday") {
            obj.beginTime =
              moment().subtract("month", 1).format("YYYY-MM") + "-01";
            obj.endTime = moment(obj.beginTime)
              .subtract("month", -1)
              .add("days", -1)
              .format("YYYY-MM-DD");
          }
        }

        this.$emit("dateChange", obj);
      }
    },
    dateValue(val) {
      if (val) {
        this.dateRadio = "costom";
      }
    },
  },
  computed: {},
  mounted() {
    if (
      this.screenParams != undefined &&
      JSON.stringify(this.screenParams) != "{}"
    ) {
      // this.dateValue = [this.screenParams.beginTime, this.screenParams.endTime];
    }
  },
  methods: {
    btnScreen() {
      let obj = {};
      if (this.dateValue) {
        if (this.filed == "date") {
          obj = {
            beginTime: moment(this.dateValue[0]).format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(this.dateValue[1]).format("YYYY-MM-DD HH:mm:ss"),
          };
        } else {
          obj = {
            beginTime: moment(this.dateValue[0]).format("YYYY-MM-DD"),
            endTime: moment(this.dateValue[1]).format("YYYY-MM-DD"),
          };
        }
      }
      this.$emit("dateChange", obj);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
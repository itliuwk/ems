<template>
  <div class="wrapper" style="width:100%;height:100%">
    <el-scrollbar v-if="realtimeSoeData.length" style="width:100%;height:100%">
      <ul class="dynamic-u">
        <li v-for="(item,index) in realtimeSoeData" :key="index">
          <p class="otw">
            <span>
              <svg-icon :icon-class="item.svg"></svg-icon>
            </span>
            {{item.customerName}} - {{item.soeNote}}
          </p>
          <p>{{item.createDate}}</p>
        </li>
      </ul>
    </el-scrollbar>
    <p v-else class="not-data">暂无数据</p>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    realtimeSoeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      list: [
        {
          title:
            "设备名称 - 设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高于",
          time: "07/22 14:15:02",
          svg: "告警",
        },
        {
          title:
            "设备名称 - 设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高于",
          time: "07/22 14:15:02",
          svg: "离网",
        },
        {
          title:
            "设备名称 - 设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高于",
          time: "07/22 14:15:02",
          svg: "放电",
        },
        {
          title:
            "设备名称 - 设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高于",
          time: "07/22 14:15:02",
          svg: "充电",
        },
        {
          title:
            "设备名称 - 设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高于",
          time: "07/22 14:15:02",
          svg: "并网",
        },
        {
          title:
            "设备名称 - 设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高设备名称告警信息，当前值XX，高于",
          time: "07/22 14:15:02",
          svg: "告警",
        },
        {
          title: "XXXPCSXX单元组XX单元",
          time: "07/22 14:15:02",
          svg: "告警",
        },
        {
          title: "XXXPCSXX单元组XX单元",
          time: "07/22 14:15:02",
          svg: "告警",
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
.dynamic-u {
  // overflow: auto;
  // height: 100%;
  li {
    display: flex;
    color: $textColor;
    font-size: 14px;
    height: 25px;
    line-height: 25px;
    cursor: pointer;
    p {
      flex: 1;
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
    .svg-icon {
      width: 14px;
      height: 14px;
      vertical-align: initial;
    }
  }
}
</style>
<template>
  <div class="eventDynamics bgBorder">
    <div class="screen">
      <el-form ref="form" :model="form" :inline="true" label-width="80px">
        <el-form-item label="设备">
          <el-select clearable filterable v-model="form.equipmentId" placeholder="请选择设备">
            <el-option
              v-for="item in equipmentList"
              :key="item.equipmentId"
              :label="item.equipmentName"
              :value="item.equipmentId"
            >{{item.equipmentName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select clearable v-model="form.statusType" placeholder="请选择类型">
            <el-option
              v-for="(item,idx) in typeOptions"
              :key="item.value + idx"
              :label="item.label"
              :value="item.value"
            >{{item.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            clearable
            v-model="form.date"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <el-table
        :data="realtimeSoeData"
        style="width: 100%;height:calc(100% - 50px)"
        height="calc(100% - 50px)"
        border
        :highlight-current-row="true"
        :header-cell-style="{background:'rgba(0,160,233,0.1)'}"
        @row-click="rowClick"
      >
        <el-table-column prop="equipmentName" align="center" width="400" label="设备">
          <template slot-scope="scope">{{scope.row.customerName}} - {{scope.row.equipmentName}}</template>
        </el-table-column>
        <el-table-column prop="svg" align="center" width="100" label="类型">
          <template slot-scope="scope">{{scope.row.svg}}</template>
        </el-table-column>
        <el-table-column prop="soeNote" align="center" label="事件"></el-table-column>
        <el-table-column prop="createDate" width="200" align="center" label="时间"></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total,sizes ,prev, pager, next"
        :total="count"
        :current-page="params.currentPageIndex"
        :page-size="params.eachPageSize"
        @size-change="handleSizeChange"
        @current-change="paginationChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getSystemDynamicsData,
  getSecondaryEquipmentList,
} from "@/apis/views/index";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      userInfo: this.$attrs.userInfo,
      loading: false,
      form: {
        equipmentId: "",
        statusType: "",
        date: "",
        beginTime: "",
        endTime: "",
      },
      params: {
        currentPageIndex: 1,
        eachPageSize: 20,
      },
      count: 0,
      realtimeSoeData: [],
      equipmentList: [],
      typeOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "并网",
          value: "2",
        },
        {
          label: "离网",
          value: "3",
        },
        {
          label: "充电",
          value: "4",
        },
        {
          label: "放电",
          value: "5",
        },
        {
          label: "待机",
          value: "6",
        },
        {
          label: "运行",
          value: "7",
        },
        {
          label: "停机",
          value: "8",
        },
        {
          label: "告警",
          value: "9",
        },
      ],
    };
  },
  props: {
    childCustomerId: {},
    toEventVal: {},
  },
  watch: {
    childCustomerId(val) {
      this.getSystemDynamicsData();
      this.getSecondaryEquipmentList();
    },
  },
  computed: {
    customerId() {
      //  || this.userInfo.belongToNetwork
      return this.userInfo.customerId;
    },
  },
  mounted() {
    this.form = {
      ...this.form,
      addrIP: this.toEventVal.addrIP,
      addrIPOrder: this.toEventVal.addrIPOrder,
      equipmentId: this.toEventVal.equipmentId || "",
    };
    this.getSystemDynamicsData();
    this.getSecondaryEquipmentList();
  },
  methods: {
    getSecondaryEquipmentList() {
      let isNetworkId = 0;
      if (this.userInfo.userType == 1) {
        isNetworkId = 1;
      }
      if (this.childCustomerId) {
        isNetworkId = 0;
      }
      getSecondaryEquipmentList({
        id: this.childCustomerId || this.customerId,
        isNetworkId,
      }).then((res) => {
        if (res.code == 200) {
          res.data.unshift({
            equipmentId: "",
            equipmentName: "全部",
          });
          this.equipmentList = res.data;
        }
      });
    },
    getSystemDynamicsData() {
      let isNetworkId = 0;
      if (this.userInfo.userType == 1) {
        isNetworkId = 1;
      }
      if (this.childCustomerId) {
        isNetworkId = 0;
      }
      let form = this.form;
      if (form.date) {
        form.beginTime = form.date[0];
        form.endTime = form.date[1];
      } else {
        form.beginTime = "";
        form.endTime = "";
      }
      this.loading = true;
      getSystemDynamicsData({
        id: this.childCustomerId || this.customerId,
        isNetworkId,
        ...form,
        ...this.params,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            let statusType = this.form.statusType;
            let list = res.data.list;
            let mapData = list.realtimeSoeData;

            if (statusType == "9") {
              mapData = list.soeData;
            } else if (!statusType) {
              mapData = [...list.realtimeSoeData, ...list.soeData];
            }

            let realtimeSoeData = mapData.map((item) => {
              item.svg = this.filterStatus(item.status);
              if (statusType == "9") item.svg = "告警";
              if (!item.status) item.svg = "告警";
              item.createDate = item.createDate || item.updateTime;
              return item;
            });
            this.realtimeSoeData = realtimeSoeData || [];
            this.count = res.data.pagination.count;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    filterStatus(status) {
      switch (status) {
        case "0":
          return "通知";
          break;
        case "1":
          return "通知";
          break;
        case "2":
          return "并网";
          break;
        case "3":
          return "离网";
          break;
        case "4":
          return "充电";
          break;
        case "5":
          return "放电";
          break;
        case "6":
          return "待机";
          break;
        case "7":
          return "运行";
          break;
        case "8":
          return "停机";
          break;
        default:
          return "通知";
          break;
      }
    },
    paginationChange(val) {
      this.params.currentPageIndex = val;
      this.getSystemDynamicsData();
    },
    handleSizeChange(val) {
      this.params.eachPageSize = val;
      this.getSystemDynamicsData();
    },
    rowClick() {
      this.$nextTick(() => {
        $(".el-table__row").removeClass("current-row");
      });
    },
    submit() {
      this.params.currentPageIndex = 1;
      this.getSystemDynamicsData();
    },
    reset() {
      this.form = {
        equipmentId: "",
        statusType: "",
        date: [],
        beginTime: "",
        endTime: "",

        addrIP: "",
        addrIPOrder: "",
      };
      this.params = {
        ...this.params,
        currentPageIndex: 1,
      };
      this.getSystemDynamicsData();
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.eventDynamics {
  width: 100%;
  background: url("../../assets/images/告警底框.png") no-repeat;
  padding: 25px !important;

  .screen {
    margin-top: 10px;
    border-bottom: 2px solid #2c325a;

    >>> .el-radio__inner {
      background: #030419;
      border-color: #00a0e9;
      color: #84a0b6;
      font-size: 14px;
    }
    >>> .el-radio__label {
      color: #84a0b6;
      font-size: 14px;
    }
    >>> .el-radio__inner::after {
      border-color: #00a0e9;
    }
    >>> .el-range-separator {
      color: #84a0b6;
      font-size: 14px;
    }
    >>> .el-range-input {
      background: #030419;
      font-size: 12px;
      color: #84a0b6;
    }

    >>> .el-form-item__label {
      vertical-align: inherit;
    }
  }

  .content {
    margin-top: 20px;
    height: calc(100% - 80px);

    .pagination {
      margin-top: 20px;

      >>> .btn-prev {
        min-width: 70px;
        background: rgba(11, 12, 41, 0.5);
        border: 1px solid rgba(44, 50, 90, 1);
      }

      >>> .btn-next {
        min-width: 70px;
        background: rgba(11, 12, 41, 0.5);
        border: 1px solid rgba(44, 50, 90, 1);
      }
      >>> .number {
        background: rgba(11, 12, 41, 0.5);
        border: 1px solid rgba(44, 50, 90, 1);
      }
      >>> .more {
        background: rgba(11, 12, 41, 0.5);
        border: 1px solid rgba(44, 50, 90, 1);
      }
    }

    >>> .el-table,
    >>> .el-table th,
    >>> .el-table tr {
      background: transparent;
    }
    >>> .el-table::before,
    >>> .el-table td,
    >>> .el-table th.is-leaf {
      border-bottom-color: rgba(0, 160, 233, 1) !important;
    }

    >>> .el-table--border {
      border-left: 1px solid rgba(0, 160, 233, 1) !important;
      border-top: 1px solid rgba(0, 160, 233, 1) !important;
    }

    >>> .el-table::before {
      background-color: rgba(0, 160, 233, 1);
    }
    >>> .el-table--border::after {
      background-color: rgba(0, 160, 233, 1);
    }
    >>> .el-table--border th {
      border-right: 1px solid rgba(0, 160, 233, 1) !important;
    }
    >>> .el-table--border td {
      border-right: 1px solid rgba(0, 160, 233, 1) !important;
    }
    >>> .el-table__header .cell {
      color: rgba(0, 160, 233, 1);
    }
    >>> .el-table__body .cell {
      color: rgba(132, 160, 182, 1);
    }

    >>> .el-table tbody tr:hover > td {
      background-color: transparent !important;
    }

    >>> .current-row {
      background: transparent !important;
    }
  }
}
</style>
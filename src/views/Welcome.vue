<template>
  <el-container>
    <el-aside width="300px"> <p class="title">Welcome Back</p></el-aside>
    <el-main>
      <el-tooltip placement="bottom">
        <template #content>
          <span v-if="checkRole()">积分</span>
          <span v-else>管理员</span>
        </template>
        <div v-if="checkRole()">
          <el-image
            class="coin"
            :src="require('@/assets/coin.png')"
            fit="contain"
          />
          <p class="score">{{ score }}</p>
        </div>
        <el-image
          v-else
          class="admin"
          :src="require('@/assets/admin.png')"
          fit="contain"
        />
      </el-tooltip>
    </el-main>
  </el-container>

  <el-row justify="center">
    <el-col :span="10">
      <div v-if="checkRole()" id="deliveryNumberGraph"></div>
      <div v-else id="garbageCategoryGraph"></div>
    </el-col>
    <el-col :span="10">
      <div v-if="checkRole()" id="deliveryStatusGraph"></div>
      <div v-else id="totalDeliveryStatusGraph"></div>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { getUserById } from "@/request/personalApi";
import {
  getGarbageCountGroupByCategory,
  getGarbageDeliveryCountGroupByStatus,
  getGarbageDeliveryCountGroupByWeek,
  getPersonalGarbageDeliveryCountGroupByStatus,
} from "@/request/welcomeApi";
import useUserStore from "@/store/user";
import { EChartsOption } from "echarts";
import { storeToRefs } from "pinia";
import { defineComponent, reactive, ref, toRefs, inject } from "vue";
export default defineComponent({
  name: "welcome",
  setup(props) {
    const echarts: any = inject("echarts");

    const userStore = useUserStore();
    const { id, username, roleList } = storeToRefs(userStore);

    const score = ref(0);

    function checkRole() {
      const result = roleList.value.filter((r) => r.role === "admin");
      return result.length === 0;
    }

    function showDeliveryNumberGraph(p: any[]) {
      const data = new Array();
      p.forEach((e) => {
        data.push(e.value);
      });

      const deliveryNumberGraphDom = document.getElementById(
        "deliveryNumberGraph"
      );
      const deliveryNumberGraph = echarts.init(deliveryNumberGraphDom, null, {
        width: 320,
        height: 350,
      });
      const deliveryNumberGraphOption: EChartsOption = {
        title: {
          text: "每周投递垃圾数量",
          textStyle: {
            fontSize: "16",
            fontWeight: "normal",
            lineHeight: 10,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["柱状图", "折线图"],
          orient: "vertical",
          right: "right",
        },
        grid: {
          left: "4%",
          right: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          name: "次数",
        },
        series: [
          {
            name: "柱状图",
            type: "bar",
            itemStyle: {
              opacity: 0.8,
            },
            data,
          },
          {
            name: "折线图",
            type: "line",
            itemStyle: {
              color: "#f78989",
            },
            data,
          },
        ],
      };

      deliveryNumberGraphOption &&
        deliveryNumberGraph.setOption(deliveryNumberGraphOption);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        deliveryNumberGraph.resize();
      });
    }

    function showDeliveryStatusGraph(p: any[]) {
      const deliveryStatusGraphDom = document.getElementById(
        "deliveryStatusGraph"
      );
      const deliveryStatusGraph = echarts.init(deliveryStatusGraphDom, null, {
        width: 320,
        height: 350,
      });
      const deliveryStatusGraphOption: EChartsOption = {
        title: {
          text: "投递垃圾情况",
          textStyle: {
            fontSize: "16",
            fontWeight: "normal",
            lineHeight: 10,
          },
        },
        tooltip: {
          trigger: "item",
          formatter,
        },
        legend: {
          orient: "vertical",
          right: "right",
          textStyle: {
            fontSize: "11",
            fontWeight: "normal",
          },
        },
        dataset: {
          source: [],
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            data: [
              {
                value: p[0].value,
                name: "正确(获得积分)",
                itemStyle: {
                  color: "#67C23A",
                  opacity: 0.8,
                },
              },
              {
                value: p[1].value,
                name: "错误(扣减积分)",
                itemStyle: {
                  color: "#F56C6C",
                  opacity: 0.8,
                },
              },
              {
                value: p[2].value,
                name: "异常(违规)",
                itemStyle: {
                  color: "#ebb563",
                  opacity: 0.8,
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      deliveryStatusGraphOption &&
        deliveryStatusGraph.setOption(deliveryStatusGraphOption);

      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        deliveryStatusGraph.resize();
      });
    }

    function showGarbageCategoryGraph(p: any) {
      const garbageCategoryGraphDom = document.getElementById(
        "garbageCategoryGraph"
      );
      const garbageCategoryGraph = echarts.init(garbageCategoryGraphDom, null, {
        width: 250,
        height: 320,
      });
      const garbageCategoryGraphOption: EChartsOption = {
        title: {
          text: "垃圾分类数量",
          textStyle: {
            fontSize: "16",
            fontWeight: "normal",
            lineHeight: 10,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "1%",
          right: "3%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["可回收垃圾", "其他垃圾", "厨余垃圾", "有害垃圾"],
          axisLabel: {
            rotate: 90,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: [
              {
                value: p[0].value,
                name: "可回收垃圾",
                itemStyle: {
                  color: "#67C23A",
                  opacity: 0.8,
                },
              },
              {
                value: p[1].value,
                name: "其他垃圾",
                itemStyle: {
                  color: "#909399",
                  opacity: 0.8,
                },
              },
              {
                value: p[2].value,
                name: "厨余垃圾",
                itemStyle: {
                  color: "#ebb563",
                  opacity: 0.8,
                },
              },
              {
                value: p[3].value,
                name: "有害垃圾",
                itemStyle: {
                  color: "#F56C6C",
                  opacity: 0.8,
                },
              },
            ],
          },
        ],
      };

      garbageCategoryGraphOption &&
        garbageCategoryGraph.setOption(garbageCategoryGraphOption);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        garbageCategoryGraph.resize();
      });
    }

    function showTotalDeliveryStatusGraph(p: any) {
      const totalDeliveryStatusGraphDom = document.getElementById(
        "totalDeliveryStatusGraph"
      );
      const totalDeliveryStatusGraph = echarts.init(
        totalDeliveryStatusGraphDom,
        null,
        {
          width: 320,
          height: 350,
        }
      );
      const totalDeliveryStatusGraphOption: EChartsOption = {
        title: {
          text: "投递垃圾情况",
          textStyle: {
            fontSize: "16",
            fontWeight: "normal",
            lineHeight: 10,
          },
        },
        tooltip: {
          trigger: "item",
          formatter,
        },
        legend: {
          orient: "vertical",
          right: "right",
          textStyle: {
            fontSize: "11",
            fontWeight: "normal",
            overflow: "none",
          },
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            data: [
              {
                value: p[0].value,
                name: "正确(获得积分)",
                itemStyle: {
                  color: "#67C23A",
                  opacity: 0.8,
                },
              },
              {
                value: p[1].value,
                name: "错误(扣减积分)",
                itemStyle: {
                  color: "#F56C6C",
                  opacity: 0.8,
                },
              },
              {
                value: p[2].value,
                name: "异常(违规)",
                itemStyle: {
                  color: "#ebb563",
                  opacity: 0.8,
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      totalDeliveryStatusGraphOption &&
        totalDeliveryStatusGraph.setOption(totalDeliveryStatusGraphOption);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        totalDeliveryStatusGraph.resize();
      });
    }

    function formatter(p: any): string {
      // console.log(p);
      const name = p.data.name;
      const value = p.data.value;
      const percent = p.percent;
      return `${name}\t${value}(${percent}%)`;
    }

    return {
      id,
      username,
      score,
      checkRole,
      showDeliveryNumberGraph,
      showDeliveryStatusGraph,
      showGarbageCategoryGraph,
      showTotalDeliveryStatusGraph,
    };
  },
  mounted() {
    getUserById(this.id).then(
      (res) => {
        this.score = res.data.data.score;
      },
      (err) => {
        console.log(err);
      }
    );

    if (this.checkRole()) {
      getGarbageDeliveryCountGroupByWeek(this.id).then(
        (res) => {
          // console.log(res);
          this.showDeliveryNumberGraph(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );

      getPersonalGarbageDeliveryCountGroupByStatus(this.id).then(
        (res) => {
          // console.log(res);
          this.showDeliveryStatusGraph(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      getGarbageCountGroupByCategory().then(
        (res) => {
          // console.log(res);
          this.showGarbageCategoryGraph(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );

      getGarbageDeliveryCountGroupByStatus().then(
        (res) => {
          // console.log(res);
          this.showTotalDeliveryStatusGraph(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  },
});
</script>
<style lang="less" scoped>
.el-container {
  height: 100px;
  margin-bottom: 50px;
  .title {
    margin: 0px;
    line-height: 90px;
    height: 90px;
    color: #ff6a00;
    font-size: 48px;
    font-weight: 500;
    font-family: "butteyhoney";
  }

  .el-main {
    margin-left: 50%;
    height: 100px;
    .coin {
      width: 55px;
      height: 55px;
    }

    .admin {
      width: 45px;
      height: 45px;
    }

    .score {
      margin: 0px;
      font-size: 13px;
      font-family: "OPPOSans-B";
    }
  }
}
</style>
<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">订单列表</h1>
    </el-col>
  </el-row>
  <el-table
    class="table"
    ref="tableRef"
    max-height="500px"
    stripe
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column prop="id" label="订单编号" width="150" align="center" />
    <el-table-column prop="sum" label="订单总积分" align="center" />
    <el-table-column prop="createTime" label="创建时间" align="center">
      <template #default="scope">
        {{ scope.row.createTime.replace("T", " ") }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" @click="showDetails(scope.$index, scope.row)"
          >详情</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <el-row justify="center" class="pagination">
    <el-col :span="16">
      <el-pagination
        v-model:current-page="currentPage"
        :hide-on-single-page="true"
        :background="true"
        :total="totalPage"
        :page-count="totalPage"
        layout="prev, pager, next, jumper, total"
      />
    </el-col>
  </el-row>

  <el-dialog v-model="dialogVisible" width="45%" center align-center>
    <template #header>
      <h1 class="title">订单详情信息</h1>
    </template>
    <el-table
      class="table"
      ref="tableRef"
      stripe
      :data="orderDetails"
      style="width: 100%"
    >
      <el-table-column prop="goodName" label="商品名称" align="center" />
      <el-table-column prop="goodImage" label="图片" align="center">
        <template #default="scope">
          <el-image
            class="image"
            style="width: 75px; height: 75px"
            :src="scope.row.goodImage[0]"
            :preview-src-list="scope.row.goodImage"
            fit="cover"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column prop="count" label="数量" align="center" />
      <el-table-column label="积分" align="center">
        <template #default="scope">
          {{ scope.row.count * scope.row.goodScore }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script lang="ts">
import {
  getAllOrderCount,
  getOrderDetailsList,
  getOrderList,
} from "@/request/orderListApi";
import useUserStore from "@/store/user";
import { Order, OrderDetails } from "@/type/orderList";
import { ElTable } from "element-plus";
import { storeToRefs } from "pinia";
import { defineComponent, inject, reactive, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "orderList",
  setup(props) {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Order> = reactive([]);

    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);

    const orderDetails: Array<OrderDetails> = reactive([]);

    function showDetails(index: number, row: Order) {
      // console.log(row)
      getOrderDetailsList(row.id).then(
        (res) => {
          // console.log(res);
          orderDetails.splice(0, orderDetails.length);
          const temp: Array<OrderDetails> = res.data.data;
          temp.forEach((t) => {
            if (typeof t.goodImage === "string") {
              t.goodImage = new Array(t.goodImage);
            }
            orderDetails.push(t);
          });
          dialogVisible.value = true;
        },
        (err) => {
          console.log(err);
        }
      );
    }

    watch(currentPage, (newValue, oldValue) => {
      getOrderList(id.value, currentPage.value, 5).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const orderList: Array<Order> = res.data.data;
          orderList.forEach((o) => {
            tableData.push(o);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });

    return {
      id,
      currentPage,
      totalPage,
      dialogVisible,
      tableRef,
      tableData,
      orderDetails,
      showDetails,
    };
  },
  mounted() {
    getOrderList(this.id, 1, 5).then(
      (res) => {
        // console.log(res);
        const orderList: Array<Order> = res.data.data;
        orderList.forEach((o) => {
          this.tableData.push(o);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getAllOrderCount(this.id).then(
      (res) => {
        // console.log(res);
        this.totalPage = Math.round(res.data.data / 5);
      },
      (err) => {
        console.log(err);
      }
    );
  },
});
</script>
<style lang="less" scoped>
.title {
  font-size: 21px;
  color: #409eff;
}
</style>
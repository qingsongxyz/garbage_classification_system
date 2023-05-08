<template>
  <el-row justify="center">
    <el-col :span="5">
      <el-image :src="require('@/assets/news.png')" fit="contain" />
    </el-col>
  </el-row>

  <el-row justify="center">
    <el-col :span="16">
      <el-table
        class="table"
        ref="tableRef"
        max-height="500px"
        stripe
        :show-header="false"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" width="45">
          <span class="dot">·</span>
        </el-table-column>
        <el-table-column prop="title" width="200" align="left">
          <template #default="scope">
            <el-link
              @click="showDetails(scope.row.id)"
              type="info"
              class="title"
              >{{ scope.row.title }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="right">
          <template #default="scope">
            <span class="createTime">{{ scope.row.createTime.replace("T", " ") }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <el-row justify="center" class="pagination">
    <el-col>
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
</template>
<script lang="ts">
import {
  getBroadcastList,
  getBroadcastListCount,
} from "@/request/broadcastListApi";
import { Broadcast } from "@/type/broadcastList";
import { ElTable } from "element-plus";
import { defineComponent, reactive, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "notice",
  setup(props) {
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Broadcast> = reactive([]);

    const currentPage = ref(1);
    const totalPage = ref(1);

    const router = useRouter();

    function showDetails(id: number) {
      router.push({ name: "noticeDetails", params: { id } });
    }

    watch(currentPage, (newValue, oldValue) => {
      tableData.splice(0, tableData.length);
      getBroadcastList(currentPage.value, 10).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: Broadcast[] = res.data.data;
          data.forEach((d) => {
            tableData.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });

    return {
      tableRef,
      tableData,
      currentPage,
      totalPage,
      showDetails,
    };
  },
  mounted() {
    getBroadcastList(1, 10).then(
      (res) => {
        // console.log(res);
        const data: Broadcast[] = res.data.data;
        data.forEach((d) => {
          this.tableData.push(d);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getBroadcastListCount("").then(
      (res) => {
        // console.log(res);
        this.totalPage = Math.ceil(res.data.data / 10);
      },
      (err) => {
        console.log(err);
      }
    );
  },
});
</script>
<style lang="less" scoped>
.el-image {
  margin-top: 30px;
}

.table {
  color: #393a3c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 10px;

  .dot {
    width: 5px;
    height: 5px;
    font-size: 35px;
    color: #409eff;
  }

  .title {
    color: #303030;
    font-size: 16px;
  }

  .createTime {
    font-size: 14px;
    font-family: "PingFang SC";
    margin-right: 80px;
  }
}

.el-pagination {
  margin-top: 40px;
  margin-left: 35%;
}
</style>
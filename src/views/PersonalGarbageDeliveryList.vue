<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">投递记录列表</h1>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="20">
      <el-select
        class="searchStatus"
        clearable
        v-model="searchStatus"
        placeholder="请选择投递状态查询"
        style="width: 200px"
        @change="search"
      >
        <el-option :key="0" label="预发放" :value="0" />
        <el-option :key="1" label="正常" :value="1" />
        <el-option :key="2" label="错误" :value="2" />
        <el-option :key="3" label="异常" :value="3" />
      </el-select>
    </el-col>
  </el-row>

  <el-table
    class="table"
    max-height="500px"
    stripe
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column prop="id" label="投递编号" width="150" align="center" />
    <el-table-column prop="total" label="总积分" width="80" align="center" />
    <el-table-column prop="stationAddress" label="垃圾站地址" align="center" />
    <el-table-column prop="createTime" label="投递时间" align="center">
      <template #default="scope">
        {{ scope.row.createTime.replace("T", " ") }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="投递状态" width="120" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 0"> 预发放 </el-tag>
        <el-tag v-else-if="scope.row.status === 1" type="success">
          正常
        </el-tag>
        <el-tag v-else-if="scope.row.status === 2" type="warning">
          错误
        </el-tag>
        <div v-else-if="scope.row.status === 3">
          <el-tag type="danger"> 异常 </el-tag>
          <el-tooltip
            effect="light"
            :content="scope.row.addition"
            placement="bottom"
          >
            <el-icon style="margin-left: 5px" color="#F56C6C"
              ><InfoFilled
            /></el-icon>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" align="center">
      <template #default="scope">
        <el-button
          type="primary"
          @click="handleDetails(scope.$index, scope.row)"
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

  <el-dialog v-model="dialogVisible" width="70%" center align-center>
    <template #header>
      <h1 class="title">投递详情信息</h1>
    </template>

    <el-table
      class="table"
      max-height="500px"
      stripe
      :data="detailsData"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="投递垃圾编号"
        width="150"
        align="center"
      />
      <el-table-column
        prop="garbageName"
        label="投递垃圾名称"
        width="110"
        align="center"
      />
      <el-table-column prop="garbageImage" label="垃圾图片" align="center">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-image
              class="image"
              style="width: 75px; height: 75px"
              :src="scope.row.garbageImage[0]"
              :preview-src-list="scope.row.garbageImage"
              fit="cover"
              preview-teleported
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="garbageCategory"
        label="投递垃圾分类"
        width="110"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-show="scope.row.garbageCategory === '可回收垃圾'"
            disable-transitions
            type="success"
            >{{ scope.row.garbageCategory }}</el-tag
          >
          <el-tag
            v-show="scope.row.garbageCategory === '餐余垃圾'"
            disable-transitions
            >{{ scope.row.garbageCategory }}</el-tag
          >
          <el-tag
            v-show="scope.row.garbageCategory === '其他垃圾'"
            disable-transitions
            type="info"
            >{{ scope.row.garbageCategory }}</el-tag
          >
          <el-tag
            v-show="scope.row.garbageCategory === '有害垃圾'"
            disable-transitions
            type="danger"
            >{{ scope.row.garbageCategory }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="count" width="80" label="垃圾总量" align="center">
        <template #default="scope">
          {{ scope.row.count }}&nbsp;/&nbsp;{{ scope.row.garbageUnit }}
        </template>
      </el-table-column>
      <el-table-column label="垃圾总积分" width="100" align="center">
        <template #default="scope">
          {{ sum(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="flag"
        label="是否正确分类"
        width="110"
        align="center"
      >
        <template #default="scope">
          <el-icon v-if="scope.row.flag === 0" color="#67C23A" size="20"
            ><Check
          /></el-icon>
          <el-icon v-else-if="scope.row.flag === 1" color="#F56C6C" size="20"
            ><Close
          /></el-icon>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  getAllGarbageDeliveryCountByUserId,
  getAllGarbageDeliveryCountByUserIdAndStatus,
  getGarbageDeliveryDetailsVOByDeliveryId,
  getGarbageDeliveryList,
  getGarbageDeliveryListByUserIdAndStatus,
} from "@/request/personalGarbageDeliveryListApi";
import useUserStore from "@/store/user";
import {
  GarbageDelivery,
  GarbageDeliveryDetails,
} from "@/type/personalGarbageDeliveryList";
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import { Mark } from "element-plus/es/components/slider/src/composables";
import { storeToRefs } from "pinia";
import {
  CSSProperties,
  defineComponent,
  inject,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  name: "personalGarbageDeliveryList",
  setup(props) {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const searchStatus = ref();
    let dialogVisible = ref(false);
    const tableData: Array<GarbageDelivery> = reactive([]);

    const detailsData: Array<GarbageDeliveryDetails> = reactive([]);

    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);

    //计算每种垃圾投递的总积分
    function sum(g: GarbageDeliveryDetails) {
      g.sum = (g.count || 0) * g.garbageScore;
      return g.sum;
    }

    function search() {
      getGarbageDeliveryListByUserIdAndStatus(
        id.value,
        searchStatus.value,
        1,
        5
      ).then(
        (res) => {
          tableData.splice(0, tableData.length);
          const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
          garbageDeliveryList.forEach((g) => {
            tableData.push(g);
          });
        },
        (err) => {
          console.log(err.message);
        }
      );

      getAllGarbageDeliveryCountByUserIdAndStatus(
        id.value,
        searchStatus.value
      ).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 5);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function handleDetails(index: number, row: GarbageDelivery) {
      getGarbageDeliveryDetailsVOByDeliveryId(row.id).then(
        (res) => {
          // console.log(res);
          detailsData.splice(0, detailsData.length);
          const garbageDeliveryDetails: Array<GarbageDeliveryDetails> =
            res.data.data;
          garbageDeliveryDetails.forEach((d) => {
            if (typeof d.garbageImage === "string") {
              d.garbageImage = new Array(d.garbageImage);
            }

            detailsData.push(d);
          });

          dialogVisible.value = true;
        },
        (err) => {
          console.log(err);
        }
      );
    }

    watch(currentPage, (newValue, oldValue) => {
      if (searchStatus.value >= 0 && searchStatus.value <= 2) {
        getGarbageDeliveryListByUserIdAndStatus(
          id.value,
          searchStatus.value,
          currentPage.value,
          5
        ).then(
          (res) => {
            tableData.splice(0, tableData.length);
            const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
            garbageDeliveryList.forEach((g) => {
              tableData.push(g);
            });
          },
          (err) => {
            console.log(err.message);
          }
        );
      } else {
        getGarbageDeliveryList(id.value, currentPage.value, 5).then(
          (res) => {
            // console.log(res);
            tableData.splice(0, tableData.length);
            const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
            garbageDeliveryList.forEach((g) => {
              tableData.push(g);
            });
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });

    return {
      currentPage,
      totalPage,
      searchStatus,
      dialogVisible,
      tableData,
      detailsData,
      id,
      sum,
      search,
      handleDetails,
    };
  },
  mounted() {
    getGarbageDeliveryList(this.id, 1, 5).then(
      (res) => {
        // console.log(res);
        const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
        garbageDeliveryList.forEach((g) => {
          this.tableData.push(g);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getAllGarbageDeliveryCountByUserId(this.id).then(
      (res) => {
        // console.log(res);
        this.totalPage = Math.ceil(res.data.data / 5);
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

.searchStatus {
  margin-left: 65%;
}

.table {
  margin-top: 10px;

  .image {
    margin-left: 30%;
  }

  .el-button {
    width: 48px;
    height: 27px;
  }
}
</style>
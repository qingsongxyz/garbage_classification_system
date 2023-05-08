<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">投递记录列表</h1>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="22">
      <el-button
        class="batchOperation"
        style="width: 85px; height: 29px"
        type="danger"
        @click="updateChoosen"
      >
        <el-icon><Briefcase /></el-icon>
        <span style="font-size: 12px">批量更改</span>
      </el-button>

      <el-select
        class="searchStatus"
        clearable
        v-model="searchStatus"
        placeholder="请选择投递状态查询"
        @change="search"
      >
        <el-option :key="0" label="预发放" :value="0" />
        <el-option :key="1" label="正常" :value="1" />
        <el-option :key="2" label="错误" :value="2" />
        <el-option :key="3" label="异常" :value="3" />
      </el-select>

      <el-autocomplete
        v-model="searchName"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="username"
        select-when-unmatched
        clearable
        placeholder="请输入用户名称查询"
        @select="handleSelect"
      />
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
    <el-table-column type="selection" width="40" />
    <el-table-column
      prop="id"
      label="投递编号"
      width="150"
      align="center"
      fixed
    />
    <el-table-column
      prop="userVO.username"
      label="用户名"
      width="100"
      align="center"
      fixed
    />
    <el-table-column
      prop="userVO.image"
      label="用户头像"
      width="150"
      align="center"
    >
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-image
            class="image"
            style="width: 75px; height: 75px"
            :src="scope.row.userVO.image[0]"
            :preview-src-list="scope.row.userVO.image"
            fit="cover"
            preview-teleported
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="total" label="总积分" width="70" align="center" />
    <el-table-column
      prop="createTime"
      label="投递时间"
      width="200"
      align="center"
    >
      <template #default="scope"> {{scope.row.createTime.replace("T", " ")}} </template>
    </el-table-column>
    <el-table-column
      prop="stationAddress"
      label="垃圾站地址"
      width="230"
      align="center"
    />
    <el-table-column prop="status" label="投递状态" width="100" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 0"> 预发放 </el-tag>
        <el-tag v-else-if="scope.row.status === 1" type="success">
          正常
        </el-tag>
        <el-tag v-else-if="scope.row.status === 2" type="warning">
          错误
        </el-tag>
        <el-tag v-else-if="scope.row.status === 3" type="danger"> 异常 </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" align="center">
      <template #default="scope">
        <el-button
          type="primary"
          @click="handleDetails(scope.$index, scope.row)"
          >详情</el-button
        >
        <el-button type="danger" @click="handleChange(scope.$index, scope.row)"
          >更改</el-button
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

  <el-dialog v-model="updateVisible" width="40%" center align-center>
    <template #header>
      <h1 class="title">更改投递状态</h1>
    </template>

    <el-row justify="center">
      <el-col :span="16">
        <el-slider v-model="sliderValue" :max="3" :marks="marks" />
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col :span="16">
        <div class="addition" v-show="sliderValue === 3">
          <el-icon><InfoFilled /></el-icon>&nbsp;附加信息:<el-input
            v-model="updateDelivery.addition"
          ></el-input>
        </div>
      </el-col>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updateGarbageDeliveryFunction"
          >确定</el-button
        >
        <el-button @click="updateVisible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  getAllGarbageDeliveryCount,
  getGarbageDeliveryList,
  getGarbageDeliveryListByUsernameOrStatus,
  getGarbageDeliveryDetailsVOByDeliveryId,
  getAllGarbageDeliveryCountByUsernameOrStatus,
  updateGarbageDelivery,
} from "@/request/garbageDeliveryListApi";
import { getAllUsersByName } from "@/request/userListApi";
import {
  GarbageDelivery,
  GarbageDeliveryDetails,
  GarbageDeliveryForm,
} from "@/type/personalGarbageDeliveryList";
import User from "@/type/userList";
import { ElMessage, ElTable } from "element-plus";
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
  name: "garbageDeliveryList",
  setup(props) {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const searchStatus = ref();
    const searchName = ref("");
    let dialogVisible = ref(false);
    const tableData: Array<GarbageDelivery> = reactive([]);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const detailsData: Array<GarbageDeliveryDetails> = reactive([]);

    let updateVisible = ref(false);

    interface Mark {
      style: CSSProperties;
      label: string;
    }

    type Marks = Record<number, Mark | string>;

    const marks = reactive<Marks>({
      0: {
        style: {
          color: "#909399",
          "font-size": "15px",
        },
        label: "预发放",
      },
      1: {
        style: {
          color: "#67C23A",
          "font-size": "15px",
        },
        label: "正常",
      },
      2: {
        style: {
          color: "#E6A23C",
          "font-size": "15px",
        },
        label: "错误",
      },
      3: {
        style: {
          color: "#F56C6C",
          "font-size": "15px",
        },
        label: "异常",
      },
    });

    const updateDelivery: GarbageDeliveryForm = reactive({
      id: 1,
      status: 0,
    });

    const sliderValue = ref(0);

    //是否批量修改
    const isBatch = ref(false);

    //计算每种垃圾投递的总积分
    function sum(g: GarbageDeliveryDetails) {
      let sign = 1;
      if (g.flag === 1) {
        sign = -1;
      }
      g.sum = sign * (g.count || 0) * g.garbageScore;
      return g.sum;
    }

    const querySearch = (queryString: string, cb: any) => {
      if (!queryString) {
        return;
      }

      getAllUsersByName(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((c: any) => {
            return c.username.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    const handleSelect = (item: User) => {
      search();
    };

    function search() {
      getGarbageDeliveryListByUsernameOrStatus(
        searchName.value,
        searchStatus.value,
        1,
        5
      ).then(
        (res) => {
          tableData.splice(0, tableData.length);
          const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
          garbageDeliveryList.forEach((g) => {
            if (g.userVO && typeof g.userVO.image === "string") {
              g.userVO.image = new Array(g.userVO?.image);
            }
            tableData.push(g);
          });
        },
        (err) => {
          console.log(err.message);
        }
      );

      getAllGarbageDeliveryCountByUsernameOrStatus(
        searchName.value,
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

    function handleChange(index: number, row: GarbageDelivery) {
      isBatch.value = false;
      updateDelivery.id = row.id;
      updateDelivery.addition = row.addition;
      updateDelivery.status = row.status;
      sliderValue.value = row.status;
      updateVisible.value = true;
    }

    watch(currentPage, (newValue, oldValue) => {
      getGarbageDeliveryListByUsernameOrStatus(
        searchName.value,
        searchStatus.value,
        currentPage.value,
        5
      ).then(
        (res) => {
          // console.log(res);
          const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
          garbageDeliveryList.forEach((g) => {
            if (g.userVO && typeof g.userVO.image === "string") {
              g.userVO.image = new Array(g.userVO?.image);
            }
            tableData.push(g);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });

    function updateGarbageDeliveryFunction() {
      const garbageDeliveryList: Array<GarbageDeliveryForm> = [];
      if (!isBatch.value) {
        updateDelivery.status = sliderValue.value;
        garbageDeliveryList.push(updateDelivery);
      } else {
        const choosenRows: Array<GarbageDelivery> =
          tableRef.value?.getSelectionRows();
        choosenRows.forEach((r) => {
          const garbageDelivery: GarbageDeliveryForm = {
            id: r.id,
            status: sliderValue.value,
          };
          garbageDeliveryList.push(garbageDelivery);
        });
      }

      updateGarbageDelivery(garbageDeliveryList).then(
        (res) => {
          // console.log(res);
          if (res.data.code === 200) {
            sliderValue.value = 0;
            reload();
            ElMessage.success({
              message: "修改垃圾投递信息成功!",
              duration: 2000,
              center: true,
            });
          } else {
            ElMessage.error({
              message: "修改垃圾投递信息失败!!!",
              duration: 2000,
              center: true,
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function updateChoosen() {
      const choosenRows: Array<GarbageDelivery> =
        tableRef.value?.getSelectionRows();

      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要更改的投递记录!!!",
          duration: 2000,
          center: true,
        });
      } else {
        isBatch.value = true;
        updateVisible.value = true;
      }
    }

    return {
      currentPage,
      totalPage,
      searchStatus,
      searchName,
      dialogVisible,
      tableData,
      tableRef,
      detailsData,
      updateVisible,
      marks,
      updateDelivery,
      sliderValue,
      sum,
      querySearch,
      handleSelect,
      search,
      handleDetails,
      handleChange,
      updateGarbageDeliveryFunction,
      updateChoosen,
    };
  },
  mounted() {
    getGarbageDeliveryList(1, 5).then(
      (res) => {
        // console.log(res);
        const garbageDeliveryList: Array<GarbageDelivery> = res.data.data;
        garbageDeliveryList.forEach((g) => {
          if (g.userVO && typeof g.userVO.image === "string") {
            g.userVO.image = new Array(g.userVO?.image);
          }
          this.tableData.push(g);
        });
      },
      (err) => {
        console.log(err);
      }
    );
    getAllGarbageDeliveryCount().then(
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

.batchOperation {
  margin-right: 43%;
}

.searchStatus {
  width: 200px;
  margin-right: 20px;
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

.addition {
  width: 300px;
  margin-top: 40px;
  margin-bottom: 0;
}
</style>
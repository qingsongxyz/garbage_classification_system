<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">消息列表</h1>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="2">
      <el-button
        class="deleteAll"
        style="width: 85px; height: 29px"
        type="danger"
        @click="deleteChoosen"
      >
        <el-icon> <DeleteFilled /> </el-icon
        ><span style="font-size: 12px">全部删除</span>
      </el-button>
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
    <el-table-column prop="id" label="消息编号" width="150px" align="center" />
    <el-table-column prop="title" label="消息标题" align="center" />
    <el-table-column
      prop="userVO.username"
      label="发布者"
      width="100px"
      align="center"
    />
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="160px"
      align="center"
    >
      <template #default="scope">
        {{ scope.row.createTime.replace("T", " ") }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200px" align="center">
      <template #header>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          value-key="title"
          select-when-unmatched
          :debounce="0"
          clearable
          placeholder="请输入消息标题查询"
          @select="handleSelect"
        />
      </template>
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button
        >
        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <el-row justify="center" class="pagination">
    <el-col :span="10">
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

  <el-dialog v-model="dialogVisible" width="65%" center align-center>
    <el-row justify="center">
      <el-col :span="4">
        <h1 class="title">修改消息信息</h1>
      </el-col>
    </el-row>
    <el-form
      ref="ruleFormRef"
      :model="updateBroadcast"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="24">
          <el-form-item label="消息标题" prop="title">
            <el-input v-model="title" clearable style="width: 250px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="24">
          <el-form-item label="消息内容" required>
            <WangEditor ref="wangRef" class="wang" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row justify="center">
      <el-col :span="6">
        <el-button type="primary" @click="updateBroadcastFunction(ruleFormRef)"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">
import {
  deleteBroadcast,
  deleteBroadcastList,
  getAllBroadcastListByTitle,
  getBroadcastList,
  getBroadcastListByTitle,
  getBroadcastListCount,
  updateBroadcastFunc,
} from "@/request/broadcastListApi";
import WangEditor from "@/components/WangEditor.vue";
import { Broadcast, UpdateBroadcastForm } from "@/type/broadcastList";
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import {
  defineComponent,
  inject,
  nextTick,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  name: "broadcastList",
  component: { WangEditor },
  setup(props) {
    const reload: any = inject("reload");
    const search = ref("");
    let dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Broadcast> = reactive([]);
    const currentPage = ref(1);
    const totalPage = ref(1);

    let updateBroadcast: UpdateBroadcastForm = reactive({
      id: 1,
      title: "",
      content: "",
    });

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      title: [
        {
          required: true,
          message: "请输入消息标题",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "消息标题长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      content: [
        {
          required: true,
          message: "请输入消息内容",
          trigger: "blur",
        },
      ],
    });

    const wangRef = ref();

    function handleEdit(index: number, row: Broadcast) {
      //显示修改对话框
      dialogVisible.value = true;
      updateBroadcast.id = row.id;
      updateBroadcast.title = row.title;
      updateBroadcast.content = row.content;
      nextTick(() => {
        wangRef.value.setContent(row.content);
      });
      // console.log(updateRole)
    }

    async function updateBroadcastFunction(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (wangRef.value.isEditorEmpty()) {
            ElMessage.warning({
              message: "请输入消息内容!!!",
              duration: 2000,
              center: true,
            });
            return;
          }

          updateBroadcast.content = wangRef.value.getContent();

          updateBroadcastFunc(updateBroadcast).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "修改消息成功!",
                  duration: 2000,
                  center: true,
                });
                dialogVisible.value = false;
                reload();
              } else {
                ElMessage.error({
                  message: "修改消息失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          console.log("error submit!", fields);
        }
      });
    }

    function handleDelete(index: number, row: Broadcast) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除消息"${row.title}"吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteBroadcast(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code) {
              reload();
              ElMessage.success({
                message: "删除消息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除消息失败!!!",
                duration: 2000,
                center: true,
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
      });
    }

    function deleteChoosen() {
      const choosenRows: Array<Broadcast> = tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除的消息!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中的消息吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteBroadcastList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "修改消息成功!",
                  duration: 2000,
                  center: true,
                });
                dialogVisible.value = false;
                reload();
              } else {
                ElMessage.error({
                  message: "修改消息失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );
        });
      }
    }

    const querySearch = (queryString: string, cb: any) => {
      // console.log(queryString);
      if (!queryString) {
        return;
      }

      getAllBroadcastListByTitle(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((c: Broadcast) => {
            return c.title.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    const handleSelect = (item: any) => {
      if (item.value === "") {
        reload();
        return;
      }
      // console.log(item);
      searchFunction();
    };

    function searchFunction() {
      getBroadcastListByTitle(search.value, 1, 5).then(
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

      getBroadcastListCount(search.value).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 5);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    watch(currentPage, (newValue, oldValue) => {
      tableData.splice(0, tableData.length);
      if (search.value !== "") {
        getBroadcastListByTitle(search.value, currentPage.value, 5).then(
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
      } else {
        getBroadcastList(currentPage.value, 5).then(
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
      }
    });

    return {
      search,
      dialogVisible,
      tableRef,
      tableData,
      updateBroadcast,
      ...toRefs(updateBroadcast),
      ruleFormRef,
      rules,
      currentPage,
      totalPage,
      wangRef,
      handleEdit,
      updateBroadcastFunction,
      handleDelete,
      deleteChoosen,
      querySearch,
      handleSelect,
    };
  },
  mounted() {
    getBroadcastList(1, 5).then(
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
h1 {
  font-size: 21px;
  color: #409eff;
}

.table {
  margin-top: 10px;

  .el-button {
    width: 48px;
    height: 27px;
  }
}

.el-dialog {
  .wang {
    width: 96%;
    height: 420px;
  }
}
</style>
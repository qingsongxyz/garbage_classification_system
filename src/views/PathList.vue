<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">权限列表</h1>
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
    <el-table-column prop="id" label="权限编号" width="150px" align="center" />
    <el-table-column
      prop="path"
      label="权限路径"
      width="180px"
      align="center"
    />
    <el-table-column prop="description" label="权限简介" align="center" />
    <el-table-column label="操作" width="200px" align="center">
      <template #header>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          value-key="path"
          select-when-unmatched
          :debounce="0"
          clearable
          placeholder="请输入权限路径查询"
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

  <el-dialog v-model="dialogVisible" width="55%" center align-center>
    <template #header>
      <h1 class="title">修改权限信息</h1>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="updatePath"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="权限路径" prop="path">
            <el-input v-model="path" clearable style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="权限简介" prop="description">
            <el-input v-model="description" clearable style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updateRoleFunction(ruleFormRef)"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  deletePath,
  deletePathList,
  getAllPathCount,
  getAllPathListByPath,
  getPathCountByPath,
  getPathList,
  getPathListByPath,
  updatePathInfo,
} from "@/request/pathListApi";
import Path from "@/type/pathList";
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import { defineComponent, inject, reactive, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "pathList",
  setup(props) {
    const reload: any = inject("reload");
    const search = ref("");
    let dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Path> = reactive([]);
    const currentPage = ref(1);
    const totalPage = ref(1);

    let updatePath: Path = reactive({
      id: 1,
      path: "",
      description: "",
    });

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      path: [
        {
          required: true,
          message: "请输入权限路径",
          trigger: "blur",
        },
        {
          min: 1,
          max: 255,
          message: "权限路径长度必须在1~255之间",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "请输入权限简介",
          trigger: "blur",
        },
        {
          min: 1,
          max: 255,
          message: "权限简介长度必须在1~255之间",
          trigger: "blur",
        },
      ],
    });

    function handleEdit(index: number, row: Path) {
      //显示修改对话框
      dialogVisible.value = true;
      updatePath.id = row.id;
      updatePath.path = row.path;
      updatePath.description = row.description;
      // console.log(updateRole)
    }

    async function updateRoleFunction(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (updatePath.path.indexOf("/") === -1) {
            ElMessage.warning({
              message: "权限路径格式不正确!!!",
              duration: 2000,
              center: true,
            });
            return;
          }

          updatePathInfo(updatePath).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                dialogVisible.value = false;
                reload();
                ElMessage.success({
                  message: "修改权限信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "修改权限信息失败!!!",
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

    function handleDelete(index: number, row: Path) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除权限"${row.path}"吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deletePath(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              reload();
              ElMessage.success({
                message: "删除权限信息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除权限信息失败!!!",
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
      const choosenRows: Array<Path> = tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除的角色!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中的角色吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deletePathList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "删除权限信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "删除权限信息失败!!!",
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
      getAllPathListByPath(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((c: Path) => {
            return c.path.indexOf(queryString) !== -1;
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
      getPathListByPath(search.value, 1, 7).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: Path[] = res.data.data;
          data.forEach((d) => {
            tableData.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );

      getPathCountByPath(search.value).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 7);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    watch(currentPage, (newValue, oldValue) => {
      tableData.splice(0, tableData.length);
      if (search.value !== "") {
        getPathListByPath(search.value, currentPage.value, 7).then(
          (res) => {
            // console.log(res);
            tableData.splice(0, tableData.length);
            const data: Path[] = res.data.data;
            data.forEach((d) => {
              tableData.push(d);
            });
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        getPathList(currentPage.value, 7).then(
          (res) => {
            // console.log(res);
            const data: Path[] = res.data.data;
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
      updatePath,
      ...toRefs(updatePath),
      ruleFormRef,
      rules,
      currentPage,
      totalPage,
      handleEdit,
      updateRoleFunction,
      handleDelete,
      deleteChoosen,
      querySearch,
      handleSelect,
    };
  },
  mounted() {
    getPathList(this.currentPage, 7).then(
      (res) => {
        // console.log(res);
        const data: Path[] = res.data.data;
        data.forEach((d) => {
          this.tableData.push(d);
        });
      },
      (err) => {
        console.log(err);
      }
    );
    getAllPathCount().then(
      (res) => {
        // console.log(res);
        this.totalPage = Math.ceil(res.data.data / 7);
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
  .el-button {
    width: 48px;
    height: 27px;
  }
}
</style>
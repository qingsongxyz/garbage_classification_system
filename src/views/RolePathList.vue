<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">角色权限列表</h1>
    </el-col>
  </el-row>
  <el-row class="bar">
    <el-col :span="24">
      <el-button
        class="deleteAll"
        style="width: 85px; height: 29px"
        type="danger"
        @click="deleteChoosen"
      >
        <el-icon> <DeleteFilled /> </el-icon
        ><span style="font-size: 12px">全部删除</span>
      </el-button>
      <el-button
        type="primary"
        style="width: 70px; height: 29px"
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>
        <span style="font-size: 12px">添加</span>
      </el-button>
      <el-button @click="reload()" style="width: 30px; height: 29px">
        <el-icon><RefreshRight /></el-icon>
      </el-button>
      <el-select
        class="search"
        clearable
        v-model="searchRole"
        placeholder="请选择角色查询"
        @change="search"
      >
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.role"
          :value="item.role"
        >
          <span>{{ item.role }}</span>
        </el-option>
      </el-select>

      <el-autocomplete
        v-model="searchPath"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="path"
        select-when-unmatched
        clearable
        placeholder="请输入权限路径查询"
        @select="handleSelect"
      />
    </el-col>
  </el-row>
  <el-table
    class="table"
    ref="tableRef"
    :data="tableData"
    :span-method="arraySpanMethod"
    border
  >
    <el-table-column type="selection" width="40" />
    <el-table-column prop="role" label="角色" align="center" width="100">
      <template #default="scope">
        <el-tag
          v-if="scope.row.role"
          type="success"
          effect="light"
          size="large"
        >
          {{ scope.row.role }}
        </el-tag>
        <span v-else>无</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="pathId"
      label="权限编号"
      width="150"
      align="center"
    />
    <el-table-column prop="path" label="权限路径" width="220" align="center" />
    <el-table-column prop="description" label="权限介绍" align="center" />
    <el-table-column label="操作" width="80" align="center">
      <template #default="scope">
        <el-button
          type="danger"
          size="small"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" width="50%" center align-center>
    <el-row justify="center">
      <el-col :span="9">
        <h1 class="title">添加角色权限信息</h1>
      </el-col>
    </el-row>
    <el-form
      class="form"
      ref="ruleFormRef"
      :model="addRolePath"
      :rules="rules"
      label-width="120px"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="权限编号" prop="path">
            <el-select
              class="path"
              clearable
              v-model="path"
              placeholder="请选择权限信息"
              @change="changePath"
              style="width: 300px"
            >
              <el-option
                v-for="item in pathList"
                :key="item.id"
                :label="item.path"
                :value="item.path"
              >
                <span style="float: left">{{ item.path }}</span>
                <span style="float: right; color: tomato; font-size: 10px">{{
                  item.description
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="角色" prop="role">
            <el-select
              class="role"
              clearable
              v-model="role"
              placeholder="请选择角色"
              @change="changeRole"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.role"
                :value="item.role"
              >
                <span>{{ item.role }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row justify="center">
        <el-col :span="8">
          <el-button type="primary" @click="addRolePathFunction(ruleFormRef)"
            >添加</el-button
          >
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { RolePath, RolePathForm, SpanMethodProps } from "@/type/rolePathList";
import Role from "@/type/roleList";
import {
  ElMessage,
  ElMessageBox,
  ElSelect,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import { defineComponent, inject, reactive, ref, toRefs, watch } from "vue";
import {
  addRolePathInfo,
  deleteRolePathById,
  deleteRolePathList,
  getAllRolePathByPath,
  getAllRolePathByRoleAndPath,
  getRolePathList,
} from "@/request/rolePathListApi";
import Path from "@/type/pathList";
import { getRoleList } from "@/request/roleListApi";
import { getAllPathList } from "@/request/pathListApi";
export default defineComponent({
  name: "rolePathList",
  setup(props) {
    const reload: any = inject("reload");
    const searchRole = ref("");
    const searchPath = ref("");
    const pathList: Path[] = reactive([]);
    const roleList: Role[] = reactive([]);
    const tableData: RolePath[] = reactive([]);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tempIndex: number[] = reactive([]);
    const roleData: Role[] = reactive([]);
    const dialogVisible = ref(false);
    const addRolePath: RolePathForm = reactive({
      role: "",
      path: "",
    });

    const selectRole = ref("");
    const selectVisible = ref(false);
    const selectRef = ref<InstanceType<typeof ElSelect>>();

    const ruleFormRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
      path: [
        {
          required: true,
          message: "请选择权限信息",
          trigger: "blur",
        },
      ],
      role: [
        {
          required: true,
          message: "请选择角色",
          trigger: "blur",
        },
      ],
    });

    const arraySpanMethod = ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: SpanMethodProps) => {
      if (columnIndex === 1) {
        // if (tableData.length === 1) {
        //   return {
        //     rowspan: 1,
        //     colspan: 1,
        //   };
        // } else {
        return {
          rowspan: tempIndex[rowIndex],
          colspan: 1,
        };
        // }
      }
    };

    function handleAdd() {
      addRolePath.path = "";
      addRolePath.role = "";
      resetForm(ruleFormRef.value);
      dialogVisible.value = true;
    }

    const handleDelete = (index: number, row: RolePath) => {
      // console.log(index, row);
      ElMessageBox.confirm(
        `你确定要删除角色${row.role}——${row.description}的权限吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }
      ).then(() => {
        deleteRolePathById(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              reload();
              ElMessage.success({
                message: "删除角色权限信息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除角色权限信息失败!!!",
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
    };

    watch(
      roleData,
      (newValue) => {
        let arr: RolePath[] = [];
        let tempMergeIndex: number[] = [];
        let pos = 0;
        newValue.forEach((d) => {
          if (d && d.pathList) {
            let sourceArr: RolePath[] = d.pathList.map((p) => {
              return {
                id: d.rolePathId || 1,
                roleId: d.id,
                role: d.role,
                name: d.name,
                pathId: p.id,
                path: p.path,
                description: p.description,
              };
            });
            arr.push(...sourceArr);
          } else {
            arr.push(d);
          }
        });

        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            tempMergeIndex.push(1);
            pos = 0;
          } else {
            if (arr[i].pathId && arr[i].role === arr[i - 1].role) {
              tempMergeIndex[pos] += 1;
              tempMergeIndex.push(0);
            } else {
              tempMergeIndex.push(1);
              pos = i;
            }
          }
        }

        //先修改tempMergeIndex 后修改tableData 避免加载问题
        tempIndex.splice(0, tableData.length);
        tempMergeIndex.forEach((i) => {
          tempIndex.push(i);
        });
        
        tableData.splice(0, tableData.length);
        arr.forEach((a) => {
          tableData.push(a);
        });
      },
      { deep: true, immediate: true }
    );

    function deleteChoosen() {
      const choosenRows: Array<RolePath> = tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除角色对应的权限信息!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中角色对应的权限吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteRolePathList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "删除角色权限信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "删除角色权限信息失败!!!",
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
      if (!queryString) {
        return;
      }

      getAllRolePathByPath(queryString).then(
        (res) => {
          const pathList: Path[] = [];
          res.data.data.forEach((d: any) => {
            d.rolePathVOList.forEach((r: any) => {
              pathList.push(r.pathVO);
            });
          });
          const results = pathList.filter((p: Path) => {
            return p.path.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    const handleSelect = (item: Path) => {
      search();
    };

    function search() {
      let role = "";
      let path = "";
      if (searchRole.value !== "") {
        role = searchRole.value;
      }
      if (searchPath.value !== "") {
        path = searchPath.value;
      }

      getAllRolePathByRoleAndPath(role, path).then(
        (res) => {
          // console.log(res);
          roleData.splice(0, roleData.length);
          const data: any[] = res.data.data;
          data.forEach((d) => {
            d.rolePathVOList.forEach((r: any) => {
              const list: Path[] = [];
              list.push(r.pathVO);
              roleData.push({
                id: d.id,
                rolePathId: r.id,
                role: d.role,
                name: d.name,
                pathList: list,
              });
            });
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }

    async function addRolePathFunction(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          // console.log(addRolePath);
          addRolePathInfo(addRolePath).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: res.data.message,
                  duration: 2000,
                  center: true,
                });
                dialogVisible.value = false;
              } else {
                ElMessage.error({
                  message: "添加角色权限信息失败!!!",
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

    function resetForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      formEl.resetFields();
    }

    function changePath(val: string) {
      pathList.forEach((p) => {
        if (p.path === val) {
          addRolePath.pathId = p.id;
        }
      });
    }

    function changeRole(val: string) {
      roleList.forEach((r) => {
        if (r.role === val) {
          addRolePath.roleId = r.id;
        }
      });
    }

    return {
      reload,
      searchRole,
      searchPath,
      pathList,
      roleList,
      tableData,
      tableRef,
      roleData,
      dialogVisible,
      addRolePath,
      ...toRefs(addRolePath),
      selectRole,
      selectVisible,
      selectRef,
      ruleFormRef,
      rules,
      arraySpanMethod,
      handleDelete,
      handleAdd,
      deleteChoosen,
      querySearch,
      handleSelect,
      search,
      addRolePathFunction,
      changePath,
      changeRole,
    };
  },
  mounted() {
    getRolePathList().then(
      (res) => {
        // console.log(res);
        const data: any[] = res.data.data;
        data.forEach((d) => {
          d.rolePathVOList.forEach((r: any) => {
            const list: Path[] = [];
            list.push(r.pathVO);
            this.roleData.push({
              id: d.id,
              rolePathId: r.id,
              role: d.role,
              name: d.name,
              pathList: list,
            });
          });
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getRoleList().then(
      (res) => {
        // console.log(res);
        const data: Role[] = res.data.data;
        data.forEach((d) => {
          this.roleList.push(d);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getAllPathList().then(
      (res) => {
        // console.log(res);
        const data: Path[] = res.data.data;
        data.forEach((d) => {
          this.pathList.push(d);
        });
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

.bar {
  margin-bottom: 20px;
  .search {
    margin-left: 30%;
    margin-right: 2%;
  }
}

.table {
  width: 100%;
}

.el-dialog {
  .title {
    margin-bottom: 50px;
  }
}

.form {
  .el-form-item {
    margin-bottom: 30px;
  }
}
</style>
<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">角色列表</h1>
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
    <el-table-column prop="id" label="角色编号" align="center" />
    <el-table-column prop="role" label="角色英文名" align="center" />
    <el-table-column prop="name" label="角色中文名" align="center" />
    <el-table-column label="操作" align="center">
      <template #header>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          value-key="role"
          select-when-unmatched
          :debounce="0"
          clearable
          placeholder="请输入角色英文名称查询"
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

  <el-dialog v-model="dialogVisible" width="55%" center align-center>
    <el-row justify="center">
      <el-col :span="6">
        <h1 class="title">修改角色信息</h1>
      </el-col>
    </el-row>
    <el-form
      ref="ruleFormRef"
      :model="updateRole"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="角色英文名" prop="role">
            <el-input v-model="role" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="角色中文名" prop="name">
            <el-input v-model="name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="updateRoleFunction(ruleFormRef)"
            >确定</el-button
          >
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import { defineComponent, inject, reactive, ref, toRefs } from "vue";
import Role from "@/type/roleList";
import {
  deleteRole,
  deleteRoleList,
  getRoleList,
  getRoleListByRole,
  updateRoleInfo,
} from "@/request/roleListApi";
import { keysOf } from "element-plus/es/utils";
export default defineComponent({
  name: "roleList",
  setup(props) {
    const reload: any = inject("reload");
    const search = ref("");
    let dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Role> = reactive([]);

    let updateRole: Role = reactive({
      id: 1,
      rolePathId: 1,
      role: "",
      name: "",
    });

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      role: [
        {
          required: true,
          message: "请输入角色英文名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "角色英文名长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      name: [
        {
          required: true,
          message: "请输入角色中文名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "角色中文名长度必须在1~50之间",
          trigger: "blur",
        },
      ],
    });

    function handleEdit(index: number, row: Role) {
      //显示修改对话框
      dialogVisible.value = true;
      updateRole.id = row.id;
      updateRole.role = row.role;
      updateRole.name = row.name;
      // console.log(updateRole)
    }

    async function updateRoleFunction(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          updateRoleInfo(updateRole).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "修改角色信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "修改角色信息失败!!!",
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

    function handleDelete(index: number, row: Role) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除角色${row.name}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteRole(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              reload();
              ElMessage.success({
                message: "删除角色信息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "存在该角色的用户, 删除角色信息失败!!!",
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
      const choosenRows: Array<Role> = tableRef.value?.getSelectionRows();
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

          deleteRoleList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "删除角色信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "存在该角色的用户, 删除角色信息失败!!!",
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
      const results = queryString
        ? tableData.filter((c: Role) => {
            return c.role.indexOf(queryString) !== -1;
          })
        : tableData;
      cb(results);
    };

    const handleSelect = (item: any) => {
      let p;
      if ("value" in item) {
        if (item.value === "") {
          reload();
          return;
        }

        p = item.value;
      } else {
        p = item.role;
      }
      getRoleListByRole(p).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: Role[] = res.data.data;
          data.forEach((d) => {
            tableData.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    };

    return {
      search,
      dialogVisible,
      tableRef,
      tableData,
      updateRole,
      ...toRefs(updateRole),
      ruleFormRef,
      rules,
      handleEdit,
      updateRoleFunction,
      handleDelete,
      deleteChoosen,
      querySearch,
      handleSelect,
    };
  },
  mounted() {
    getRoleList().then(
      (res) => {
        // console.log(res);
        const data: Role[] = res.data.data;
        data.forEach((d) => {
          this.tableData.push(d);
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

.form {
  .el-row {
    margin-bottom: 10px;
  }
  .el-input {
    width: 350px;
  }
}
</style>
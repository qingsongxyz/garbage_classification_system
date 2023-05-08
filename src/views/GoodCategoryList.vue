<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">商品种类列表</h1>
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
    <el-table-column prop="id" label="商品编号" align="center" />
    <el-table-column prop="category" label="商品种类名称" align="center" />
    <el-table-column label="操作" align="center">
      <template #header>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          value-key="category"
          select-when-unmatched
          :debounce="0"
          clearable
          placeholder="请输入商品种类名称查询"
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

  <el-dialog v-model="dialogVisible" width="55%" center align-center>
    <el-row justify="center">
      <el-col :span="8">
        <h1 class="title">修改商品种类信息</h1>
      </el-col>
    </el-row>
    <el-form
      ref="ruleFormRef"
      :model="updateGoodCategory"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="商品种类名称" prop="category">
            <el-input v-model="category" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="8">
          <span class="dialog-footer">
            <el-button type="primary" @click="updateFunction(ruleFormRef)"
              >确定</el-button
            >
            <el-button @click="dialogVisible = false"> 取消 </el-button>
          </span>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import {
  deleteGoodCategory,
  deleteGoodCategoryList,
  getAllGoodCategoryCount,
  getAllGoodCategoryListByCategory,
  getGoodCategoryCountByCategory,
  getGoodCategoryList,
  getGoodCategoryListByCategory,
  updateGoodCategoryFunction,
} from "@/request/goodCategoryListApi";
import GoodCategory from "@/type/goodCategoryList";
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import { defineComponent, inject, reactive, ref, toRefs, watch } from "vue";
export default defineComponent({
  name: "goodCategoryList",
  setup(props) {
    const reload: any = inject("reload");
    const search = ref("");
    let dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<GoodCategory> = reactive([]);
    const currentPage = ref(1);
    const totalPage = ref(1);

    let updateGoodCategory: GoodCategory = reactive({
      id: 1,
      category: "",
    });

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      category: [
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

    function handleEdit(index: number, row: GoodCategory) {
      //显示修改对话框
      dialogVisible.value = true;
      updateGoodCategory.id = row.id;
      updateGoodCategory.category = row.category;
      // console.log(updateRole)
    }

    async function updateFunction(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          updateGoodCategoryFunction(updateGoodCategory).then(
            (res) => {
              // console.log(res);
              if (res.data.code) {
                reload();
                ElMessage.success({
                  message: "修改商品分类成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "修改商品分类失败!!!",
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

    function handleDelete(index: number, row: GoodCategory) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除商品种类${row.category}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteGoodCategory(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              reload();
              ElMessage.success({
                message: "删除商品分类成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除商品分类失败!!!",
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
      const choosenRows: Array<GoodCategory> =
        tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除的商品种类!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中的商品种类吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteGoodCategoryList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "删除商品分类成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "删除商品分类失败!!!",
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
      getAllGoodCategoryListByCategory(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((c: GoodCategory) => {
            return c.category.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
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
        p = item.category;
      }
      getGoodCategoryListByCategory(p, 1, 7).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: GoodCategory[] = res.data.data;
          data.forEach((d) => {
            tableData.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );

      getGoodCategoryCountByCategory(search.value).then(
        (res) => {
          totalPage.value = Math.ceil(res.data.data / 7);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    watch(currentPage, (newValue, oldValue) => {
      tableData.splice(0, tableData.length);
      if (search.value !== "") {
        getGoodCategoryListByCategory(search.value, currentPage.value, 7).then(
          (res) => {
            // console.log(res);
            tableData.splice(0, tableData.length);
            const data: GoodCategory[] = res.data.data;
            data.forEach((d) => {
              tableData.push(d);
            });
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        getGoodCategoryList(currentPage.value, 7).then(
          (res) => {
            // console.log(res);
            const data: GoodCategory[] = res.data.data;
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
      updateGoodCategory,
      ...toRefs(updateGoodCategory),
      ruleFormRef,
      rules,
      currentPage,
      totalPage,
      handleEdit,
      updateFunction,
      handleDelete,
      deleteChoosen,
      querySearch,
      handleSelect,
    };
  },
  mounted() {
    getGoodCategoryList(1, 7).then(
      (res) => {
        // console.log(res.data.data);
        const data: GoodCategory[] = res.data.data;
        data.forEach((d) => {
          this.tableData.push(d);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getAllGoodCategoryCount().then(
      (res) => {
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

.form {
  .el-input {
    width: 300px;
  }
}
</style>
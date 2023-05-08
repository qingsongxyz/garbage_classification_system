<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">垃圾分类列表</h1>
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
    <el-table-column prop="id" label="分类编号" width="150" align="center" />
    <el-table-column prop="name" label="分类名称" width="150" align="center" />
    <el-table-column prop="image" label="分类图片" align="center">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-image
            class="image"
            style="width: 75px; height: 75px"
            :src="scope.row.image[0]"
            :preview-src-list="scope.row.image"
            fit="cover"
            preview-teleported
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #header>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          value-key="name"
          select-when-unmatched
          clearable
          placeholder="请输入分类名称查询"
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
    <template #header>
      <h1 class="title">修改垃圾分类信息</h1>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="updateCategory"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="分类名称" prop="name">
            <el-input class="name" v-model="name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item required label="分类图像">
            <Upload
              :image="image"
              type="category"
              @setImage="setImage"
              ref="uploadRef"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="分类描述" prop="description">
            <el-input
              class="description"
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="description"
              :show-word-limit="true"
              resize="none"
              maxlength="1000"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updateGarbageCategry(ruleFormRef)"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang='ts'>
import {
  deleteGarbageCategory,
  deleteGarbageCategoryList,
  getAllGarbageCategoryListByName,
  getGarbageCategoryCount,
  getGarbageCategoryList,
  getGarbageCategoryListByName,
  updateGarbageCategory,
} from "@/request/garbageCategoryListApi";
import { GarbageCategory } from "@/type/home";
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
} from "element-plus";
import { defineComponent, reactive, ref, toRefs, inject, watch } from "vue";
import Upload from "../components/UploadImage.vue";
export default defineComponent({
  name: "garbageCategoryList",
  components: { Upload },
  setup() {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const search = ref("");
    let dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<GarbageCategory> = reactive([]);

    let updateCategory: GarbageCategory = reactive({
      id: 1,
      name: "",
      description: "",
      image: "",
    });

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      name: [
        {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "垃圾分类称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "请输入分类简介",
          trigger: "blur",
        },
      ],
    });

    const uploadRef = ref();

    function handleEdit(index: number, row: GarbageCategory) {
      //显示修改对话框
      dialogVisible.value = true;
      updateCategory.id = row.id;
      updateCategory.name = row.name;
      updateCategory.description = row.description;
      updateCategory.image = row.image[0];

      uploadRef.value?.showImage(row.image[0]);
      // console.log(updateCategory)
    }

    async function updateGarbageCategry(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //上传图片
          uploadRef.value?.submit();

          updateGarbageCategory(updateCategory).then(
            (res) => {
              if (res.data.code === 200) {
                dialogVisible.value = false;
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
              console.log(err.message);
            }
          );
        } else {
          console.log("error submit!", fields);
        }
      });
    }

    function handleDelete(index: number, row: GarbageCategory) {
      console.log(index, row);
      ElMessageBox.confirm(`你确定要删除分类${row.name}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteGarbageCategory(row.id).then(
          (res) => {
            reload();
            if (res.data.code === 200) {
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
            console.log(err.message);
          }
        );
      });
    }

    function deleteChoosen() {
      const choosenRows: Array<GarbageCategory> =
        tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除的分类数据!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中的垃圾分类信息吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteGarbageCategoryList(ids).then(
            (res) => {
              reload();
              if (res.data.code === 200) {
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
              console.log(err.message);
            }
          );
        });
      }
    }

    const querySearch = (queryString: string, cb: any) => {
      getAllGarbageCategoryListByName(queryString).then(
        (res) => {
          const results = queryString
            ? res.data.data.filter((c: any) => {
                return c.name.indexOf(queryString) !== -1;
              })
            : tableData;
          cb(results);
        },
        (err) => {
          console.log(err.message);
        }
      );
    };

    const handleSelect = (item: GarbageCategory) => {
      if (!item.name) {
        reload();
        return;
      }
      getGarbageCategoryListByName(item.name, 1, 5).then(
        (res) => {
          tableData.splice(0, tableData.length);
          const garbageCategoryList: GarbageCategory[] = res.data.data;
          garbageCategoryList.forEach((c) => {
            tableData.push(c);
          });
          tableData.forEach((c) => {
            if (typeof c.image === "string") {
              c.image = new Array(c.image);
            }
          });
        },
        (err) => {
          console.log(err.message);
        }
      );

      getGarbageCategoryCount(item.name).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 5);
        },
        (err) => {
          console.log(err.message);
        }
      );
    };

    function setImage(image: string) {
      updateCategory.image = image;
    }

    watch(currentPage, (newValue, oldValue) => {
      if (search.value != "") {
        getGarbageCategoryListByName(search.value, currentPage.value, 5).then(
          (res) => {
            tableData.splice(0, tableData.length);
            const garbageCategoryList: GarbageCategory[] = res.data.data;
            garbageCategoryList.forEach((c) => {
              tableData.push(c);
            });
            tableData.forEach((c) => {
              if (typeof c.image === "string") {
                c.image = new Array(c.image);
              }
            });
          },
          (err) => {
            console.log(err.message);
          }
        );
      } else {
        getGarbageCategoryList(currentPage.value, 5).then(
          (res) => {
            // console.log(res);
            tableData.splice(0, tableData.length);
            const garbageCategoryList: GarbageCategory[] = res.data.data;
            garbageCategoryList.forEach((c) => {
              tableData.push(c);
            });
            tableData.forEach((c) => {
              if (typeof c.image === "string") {
                c.image = new Array(c.image);
              }
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
      search,
      dialogVisible,
      tableRef,
      tableData,
      updateCategory,
      ...toRefs(updateCategory),
      ruleFormRef,
      rules,
      uploadRef,
      handleEdit,
      updateGarbageCategry,
      handleDelete,
      deleteChoosen,
      querySearch,
      handleSelect,
      setImage,
    };
  },
  mounted() {
    getGarbageCategoryList(this.currentPage, 5).then(
      (res) => {
        // console.log(res);
        const garbageCategoryList: GarbageCategory[] = res.data.data;
        garbageCategoryList.forEach((c) => {
          this.tableData.push(c);
        });
        this.tableData.forEach((c) => {
          if (typeof c.image === "string") {
            c.image = new Array(c.image);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getGarbageCategoryCount("").then(
      (res) => {
        // console.log(res);
        this.totalPage = Math.ceil(res.data.data / 5);
      },
      (err) => {
        console.log(err.message);
      }
    );
  },
});
</script>
<style lang='less' scoped>
.title {
  font-size: 21px;
  color: #409eff;
}

.deleteAll {
  margin-bottom: 10px;
}

.table {
  .image {
    margin-left: 39%;
  }

  .el-button {
    width: 48px;
    height: 27px;
  }
}

.el-pagination {
  margin-top: 30px;
}
</style>
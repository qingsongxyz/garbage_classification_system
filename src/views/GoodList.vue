<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">商品列表</h1>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="23">
      <el-button
        class="deleteAll"
        style="width: 85px; height: 29px"
        type="danger"
        @click="deleteChoosen"
      >
        <el-icon> <DeleteFilled /> </el-icon
        ><span style="font-size: 12px">全部删除</span>
      </el-button>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="请先下载模版再导入数据!"
        placement="top"
      >
        <el-upload
          ref="importRef"
          class="importExcel"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :action="baseUrl + '/gcs-mall/excel/good/upload'"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
          :headers="headers"
        >
          <el-button style="width: 85px; height: 29px" type="success">
            <el-icon> <Upload /> </el-icon
            ><span style="font-size: 12px">导入</span>
          </el-button>
        </el-upload>
      </el-tooltip>
      <el-button
        @click="downloadExcel(false)"
        style="width: 85px; height: 29px"
        type="success"
      >
        <el-icon> <Download /> </el-icon
        ><span style="font-size: 12px">导出</span>
      </el-button>
      <el-button
        @click="downloadExcel(true)"
        style="width: 85px; height: 29px"
        type="primary"
      >
        <el-icon> <Document /> </el-icon
        ><span style="font-size: 12px">模版</span>
      </el-button>

      <el-select
        class="search"
        clearable
        v-model="searchCategory"
        placeholder="请选择商品种类查询"
        @change="search"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.category"
          :value="item.category"
        >
          <span>{{ item.category }}</span>
        </el-option>
      </el-select>

      <el-autocomplete
        v-model="searchName"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="name"
        select-when-unmatched
        clearable
        placeholder="请输入商品名称查询"
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
    <el-table-column prop="id" label="商品编号" width="150" align="center" />
    <el-table-column prop="name" label="商品名称" width="120" align="center" />
    <el-table-column prop="image" label="商品图片" align="center">
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
    <el-table-column
      prop="goodCategoryVO.category"
      label="商品种类"
      width="120"
      align="center"
    />
    <el-table-column
      prop="score"
      label="商品所需积分"
      width="110"
      align="center"
    />
    <el-table-column
      prop="storage.storage"
      label="商品库存"
      width="80"
      align="center"
    />
    <el-table-column label="操作" width="170" align="center">
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
      <h1 class="title">修改商品信息</h1>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="updateGood"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="商品名称" prop="name">
            <el-input class="name" v-model="name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="商品分类" prop="categoryId">
            <el-select v-model="categoryId" placeholder="请选择商品种类">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.category"
                :value="item.id"
              >
                <span>{{ item.category }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="商品所需积分" prop="score">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="score"
              :min="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item required label="商品图像">
            <UploadImage
              :image="image"
              type="good"
              @setImage="setImage"
              ref="uploadRef"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="商品库存" prop="storage.storage">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="storage.storage"
              :min="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updateGoodCategry(ruleFormRef)"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  deleteGood,
  deleteGoodList,
  download,
  getAllGoodCount,
  getAllGoodListByName,
  getCountByNameOrCategory,
  getGoodList,
  getGoodListByNameOrCategory,
  updateGoodFunction,
} from "@/request/goodListApi";
import { getAllGoodCategoryList } from "@/request/goodCategoryListApi";
import GoodCategory from "@/type/goodCategoryList";
import { Good } from "@/type/goodList";
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  FormInstance,
  FormRules,
  genFileId,
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { defineComponent, inject, reactive, ref, toRefs, watch } from "vue";
import http from "@/request/index";
import { updateUser } from "@/request/personalApi";
export default defineComponent({
  name: "goodList",
  setup(props) {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const searchCategory = ref("");
    const searchName = ref("");
    const dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Good> = reactive([]);

    let updateGood: Good = reactive({
      id: 0,
      name: "",
      categoryId: 0,
      image: "",
      score: 0,
      storage: {
        storage: 0,
      },
    });

    const categoryList: GoodCategory[] = reactive([]);

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      name: [
        {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "商品名称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      categoryId: [
        {
          required: true,
          message: "请选择商品所属分类",
          trigger: "change",
        },
      ],
      score: [
        {
          required: true,
          message: "请输入商品所需积分",
          trigger: "blur",
        },
      ],
      storage: [
        {
          required: true,
          message: "请输入商品库存",
          trigger: "blur",
        },
      ],
    });

    const uploadRef = ref();

    const importRef = ref();
    const headers = ref();
    const baseUrl = ref(http.defaults.baseURL);

    function handleEdit(index: number, row: Good) {
      //显示修改对话框
      dialogVisible.value = true;
      updateGood.id = row.id;
      updateGood.name = row.name;
      updateGood.categoryId = row.categoryId;
      updateGood.storage.storage = row.storage.storage;
      updateGood.score = row.score;
      updateGood.image = row.image[0];

      uploadRef.value?.showImage(row.image[0]);
      // console.log(updateCategory)
    }

    async function updateGoodCategry(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //上传图片
          uploadRef.value?.submit();

          const o: Good = {
            id: updateGood.id,
            name: updateGood.name,
            categoryId: updateGood.categoryId,
            storage: updateGood.storage,
            score: updateGood.score,
            image: "",
          };

          if (typeof updateGood.image === "string") {
            o.image = updateGood.image;
          }

          updateGoodFunction(o).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                dialogVisible.value = false;
                reload();
                ElMessage.success({
                  message: "修改商品信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "修改商品信息失败!!!",
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
      });
    }

    function handleDelete(index: number, row: Good) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除商品${row.name}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteGood(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              reload();
              ElMessage.success({
                message: "删除商品信息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除商品信息失败!!!",
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
      const choosenRows: Array<Good> = tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除的商品信息!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中的商品吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteGoodList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "删除商品信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "删除商品信息失败!!!",
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
      getAllGoodListByName(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((c: Good) => {
            return c.name.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    const handleSelect = (item: Good) => {
      search();
    };

    function search() {
      getGoodListByNameOrCategory(
        searchName.value,
        searchCategory.value,
        1,
        5
      ).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: Good[] = res.data.data;
          // console.log(data);
          data.forEach((d) => {
            tableData.push(d);
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

      getCountByNameOrCategory(searchName.value, searchCategory.value).then(
        (res) => {
          totalPage.value = Math.ceil(res.data.data / 5);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function setImage(image: string) {
      updateGood.image = image;
    }

    function inputLimit(e: any) {
      if (
        e.key === "e" ||
        e.key === "+" ||
        e.key === "-" ||
        e.key === "Shift"
      ) {
        e.returnValue = false;
        return false;
      }
      return true;
    }

    watch(currentPage, (newValue, oldValue) => {
      tableData.splice(0, tableData.length);
      if (searchName.value != "" || searchCategory.value != "") {
        getGoodListByNameOrCategory(
          searchName.value,
          searchCategory.value,
          currentPage.value,
          5
        ).then(
          (res) => {
            // console.log(res);
            const data: Good[] = res.data.data;
            data.forEach((d) => {
              tableData.push(d);
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
      } else {
        getGoodList(currentPage.value, 5).then(
          (res) => {
            // console.log(res);
            const garbageCategoryList: Good[] = res.data.data;
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

    function downloadExcel(isTemplate: boolean) {
      download(isTemplate).then(
        (res) => {
          // console.log(res);
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          //创建标签
          const link = document.createElement("a");
          link.style.display = "none";
          //设置标签href属性为文件路径
          link.href = URL.createObjectURL(blob);
          //设置下载文件名
          if (isTemplate) {
            link.download = "商品信息表模版";
          } else {
            link.download = "商品信息表";
          }
          document.body.appendChild(link);
          //点击触发下载
          link.click();
          //移除标签
          document.body.removeChild(link);
          // 释放掉blob对象
          window.URL.revokeObjectURL(link.href);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function handleSuccess(
      response: any,
      uploadFile: UploadFile,
      uploadFiles: UploadFiles
    ) {
      reload();
      ElMessage.success({
        message: response.message,
        duration: 2000,
        center: true,
      });
    }

    function handleError(
      error: Error,
      uploadFile: UploadFile,
      uploadFiles: UploadFiles
    ) {
      ElMessage.error({
        message: "导入excel失败!!!",
        duration: 2000,
        center: true,
      });
    }

    const handleExceed: UploadProps["onExceed"] = (files) => {
      importRef.value!.clearFiles();
      const file = files[0] as UploadRawFile;
      file.uid = genFileId();
      importRef.value!.handleStart(file);
    };

    return {
      currentPage,
      totalPage,
      searchCategory,
      searchName,
      dialogVisible,
      tableRef,
      tableData,
      updateGood,
      ...toRefs(updateGood),
      categoryList,
      ruleFormRef,
      rules,
      uploadRef,
      importRef,
      headers,
      baseUrl,
      handleEdit,
      updateGoodCategry,
      handleDelete,
      deleteChoosen,
      querySearch,
      handleSelect,
      setImage,
      inputLimit,
      search,
      downloadExcel,
      handleExceed,
      handleSuccess,
      handleError,
    };
  },
  mounted() {
    const user = localStorage.getItem("user");
    if (user) {
      const obj = JSON.parse(user);
      if (obj.access_token) {
        const token = "Bearer " + obj.access_token;
        this.headers = {
          Authorization: token,
        };
      }
    }

    getGoodList(1, 5).then(
      (res) => {
        // console.log(res.data.data);
        const data: Good[] = res.data.data;
        // console.log(data);
        data.forEach((d) => {
          this.tableData.push(d);
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

    getAllGoodCategoryList().then(
      (res) => {
        // console.log(this.categoryList);
        const data: GoodCategory[] = res.data.data;
        data.forEach((d) => {
          this.categoryList.push(d);
        });
      },
      (err) => {
        console.log(err.message);
      }
    );

    getAllGoodCount().then(
      (res) => {
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

.importExcel {
  display: inline-block;
  margin: auto 10px;
  vertical-align: middle;
}

.search {
  width: 180px;
  margin-left: 100px;
  margin-right: 20px;
}

.table {
  margin-top: 10px;

  .image {
    margin-left: 28%;
  }

  .el-button {
    width: 48px;
    height: 27px;
  }
}

.pagination{
  margin-top: 20px;
}
</style>
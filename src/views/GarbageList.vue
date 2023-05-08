<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">垃圾列表</h1>
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
          :action="baseUrl + '/gcs-garbage/excel/garbage/upload'"
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
        placeholder="请选择分类查询"
        @change="search"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        >
          <span>{{ item.name }}</span>
        </el-option>
      </el-select>

      <el-autocomplete
        v-model="searchName"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="name"
        select-when-unmatched
        clearable
        placeholder="请输入垃圾名称查询"
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
    <el-table-column prop="id" label="垃圾编号" width="150" align="center" />
    <el-table-column prop="name" label="垃圾名称" width="120" align="center" />
    <el-table-column
      prop="category"
      label="垃圾分类"
      width="120"
      align="center"
    >
      <template #default="scope">
        <el-tag
          v-if="scope.row.category === '可回收垃圾'"
          disable-transitions
          type="success"
          >{{ scope.row.category }}</el-tag
        >
        <el-tag
          v-else-if="scope.row.category === '餐余垃圾'"
          disable-transitions
          >{{ scope.row.category }}</el-tag
        >
        <el-tag
          v-else-if="scope.row.category === '其他垃圾'"
          disable-transitions
          type="info"
          >{{ scope.row.category }}</el-tag
        >
        <el-tag
          v-else-if="scope.row.category === '有害垃圾'"
          disable-transitions
          type="danger"
          >{{ scope.row.category }}</el-tag
        >
        <el-tag v-else disable-transitions type="warning">{{
          scope.row.category
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="unit" label="单位" width="100" align="center" />
    <el-table-column
      prop="score"
      label="每单位积分"
      width="100"
      align="center"
    />
    <el-table-column prop="image" label="垃圾图片" width="170" align="center">
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
      <h1 class="title">修改垃圾信息</h1>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="updateGarbage"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="垃圾名称" prop="name">
            <el-input class="name" v-model="name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="垃圾分类" prop="category">
            <el-select v-model="category" placeholder="请选择分类">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="垃圾单位" prop="unit">
            <el-input class="unit" v-model="unit" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="每单位积分" prop="score">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="score"
              :min="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item required label="垃圾图像">
            <UploadImage
              :image="image"
              type="garbage"
              @setImage="setImage"
              ref="uploadRef"
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
  deleteGarbage,
  deleteGarbageList,
  download,
  geAllGarbageListByName,
  getGarbageCount,
  getGarbageList,
  getGarbageListByNameOrCategory,
  updateGarbageInfo,
} from "@/request/garbageListApi";
import { getGarbageCategoryList } from "@/request/homeApi";
import { UpdateGarbageObject } from "@/type/garbageList";
import { Garbage, GarbageCategory } from "@/type/home";
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
import UploadImage from "../components/UploadImage.vue";
import http from "@/request/index";
export default defineComponent({
  name: "garbageList",
  components: { UploadImage },
  setup() {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const searchCategory = ref("");
    const searchName = ref("");
    const dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<Garbage> = reactive([]);

    let updateGarbage: Garbage = reactive({
      id: 1,
      name: "",
      category: "",
      unit: "",
      score: 0,
      image: "",
    });

    const categoryList: GarbageCategory[] = reactive([]);

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
          message: "垃圾名称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      categoryId: [
        {
          required: true,
          message: "请选择垃圾所属分类",
          trigger: "change",
        },
      ],
      unit: [
        {
          required: true,
          message: "请输入垃圾的单位",
          trigger: "blur",
        },
        {
          min: 1,
          max: 10,
          message: "垃圾单位长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      score: [
        {
          required: true,
          message: "请输入垃圾每单位的积分",
          trigger: "blur",
        },
      ],
    });

    const uploadRef = ref();

    const importRef = ref();
    const headers = ref();
    const baseUrl = ref(http.defaults.baseURL);

    function handleEdit(index: number, row: Garbage) {
      //显示修改对话框
      dialogVisible.value = true;
      updateGarbage.id = row.id;
      updateGarbage.name = row.name;
      updateGarbage.category = row.category;
      updateGarbage.unit = row.unit;
      updateGarbage.score = row.score;
      updateGarbage.image = row.image[0];

      uploadRef.value?.showImage(row.image[0]);
      // console.log(updateCategory)
    }

    async function updateGarbageCategry(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //上传图片
          uploadRef.value?.submit();

          const o: UpdateGarbageObject = {
            id: updateGarbage.id,
            name: updateGarbage.name,
            categoryId: 0,
            unit: updateGarbage.unit,
            score: updateGarbage.score,
            image: "",
          };

          if (typeof updateGarbage.image === "string") {
            o.image = updateGarbage.image;
          }

          categoryList.forEach((c) => {
            if (c.name === updateGarbage.category) {
              o.categoryId = c.id;
            }
          });

          updateGarbageInfo(o).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                dialogVisible.value = false;
                reload();
                ElMessage.success({
                  message: "修改垃圾信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "修改垃圾信息失败!!!",
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

    function handleDelete(index: number, row: Garbage) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除垃圾${row.name}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteGarbage(row.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              reload();
              ElMessage.success({
                message: "删除垃圾信息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除垃圾信息失败!!!",
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
      const choosenRows: Array<Garbage> = tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要删除的垃圾信息!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除选中的垃圾吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteGarbageList(ids).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                reload();
                ElMessage.success({
                  message: "删除垃圾信息成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "删除垃圾信息失败!!!",
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
      geAllGarbageListByName(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((c: any) => {
            return c.name.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    const handleSelect = (item: Garbage) => {
      search();
    };

    function search() {
      getGarbageListByNameOrCategory(
        searchName.value,
        searchCategory.value,
        1,
        5
      ).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: Garbage[] = res.data.data;
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

      getGarbageCount(searchName.value, searchCategory.value).then(
        (res) => {
          totalPage.value = Math.ceil(res.data.data / 5);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function setImage(image: string) {
      updateGarbage.image = image;
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
        getGarbageListByNameOrCategory(
          searchName.value,
          searchCategory.value,
          currentPage.value,
          5
        ).then(
          (res) => {
            // console.log(res);
            const data: Garbage[] = res.data.data;
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
        getGarbageList(currentPage.value, 5).then(
          (res) => {
            // console.log(res);
            const garbageCategoryList: Garbage[] = res.data.data;
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
            link.download = "垃圾信息表模版";
          } else {
            link.download = "垃圾信息表";
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
      updateGarbage,
      ...toRefs(updateGarbage),
      categoryList,
      ruleFormRef,
      rules,
      uploadRef,
      importRef,
      headers,
      baseUrl,
      handleEdit,
      updateGarbageCategry,
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

    getGarbageList(this.currentPage, 5).then(
      (res) => {
        // console.log(res.data.data);
        const data: Garbage[] = res.data.data;
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

    getGarbageCategoryList().then(
      (res) => {
        // console.log(this.categoryList);
        const data: GarbageCategory[] = res.data.data;
        data.forEach((d) => {
          this.categoryList.push(d);
        });
      },
      (err) => {
        console.log(err.message);
      }
    );

    getGarbageCount("", "").then(
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
<style lang='less' scoped>
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
  width: 160px;
  margin-left: 100px;
  margin-right: 20px;
}

.table {
  margin-top: 10px;

  .image {
    margin-left: 39%;
  }

  .el-button {
    width: 48px;
    height: 27px;
  }
}

.pagination {
  margin-top: 20px;
}
</style>
<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">用户列表</h1>
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
          :action="baseUrl + '/gcs-admin/excel/user/upload'"
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
        class="searchGender"
        clearable
        v-model="searchGender"
        placeholder="请选择性别查询"
        @change="search"
      >
        <el-option v-for="g in ['男', '女']" :key="g" :label="g" :value="g">
          <span>{{ g }}</span>
        </el-option>
      </el-select>

      <el-select
        class="searchRole"
        clearable
        v-model="searchRole"
        placeholder="请选择角色查询"
        @change="search"
      >
        <el-option
          v-for="r in allRoleList"
          :key="r.id"
          :label="r.role"
          :value="r.role"
        >
          <span>{{ r.role }}</span>
        </el-option>
      </el-select>

      <el-autocomplete
        v-model="searchName"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="username"
        select-when-unmatched
        clearable
        placeholder="请输入用户名查询"
        style="width: 170px; margin-right: 7px"
        @select="handleSelect"
      />
      <el-button @click="reload()" style="width: 30px; height: 29px">
        <el-icon><RefreshRight /></el-icon>
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
    <el-table-column type="selection" width="40" fixed />
    <el-table-column
      prop="id"
      label="用户编号"
      width="150"
      align="center"
      fixed
    />
    <el-table-column
      prop="username"
      label="用户名"
      width="120"
      align="center"
      fixed
    />
    <el-table-column prop="gender" label="性别" width="60" align="center" />
    <el-table-column prop="age" label="年龄" width="60" align="center" />
    <el-table-column prop="image" label="头像" width="170" align="center">
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
    <el-table-column prop="score" label="积分" width="100" align="center" />
    <el-table-column prop="roleList" label="角色" width="120" align="center">
      <template #default="scope">
        <el-tag
          v-for="r in scope.row.roleList"
          :key="r.id"
          type="success"
          effect="light"
        >
          {{ r.role }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="accountLocked"
      label="是否锁定"
      width="80"
      align="center"
    >
      <template #default="scope">
        <el-icon color="#F56C6C" v-if="scope.row.accountLocked === 1"
          ><Lock
        /></el-icon>
        <el-icon color="#67C23A" v-else><Unlock /></el-icon>
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

  <el-dialog v-model="dialogVisible" width="65%" center align-center>
    <template #header>
      <h1 class="title">修改用户信息</h1>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="updateUser"
      :rules="rules"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="用户名" prop="username">
            <el-input class="username" v-model="username" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="性别" prop="gender">
            <el-radio-group class="gender" v-model="gender">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="年龄" prop="age">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="age"
              :min="1"
              :max="120"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="角色" prop="roleList">
            <el-tag
              v-for="r in updateUser.roleList"
              :closable="hideTagClose(r.role)"
              :key="r.id"
              type="success"
              effect="light"
              @close="handleTagClose(r.id)"
            >
              {{ r.role }}
            </el-tag>

            <el-select
              v-show="selectVisible"
              ref="selectRef"
              class="search"
              clearable
              v-model="selectRole"
              placeholder="请选择角色"
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="item in allRoleList"
                :key="item.id"
                :label="item.role"
                :value="item.role"
              >
                <span>{{ item.role }}</span>
              </el-option>
            </el-select>
            <el-button
              v-show="!selectVisible"
              size="small"
              @click="selectVisible = true"
            >
              添加角色
            </el-button>
            <el-button
              v-show="selectVisible"
              type="primary"
              size="small"
              @click="addUserRole"
            >
              添加
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="邮箱" prop="email">
            <el-input class="email" v-model="email" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="手机号" prop="phone">
            <el-input class="phone" v-model="phone" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="积分" prop="score">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="score"
              :min="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="用户头像">
            <UploadImage type="user" @setImage="setImage" ref="uploadRef" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="个性签名" prop="signature">
            <el-input
              class="signature"
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="signature"
              :show-word-limit="true"
              resize="none"
              maxlength="1000"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="是否锁定" prop="accountLocked">
            <el-switch
              v-model="accountLocked"
              style="
                --el-switch-off-color: #13ce66;
                --el-switch-on-color: #ff4949;
              "
              :active-value="1"
              :inactive-value="0"
              :loading="loading"
              :before-change="beforeChange"
              @change="switchChange($event, switchInit)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updateUserFunction(ruleFormRef)"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
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
import {
  defineComponent,
  inject,
  reactive,
  ref,
  toRefs,
  watch,
  onMounted,
} from "vue";
import UploadImage from "../components/UploadImage.vue";
import User from "@/type/userList";
import Role from "@/type/roleList";
import { emailRegex, phoneRegex } from "@/util/regex";
import {
  addUserRoleInfo,
  deleteUser,
  deleteUserList,
  deleteUserRoleByUserIdAndRoleId,
  download,
  getAllUsersByName,
  getCountByRoleOrGenderOrName,
  getUserList,
  getUserListByRoleOrGenderOrName,
  updateUserInfo,
} from "@/request/userListApi";
import { getRoleList } from "@/request/roleListApi";
import http from "@/request/index";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "userList",
  components: { UploadImage },
  setup(props) {
    const reload: any = inject("reload");
    const currentPage = ref(1);
    const totalPage = ref(1);
    const searchRole = ref("");
    const searchGender = ref("");
    const searchName = ref("");
    const dialogVisible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<User> = reactive([]);

    const allRoleList: Role[] = reactive([]);

    let updateUser: User = reactive({
      id: 1,
      username: "",
      age: 1,
      gender: "",
      image: "",
      email: "",
      phone: "",
      score: 1,
      signature: "",
      accountLocked: 1,
      roleList: [],
    });

    const ruleFormRef = ref<FormInstance>();

    const rules = reactive<FormRules>({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "用户名长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      gender: [
        {
          min: 1,
          max: 1,
          message: "性别长度必须为1",
          trigger: "blur",
        },
      ],
      email: [
        { pattern: emailRegex, message: "请输入合法的邮箱", trigger: "blur" },
      ],
      phone: [
        { pattern: phoneRegex, message: "请输入合法的手机号", trigger: "blur" },
      ],
    });

    const uploadRef = ref();

    const importRef = ref();
    const headers = ref();

    const baseUrl = ref(http.defaults.baseURL);

    const switchInit = ref(false);
    const loading = ref(false);

    const selectVisible = ref(false);
    const selectRole = ref("");

    const userStore = useUserStore();
    const user = storeToRefs(userStore);

    function handleEdit(index: number, row: User) {
      // console.log(updateCategory)
      selectRole.value = "";
      selectVisible.value = false;

      updateUser.id = row.id;
      updateUser.username = row.username;
      updateUser.age = row.age;
      updateUser.gender = row.gender;
      updateUser.email = row.email;
      updateUser.phone = row.phone;
      updateUser.accountLocked = row.accountLocked;
      updateUser.score = row.score;
      updateUser.image = row.image[0];
      updateUser.signature = row.signature;

      updateUser.roleList.splice(0, updateUser.roleList.length);
      row.roleList.forEach((r) => {
        updateUser.roleList.push(r);
      });

      uploadRef.value?.showImage(row.image[0]);

      //显示修改对话框
      dialogVisible.value = true;
    }

    async function updateUserFunction(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //上传图片
          uploadRef.value?.submit();

          updateUserInfo(updateUser).then(
            (res) => {
              // console.log(res);
              reload();
              ElMessage.success({
                message: res.data.message,
                duration: 2000,
                center: true,
              });
              dialogVisible.value = false;
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });
    }

    function handleDelete(index: number, row: User) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要删除用户${row.username}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteUser(row.id).then(
          (res) => {
            reload();
            // console.log(res);
            ElMessage.success({
              message: res.data.message,
              duration: 2000,
              center: true,
            });
          },
          (err) => {
            console.log(err);
          }
        );
      });
    }

    function deleteChoosen() {
      const choosenRows: Array<User> = tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择删除的用户!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要删除用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteUserList(ids).then(
            (res) => {
              reload();
              // console.log(res);
              ElMessage.success({
                message: res.data.message,
                duration: 2000,
                center: true,
              });
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
      getUserListByRoleOrGenderOrName(
        searchRole.value,
        searchGender.value,
        searchName.value,
        1,
        5
      ).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          const data: User[] = res.data.data;
          data.forEach((d) => {
            if (d.image === null) {
              d.image =
                "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/user.png";
            }
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

      getCountByRoleOrGenderOrName(
        searchRole.value,
        searchGender.value,
        searchName.value
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

    function setImage(image: string) {
      updateUser.image = image;
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
      getUserListByRoleOrGenderOrName(
        searchRole.value,
        searchGender.value,
        searchName.value,
        currentPage.value,
        5
      ).then(
        (res) => {
          tableData.splice(0, tableData.length);
          console.log(res);
          const data: User[] = res.data.data;
          data.forEach((d) => {
            if (d.image === null) {
              d.image =
                "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/user.png";
            }
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

      getCountByRoleOrGenderOrName(
        searchRole.value,
        searchGender.value,
        searchName.value
      ).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 5);
        },
        (err) => {
          console.log(err);
        }
      );
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
            link.download = "用户信息表模版";
          } else {
            link.download = "用户信息表";
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

    const beforeChange = () => {
      switchInit.value = true;
      loading.value = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          loading.value = false;
          return resolve(true);
        }, 250);
      });
    };

    function switchChange(val: string, switchInit: boolean) {
      // console.log(val, switchInit);
      if (!switchInit) return;
      if (val === "1") {
        ElMessage.error("用户锁定");
      } else if (val === "0") {
        ElMessage.success("用户解锁");
      }
    }

    function hideTagClose(role: string) {
      //当用户仅有游客角色时隐藏删除
      return updateUser.roleList.length > 1 && role === "guest";
    }

    function handleTagClose(id: number) {
      //判断用户是否有游客角色
      let flag =
        updateUser.roleList.filter((r) => {
          return r.role === "guest";
        }).length === 1
          ? true
          : false;

      const guest = allRoleList.filter((r) => r.role === "guest");

      updateUser.roleList.forEach((r, index) => {
        if (r.id === id) {
          ElMessageBox.confirm(`你确定要删除用户的${r.role}角色吗?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            draggable: true,
          }).then(() => {
            if (!flag) {
              addUserRoleInfo(user.id.value, guest[0].id).then(
                (res) => {
                  updateUser.roleList.push(guest[0]);
                },
                (err) => {
                  console.log(err);
                }
              );
            }

            deleteUserRoleByUserIdAndRoleId(user.id.value, r.id).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  ElMessage.success({
                    message: `删除用户的${r.role}角色成功!`,
                    duration: 2000,
                    center: true,
                  });
                  updateUser.roleList.splice(index, 1);
                } else {
                  ElMessage.error({
                    message: `删除用户的${r.role}角色失败!!!`,
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
      });
    }

    function addUserRole() {
      if (selectRole.value === "") {
        ElMessage.warning({
          message: "请选择添加的角色!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      let flag = false;
      updateUser.roleList.forEach((r) => {
        if (r.role === selectRole.value) {
          flag = true;
        }
      });

      if (flag) {
        ElMessage.warning({
          message: "用户拥有该角色,无法重复添加!!!",
          duration: 2000,
          center: true,
        });
        return;
      }
      const role = allRoleList.filter((r) => r.role === selectRole.value);

      addUserRoleInfo(user.id.value, role[0].id).then(
        (res) => {
          if (res.data.code === 200) {
            ElMessage.success({
              message: `添加用户${role[0].role}角色成功!`,
              duration: 2000,
              center: true,
            });
            updateUser.roleList.push(role[0]);
          } else {
            ElMessage.error({
              message: `添加用户${role[0].role}角色失败!!!`,
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

    return {
      reload,
      currentPage,
      totalPage,
      searchRole,
      searchGender,
      searchName,
      dialogVisible,
      tableRef,
      tableData,
      updateUser,
      ...toRefs(updateUser),
      allRoleList,
      ruleFormRef,
      rules,
      uploadRef,
      baseUrl,
      importRef,
      headers,
      switchInit,
      loading,
      selectVisible,
      selectRole,
      handleEdit,
      updateUserFunction,
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
      beforeChange,
      switchChange,
      hideTagClose,
      handleTagClose,
      addUserRole,
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

    getUserList(1, 5).then(
      (res) => {
        const data: User[] = res.data.data;
        data.forEach((d) => {
          if (d.image === null) {
            d.image =
              "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/user.png";
          }
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

    getCountByRoleOrGenderOrName("", "", "").then(
      (res) => {
        // console.log(res);
        this.totalPage = Math.ceil(res.data.data / 5);
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
          this.allRoleList.push(d);
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

.importExcel {
  display: inline-block;
  margin: auto 10px;
  vertical-align: middle;
}

.searchGender {
  width: 150px;
  margin-left: 20px;
  margin-right: 20px;
}

.searchRole {
  width: 150px;
  margin-right: 20px;
}

.table {
  min-height: 500px;
  margin-top: 10px;
  margin-bottom: 20px;

  .image {
    margin-left: 39%;
  }

  .el-button {
    width: 48px;
    height: 27px;
  }
}

.form {
  .username {
    width: 300px;
  }

  .email {
    width: 300px;
  }

  .phone {
    width: 300px;
  }

  .signature {
    width: 420px;
  }

  .el-tag {
    margin-right: 10px;
  }

  .search {
    margin-left: 15px;
  }

  .el-button {
    margin-left: 15px;
  }
}
</style>
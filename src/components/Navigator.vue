<template>
  <el-container class="main">
    <el-aside width="200px">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#539d73"
        text-color="#E5EAF3"
        class="menu"
        :collapse="isCollapse"
        unique-opened
        router
        @select="chooseItem"
      >
        <el-sub-menu v-if="checkRole('admin')" index="/garbage">
          <template #title>
            <el-icon><DeleteFilled /></el-icon>
            <span>垃圾管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/main/addGarbage">
              <el-icon><CirclePlus /></el-icon>
              <template #title>添加垃圾信息</template>
            </el-menu-item>
            <el-menu-item index="/main/garbageList">
              <el-icon><Tickets /></el-icon>
              <template #title>垃圾列表</template>
            </el-menu-item>
            <el-sub-menu index="/category">
              <template #title>
                <el-icon><Present /></el-icon>
                分类管理
              </template>
              <el-menu-item index="/main/addGarbageCategory">
                <el-icon><CirclePlus /></el-icon>
                <template #title>添加分类</template>
              </el-menu-item>
              <el-menu-item index="/main/garbageCategoryList">
                <el-icon><Tickets /></el-icon>
                <template #title>分类列表</template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu v-if="checkRole('admin')" index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/main/addUser">
              <el-icon><CirclePlus /></el-icon>
              <template #title>添加用户信息</template>
            </el-menu-item>
            <el-menu-item index="/main/userList">
              <el-icon><Tickets /></el-icon>
              <template #title>用户列表</template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu v-if="checkRole('admin')" index="/role">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>角色管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/main/addRole">
              <el-icon><CirclePlus /></el-icon>
              <template #title>添加角色信息</template>
            </el-menu-item>
            <el-menu-item index="/main/roleList">
              <el-icon><Tickets /></el-icon>
              <template #title>角色列表</template>
            </el-menu-item>
            <el-menu-item index="/main/rolePathList">
              <el-icon><Memo /></el-icon>
              <template #title>角色权限列表</template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu v-if="checkRole('admin')" index="/path">
          <template #title>
            <el-icon><Grid /></el-icon>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/main/addPath">
              <el-icon><CirclePlus /></el-icon>
              <template #title>添加权限信息</template>
            </el-menu-item>
            <el-menu-item index="/main/pathList">
              <el-icon><Tickets /></el-icon>
              <template #title>权限列表</template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/delivery">
          <template #title>
            <el-icon><ShoppingTrolley /></el-icon>
            <span v-if="checkRole('guest')">投递管理</span>
            <span v-else>垃圾设施管理</span>
          </template>
          <el-menu-item index="/main/garbageStationMap">
            <el-icon><CirclePlus /></el-icon>
            <template #title>
              <span v-if="checkRole('guest')">投递垃圾</span>
              <span v-else>垃圾站地图</span>
            </template>
          </el-menu-item>
          <el-menu-item
            v-if="checkRole('guest')"
            index="/main/personalGarbageDeliveryList"
          >
            <el-icon><Tickets /></el-icon>
            <template #title>投递记录列表</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          v-if="checkRole('admin')"
          index="/main/garbageDeliveryList"
        >
          <el-icon><ShoppingTrolley /></el-icon>
          <template #title>投递记录列表</template>
        </el-menu-item>
        <el-sub-menu v-if="checkRole('admin')" index="/mall">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商城管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/main/addGood">
              <el-icon><CirclePlus /></el-icon>
              <template #title>添加商品</template>
            </el-menu-item>
            <el-menu-item index="/main/goodList">
              <el-icon><Tickets /></el-icon>
              <template #title>商品列表</template>
            </el-menu-item>
            <el-sub-menu index="/goodCategory">
              <template #title>
                <el-icon><Present /></el-icon>
                <span>商品种类管理</span>
              </template>
              <el-menu-item index="/main/addGoodCategory">
                <el-icon><CirclePlus /></el-icon>
                <template #title>添加商品种类</template>
              </el-menu-item>
              <el-menu-item index="/main/goodCategoryList">
                <el-icon><Tickets /></el-icon>
                <template #title>商品种类列表</template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu v-if="checkRole('admin')" index="/broadcast">
          <template #title>
            <el-icon><ChatDotRound /></el-icon>
            <span>消息管理</span>
          </template>
          <el-menu-item index="/main/addBroadcast">
            <el-icon><ChatRound /></el-icon>
            <template #title>发布消息</template>
          </el-menu-item>
          <el-menu-item index="/main/broadcastList">
            <el-icon><Tickets /></el-icon>
            <template #title>消息列表</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-if="checkRole('guest')" index="/main/orderList">
          <el-icon><Tickets /></el-icon>
          <template #title>订单列表</template>
        </el-menu-item>
        <el-menu-item
          class="expand"
          @click="isCollapse = !isCollapse"
          :index="route.path"
        >
          <el-icon>
            <Expand v-show="isCollapse" />
            <Fold v-show="!isCollapse" />
          </el-icon>
          <template #title>折叠</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <el-tabs
        v-model="tabName"
        @tab-click="changeRoute"
        @tab-remove="removeTab"
        type="border-card"
        class="tabs"
      >
        <el-tab-pane
          v-for="item in tabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.closable"
        >
          <router-view v-if="item.isRouterActive"></router-view>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  nextTick,
  provide,
  watch,
  ref,
} from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { TabPaneName, TabsPaneContext } from "element-plus";
import useTab from "@/store/tab";
import { storeToRefs } from "pinia";
import Role from "@/type/roleList";
import { getUserById } from "@/request/personalApi";
import useUserStore from "@/store/user";
import User from "@/type/userList";
export default defineComponent({
  name: "navigator",
  setup() {
    const tabStore = useTab();
    const { tabs, tabName } = storeToRefs(tabStore);

    const userStore = useUserStore();
    const { id, roleList, image } = storeToRefs(userStore);

    const roles: Array<Role> = reactive([]);
    //默认折叠导航栏
    const isCollapse = ref(true);
    const route = useRoute();

    function chooseItem(index: string) {
      // console.log(index);
      if (index !== "/main/welcome") {
        //获取路由名称
        let title: string = "";
        router.getRoutes().forEach((route) => {
          if (route.path === index) {
            if (typeof route.meta.title === "string") {
              title = route.meta.title;
            }
          }
        });

        //判断是否存在该标签
        const flag = tabs.value.filter((tab) => {
          return tab.to === index;
        });

        if (flag.length === 0) {
          //添加标签
          const tab = {
            name: title,
            title,
            closable: true,
            to: index,
            isRouterActive: false,
          };
          tabs.value.push(tab);
        }

        tabs.value.forEach((tab) => {
          tab.isRouterActive = false;
          if (tab.name === title) {
            tab.isRouterActive = true;
          }
        });

        //跳转路由
        tabName.value = title;
        router.push({ path: index });
      }
    }

    function changeRoute(pane: TabsPaneContext) {
      const name = pane.props.name;
      //跳转路由
      tabs.value.forEach((tab) => {
        tab.isRouterActive = false;
        if (tab.name === name) {
          tab.isRouterActive = true;
          router.push({ path: tab.to });
        }
      });
    }

    function removeTab(name: TabPaneName) {
      // console.log(name);
      tabs.value.forEach((tab, index) => {
        tab.isRouterActive = false;
        if (tab.name === name) {
          tabs.value.splice(index, 1);
        }
      });

      //跳转到最后一个标签
      const last: any = tabs.value[tabs.value.length - 1];
      last.isRouterActive = true;
      tabName.value = last.title;
      router.push({ path: last.to });
    }

    provide("reload", () => {
      const tab: any = tabs.value.filter(
        (t: any) => t.name === tabName.value
      )[0];
      tab.isRouterActive = false;
      nextTick(() => {
        tab.isRouterActive = true;
      });
    });

    watch(route, (oldVal, newVal) => {
      // console.log(oldVal, newVal);
      if (
        newVal.path === "/main/personal" ||
        newVal.path === "/main/updatePassword" ||
        newVal.path === "/main/signIn"
      ) {
        chooseItem(newVal.path);
      }
    });

    function checkRole(role: string) {
      const flag = roles.filter((r) => r.role === role).length;
      return flag > 0;
    }

    return {
      id,
      roleList,
      image,
      roles,
      tabs,
      tabName,
      isCollapse,
      route,
      chooseItem,
      changeRoute,
      removeTab,
      checkRole,
    };
  },
  mounted() {
    //获取用户角色信息
    getUserById(this.id).then(
      (res) => {
        // console.log(res);
        const u: User = res.data.data;
        u.roleList.forEach((r) => {
          this.roles.push(r);
        });

        if (typeof u.image === "string") {
          this.image = u.image;
        }
        this.roleList = u.roleList;
      },
      (err) => {
        console.log(err);
      }
    );
  },
});
</script>

<style lang="less" scoped>
.main {
  margin-top: 60px;

  .menu {
    min-height: 600px;

    .el-menu-item:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      transform: translate(-2px, -2px);
      transition: 0.3s;
    }

    .expand {
      width: 100%;
      position: absolute;
      bottom: 0px;
    }
  }

  .el-main {
    padding: 2px !important;

    .tabs {
      margin-left: 2%;
      width: 96%;
      padding: 0px !important;
      padding: 32px;
      color: #6b778c;
      min-height: 560px;
    }
  }
}
</style>
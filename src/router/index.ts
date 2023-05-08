import Role from "@/type/roleList";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import('@/views/Home.vue'),
    meta: { title: '垃圾分类系统' },
  },
  {
    path: "/search",
    name: "searchGarbage",
    component: () => import("@/views/SearchGarbage.vue"),
    meta: { title: '搜索' },
  },
  {
    path: "/notice",
    name: "notice",
    component: () => import("@/views/Notice.vue"),
    meta: { title: '消息公告' },
  },
  {
    path: "/noticeDetails/:id",
    name: "noticeDetails",
    component: () => import("@/views/NoticeDetails.vue"),
    meta: { title: '消息详情' },
  },
  {
    path: "/mall",
    name: "mall",
    component: () => import("@/views/Mall.vue"),
    meta: { title: '积分商城' },
  },
  {
    path: "/rankList",
    name: "rankList",
    component: () => import("@/views/RankList.vue"),
    meta: { title: '积分排行榜' },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { title: '登录' },
  },
  {
    path: "/wechatQRCode/:id",
    name: "wechatQRCode",
    component: () => import("@/views/WechatQRCode.vue"),
    meta: { title: '微信扫码登录' },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
    meta: { title: '注册' },
  },
  {
    path: "/status/:statusCode",
    name: "status",
    component: () => import("@/views/Status.vue"),
    meta: { title: '错误页面' },
  },
  {
    path: "/main",
    name: "main",
    component: () => import('@/components/Navigator.vue'),
    meta: { title: '主页', auth: true },
    children: [
      {
        path: "welcome",
        name: "welcome",
        component: () => import("@/views/Welcome.vue"),
        meta: { title: '欢迎', auth: true },
      },
      {
        path: "signIn",
        name: "signIn",
        component: () => import("@/views/SignIn.vue"),
        meta: { title: '签到', auth: true },
      },
      {
        path: "personal",
        name: "personal",
        component: () => import("@/views/Personal.vue"),
        meta: { title: '个人中心', auth: true },
      },
      {
        path: "updatePassword",
        name: "updatePassword",
        component: () => import("@/views/UpdatePassword.vue"),
        meta: { title: '修改密码', auth: true },
      },
      {
        path: "addGarbage",
        name: "addGarbage",
        component: () => import("@/views/AddGarbage.vue"),
        meta: { title: '添加垃圾信息', auth: true },
      },
      {
        path: "garbageList",
        name: "garbageList",
        component: () => import("@/views/GarbageList.vue"),
        meta: { title: '垃圾列表', auth: true, role: "admin" },
      },
      {
        path: "addGarbageCategory",
        name: "addGarbageCategory",
        component: () => import("@/views/AddGarbageCategory.vue"),
        meta: { title: '添加垃圾分类信息', auth: true, role: "admin" },
      },
      {
        path: "garbageCategoryList",
        name: "garbageCategoryList",
        component: () => import("@/views/GarbageCategoryList.vue"),
        meta: { title: '垃圾分类列表', auth: true, role: "admin" },
      },
      {
        path: "addRole",
        name: "addRole",
        component: () => import("@/views/AddRole.vue"),
        meta: { title: '添加角色信息', auth: true, role: "admin" },
      },
      {
        path: "roleList",
        name: "roleList",
        component: () => import("@/views/RoleList.vue"),
        meta: { title: '角色列表', auth: true, role: "admin" },
      },
      {
        path: "rolePathList",
        name: "rolePathList",
      component: () => import("@/views/RolePathList.vue"),
        meta: { title: '角色权限列表', auth: true, role: "admin" },
      },
      {
        path: "addPath",
        name: "addPath",
        component: () => import("@/views/AddPath.vue"),
        meta: { title: '添加权限信息', auth: true, role: "admin" },
      },
      {
        path: "pathList",
        name: "pathList",
        component: () => import("@/views/PathList.vue"),
        meta: { title: '权限列表', auth: true, role: "admin" },
      },
      {
        path: "addUser",
        name: "addUser",
        component: () => import("@/views/AddUser.vue"),
        meta: { title: '添加用户', auth: true, role: "admin" },
      },
      {
        path: "userList",
        name: "userList",
        component: () => import("@/views/UserList.vue"),
        meta: { title: '用户列表', auth: true, role: "admin" },
      },
      {
        path: "addGarbageDelivery",
        name: "addGarbageDelivery",
        component: () => import("@/views/AddGarbageDelivery.vue"),
        meta: { title: '投递垃圾', auth: true, role: "guest" },
      },
      {
        path: "personalGarbageDeliveryList",
        name: "personalGarbageDeliveryList",
        component: () => import("@/views/PersonalGarbageDeliveryList.vue"),
        meta: { title: '投递记录列表', auth: true, role: "guest" },
      },
      {
        path: "garbageDeliveryList",
        name: "garbageDeliveryList",
        component: () => import("@/views/GarbageDeliveryList.vue"),
        meta: { title: '投递记录列表', auth: true, role: "admin" },
      },
      {
        path: "addGoodCategory",
        name: "addGoodCategory",
        component: () => import("@/views/AddGoodCategory.vue"),
        meta: { title: '添加商品种类', auth: true, role: "admin" },
      },
      {
        path: "goodCategoryList",
        name: "goodCategoryList",
        component: () => import("@/views/GoodCategoryList.vue"),
        meta: { title: '商品种类列表', auth: true, role: "admin" },
      },
      {
        path: "addGood",
        name: "addGood",
        component: () => import("@/views/AddGood.vue"),
        meta: { title: '添加商品', auth: true, role: "admin" },
      },
      {
        path: "goodList",
        name: "goodList",
        component: () => import("@/views/GoodList.vue"),
        meta: { title: '商品列表', auth: true, role: "admin" },
      },
      {
        path: "orderList",
        name: "orderList",
        component: () => import("@/views/OrderList.vue"),
        meta: { title: '订单列表', auth: true, role: "guest" },
      },
      {
        path: "garbageStationMap",
        name: "garbageStationMap",
        component: () => import("@/views/GarbageStationMap.vue"),
        meta: { title: '投递垃圾', auth: true },
      },
      {
        path: "addBroadcast",
        name: "addBroadcast",
        component: () => import("@/views/AddBroadcast.vue"),
        meta: { title: '发布消息', auth: true, role: "admin" },
      },
      {
        path: "broadcastList",
        name: "broadcastList",
        component: () => import("@/views/BroadcastList.vue"),
        meta: { title: '消息列表', auth: true, role: "admin" },
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//前置守卫 初始化时或跳转路由前触发
router.beforeEach((to, from, next) => {

  //对于状态页面直接放行
  const statusRegex = /^\/status\/./
  if (statusRegex.test(to.path)) {
    next();
  }

  //对于消息详情页面和微信扫码页面放行
  if(to.path.indexOf("/noticeDetails") !== -1 || to.path.indexOf("/wechatQRCode") !== -1){
    next();
  }

  //判断请求路由是否存在
  const flag = router.getRoutes().filter(r => r.path === to.path).length;
  if (flag === 0) {
    //该请求路由不存在直接跳转到404页面

    next({ name: "status", params: { statusCode: 404 } });
  }

  // // 当直接访问main子路由跳转到主页(只能通过导航栏访问)
  // const mainRegex = /^\/main\/./
  // if (from.path === to.path && mainRegex.test(from.path) && mainRegex.test(to.path)) {
  //   next('/main/welcome');
  // }

  //判断请求路由是否需要认证
  if (to.meta?.auth) {
    const user = localStorage.getItem("user");
    if (user) {
      const obj = JSON.parse(user);
      if (obj.access_token) {
        if (to.meta?.role) {
          //用户已认证, 是否拥有请求路由相应角色
          const roleList: Array<Role> = obj.roleList;
          const flag = roleList.filter(r => r.role === to.meta.role).length;
          if (flag > 0) {
            //用户拥有请求路由相应角色放行
            next();
          } else {
            //用户没有权限跳转到403页面
            next({ name: "status", params: { statusCode: 403 } });
          }
        } else {
          //请求路由不需要特定角色直接放行
          next();
        }
      } else {
        //用户未认证跳转到401页面
        next({ name: "status", params: { statusCode: 401 } })
      }
    } else {
      //用户未认证跳转到401页面
      next({ name: "status", params: { statusCode: 401 } })
    }
  } else {
    //请求路由不需要认证直接放行
    next();
  }
})

//后置守卫 初始化时或跳转路由后触发
router.afterEach((to, from) => {
  if (typeof (to.meta?.title) === "string") {
    document.title = to.meta?.title || "垃圾分类系统"
  }
})

export default router;

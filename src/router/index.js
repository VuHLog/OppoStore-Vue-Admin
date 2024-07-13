import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useBaseStore } from "@/store/index.js";

import Dashboard from "@pages/Dashboard.vue";
import DefaultLayout from "@layouts/DefaultLayout.vue";
import SignIn from "@pages/SignIn.vue"
import AuthLayout from "@layouts/AuthLayout.vue";
import User from "@pages/User/User.vue";
import CreateUser from "@pages/User/Create.vue";
import EditUser from "@pages/User/Edit.vue";
import InfoUser from "@pages/User/Info.vue";
import Profile from "@pages/Profile/Profile.vue";
import MobilePhone from "@pages/MobilePhone/MobilePhone.vue";
import CreateMobilePhone from "@pages/MobilePhone/Create.vue";
import EditMobilePhone from "@pages/MobilePhone/Edit.vue";
import InfoMobilePhone from "@pages/MobilePhone/Info.vue";

const routes = [
  {
    path: "/",
    name: "/",
    component: DefaultLayout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    beforeEnter: requireAdmin,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },

      //User
      {
        path: "/users",
        name: "Người dùng",
        component: User
      },
      {
        path: "/infoUser/:userId",
        name: "Info User",
        component: InfoUser,
      },
      {
        path: "/createUser",
        name: "Create User",
        component: CreateUser,
      },
      {
        path: "/editUser/:userId",
        name: "Edit User",
        component: EditUser,
      },

      //Profile
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
      },

      //Mobile Phone
      {
        path: "/mobilePhones",
        name: "Điện thoại",
        component: MobilePhone
      },
      {
        path: "/infoMobilePhone/:mobilePhoneId",
        name: "Info MobilePhone",
        component: InfoMobilePhone,
      },
      {
        path: "/createMobilePhone",
        name: "Create MobilePhone",
        component: CreateMobilePhone,
      },
      {
        path: "/editMobilePhone/:mobilePhoneId",
        name: "Edit MobilePhone",
        component: EditMobilePhone,
      },
    ],
  },
  {
    path: "/sign-in",
    name: "Sign in",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "SignIn",
        component: SignIn,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const store = useBaseStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn() || !store.isLoggedIn) {
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

//hàm check login với token
function isLoggedIn() {
  const store = useBaseStore();
  const token = sessionStorage.getItem("token");
  store.isLoggedIn = true;

  if (token) {
    //giải mã token
    const decoded = jwtDecode(token);
    store.roles = decoded.scope.replaceAll("ROLE_","");
    store.username = decoded.sub;
    store.fullName = decoded.name;
    

    // Kiểm tra xem token có hết hạn hay không
    const expirationDate = new Date(decoded.exp * 1000);
    if (expirationDate <= new Date()) {
      // Nếu token đã hết hạn, xóa nó khỏi sessionStorage và trả về false
      sessionStorage.removeItem("token");
      return false;
    } else {
      // Nếu token hợp lệ, trả về true
      return true;
    }
  } else {
    // Nếu token không tồn tại trong sessionStorage, trả về false
    return false;
  }
}

// Hàm check role
function requireAdmin(to, from, next) {
  const token = sessionStorage.getItem("token");

  if (!isLoggedIn()) {
    next("/sign-in");
  } else {
    const decodedToken = jwtDecode(token);
    if (!decodedToken.scope.includes("ROLE_ADMIN")) {
      // store.dispatch("showToast", "Tài khoản không có quyền truy cập!");
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  }
}

export default router;

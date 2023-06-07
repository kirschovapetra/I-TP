import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Product from "@/views/Product.vue";
import Cart from "../views/Cart.vue";
import CompanyList from "@/views/CompanyList.vue";
import ProductCategory from "@/containers/ProductCategory.vue";
//import Demos from '@/views/Demos.vue'
import CompanyRegistration from '@/containers/company/Registration.vue'
import Company from '@/views/Company.vue'
import Login from '@/views/Login.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  /*{
    path: "/demos",
    name: "Demos",
    component: Demos,
  },*/
  {
    path: "/company/registration",
    name: "CompanyRegistration",
    component: CompanyRegistration
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  {
    path: "/company/:caseId",
    name: "Company",
    component: Company
  },
  {
    path: "/product/:caseId",
    name: "Product",
    component: Product
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart
  },
  {
    path: "/companyList",
    name: "CompanyList",
    component: CompanyList
  },
  {
    path: "/:category",
    name: "ProductCategory",
    component: ProductCategory
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (to.name !== 'Login' && (user === null || user.type === undefined)) next({ name: 'Login' })
  else next()
})

export default router;

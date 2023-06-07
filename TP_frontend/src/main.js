import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./css/style.css";
import { BootstrapVue, BootstrapVueIcons, SpinnerPlugin } from "bootstrap-vue";
import VModal from 'vue-js-modal'
import Toasted from 'vue-toasted';
import constants from './store/constants.js';
import axios from "axios";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(SpinnerPlugin);
Vue.use(VModal)

Vue.use(Toasted, {
  iconPack: 'fontawesome' // set your iconPack, defaults to material. material|fontawesome|custom-class
});


// console.log(Vue);

// // options to the toast
// let options = {
//   type: 'error',
//   icon: {
//     name: 'exclamation-circle'
//   }
// };

// register the toast with the custom message
Vue.toasted.register('success',
  (payload) => {

    // if there is no message passed show default message
    if (!payload.message) {
      return "Šak mesidž zadaj";
    }

    // if there is a message show it with the message
    return payload.message;
  },
  {
    type: 'success',
    position: 'top-right',
    keepOnHover: true,
    duration: 5000
  }
)

Vue.toasted.register('error',
  (payload) => {

    // if there is no message passed show default message
    if (!payload.message) {
      return "Šak mesidž zadaj";
    }

    // if there is a message show it with the message
    return payload.message;
  },
  {
    type: 'error',
    position: 'top-right',
    keepOnHover: true,
    duration: 6500
  }
)

/*
enum: typ usera
Meno

*/

Vue.prototype.$const = constants;

//let productsInCart = JSON.parse(sessionStorage.getItem('productsInCart'));
// let user;
// switch (0) { // lebo proste chalan musi plakat vzdy ked nieco inicializovane unused
//   case 0: user = { type: constants.USER_TYPE.CLIENT, name: "Jaro Japonsky", token: "", groupId: "" }; break;
//   case 1: user = { type: constants.USER_TYPE.COMPANY, name: "Jaro Japanse s.r.o", token: "", groupId: "" }; break;
//   case 2: user = { type: constants.USER_TYPE.COURIER, name: "Jaro Animovaný", token: "", groupId: "" }; break;
//   case 3: user = { type: constants.USER_TYPE.ADMIN, name: "Jaro Big Boss", token: "", groupId: "" }; break;
//   case 4: user = null; break;
// }

// sessionStorage.setItem('user', JSON.stringify(user));

Vue.config.productionTip = false;

// push produkt ako parameter routera
Vue.prototype.showCompanyProfile = (caseId) => {
  return router.push({
    name: "Company",
    params: {
      caseId: caseId,
    },
  });
},
  Vue.prototype.showProduct = (caseId) => {
    return router.push({
      name: "Product",
      params: {
        caseId: caseId,
      },
    });
  },

  Vue.prototype.isPostalCode = (value) => {
    return (
      new RegExp(/(^\d{5}$)|(^\d\d\d \d\d$)/, "g").test(value) && value != ""
    ); // 12345 alebo 123 45
  };
Vue.prototype.isPhoneNumber = (value) => {
  return new RegExp(/(^[+]\d*)|(^\d*$)/, "g").test(value) || value == ""; // +1234... alebo 1234...
};
Vue.prototype.isEmail = (value) => {
  return (
    new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, "g").test(value) || value == ""
  );
};
Vue.prototype.isICO = (value) => {
  return new RegExp(/(^\d{8}$)/, "g").test(value) && value != ""; // 0000000000 (8 miestne)
};
Vue.prototype.isICDPH = (value) => {
  return new RegExp(/(^SK\d{10}$)/, "g").test(value) && value != ""; // SK0000000000 (SK + 10 miestne cislo)
};
Vue.prototype.isDIC = (value) => {
  return new RegExp(/(^\d{10}$)/, "g").test(value) && value != ""; // 0000000000 (10 miestne)
};

/******************************* API CALLS ****************************/


Vue.prototype.Login = () => {
  const username = "xszaboovav@stuba.sk";
  const password = "86024";
  const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

  var authHeader = { Authorization: `Basic ${token}` };
  try {
    const userInfo = axios.get(
      "https://engine.interes.group/api/auth/login",
      { headers: authHeader }
    );
    return userInfo;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.Logout = (token) => {

  var authTokenHeader = { "X-Auth-Token": token }
  try {
    const logout = axios.get(
      "https://engine.interes.group/api/auth/logout",
      { headers: authTokenHeader }
    );


    sessionStorage.removeItem("user");
    this.$router.push("/login");

    return logout;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.GetTasksOfCase = (token, caseId) => {

  var authTokenHeader = { "X-Auth-Token": token }
  const body = { case: { id: caseId } }

  try {
    const tasks = axios.post(
      "https://engine.interes.group/api/task/search",
      body,
      { headers: authTokenHeader }
    );
    return tasks
  } catch (e) {
    console.log(e);
  }
};

Vue.prototype.GetTaskData = (token, taskId) => {

  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const tasks = axios.get(
      `https://engine.interes.group/api/task/${taskId}/data`,
      { headers: authTokenHeader }
    );
    return tasks
  } catch (e) {
    console.log(e);
  }
};

Vue.prototype.GetUserInfo = (token) => {

  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const userInfo = axios.get(
      "https://engine.interes.group/api/user/me",
      { headers: authTokenHeader }
    );
    return userInfo
  } catch (e) {
    console.log(e);
  }
};

Vue.prototype.GetAllProcesses = (token, groupId) => {

  var body = { group: groupId }
  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const processes = axios.post(
      "https://engine.interes.group/api/petrinet/search?size=1000&page=0",
      body,
      { headers: authTokenHeader }
    );
    return processes;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.GetActiveCases = (token, groupId) => {

  var body = { group: groupId }
  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const cases = axios.post(
      "https://engine.interes.group/api/workflow/case/search?size=1000&page=0",
      body,
      { headers: authTokenHeader }
    );
    return cases;
  } catch (e) {
    console.log(e);
  }
}


Vue.prototype.GetTasksByCaseId = (token, caseId = "") => {

  var body = caseId.length == 0 ? {} : { case: { id: caseId } }
  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const tasks = axios.post(
      "https://engine.interes.group/api/task/search",
      body,
      { headers: authTokenHeader }
    );
    return tasks;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.AssignTask = (token, taskId) => {

  var authTokenHeader = { "X-Auth-Token": token }
  try {
    const data = axios.get(
      `https://engine.interes.group/api/task/assign/${taskId}`,
      { headers: authTokenHeader }
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}


Vue.prototype.FinishTask = (token, taskId) => {

  var authTokenHeader = { "X-Auth-Token": token }
  try {
    const data = axios.get(
      `https://engine.interes.group/api/task/finish/${taskId}`,
      { headers: authTokenHeader }
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.GetDataByTask = (token, taskId) => {

  var authTokenHeader = { "X-Auth-Token": token }
  try {
    const data = axios.get(
      `https://engine.interes.group/api/task/${taskId}/data`,
      { headers: authTokenHeader }
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.EditDataByTask = (token, taskId, payload) => {

  var authTokenHeader = { "X-Auth-Token": token }
  try {
    const data = axios.post(
      `https://engine.interes.group/api/task/${taskId}/data`,
      payload,
      { headers: authTokenHeader }
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}


Vue.prototype.SearchCaseFulltext = (token, groupId, fullText) => {

  var body = { group: groupId, fullText: fullText }
  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const cases = axios.post(
      "https://engine.interes.group/api/workflow/case/search?sort=stringId,desc&operation=AND",
      body,
      { headers: authTokenHeader }
    );
    return cases;
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.CreateCase = (token, title, stringId) => {
  var createCaseBody = {
    title: title,
    netId: stringId,
  };
  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const createCase = axios.post(
      "https://engine.interes.group/api/workflow/case",
      createCaseBody,
      { headers: authTokenHeader }
    );
    return createCase
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.DeleteCase = (token, caseId) => {
  var authTokenHeader = { "X-Auth-Token": token }

  try {
    const delCase = axios.delete(
      `https://engine.interes.group/api/workflow/case/${caseId}`,
      { headers: authTokenHeader }
    );
    return delCase
  } catch (e) {
    console.log(e);
  }
}

Vue.prototype.SubmitFile = (token, taskId, fieldStringId, formData) => {

  try {
    const data = axios.post(
      `https://engine.interes.group/api/task/${taskId}/file/${fieldStringId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Auth-Token": token,
        },
      })
    return data;
  } catch (e) {
    console.log(e);
  }
  return "done"
},


  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");


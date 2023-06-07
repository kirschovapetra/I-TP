<template>
  <div class="home view-bg">
    <Navigation />
    <b-container class="profile">
      <b-row>
        <b-col md="4" lg="3" class="profile-menu">
          <ProfileMenu
            @selected="changeView"
            :imageURL="imageURL"
            :userName="userName"
          />
        </b-col>
        <b-col md="8" lg="9">
          <div class="slide shadow">
            <div v-if="view == 'Settings'">
              <ClientInfo
                v-if="user.type == this.$const.USER_TYPE.CLIENT"
                :clientData="clientData"
                :editTaskId="clientAccountEditId"
                @reload="load"
              />
              <CourierInfo
                v-if="user.type == this.$const.USER_TYPE.COURIER"
                :courierData="courierData"
                :editTaskId="courierAccountEditId"
                @reload="load"
              />
              <CompanyInfo
                v-if="user.type == this.$const.USER_TYPE.COMPANY"
                :companyData="companyData"
                :editTaskId="companyAccountEditId"
                @reload="load"
              />
            </div>
            <OrderHistory
              v-if="view == 'OrderHistory'"
              :orderDataList="orderDataList"
            />
            <FavoriteProducts v-if="view == 'FavoriteProducts'" />
            <FavoriteCompanies v-if="view == 'FavoriteCompanies'" />
            <BranchList
              v-if="view == 'Branches'"
              :branchDataList="branchDataList"
              :addBranchTaskId="addBranchTaskId"
              @reload="load"
            />
            <Requests
              v-if="view == 'Requests'"
              :courierRequests="courierRequests"
              :companyRequests="companyRequests"
              @reload="load"
            />
            <Orders v-if="view == 'Orders'" :orderDataList="orderDataList" />
            <Products
              v-if="view == 'Products'"
              :productDataList="productDataList"
              :addProductTaskId="addProductTaskId"
              :uploadFileTaskId="uploadFileTaskId"
              @reload="load"
            />
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div class="card-footer">
      <Footer />
    </div>
  </div>
</template>
<script>
import Navigation from "@/containers/general/Navigation.vue";
import Footer from "@/containers/general/Footer.vue";
import ProfileMenu from "@/containers/profile/ProfileMenu.vue";
import ClientInfo from "@/containers/profile/ClientInfo.vue";
import CourierInfo from "@/containers/profile/CourierInfo.vue";
import CompanyInfo from "@/containers/profile/CompanyInfo.vue";
import FavoriteProducts from "@/containers/profile/FavoriteProducts.vue";
import Products from "@/containers/profile/Products.vue";
import FavoriteCompanies from "@/containers/profile/FavoriteCompanies.vue";
import OrderHistory from "@/containers/profile/OrderHistory.vue";
import Requests from "@/containers/profile/Requests.vue";
import Orders from "@/containers/profile/Orders.vue";
import BranchList from "@/containers/branch/BranchList.vue";
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "Profile",
  components: {
    ProfileMenu,
    ClientInfo,
    CourierInfo,
    CompanyInfo,
    FavoriteProducts,
    Products,
    FavoriteCompanies,
    Navigation,
    Footer,
    OrderHistory,
    Orders,
    Requests,
    BranchList,
  },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      userName: "",
      imageURL: "",
      processIdsAll: JSON.parse(sessionStorage.getItem("processIds")),
      view: "",
      allCases: JSON.parse(sessionStorage.getItem("activeTasks")),
      clientTaskIds: [],
      courierTaskIds: [],
      companyTaskIds: [],
      clientAccountEditId: "",
      courierAccountEditId: "",
      companyAccountEditId: "",
      branchListTaskId: "",
      addBranchTaskId: "",
      productListTaskId: "",
      addProductTaskId: "",
      uploadFileTaskId: "",
      orderHistoryId: "",
      orderDataList: [],
      branchDataList: [],
      productDataList: [],
      courierRequests: [],
      companyRequests: [],
      courierData: {},
      clientData: { address: {}, contact: {} },
      companyData: { company: {}, address: {} },
    };
  },
  async mounted() {
    console.log(this.user);
    await this.load();
  },
  methods: {
    clearData() {
      this.clientTaskIds = [];
      this.courierTaskIds = [];
      this.companyTaskIds = [];
      this.orderDataList = [];
      this.branchDataList = [];
      this.productDataList = [];
      this.courierRequests = [];
      this.companyRequests = [];
      this.courierData = {};
      this.clientData = { address: {}, contact: {} };
      this.companyData = { company: {}, address: {} };
    },
    async load() {
      this.clearData();
      var USER = this.$const.USER_TYPE;

      // default view
      switch (this.user.type) {
        /* admin */
        case USER.ADMIN:
          await this.adminActions();
          break;
        /* klient */
        case USER.CLIENT:
          await this.clientActions();
          break;
        /* kurier */
        case USER.COURIER:
          await this.courierActions();
          break;
        /* firma */
        case USER.COMPANY:
          await this.companyActions();
          break;
      }

      this.view = this.user.type == USER.ADMIN ? "Requests" : "Settings";
      console.log("loaded");
    },

    changeView(value) {
      this.view = value;
    },

    /***************** courier *****************/

    async courierActions() {
      /************ tasky v kurierovom ucte ***********/

      var courierCase = this.allCases.filter((_case) => {
        return (
          _case.processIdentifier == this.user.groupId + "_kurier" &&
          _case.title == this.user.email.email + "_kurier"
        );
      })[0];

      if (!courierCase) {
        console.log("Nenasiel sa taky kurier");
        return "failure";
      }
      // tasky v konkretnom Case
      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        courierCase.stringId
      );

      var courierTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];

      for (var i in courierTasks) {
        this.courierTaskIds.push({
          title: courierTasks[i].title,
          taskId: courierTasks[i].stringId,
        });
      }

      await this.getCourierData();

      /******************* vsetky objednavky ******************/

      var objednavkyCases = this.allCases.filter((_case) => {
        return _case.processIdentifier == this.user.groupId + "_objednavka";
      });

      this.orderDataList = [];
      for (var j in objednavkyCases) {
        this.orderDataList.push(
          await this.getOrderData(j, objednavkyCases[j].stringId)
        );
      }

      this.userName =
        this.courierData.first_name + " " + this.courierData.last_name;
      this.imageURL =
        this.courierData.picture != ""
          ? this.courierData.picture
          : "https://via.placeholder.com/250";

      return "done";
    },

    async getCourierData() {
      /************************** info, view task *************************/

      this.courierAccountEditId = this.courierTaskIds.find((item) =>
        item.title.includes("Upraviť informácie")
      ).taskId;

      if (this.courierAccountEditId) {
        var taskDataEdit = await this.GetDataByTask(
          this.user.token,
          this.courierAccountEditId
        );
        var courierDataGroupsEdit = taskDataEdit.data._embedded.dataGroups;
        this.courierData = await ResponseParser.parseContact(
          this.user.token,
          courierDataGroupsEdit[1].fields
        );
      } else {
        console.log("nenasiel sa kurierov editovaci task");
      }

      return "done";
    },

    async getOrderData(id, caseId) {
      var tasks = await this.GetTasksByCaseId(this.user.token, caseId);
      var orderDetailTask = tasks.data._embedded.tasks.filter((task) => {
        return task.title == "Detail";
      })[0];

      if (!orderDetailTask) return {};

      var orderDetailTaskData = await this.GetDataByTask(
        this.user.token,
        orderDetailTask.stringId
      );
      var usefulDataGroups = orderDetailTaskData.data._embedded.dataGroups.filter(
        (group) => {
          return group.fields._embedded != null;
        }
      );
      return await ResponseParser.parseOrderHistory(
        id,
        this.user.token,
        orderDetailTask.caseTitle,
        usefulDataGroups
      );
    },

    /***************** client *****************/

    async clientActions() {
      /************ tasky v klientskom ucte ***********/
      var clientCase = this.allCases.filter((_case) => {
        return (
          _case.processIdentifier == this.user.groupId + "_klient" &&
          _case.title == this.user.email.email + "_klient"
        );
      })[0];

      console.log(clientCase);

      if (!clientCase) {
        console.log("nenasiel sa taky klientsky case");
        return "failure";
      }

      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        clientCase.stringId
      );
      var clientTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];

      for (var i in clientTasks) {
        this.clientTaskIds.push({
          title: clientTasks[i].title,
          taskId: clientTasks[i].stringId,
        });
      }
      await this.getClientData();

      await this.getOrderHistoryData();

      this.userName =
        this.clientData.contact.first_name +
        " " +
        this.clientData.contact.last_name;
      this.imageURL =
        this.clientData.contact.picture != ""
          ? this.clientData.contact.picture
          : "https://via.placeholder.com/250";

      return "done";
    },

    async getClientData() {
      /*********************** view, edit info task **********************/

      var clientAccountEdit = this.clientTaskIds.find((item) =>
        item.title.includes("Aktualizovať informácie")
      );

      if (!clientAccountEdit) {
        console.log("nenasiel sa klientov editovaci task");
        return "failure";
      }

      this.clientAccountEditId = clientAccountEdit.taskId;

      var taskData = await this.GetDataByTask(
        this.user.token,
        this.clientAccountEditId
      );

      var clientDataGroups = taskData.data._embedded.dataGroups;

      this.clientData.address = ResponseParser.parseAddress(
        clientDataGroups[1].fields._embedded.localisedTextFields
      );
      this.clientData.contact = await ResponseParser.parseContact(
        this.user.token,
        clientDataGroups[2].fields
      );
      return "done";
    },

    async getOrderHistoryData() {
      /********* order history task *****************/
      var orderHistory = this.clientTaskIds.find((item) =>
        item.title.includes("História objednávok")
      );
      if (!orderHistory) {
        console.log("nenasla sa historia objednavok");
        return "failure";
      }

      this.orderHistoryId = orderHistory.taskId;

      var taskData = await this.GetDataByTask(
        this.user.token,
        this.orderHistoryId
      );

      await this.getOrdersFromEnumMap(taskData.data._embedded.dataGroups);

      return "done";
    },

    async getOrdersFromEnumMap(dataGroups) {
      var enum_map =
        dataGroups[0].fields._embedded.localisedEnumerationMapFields[0].options;

      // Case-ids vsetkych objednavok
      var orderIds = Object.keys(enum_map).filter((key) => {
        return key.length > 0;
      });

      // prechadzam cez vsetky idcka objednavok
      for (var id in orderIds) {
        var tasks = await this.GetTasksByCaseId(this.user.token, orderIds[id]);
        var orderTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];
        var orderInfo = orderTasks.filter((task) => {
          return task.title == "Detail";
        })[0];

        if (!orderInfo) {
          return "failure";
        }

        var orderData = await this.GetDataByTask(
          this.user.token,
          orderInfo.stringId
        );

        var usefulDataGroups = orderData.data._embedded.dataGroups.filter(
          (group) => {
            return group.fields._embedded != null;
          }
        );
        this.orderDataList.push(
          await ResponseParser.parseOrderHistory(
            id,
            this.user.token,
            orderInfo.caseTitle,
            usefulDataGroups
          )
        );
      }

      return "done";
    },

    /***************** admin *****************/

    async adminActions() {
      /************ registracie kurierov ************/
      var courierRegCases = this.allCases.filter((_case) => {
        return (
          _case.processIdentifier == this.user.groupId + "_kurier_registracia"
        );
      });

      for (var i in courierRegCases) {
        var tasks = await this.GetTasksByCaseId(
          this.user.token,
          courierRegCases[i].stringId
        );

        var courierRegTasks = tasks.data._embedded
          ? tasks.data._embedded.tasks
          : [];
        var courierRegTaskIds = [];

        for (var j in courierRegTasks) {
          courierRegTaskIds.push({
            title: courierRegTasks[j].title,
            taskId: courierRegTasks[j].stringId,
          });
        }

        await this.getCourierRegistrationData(
          courierRegCases[i].title,
          courierRegTaskIds
        );
      }

      /************ registracie firiem ************/
      var companyRegCases = this.allCases.filter((_case) => {
        return _case.processIdentifier == this.user.groupId + "_company";
      });

      for (var k in companyRegCases) {
        tasks = await this.GetTasksByCaseId(
          this.user.token,
          companyRegCases[k].stringId
        );

        var companyRegTasks = tasks.data._embedded
          ? tasks.data._embedded.tasks
          : [];
        var companyRegTaskIds = [];

        for (var l in companyRegTasks) {
          companyRegTaskIds.push({
            title: companyRegTasks[l].title,
            taskId: companyRegTasks[l].stringId,
          });
        }

        await this.getCompanyRegistrationData(
          companyRegCases[k].title,
          companyRegTaskIds
        );
      }

      return "done";
    },

    async getCourierRegistrationData(requestTitle, courierRegTaskIds) {
      var courierRegDetailTask = courierRegTaskIds.find((item) =>
        item.title.includes("Detail žiadosti")
      );
      if (!courierRegDetailTask) return;

      var courierApproveTask = courierRegTaskIds.find((item) =>
        item.title.includes("Schváliť")
      );

      var courierRejectTask = courierRegTaskIds.find((item) =>
        item.title.includes("Zamietnuť")
      );

      var approveTaskId = courierApproveTask ? courierApproveTask.taskId : "";
      var rejectTaskId = courierRejectTask ? courierRejectTask.taskId : "";

      var taskData = await this.GetDataByTask(
        this.user.token,
        courierRegDetailTask.taskId
      );
      var courierRegDataGroups = taskData.data._embedded.dataGroups;

      this.courierRequests.push(
        ResponseParser.parseCourierRequest(
          courierRegDataGroups[0].fields._embedded,
          requestTitle,
          approveTaskId,
          rejectTaskId
        )
      );

      return "done";
    },

    async getCompanyRegistrationData(requestTitle, companyRegTaskIds) {
      // company cases

      var companyRegDetailTask = companyRegTaskIds.find((item) =>
        item.title.includes("Detail žiadosti")
      );

      var companyApproveTask = companyRegTaskIds.find((item) =>
        item.title.includes("Schválenie")
      );

      var companyRejectTask = companyRegTaskIds.find((item) =>
        item.title.includes("Zamietnutie")
      );

      if (!companyRegDetailTask) return "failure";

      var taskData = await this.GetDataByTask(
        this.user.token,
        companyRegDetailTask.taskId
      );
      var companyRegDataGroups = taskData.data._embedded.dataGroups;

      this.companyRequests.push(
        ResponseParser.parseCompanyRequest(
          companyRegDataGroups[0].fields._embedded,
          requestTitle,
          companyApproveTask ? companyApproveTask.taskId : "",
          companyRejectTask ? companyRejectTask.taskId : ""
        )
      );
      return "done";
    },

    /***************** company *****************/

    async companyActions() {
      // Case firmy
      var companyCase = this.allCases.filter((_case) => {
        return (
          _case.processIdentifier == this.user.groupId + "_company" &&
          _case.title == this.user.email.email + "_company"
        );
      })[0];

      if (!companyCase) {
        console.log("nenasiel sa taky Case firmy");
        return "failure";
      }

      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        companyCase.stringId
      );

      var companyTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];

      for (var i in companyTasks) {
        this.companyTaskIds.push({
          title: companyTasks[i].title,
          taskId: companyTasks[i].stringId,
        });
      }

      await this.getCompanyData();

      await this.getBranchList();

      this.productDataList = await this.getProductList();

      this.addBranchTaskId = this.companyTaskIds.find((item) =>
        item.title.includes("Pridať pobočku")
      ).taskId;

      this.addProductTaskId = this.companyTaskIds.find((item) =>
        item.title.includes("Pridať produkt")
      ).taskId;

      this.uploadFileTaskId = this.companyTaskIds.find((item) =>
        item.title.includes("Importovať produkty")
      ).taskId;

      this.userName = this.companyData.company.company_name;
      this.imageURL =
        this.companyData.company.picture != ""
          ? this.companyData.company.picture
          : "https://via.placeholder.com/250";

      return "done";
    },

    async getCompanyData() {
      /*********************** view, edit info task **********************/

      this.companyAccountEditId = this.companyTaskIds.find((item) =>
        item.title.includes("Upraviť informácie")
      ).taskId;

      if (this.companyAccountEditId) {
        var taskData = await this.GetDataByTask(
          this.user.token,
          this.companyAccountEditId
        );

        var companyDataGroups = taskData.data._embedded.dataGroups;

        this.companyData.company = await ResponseParser.parseCompanyInfo(
          this.user.token,
          this.companyAccountEditId,
          companyDataGroups[0].fields._embedded
        );

        this.companyData.address = ResponseParser.parseAddress(
          companyDataGroups[1].fields._embedded.localisedTextFields
        );

        /*********************** branch list **********************/
      } else {
        console.log("nenasiel sa editovaci task firmy");
      }
      return "done";
    },

    async getBranchList() {
      var branchListTask = this.companyTaskIds.find((item) =>
        item.title.includes("Zobraziť zoznam pobočiek")
      );
      if (!branchListTask) {
        console.log("nenasiel sa task Zobraziť zoznam pobočiek");
        return "failure";
      }

      this.branchListTaskId = branchListTask.taskId;

      var taskData = await this.GetDataByTask(
        this.user.token,
        this.branchListTaskId
      );

      this.branchDataList = await ResponseParser.getBranchesFromEnumMap(
        this.user.token,
        taskData.data._embedded.dataGroups
      );

      return "done";
    },

    async getProductList() {
      var productListTask = this.companyTaskIds.find((item) =>
        item.title.includes("Zobraziť zoznam produktov")
      );

      if (!productListTask) {
        console.log("nenasiel sa task Zobraziť zoznam produktov");
        return "failure";
      }

      this.productListTaskId = productListTask.taskId;

      var taskData = await this.GetDataByTask(
        this.user.token,
        this.productListTaskId
      );

      if (taskData)
        return await ResponseParser.getProductsFromEnumMap(
          this.user.token,
          taskData.data._embedded.dataGroups
        );
    },

    /*******************************************************/
  },
};
</script>

<style scoped lang="scss">
.profile-menu {
  background-color: transparent;
  color: white;
  // height: calc(100vh - 80px - 4em - 7.5em);
  padding-left: 2rem;
  padding-right: 2rem;
  height: 100%;
}

.slide {
  background-color: white;
  height: 100%;
  border-radius: 6px;
}
@media (min-width: 767px) {
}
</style>
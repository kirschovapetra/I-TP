<template>
  <div class="home">
    <div>
      <Navigation />

      <b-container>
        <b-row>
          <b-col md="4" lg="3">
            <categorySideBar />
          </b-col>

          <b-col md="8" lg="9">
            <b-row>
              <b-col xl="6" v-for="(value, category) in topCategories" :key="category">
                <h1>{{ value.title }}</h1>
                <ProductsLine :products="value.products" :isLoading="value.isLoading"/>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>

import Navigation from "@/containers/general/Navigation.vue";
import categorySideBar from "@/components/ItemCategory/SideBar.vue";
import ProductsLine from "@/containers/ProductsLine.vue";
import ResponseParser from "@/HelperObjects/ResponseParser";


export default {
  name: "Home",
  components: {
    Navigation,
    categorySideBar,
    ProductsLine,
  },
  data() {
    return {
      isModalVisible: false,
      user: null,
      filterTask: null,
      topCategories: {
        top_products: {
          title: "Najlepšie hodnotené",
          products: [],
          isLoading: true,
        },
        most_selled: {
          title: "Najpredávanejšie",
          products: [],
          isLoading: true,
        },
      },
    };
  },

  computed: {

  },

  methods: {
    initProducts() {
      if (sessionStorage.getItem("top_products")) {
        const productCache =  JSON.parse(sessionStorage.getItem("top_products"));

        for (const topCategory in this.topCategories) {
          this.topCategories[topCategory].products = productCache[topCategory].products;
          this.topCategories[topCategory].isLoading = false;
        }
      }
    },

    async filterProducts() {
      if (this.filterTask === null) {
        console.log("nedaju sa dotiahnut produkty: filterTask je null");
        this.filterTask = await this.getFilterTask();
      }

      if (this.user === null) {
        console.log("nedaju sa dotiahnut produkty: user je null");
        return;
      }

      await this.AssignTask(this.user.token, this.filterTask.stringId);
      let response = await this.GetDataByTask(this.user.token, this.filterTask.stringId);
      let dataGroups = response.data._embedded.dataGroups;

      for (const topCategory in this.topCategories) {
        this.topCategories[topCategory].products = await ResponseParser.getProductsFromEnumMap(
            this.user.token,
            dataGroups
        )

        this.topCategories[topCategory].isLoading = false;

        dataGroups[0].fields._embedded.localisedEnumerationMapFields = dataGroups[0].fields._embedded.localisedEnumerationMapFields.slice(1);

        sessionStorage.setItem("top_products", JSON.stringify(this.topCategories));
      }
    },

    async getFilterTask() {
      /************ copy pasta <3 the best kind of pasta ***********/
      const allCases = await JSON.parse(sessionStorage.getItem("activeTasks"));

      const clientCase = allCases.filter((_case) => {
        return (
            _case.processIdentifier === this.user.groupId + "_klient" &&
            _case.title === this.user.email.email + "_klient"
        );
      })[0];

      if (!clientCase) {
        console.log("nenasiel sa taky klientsky case");
        return null;
      }

      const tasks = await this.GetTasksByCaseId(
          this.user.token,
          clientCase.stringId
      );
      const clientTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];

      for (let task of clientTasks) {
        //fancyboiiiz
        if (task.transitionId == 86) {
          return task;
        }
      }

      console.log("filterTask sa nenasiel");
      return null;
    },
  },

  async created() {
    this.initProducts();
    this.user = await JSON.parse(sessionStorage.getItem("user"));
    this.filterTask = await this.getFilterTask();
    await this.filterProducts();
  },
};
</script>

<style scoped lang="css">
</style>

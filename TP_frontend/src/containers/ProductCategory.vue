<template>
  <div>
    <Navigation />
    <b-container>
      <b-row>
        <b-col class="category-sidebar" md="4" lg="3">
          <categorySideBar
            :category="category"
            style="position: sticky; top: 1rem"
          />
        </b-col>
        <b-col class="items" md="8" lg="9">
          <b-row
              v-if="isLoadingProducts"
              class="spinner-container"
          >
            <b-spinner
                label="Načítavam produkty"
                class="spinner m-auto"
            ></b-spinner>
          </b-row>
          <b-row v-if="!isLoadingProducts">
            <b-col
              class="product-col"
              v-for="(product, key, index) in filteredList"
              :key="index"
            >
              <ProductCard
                @product-click="redirectToProduct"
                :name="product.prod_name"
                :caseId="product.caseId"
                :price="product.price_dph"
                :imgURL="product.picture"
                :description="product.description"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from "@/containers/general/Navigation.vue";
import categorySideBar from "@/components/ItemCategory/SideBar.vue";
import ProductCard from "@/components/product/ProductCard.vue";
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "ProductCategory",
  components: {
    ProductCard,
    Navigation,
    categorySideBar,
  },
  data() {
    return {
      isLoadingProducts: true,
      category: this.$route.params.category,
      filteredList: [],
      filterTask: null,
      user: null,
      products: this.initProducts(),
    };
  },

  watch: {
    async $route(to) {
      this.category = to.params.category;
      await this.filterProducts();
    },
  },

  methods: {
    initProducts() {
      if (sessionStorage.getItem("products")) {
        return JSON.parse(sessionStorage.getItem("products"));
      }

      return {};
    },

    async filterProducts() {
      this.isLoadingProducts = true;

      if (this.products[this.category] !== undefined) {
        console.log("loading cached");
        this.filteredList = this.products[this.category];

        this.isLoadingProducts = false;
      }

      // aj keby to bolo cachnute, tak nech sa znova dotiahne na pozadi
      console.log("fetching");
      if (this.filterTask === null) {
        console.log("nedaju sa dotiahnut produkty: filterTask je null");
        this.filterTask = await this.getFilterTask();
      }

      if (this.user === null) {
        console.log("nedaju sa dotiahnut produkty: user je null");
        return;
      }

      await this.AssignTask(this.user.token, this.filterTask.stringId);

      const payload = { filter_category: { type: "text", value: this.category } };
      await this.EditDataByTask(this.user.token, this.filterTask.stringId, payload);

      const response = await this.GetDataByTask(this.user.token, this.filterTask.stringId);

      const filteredList = await ResponseParser.getProductsFromEnumMap(
          this.user.token,
          response.data._embedded.dataGroups
      )
      console.log(filteredList);

      if (filteredList.length > 0) {
        // precitaj z neho kategoriu
        const category = filteredList[0].category_type;
        this.products[category] = filteredList;

        if (category === this.category) {
          this.filteredList = filteredList;
        }
      }
      else {
        // pridaj do this.category
        this.products[this.category] = filteredList;
        this.filteredList = filteredList;
      }

      sessionStorage.setItem("products", JSON.stringify(this.products));

      this.isLoadingProducts = false;
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
        if (task.transitionId == 82) {
          return task;
        }
      }

      console.log("filterTask sa nenasiel");
      return null;
    },

    redirectToProduct(value) {
      return this.$router.push({
        name: "Product",
        params: {
          caseId: value
        },
      });
    },

  },

  async created() {
    this.user = await JSON.parse(sessionStorage.getItem("user"));
    this.filterTask = await this.getFilterTask();
    await this.filterProducts();
  },
};
</script>

<style scoped lang="css">
.product-col {
  border-color: transparent;
  margin: 1rem;
  margin-top: 0;
  margin-bottom: 2rem;
  border-radius: 6px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  min-width: 20rem;
  max-width: 20rem;
  padding: 0;
}

.spinner-container {
  height: 100%;
  width: 100%;
}

.spinner {
  height: 10rem;
  width: 10rem;
  color: #178ca4d4;
}
</style>

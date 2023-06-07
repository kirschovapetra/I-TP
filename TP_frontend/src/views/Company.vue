<template>
  <div class="home view-bg">
    <Navigation />
    <b-container class="profile">
      <b-row>
        <b-col
          md="4"
          lg="3"
          class="profile-menu"
          v-if="companyData != undefined"
        >
          <CompanyMenu
            @selected="changeView"
            :companyName="companyData.company.company_name"
            :imageURL="companyData.company.picture"
          />
        </b-col>
        <b-col md="8" lg="9">
          <div
            class="slide shadow"
            v-if="view == 'Info' && companyData != undefined"
          >
            <CompanyInfoReadonly :companyData="companyData" :caseId="this.$route.params.caseId"/>

            <h3 class="mt-1 profile-h3">Pobočky</h3>

            <b-row class="px-5 pb-5 d*flex justify-content-center">
              <b-col
                v-for="(branch, i) in branchDataList"
                :key="i"
                class="mx-2 col-5"
              >
                <BranchCardReadonly :branchData="branch" />
              </b-col>
            </b-row>
          </div>

          <div class="slide shadow pb-5" v-if="view == 'Products'">
            <b-row class="d-flex justify-content-center py-5">
              <h3 class="mt-5 profile-h3">Produkty</h3>
            </b-row>
            <b-row class="py-4 mx-1">
              <b-col class="d-flex justify-content-start">
                <b-form-select
                  id="company-filter"
                  class="text-secondary col-sm-6 ml-5"
                  v-model="filter"
                  :options="filterOptions"
                  @change="filterList()"
                >
                </b-form-select>
              </b-col>
              <b-col class="d-flex justify-content-end">
                <b-input-group style="width: 70%" class="mr-5">
                  <template #append>
                    <b-input-group-text>
                      <b-icon class="text-info" icon="search"></b-icon>
                    </b-input-group-text>
                  </template>
                  <b-form-input
                    placeholder="Search"
                    type="search"
                    v-model="searchString"
                    @input="search()"
                  ></b-form-input>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="p-2 px-5">
              <b-col v-for="(product, id) in filteredList" :key="id" lg="4">
                <ProfileProductCard :product="product" />
              </b-col>
            </b-row>
            <b-row
              class="p-4 font11 d-flex justify-content-center"
              v-if="filteredList.length == 0"
            >
              Nenašli sa žiadne výsledky
            </b-row>
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
import CompanyMenu from "@/containers/company/CompanyMenu.vue";
import CompanyInfoReadonly from "@/containers/company/CompanyInfoReadonly.vue";
import BranchCardReadonly from "@/components/Branch/BranchCardReadonly.vue";
import ProfileProductCard from "@/components/product/ProfileProductCard.vue";
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "Company",
  components: {
    CompanyMenu,
    CompanyInfoReadonly,
    BranchCardReadonly,
    ProfileProductCard,
    Navigation,
    Footer,
  },
  data() {
    return {
      allCases: JSON.parse(sessionStorage.getItem("activeTasks")),
      user: JSON.parse(sessionStorage.getItem("user")),
      view: "Info",
      caseId: this.$route.params.caseId,
      companyData: { address: {}, company: {}, caseId: "" },
      productList: [],
      branchDataList: [],
      searchString: "",
      filteredList: [],
      filter: "Zvoľte kategóriu",
      filterOptions: [
        "Zvoľte kategóriu",
        "Elektronika",
        "Biela technika",
        "Dom a záhrada",
        "Chovateľstvo",
        "Detský tovar",
        "Knihy, filmy, hry",
        "Potraviny",
        "Kozmetika a zdravie",
        "Oblečenie",
        "Šport",
        "Nábytok",
      ],
    };
  },
  async created() {
    this.companyData = await ResponseParser.getCompanyData(
      this.user.token,
      this.caseId
    );

    this.branchDataList = await this.getBranchList();
    this.productList = await this.getProductList();
    this.filteredList = this.productList;
  },
  methods: {
    async getBranchList() {
      var tasks = await this.GetTasksByCaseId(this.user.token, this.caseId);
      if (!tasks || !tasks.data._embedded) return "failure";

      var branchListTask = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Zobraziť zoznam pobočiek");
      })[0];

      if (!branchListTask) {
        console.log("nenasiel sa task Zobraziť zoznam pobočiek");
        return "failure";
      }

      var taskData = await this.GetDataByTask(
        this.user.token,
        branchListTask.stringId
      );

      return await ResponseParser.getBranchesFromEnumMap(
        this.user.token,
        taskData.data._embedded.dataGroups
      );
    },

    async getProductList() {
      var tasks = await this.GetTasksByCaseId(this.user.token, this.caseId);
      if (!tasks || !tasks.data._embedded) return "failure";

      var productListTask = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Zobraziť zoznam produktov");
      })[0];

      if (!productListTask) {
        console.log("nenasiel sa task Zobraziť zoznam produktov");
        return "failure";
      }
      var taskData = await this.GetDataByTask(
        this.user.token,
        productListTask.stringId
      );

      if (taskData)
        this.productList = await ResponseParser.getProductsFromEnumMap(
          this.user.token,
          taskData.data._embedded.dataGroups
        );
      
      return this.productList;
    },
    changeView(value) {
      this.view = value;
    },
    search() {
      this.filteredList = this.productList.filter((product) => {
        return product.prod_name
          .toLowerCase()
          .includes(this.searchString.toLowerCase());
      });
      if (this.searchString == "") {
        this.filteredList = this.productList;
      }
    },
    filterList() {
      this.filteredList = this.productList.filter((product) => {
        return this.filter == "Zvoľte kategóriu"
          ? this.productList
          : product.category_type
              .toLowerCase()
              .includes(this.filter.toLowerCase());
      });
    },
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
.accordion {
  width: 80%;
  margin: auto;
  padding-bottom: 10%;
}
</style>
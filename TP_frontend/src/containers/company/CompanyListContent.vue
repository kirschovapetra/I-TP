<template>
  <b-container class="p-4 bg-white shadow">
    <b-row class="p-2 py-4">
      <b-col class="text-left"><h2>Firmy</h2></b-col>
      <b-col>
        <b-form inline class="mt-1 d-flex justify-content-end">
          <b-input-group style="width: 70%" class="mr-2 px-4">
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
        </b-form>
      </b-col>
    </b-row>
    <b-row class="p-2">
      <b-col v-for="(company, id) in filteredList" :key="id" lg="4">
        <CompanyCard :companyData="company" />
      </b-col>
    </b-row>
    <b-row class="p-4 font12" v-if="filteredList.length == 0">
      Nenašli sa žiadne výsledky
    </b-row>
  </b-container>
</template>

<script>
import CompanyCard from "@/components/company/CompanyCard.vue";
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  components: {
    CompanyCard,
  },
  data() {
    return {
      allCases: JSON.parse(sessionStorage.getItem("activeTasks")),
      user: JSON.parse(sessionStorage.getItem("user")),
      searchString: "",
      companyDataList: [],
      filteredList: [],
    };
  },
  async mounted() {

    await this.getAllCompanies();
    this.filteredList = this.companyDataList;
  },
  methods: {
    search() {
      var temp = [];
      for (var item in this.companyDataList) {
        temp.push(this.companyDataList[item]);
      }

      this.filteredList = temp.filter((companyData) => {
        return companyData.company.company_name
          .toLowerCase()
          .includes(this.searchString.toLowerCase());
      });
      if (this.searchString == "") {
        this.filteredList = this.companyDataList;
      }
    },
    async getAllCompanies() {
      var companyCases = this.allCases.filter((_case) => {
        return _case.processIdentifier == this.user.groupId + "_company";
      });


      this.companyDataList = [];

      if (!companyCases) {
        return "failure";
      }

      for (var j in companyCases) {
        var compData = await ResponseParser.getCompanyData(
          this.user.token,
          companyCases[j].stringId
        );
        if (!compData) continue;
        this.companyDataList.push(compData);
      }
      return "done";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
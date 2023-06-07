<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">Obľúbené firmy</h3>
    </b-row>
    <b-row class="p-2 px-5" v-if="items.length > 0">
      <b-col v-for="(item, id) in items" :key="id" lg="4">
        <CompanyCard :companyData="item.company" />
      </b-col>
    </b-row>
    <b-row v-else class="font12 text-info d-flex justify-content-center">
      V zozname obľúbených nemáte žiadne firmy.
    </b-row>
  </b-container>
</template>


<script>
import CompanyCard from "@/components/company/CompanyCard.vue";
export default {
  name: "FavoriteCompanies",
  components: {
    CompanyCard,
  },
  mounted() {
    let favoriteCompanies = sessionStorage.getItem("favoriteCompanies")
      ? JSON.parse(sessionStorage.getItem("favoriteCompanies"))
      : {};

    for (var company in favoriteCompanies) {
      this.items.push(favoriteCompanies[company]);
    }
  },
  data() {
    return {
      items: [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
<template>
  <div class="view-bg">
    <Navigation />
    <div class="company-list"><CompanyListContent /></div>
    <div class="card-footer"><Footer /></div>
  </div>
</template>

<script>
import CompanyListContent from "@/containers/company/CompanyListContent.vue";
import Navigation from "@/containers/general/Navigation.vue";
import Footer from "@/containers/general/Footer.vue";

export default {
  name: "CompanyList",
  components: {
    CompanyListContent,
    Navigation,
    Footer,
  },
};
</script>

<style scoped lang="css">
</style>

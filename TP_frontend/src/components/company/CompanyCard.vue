<template>
  <b-card
    no-body
    class="overflow-hidden mb-2 shadow-sm py-2"
    border-variant="light"
  >
    <b-row no-gutters>
      
      <b-col md="4" class="d-flex align-items-center justify-content-center">
        <b-card-img :src="companyData.company.picture" style="width: 75%"></b-card-img>
      </b-col>
      <b-col md="8">
        <b-card-body no-body>
          <a
            @click="showCompanyProfile(companyData.caseId)"
            class="text-info company-link"
          >
            <h4>{{ companyData.company.company_name }}</h4>
          </a>
          <b-card-text> {{ companyData.company.company_type }} </b-card-text>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  props: {
    companyData: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.company-link {
  cursor: pointer;
}
</style>
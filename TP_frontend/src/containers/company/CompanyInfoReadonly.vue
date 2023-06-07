<template>
  <b-container>
    <b-row class="d-flex justify-content-end">
      <b-icon
        :icon="favorited ? 'heart-fill' : 'heart'"
        variant="info"
        font-scale="2.5"
        class="mr-5 mt-5"
        @click="addToFavorites"
      ></b-icon>
    </b-row>
    <b-row class="d-flex justify-content-center py-4">
      <h3 class="profile-h3">Informácie o firme</h3>
    </b-row>

    <b-row class="d-flex justify-content-center mb-5">
      <b-col md="4" class="p-3 card-borders card-shadow bg-light mx-3">
        <b-row class="d-flex justify-content-center">
          <h4 class="ml-5 text-info">
            <b> {{ companyData.company.company_name }}</b>
          </h4>
        </b-row>
        <b-row>
          <b-col md="2">
            <b-icon icon="info-circle-fill" scale="2" variant="info"></b-icon>
          </b-col>
          <b-col class="font11">
            {{ companyData.company.company_type }} <br />
            <b>IČO:</b> {{ companyData.company.ico }} <br />
            <b>DIČ:</b> {{ companyData.company.dic }}
          </b-col>
        </b-row>
      </b-col>

      <b-col md="4" class="p-3 card-borders card-shadow bg-light mx-3">
        <b-row class="d-flex justify-content-center">
          <h4 class="ml-5 text-info">
            <b>Adresa</b>
          </h4>
        </b-row>
        <b-row>
          <b-col md="2">
            <b-icon icon="building" scale="2" variant="info"></b-icon>
          </b-col>
          <b-col class="font12">
            <b
              >{{ companyData.address.street }}
              {{ companyData.address.street_number }}
            </b>
            <br />
            {{ companyData.address.city }} {{ companyData.address.postal_code }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "CompanyInfoReadonly",
  props: {
    companyData: { type: Object },
    caseId: { type: String },
  },
  data() {
    return {
      favoriteCompanies: {},
      favorited: false,
    };
  },

  mounted() {
    this.favoriteCompanies = sessionStorage.getItem("favoriteCompanies")
      ? JSON.parse(sessionStorage.getItem("favoriteCompanies"))
      : {};

    this.favorited = this.favoriteCompanies[this.$props.caseId] != null;
  },
  methods: {
    addToFavorites() {
      this.favoriteCompanies = sessionStorage.getItem("favoriteCompanies")
        ? JSON.parse(sessionStorage.getItem("favoriteCompanies"))
        : {};

      if (this.favorited) {
        delete this.favoriteCompanies[this.$props.caseId];
        this.favorited = false;
      } else {
        this.favoriteCompanies[this.$props.caseId] = {
          company: this.$props.companyData,
        };
        this.favorited = true;
      }

      if (Object.keys(this.favoriteCompanies).length === 0) {
        sessionStorage.removeItem("favoriteCompanies");
      } else {
        sessionStorage.setItem(
          "favoriteCompanies",
          JSON.stringify(this.favoriteCompanies)
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
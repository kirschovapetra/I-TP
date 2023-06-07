<!-- 
  Parameters: na BE oddelene ciarkou, na FE v odrazkach
-->

<template>
  <div class="view-bg">
    <Navigation :trigger="trigger" />
    <div class="breadcrumbs"><Breadcrumbs :links="breadcrumbs" /></div>
    <div class="product-detail">
      <ProductDetail
        :productData="productData"
        @updateItemsCount="updateItemsCount"
        :caseId="this.$route.params.caseId"
      />
    </div>
    <div class="product-review">
      <ProductReview
        :reviewList="reviewList"
        :addReviewTaskId="addReviewTaskId"
        @reload="reload"
      />
    </div>
    <div class="card-footer"><Footer /></div>
  </div>
</template>

<script>
import ProductDetail from "@/containers/product/ProductDetail.vue";
import ProductReview from "@/containers/product/ProductReview.vue";
import Breadcrumbs from "@/containers/general/Breadcrumbs.vue";
import Navigation from "@/containers/general/Navigation.vue";
import Footer from "@/containers/general/Footer.vue";
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "Product",
  components: {
    ProductDetail,
    ProductReview,
    Breadcrumbs,
    Navigation,
    Footer,
  },
  data() {
    return {
      caseId: this.$route.params.caseId,
      user: JSON.parse(sessionStorage.getItem("user")),
      allCases: JSON.parse(sessionStorage.getItem("activeTasks")),
      productData: {},
      trigger: 0,
      reviewTrigger: 0,
      breadcrumbs: [],
      reviewList: [],
      addReviewTaskId: "",
    };
  },
  async created() {
    console.log("product created");
    this.productData = await this.getProductData();
    this.breadcrumbs = [
      { title: "Domov", url: "/" },
      {
        title: "Kategória",
        url: "/" + this.productData.category_type,
      },
      { title: "Názov produktu", url: this.$route.path },
    ];
  },
  methods: {
    updateItemsCount() {
      this.trigger++;
    },

    async getReviewData() {},

    async getProductData() {
      var tasks = await this.GetTasksByCaseId(this.user.token, this.caseId);
      if (!tasks || !tasks.data._embedded) return {};

      var productEdit = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Upravenie");
      })[0];

      if (!productEdit) {
        console.log("nenasiel sa edit task produktu");
        return {};
      }

      var addReview = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Pridať hodnotenie");
      })[0];
      this.addReviewTaskId = addReview.stringId;

      var viewReview = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Zobraziť hodnotenie");
      })[0];

      // list hodnoteni
      var reviewData = await this.GetDataByTask(
        this.user.token,
        viewReview.stringId
      );
      this.reviewList = this.getReviewList(
        reviewData.data._embedded.dataGroups
      );

      var data = await this.GetDataByTask(
        this.user.token,
        productEdit.stringId
      );

      var usefulDataGroups = data.data._embedded.dataGroups.filter((group) => {
        return group.fields._embedded != null;
      });
      return await ResponseParser.parseProductData(
        0,
        this.user.token,
        this.caseId,
        usefulDataGroups[0],
        productEdit.stringId,
        ''
      );
    },
    getReviewList(dataGroups) {
      var arr = [];
      for (var i = 1; i < dataGroups.length; i++) {
        arr.push(this.parseReview(dataGroups[i].fields._embedded));
      }
      return arr;
    },
    parseReview(data) {
      var reviewer =
        data.localisedTextFields[0] && data.localisedTextFields[0].value
          ? data.localisedTextFields[0].value
          : "";
      var review_text =
        data.localisedTextFields[1] && data.localisedTextFields[1].value
          ? data.localisedTextFields[1].value
          : "";
      var review_title =
        data.localisedTextFields[2] && data.localisedTextFields[1].value
          ? data.localisedTextFields[2].value
          : "";
      var date =
        data.localisedDateFields[0] && data.localisedDateFields[0].value
          ? data.localisedDateFields[0].value
          : "";
      var stars =
        data.localisedEnumerationFields[0] &&
        data.localisedEnumerationFields[0].value
          ? data.localisedEnumerationFields[0].value
          : "";

      return {
        reviewer: reviewer,
        review_text: review_text,
        review_title,
        year: date[0],
        month: date[1],
        day: date[2],
        stars: stars.length,
      };
    },
    async reload() {
      this.productData = await this.getProductData();
      return "done";
    },
  },
};
</script>

<style scoped lang="css">
</style>

<template>
  <b-container class="bg-white pt-4 shadow">
    <b-row align-h="center" class="my-2">
      <b-col md="9" class="text-left">
        <div>
          <b-tabs active-nav-item-class="font-weight-bold" align="center" fill>
            <b-tab title="Recenzie" active title-link-class="review-tab">
              <ReviewList class="my-3" :reviewList="reviewList" />
            </b-tab>
            <b-tab title="Pridať recenziu" title-link-class="review-tab">
              <ReviewForm
                class="my-4"
                :addReviewTaskId="addReviewTaskId"
                @reload="reload"
              />
            </b-tab>
          </b-tabs>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ReviewList from "@/components/review/ReviewList.vue";
import ReviewForm from "@/components/review/ReviewForm.vue";

export default {
  name: "ProductReview",
  props: {
    reviewList: {
      type: Array,
    },
    addReviewTaskId: {
      type: String,
    },
  },
  components: {
    ReviewForm,
    ReviewList,
  },
  methods: {
    reload() {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
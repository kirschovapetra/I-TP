<template>
  <b-container class="px-5 py-2">
    <b-row v-if="review.review_title!=''"><h5>{{ review.review_title }}</h5></b-row>
    <b-row>{{ review.review_text }}</b-row>
    <b-row class="mt-4" style="margin-left: -4%">
      <b-col class="d-flex align-items-center">
        <b-form-rating
          :value="review.stars"
          fluid
          inline
          readonly
          no-border
          icon-empty="heart"
          icon-half="heart-half"
          icon-full="heart-fill"
          id="rating-inline"
          variant="info"
          size="sm"
        />
        <div class="font12">{{ review.reviewer }}</div>
      </b-col>
      <b-col class="d-flex justify-content-end align-items-center">
        <div class="font12">
          {{ review.day + "." + review.month + "." + review.year }}
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Review",
  props: {
    review: {
      type: Object
    },
  },
};
</script>

<style lang="scss" scoped>
#rating-inline {
  background-color: transparent;
}
#rating-inline:focus {
  border-color: inherit !important;
  box-shadow: inherit !important;
}
</style>
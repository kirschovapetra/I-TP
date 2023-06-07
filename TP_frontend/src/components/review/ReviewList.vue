<template>
  <b-container class="pb-5">
    <div>
      <div style="display: none">
        {{ (this.reviews = this.$props.reviewList) }}
      </div>
      <b-row align-h="center" class="mt-5">
        <h3>Hodnotenia zákazníkov</h3>
      </b-row>
      <div v-if="reviews.length > 0">
        <b-row align-h="center" class="percent text-info"
          >{{ (reviewAverage() / 5) * 100 }}%</b-row
        >
        <b-row align-h="center">
          <b-form-rating
            icon-empty="heart"
            icon-half="heart-half"
            icon-full="heart-fill"
            id="rating-all"
            variant="info"
            no-border
            size="lg"
            style="width: 25%"
            readonly
            :value="reviewAverage()"
          >
          </b-form-rating>
        </b-row>
      </div>

      <div class="font12 text-info text-center" v-else>
        Nenašli sa žiadne recenzie
      </div>
    </div>
    <hr />
    <div>
      <b-row>
        <b-form-select
          id="review-sorting"
          class="m-md-2 font12 text-secondary"
          size="lg"
          style="width: 20%"
          v-model="sorting"
          :options="sortingOptions"
        >
        </b-form-select>
      </b-row>
      <b-row
        class="review card-shadow mb-3 p-3 bg-light"
        v-for="(review, i) in sortedReviews()"
        :key="i"
      >
        <Review :review="review" />
      </b-row>
    </div>
  </b-container>
</template>

<script>
import Review from "@/components/review/Review.vue";
import moment from "moment";
import _ from "lodash";

export default {
  name: "ReviewList",
  props: {
    reviewList: { type: Array },
  },
  components: { Review },

  data() {
    return {
      sorting: "Najlepšie",
      sortingOptions: ["Najlepšie", "Najhoršie", "Najnovšie", "Najstaršie"],
      reviews: this.$props.reviewList,
    };
  },
  mounted() {
    this.reviews = this.$props.reviewList;
  },
  methods: {
    reviewAverage() {
      let sumAll = 0;
      this.reviews.forEach((review) => {
        sumAll += parseInt(review.stars);
      });
      return sumAll / this.reviews.length;
    },
    sortByDate(order) {
      return _.orderBy(
        this.reviews,
        function (o) {
          return new moment(o.date);
        },
        [order]
      );
    },
    sortByRating(order) {
      return _.orderBy(
        this.reviews,
        function (o) {
          return parseInt(o.stars);
        },
        [order]
      );
    },

    sortedReviews() {
      // asc = od najmensieho po najvacsie, desc = od najvacsieho po najmensie
      switch (this.sorting) {
        case "Najnovšie":
          return this.sortByDate("desc");
        case "Najstaršie":
          return this.sortByDate("asc");
        case "Najlepšie":
          return this.sortByRating("desc");
        case "Najhoršie":
          return this.sortByRating("asc");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.percent {
  font-size: 4em;
}

.review {
  border: 3px solid rgb(245, 245, 245);
  padding: 2%;
}

.custom-select {
  border: none;
  background-color: none;
  // box-shadow: inherit !important;
}

#rating-all:focus {
  border-color: inherit !important;
  box-shadow: inherit !important;
}
</style>
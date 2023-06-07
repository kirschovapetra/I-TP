<!-- credits to https://codepen.io/lukaszflorczak/pen/yrQyBj -->
<template>
  <b-container class="carousel-container p-5">
    <agile
      class="main-image mb-3"
      ref="main"
      :options="optionsMain"
      :as-nav-for="asNavForMain"
    >
      <img
        class="slide-main"
        v-for="(slide, index) in images"
        :key="index"
        @click="mainIndex = index"
        :src="slide"
      />
    </agile>

    <div style="padding: 0 10%">
      <agile
        class="thumbnails"
        ref="thumbnails"
        :options="optionsThumbnails"
        :as-nav-for="asNavForThumbnails"
      >
        <img
          class="slide-thumbnail px-1"
          v-for="(slide, index) in images"
          :key="index"
          @click="$refs.thumbnails.goTo(index)"
          :src="slide"
        />
        <span slot="prevButton"
          ><b-icon icon="chevron-left" scale="1.5" aria-hidden="true"></b-icon
        ></span>
        <span slot="nextButton"
          ><b-icon icon="chevron-right" scale="1.5" aria-hidden="true"></b-icon
        ></span>
      </agile>
    </div>

    <VueGallerySlideshow
      :images="images"
      :index="mainIndex"
      @close="mainIndex = null"
    />
  </b-container>
</template>

<script>
import { VueAgile } from "vue-agile";
import VueGallerySlideshow from "vue-gallery-slideshow";

export default {
  name: "Carousel",
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.asNavForMain.push(this.$refs.thumbnails);
    this.asNavForThumbnails.push(this.$refs.main);
  },
  components: {
    agile: VueAgile,
    VueGallerySlideshow,
  },

  data() {
    return {
      mainIndex: null,
      asNavForMain: [],
      asNavForThumbnails: [],
      optionsMain: {
        dots: false,
        fade: true,
        navButtons: false,
      },

      optionsThumbnails: {
        centerMode: true,
        dots: false,
        navButtons: true,
        slidesToShow: 3,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
img {
  cursor: pointer;
}
img:hover {
  opacity: 0.75;
}

.slide-main {
  height: 450px;
  width: 450px;
  object-fit: cover;
  padding: 0 2%;
}

.thumbnails {
  padding: 0 10%;
}

.slide-thumbnail {
  height: 100px;
  object-fit: cover;
  transition: opacity 0.3s;
}
</style>
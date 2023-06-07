<template>
  <div id="products-line">
    <b-carousel
      :ref="id"
      :id="id"
      v-model="slide"
      :interval="20000"
      :controls="!isLoading"
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333"
    >
      <div
          v-if="isLoading"
          class="spinner-container">
        <b-spinner
            label="Načítavam produkty"
            class="spinner m-auto"
        ></b-spinner>
      </div>
      <div v-if="!isLoading">
        <b-carousel-slide
            v-for="(value, key, index) in products"
            :key="index"
            :img-src="value.picture"
        >
          <a class="product-name-anchor" @click="showProduct(value.caseId)">{{
              value.prod_name
            }}</a>
          <p style="margin: 0">{{ value.price_dph }} €</p>
        </b-carousel-slide>
      </div>
    </b-carousel>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ProductsLine",
  props: {
    id: String,
    products: Array,
    isLoading: Boolean,
  },
  data() {
    return {
      slide: 0,
      sliding: null,
    };
  },
};
</script>

<style scoped lang="css">
#products-line {
  padding: 2rem;
  text-decoration: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.product-name-anchor {
  cursor: pointer;
  color: white;
  font-size: 32px;
}

.spinner-container {
  height: 45rem;
  width: 100%;

  display: flex;
  align-items: center;
}

.spinner {
  height: 8rem;
  width: 8rem;
  color: #ccc;
}

.spinner-border {
  border: 0.5rem solid #ccc;
  border-right-color: transparent;
}
</style>

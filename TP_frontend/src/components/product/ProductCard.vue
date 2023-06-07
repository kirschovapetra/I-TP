<template>
  <div id="products">
    <img :src="imgURL" />
    <div class="pt-3">
      <h2 @click="clickOnProduct">{{ name }}</h2>
      <div class="price">
        <p>{{ price }}€</p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ProductCard",
  props: {
    name: String,
    caseId: String,
    price: Number,
    imgURL: String,
    description: String,
  },
  methods: {
    clickOnProduct() {
      this.$emit("product-click", this.caseId);
    },
  },
};
</script>

<style scoped lang="css">
h2 {
  cursor: pointer;
}
img {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  height: 100%;
  width: 100%;
  max-height: 17rem;
  object-fit: cover !important;
}
h2:hover {
  text-decoration: underline;
}
#products {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 100%;
}
</style>
<template>
  <b-card
    no-body
    class="overflow-hidden mb-2 shadow-sm py-2"
    border-variant="light"
  >
    <b-row no-gutters class="d-flex align-items-center justify-content-center">
      <b-card-img :src="product.picture" style="width: 75%"></b-card-img>
      <b-card-body no-body>
        <b-link @click="showProduct(product.caseId)" class="text-info pointer">
          <h3>
            <u>{{ product.prod_name }}</u>
          </h3>
        </b-link>
        <b-card-text>
          <p>{{ product.description }}</p>
          <p class="text-info h4">
            <b> {{ product.price_dph }} €</b>
          </p>
          <p class="text-secondary h6">{{ product.price_no_dph }} €</p>
        </b-card-text>
      </b-card-body>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: "ProfileProductCard",
  props: {
    product: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
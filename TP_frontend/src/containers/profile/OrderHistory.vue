<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">História objednávok</h3>
    </b-row>
    <b-row v-if="orderDataList.length > 0">
      <div class="accordion" role="tablist">
        <OrderDetailsCard
          v-for="(order, i) in orderDataList"
          :key="i"
          :orderData="order"
        />
      </div>
    </b-row>
    <b-row v-else class="font12 text-info d-flex justify-content-center">
      Nenašli sa žiadne objednávky.
    </b-row>
  </b-container>
</template>

<script>
import OrderDetailsCard from "@/containers/order/OrderDetailsCard.vue";

export default {
  name: "OrderHistory",
  components: {
    OrderDetailsCard,
  },
  props: {
    orderDataList: { type: Array },
  },
};
</script>

<style lang="scss" scoped>
hr {
  width: 50%;
  margin: -3% auto 0 auto;
  background-color: rgb(188, 211, 238);
}
.accordion {
  width: 80%;
  margin: auto;
  padding-bottom: 10%;
}
</style>
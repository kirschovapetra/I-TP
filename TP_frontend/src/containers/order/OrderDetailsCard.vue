<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button
        block
        v-b-toggle="'accordion-' + orderJson.id"
        variant="light"
        class="text-left d-flex justify-content-between"
      >
        <div class="font12">{{ orderJson.title }}</div>
        <div><b-icon icon="caret-down-fill"></b-icon></div>
      </b-button>
    </b-card-header>
    <b-collapse
      :id="'accordion-' + orderJson.id"
      role="tabpanel"
      class="text-left"
    >
      <b-card-body class="card-body">
        <b-card-text>
          <OrderDetails :orderData="orderJson" />
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import OrderDetails from "@/containers/order/OrderDetails.vue";

export default {
  name: "OrderDetailsCard",
  components: {
    OrderDetails,
  },
  props: {
    orderData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderJson: this.$props.orderData,
    };
  },
};
</script>

<style lang="scss" scoped>
h5 {
  margin-bottom: 5%;
}
.card-body {
  padding: 2% 7% 5% 7%;
}
</style>
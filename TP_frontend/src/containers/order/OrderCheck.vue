<template>
  <b-container class="p-4">
    <b-row class="d-flex justify-content-center"><h3>Rekapitulácia</h3></b-row>
    <OrderDetails
      :orderData="orderData"
      class="px-4"
      style="width: 85%; margin: auto"
    />
  </b-container>
</template>

<script>
import OrderDetails from "@/containers/order/OrderDetails.vue";
export default {
  name: "OrderCheck",
  props: {
    delivery_address: { type: Object },
    billing_address: { type: Object },
    items: { type: Array },
    totalPriceVAT: { type: Number },
    totalPriceWithoutVAT: { type: Number },
  },
  components: {
    OrderDetails,
  },
  mounted() {
    this.parseProps();
  },
  data() {
    return {
      orderData: {
        price: 0.0,
        delivery_address: {},
        billing_address: {},
        contact: {},
        items: [],
      },
    };
  },
  methods: {
    parseProps() {

      this.orderData.price = this.$props.totalPriceVAT;

      this.orderData.delivery_address = {
        street: this.$props.delivery_address.street_name,
        street_number: this.$props.street_number,
        city: this.$props.city,
        postal_code: this.$props.postal_code,
      };
      this.orderData.billing_address = {
        street: this.$props.billing_address.street_name,
        street_number: this.$props.street_number,
        city: this.$props.city,
        postal_code: this.$props.postal_code,
      };
      this.orderData.contact = {
        first_name: this.$props.billing_address.first_name,
        last_name: this.$props.billing_address.last_name,
        phone_number: this.$props.billing_address.phone_number,
        email: this.$props.billing_address.email,
      };

      this.orderData.items = this.$props.items
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
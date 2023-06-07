<template>
  <div>
    <b-row class="mt-2">
      <div class="text-left font12" v-if="orderJson.status">
        <b>Stav:</b> {{ orderJson.status }} <br />
      </div>
      <div class="text-left font12" v-if="orderJson.delivery_date">
        <b>Dátum doručenia:</b> {{ orderJson.delivery_date }}
      </div>
    </b-row>
    <b-row class="mt-4 py-3">
      <OrderItem
        class="mb-1 w-100"
        v-for="(item, i) in orderJson.items"
        :key="i"
        :item="item"
      />
    </b-row>

    <b-row class="mt-4" align-h="end">
      <b-col md="5">
        <b-row class="text-info text-right font12">
          <b-col><b>Cena s DPH:</b></b-col>
          <b-col
            ><b>{{ orderJson.price.toFixed(2) }} €</b></b-col
          >
        </b-row>
        <b-row class="text-right text-secondary">
          <b-col>Cena bez DPH:</b-col>
          <b-col>{{ (orderJson.price / 1.2).toFixed(2) }} €</b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="mt-5" align-h="between">
      <b-col md="5" class="py-3 pl-5 card-borders card-shadow bg-light">
        <b-row class="d-flex justify-content-center">
          <h5><b>Fakturačná adresa</b></h5>
        </b-row>
        <b-row>
          <b-col md="2">
            <b-icon icon="house-door" scale="2" variant="info"> </b-icon>
          </b-col>
          <b-col>
            <b
              >{{ orderJson.contact.first_name }}
              {{ orderJson.contact.last_name }}</b
            >
            <br />
            {{ orderJson.billing_address.street }}
            {{ orderJson.billing_address.street_number }} <br />
            {{ orderJson.billing_address.postal_code }}
            {{ orderJson.billing_address.city }} <br />
            {{ orderJson.contact.email }} <br />
            {{ orderJson.contact.phone_number }}
          </b-col>
        </b-row>
      </b-col>

      <b-col md="5" class="py-3 pl-5 card-borders card-shadow bg-light">
        <b-row class="d-flex justify-content-center">
          <h5><b>Doručovacia adresa</b></h5>
        </b-row>
        <b-row>
          <b-col md="2"
            ><b-icon icon="truck" scale="2" variant="info"></b-icon
          ></b-col>
          <b-col>
            <b
              >{{ orderJson.contact.first_name }}
              {{ orderJson.contact.last_name }}</b
            >
            <br />
            {{ orderJson.delivery_address.street }}
            {{ orderJson.delivery_address.street_number }} <br />
            {{ orderJson.delivery_address.postal_code }}
            {{ orderJson.delivery_address.city }} <br />
            {{ orderJson.contact.email }} <br />
            {{ orderJson.contact.phone_number }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import OrderItem from "@/components/order/OrderItem.vue";

export default {
  name: "OrderDetails",
  components: {
    OrderItem,
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
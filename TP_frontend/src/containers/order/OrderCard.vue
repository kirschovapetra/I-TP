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
          <div v-if="orderJson.status != 'Doručená'">
            <b-row
              v-if="orderJson.status == 'Vytvorená'"
              class="d-flex justify-content-center font11 text-danger pt-5"
              >Objednávka sa momentálne nedá rezervovať</b-row
            >
            <b-row
              class="mt-5 d-flex justify-content-center"
              v-else-if="orderJson.status == 'Zaplatená'"
            >
              <b-button size="lg" variant="info" @click="book">
                Rezervovať
              </b-button>
            </b-row>
            <b-row class="mt-5 d-flex justify-content-center" v-else>
              <b-button size="lg" @click="cancel" :disabled="!toCancel">
                Zrušiť rezerváciu
              </b-button>
              <b-button
                size="lg"
                @click="stock"
                variant="info"
                :disabled="!toStock"
              >
                Naskladniť
              </b-button>
              <b-button
                size="lg"
                @click="takeOrder"
                variant="info"
                :disabled="!toTake"
              >
                Prevziať
              </b-button>
              <!-- <b-button
                size="lg"
                @click="returnOrder"
                variant="secondary"
                :disabled="!toReturn"
                v-if="this.orderJson.status == 'Prevzatá na doručenie'"
              >
                Vrátiť
              </b-button> -->
              <b-button
                size="lg"
                @click="deliver"
                variant="info"
                :disabled="!toDeliver"
              >
                Doručiť
              </b-button>
            </b-row>
          </div>
          <div v-else>
            <b-row class="d-flex justify-content-center font11 text-success pt-5"
              >Objednávka je doručená</b-row
            >
          </div>
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import OrderDetails from "@/containers/order/OrderDetails.vue";

export default {
  name: "OrderCard",
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
    return { orderJson: this.$props.orderData };
  },
  watch: {},
  computed: {
    toStock() {
      return (
        this.orderJson.status == "Rezervovaná kuriérom" &&
        this.orderJson.status != "Pripravená na doručenie" &&
        this.orderJson.status != "Prevzatá na doručenie" &&
        this.orderJson.status != "Doručená"
      );
    },
    toTake() {
      return (
        this.orderJson.status != "Rezervovaná kuriérom" &&
        this.orderJson.status == "Pripravená na doručenie" &&
        this.orderJson.status != "Prevzatá na doručenie" &&
        this.orderJson.status != "Doručená"
      );
    },
    toDeliver() {
      return (
        this.orderJson.status != "Rezervovaná kuriérom" &&
        this.orderJson.status != "Pripravená na doručenie" &&
        this.orderJson.status == "Prevzatá na doručenie" &&
        this.orderJson.status != "Doručená"
      );
    },
    // toReturn() {
    //   return (
    //     this.orderJson.status != "Rezervovaná kuriérom" &&
    //     this.orderJson.status != "Pripravená na doručenie" &&
    //     this.orderJson.status == "Prevzatá na doručenie" &&
    //     this.orderJson.status != "Doručená"
    //   );
    // },
    toCancel() {
      return (
        this.orderJson.status == "Rezervovaná kuriérom" &&
        this.orderJson.status != "Pripravená na doručenie" &&
        this.orderJson.status != "Prevzatá na doručenie" &&
        this.orderJson.status != "Doručená"
      );
    },
  },
  methods: {
    book() {
      this.orderJson.status = "Rezervovaná kuriérom";
      this.$emit("book"); // Rezervovaná kuriérom
    },
    cancel() {
      this.orderJson.status = "Zaplatená";
      this.$emit("cancel"); // Zaplatená
    },
    stock() {
      this.orderJson.status = "Pripravená na doručenie";
      this.$emit("stock"); // Pripravená na doručenie
    },
    takeOrder() {
      this.orderJson.status = "Prevzatá na doručenie";
      this.$emit("takeOrder"); // Prevzatá na doručenie
    },
    //  return() {
    //   this.$emit("return"); // Prevzatá na doručenie
    // },
    deliver() {
      this.orderJson.status = "Doručená";
      this.$emit("deliver"); // Doručená
    },
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

.btn {
  margin: 0 5px;
}
</style>
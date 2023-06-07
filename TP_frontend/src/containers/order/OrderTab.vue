<template>
  <b-container class="order-tab-container">
    <b-form @submit.prevent="check">
      <!-- ADDRESS -->
      <b-row :class="classListCenter">
        <b-col md="12" :class="classListColumn">
          <h5><b>Fakturačné údaje</b></h5>
          Povinné polia sú označené
          <b style="color: red" class="ml-2"> *</b> .
          <Address
            :addressType="'billing'"
            v-model="formData.billing_address"
          />
        </b-col>

        <br />

        <b-col md="12" :class="classListColumn">
          <h5><b>Dodacie údaje</b></h5>
          <b-form-checkbox v-model="addressIsEqual" class="font11">
            Adresa doručenia je rovnaká ako fakturačná adresa.
          </b-form-checkbox>
          <Address
            v-if="!addressIsEqual"
            :addressType="'delivery'"
            v-model="formData.delivery_address"
          />
        </b-col>
      </b-row>

      <b-row :class="classListCenter">
        <b-form-textarea
          class="shadow-sm"
          id="comment"
          rows="4"
          placeholder="Napíšte komentár k objednávke"
        ></b-form-textarea>
      </b-row>
      <b-row :class="classListBetween">
        <b-button
          variant="secondary"
          id="back-button"
          class="shadow-sm"
          @click="back"
        >
          Späť
        </b-button>

        <b-button
          variant="info"
          id="check-button"
          class="shadow-sm"
          type="submit"
        >
          Skontrolovať
        </b-button>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import Address from "@/components/order/OrderAddress.vue";

export default {
  name: "OrderTab",
  components: {
    Address,
  },
  props: {
    formDataProp: { type: Object, required: true },
  },
  data() {
    return {
      classListCenter: ["d-flex", "justify-content-center", "order-row"],
      classListBetween: ["d-flex", "justify-content-between", "order-row"],
      classListColumn: [
        "bg-light",
        "mx-3",
        "py-3",
        "round-border",
        "box-shadow",
      ],
      addressIsEqual: true,
      formData: {
        billing_address: {
          first_name: "",
          last_name: "",
          city: "",
          postal_code: "",
          street: "",
          street_number: "",
          phone_number: "",
          email: "",
        },
        delivery_address: {
          first_name: "",
          last_name: "",
          city: "",
          postal_code: "",
          street: "",
          street_number: "",
          phone_number: "",
          email: "",
        },
      },
    };
  },
  mounted() {
    this.formData = this.$props.formDataProp;
  },
  methods: {
    back() {
      this.$emit("back", this.formData);
    },
    check() {
      this.copyAddress();
      this.$emit("check", this.formData);
    },
    copyAddress() {
      if (this.addressIsEqual) {
        this.formData.delivery_address = this.formData.billing_address;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-tab-container {
  // position: absolute;
  // left: 180px;
  background-color: white;
  padding: 2% 4%;
}
.order-row {
  padding: 1%;
  margin-bottom: 1%;
}
.white {
  background-color: white;
}

.round-border {
  border-radius: 20px;
}

.box-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
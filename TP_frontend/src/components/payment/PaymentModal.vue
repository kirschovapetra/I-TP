<template>
  <b-container>
    <b-row class="d-flex justify-content-center mt-4"><h4>Platba</h4></b-row>
    <b-row class="d-flex justify-content-center font12 text-info"
      ><b class="mr-2">Cena: </b> {{ parseFloat(price).toFixed(2) }} €</b-row
    >
    <b-row class="d-flex justify-content-center">
      <b-form class="w-100 px-4 pb-4 pt-2" @submit="onSubmit">
        <b-form-group label-for="input-details">
          <template v-slot:label>
            <span class="text-danger">*</span> Číslo karty
          </template>
          <b-form-input
            id="input-num"
            type="text"
            placeholder="0000 0000 0000 0000"
            required
            v-model="paymentDetails.card_number"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group label-for="input-details">
          <div class="d-flex justify-content-between">
            <b-form-group label-for="input-cvc" style="width: 45%">
              <template v-slot:label>
                <span class="text-danger">*</span> CVC
              </template>
              <b-form-input
                id="input-cvc"
                type="text"
                placeholder="000"
                required
                v-model="paymentDetails.cvc"
              ></b-form-input>
            </b-form-group>
            <b-form-group label-for="input-expiration-date" style="width: 50%">
              <template v-slot:label>
                <span class="text-danger">*</span> Dátum platnosti karty
              </template>
              <b-form-input
                id="input-expiration-date"
                type="text"
                placeholder="01/21"
                required
                v-model="paymentDetails.expiration_date"
              ></b-form-input>
            </b-form-group>
          </div>
        </b-form-group>

        <div class="d-flex justify-content-end">
          <div class="w-25">
            <b-button
              class="btn btn-primary btn-block"
              type="submit"
              variant="info"
            >
              Zaplatiť
            </b-button>
          </div>
        </div>
      </b-form>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "PaymentModal",
  props: ["price"],
  data() {
    return {
      paymentDetails: {
        card_number: "",
        expiration_date: "",
        cvc: "",
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
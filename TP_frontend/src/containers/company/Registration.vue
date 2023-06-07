<template>
  <div class="d-flex justify-content-center align-self-center mt-5">
    <div class="d-flex justify-content-center col-sm-4 wrap-div p-4">
      <div class="col-sm-10 form-div" style="background-color: white">
        <div class="text-center">
          <div class="w-100 mb-2" style="height: 30px">
            <h3>Registrácia spoločnosti</h3>
          </div>
        </div>
        <b-form @submit="onSubmit" class="px-4 pb-4">
          <!-- Nazov  -->
          <b-form-group
            id="input-group-firstname"
            label="Názov spoločnosti"
            label-for="input-name"
          >
            <b-form-input
              id="input-name"
              type="text"
              v-model="form.name"
              placeholder="Názov spoločnosti"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Typ spoločnosti"
            label-for="input-3"
          >
            <b-form-select
              id="input-3"
              v-model="form.type"
              :options="types"
              required
            ></b-form-select>
          </b-form-group>

          <!-- ICO  -->
          <b-form-group
            id="input-group-ico"
            label="IČO"
            label-for="input-for-ico"
          >
            <b-form-input
              id="input-1"
              v-model="form.ico"
              type="number"
              placeholder="Zadajte IČO"
            ></b-form-input>
          </b-form-group>

          <!-- DIC  -->
          <b-form-group
            id="input-group-dic"
            label="DIČ"
            label-for="input-for-dic"
          >
            <b-form-input
              id="input-1"
              v-model="form.dic"
              type="number"
              placeholder="Zadajte DIČ"
            ></b-form-input>
          </b-form-group>

          <!-- Datum vzniku  -->
          <b-form-group
            id="input-group-formation-date"
            label="Dátum vzniku"
            label-for="input-for-formation-date"
          >
            <b-form-input
              id="input-1"
              v-model="form.formationDate"
              type="date"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-address"
            label="Adresa"
            label-for="input-address"
          >
            <div class="d-flex justify-content-between">
              <b-form-input
                id="input-street"
                type="text"
                placeholder="Ulica"
                required
                class="col-sm-5"
              >
              </b-form-input>

              <b-form-input
                id="input-street-number"
                type="text"
                placeholder="Súpisné číslo"
                class="col-sm-4"
              ></b-form-input>
            </div>

            <div class="d-flex justify-content-between mt-2">
              <b-form-input
                id="input-city"
                type="text"
                placeholder="Mesto"
                required
                class="col-sm-5"
              >
              </b-form-input>

              <b-form-input
                id="input-psc"
                type="number"
                placeholder="PSČ"
                class="col-sm-4"
                max="{5}"
              ></b-form-input>
            </div>
          </b-form-group>

          <div class="d-flex justify-content-end">
            <div class="w-25">
              <b-button
                class="btn btn-primary btn-block"
                type="submit"
                variant="primary"
                >Pridať</b-button
              >
            </div>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyRegistration",
  data() {
    return {
      form: {
        name: "",
        type: null,
        ico: "",
        dic: "",
        formationDate: null,
        adress: "",
      },
      types: [
        { text: "Spoločnosť s ručením obmedzením (s.r.o.)", value: null },
        "Verejná obchodná spoločnosť (v.o.s)",
        "Komanditná spoločnosť (k.s.o)",
        "Akciová spoločnosť (a.s.)",
        "Jednoduchá spoločnosť na akcie (j.s.a.)",
      ],
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
      //   this.$toasted.global.my_app_error();
    },
  },
};
</script>

<style scoped lang="css">
.wrap-div {
  background-color: #a3d7e6;
}

.form-div {
  border-radius: 10px;
}
/* Na ostranenie sipok z number inputov */
/* pre vsetko okrem firefoxu */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* pre firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
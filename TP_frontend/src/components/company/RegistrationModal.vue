<template>
  <div class="example-modal-center">
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
          v-model="form.company.company_name"
          :state="form.company.company_name != ''"
          placeholder="Názov spoločnosti"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Email  -->
      <b-form-group
        id="input-group-email"
        label="Email"
        label-for="input-for-email"
      >
        <b-form-input
          id="input-email"
          v-model="form.company.email"
          type="email"
          :disabled="true"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Heslo  -->
      <b-form-group
        id="input-group-password"
        label="Heslo"
        label-for="input-for-password"
      >
        <b-form-input
          id="input-password"
          v-model="form.company.password"
          type="password"
          placeholder="Zadajte heslo"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Typ spoločnosti"
        label-for="input-3"
      >
        <b-form-select
          id="input-3"
          v-model="form.company.company_type"
          :state="form.company.company_type != null"
          :options="types"
          required
        ></b-form-select>
      </b-form-group>

      <div class="d-flex justify-content-between">
        <!-- ICO  -->
        <b-form-group
          id="input-group-ico"
          label="IČO"
          label-for="input-for-ico"
        >
          <b-form-input
            id="input-for-ico"
            v-model="form.company.ico"
            :state="isICO(form.company.ico)"
            type="text"
            placeholder="00000000 (8 miestne)"
            required
          ></b-form-input>
        </b-form-group>

        <!-- DIC  -->
        <b-form-group
          id="input-group-dic"
          label="DIČ"
          label-for="input-for-dic"
        >
          <b-form-input
            id="input-for-dic"
            v-model="form.company.dic"
            :state="isDIC(form.company.dic)"
            type="text"
            placeholder="0000000000 (10 miestne)"
            required
          ></b-form-input>
        </b-form-group>
      </div>

      <!-- DIC  -->
      <div class="d-flex justify-content-between">
        <b-form-group
          id="input-group-dic"
          label="IČ DPH"
          label-for="input-for-ic_dph"
        >
          <b-form-input
            id="input-for-ic_dph"
            v-model="form.company.ic_dph"
            :state="isICDPH(form.company.ic_dph)"
            type="text"
            placeholder="SK0000000000"
            required
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
            v-model="form.company.registration_date"
            type="date"
            required
          ></b-form-input>
        </b-form-group>
      </div>

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
            v-model="form.address.street_name"
            :state="form.address.street_name != ''"
          >
          </b-form-input>

          <b-form-input
            id="input-street-number"
            type="text"
            placeholder="Súpisné číslo"
            class="col-sm-4"
            v-model="form.address.street_number"
            :state="form.address.street_number != ''"
            required
          ></b-form-input>
        </div>

        <div class="d-flex justify-content-between mt-2">
          <b-form-input
            id="input-city"
            type="text"
            placeholder="Mesto"
            required
            class="col-sm-5"
            v-model="form.address.city"
            :state="form.address.city != ''"
          >
          </b-form-input>

          <b-form-input
            id="input-psc"
            type="number"
            placeholder="00000"
            class="col-sm-4"
            max="{5}"
            v-model="form.address.postal_code"
            :state="isPostalCode(form.address.postal_code)"
            required
          ></b-form-input>
        </div>
      </b-form-group>

      <b-button class="btn btn-primary btn-block" type="submit" variant="info">
        Podať žiadosť
      </b-button>
    </b-form>
  </div>
</template>

<script>
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "CompanyRegistrationModal",
  data() {
    return {
      form: {
        company: {
          company_name: "",
          email: this.$props.email,
          password: "Heslo",
          company_type: null,
          ico: "",
          dic: "",
          ic_dph: "",
          registration_date: null,
        },
        registration_date: null,
        address: {
          street_name: "",
          street_number: "",
          city: "",
          postal_code: "",
        },
      },
      user: JSON.parse(sessionStorage.getItem("user")),
      choosenRole: this.$props.selectedRole,
      types: [
        { text: "Vyberte typ spoločnosti", value: null },
        "Spoločnosť s ručením obmedzeným (s.r.o.)",
        "Verejná obchodná spoločnosť (v.o.s.)",
        "Komanditná spoločnosť (k.s.)",
        "Akciová spoločnosť (a.s.)",
      ],
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();

      const createdCase = await this.CreateCase(
        this.user.token,
        this.form.company.email + this.choosenRole.suffix,
        this.choosenRole.netId
      );

      const tasksOfCase = await this.GetTasksOfCase(
        this.user.token,
        createdCase.data.stringId
      );

      const createTaskId = tasksOfCase.data._embedded.tasks[0].stringId;

      const asignedTask = await this.AssignTask(this.user.token, createTaskId);
      const adressTaskRef =
        asignedTask.data.changedFields.address_taskRef.value[0];

      let dataPayload = ResponseParser.formatTaskRefForm(
        this.form.address,
        adressTaskRef
      );

      await this.EditDataByTask(this.user.token, createTaskId, dataPayload);

      dataPayload = ResponseParser.formatNoTaskRefForm(this.form.company);
      await this.EditDataByTask(this.user.token, createTaskId, dataPayload);

      const finalResponse = await this.FinishTask(
        this.user.token,
        createTaskId
      );

      if (finalResponse.status === 200) {
        this.$modal.hideAll();
        this.$toasted.global.success({
          message: "Vaša žiadosť bola odoslaná",
        });
      } else {
        this.$toasted.global.error({
          message: "Došlo k chybe pri spracovaní žiadosti",
        });
      }
      //   this.$toasted.global.my_app_error();
    },
  },
  props: ["selectedRole", "email"],
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
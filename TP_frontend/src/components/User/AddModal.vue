<template>
  <div class="example-modal-center">
    <div class="text-center">
      <div class="w-100" style="height: 30px">
        <h3>Nový {{ choosenRole.title }}</h3>
      </div>
    </div>
    <b-form @submit="onSubmit" class="px-4 pb-4">
      <div v-if="choosenRole.roleId === 0">
        <b-form-group class="pr-3" label="Adresa" label-for="input-address">
          <div class="d-flex justify-content-between">
            <b-form-input
              id="input-street"
              type="text"
              placeholder="Ulica"
              class="col-6 mx-1"
              v-model="form.address.street_name"
              :state="form.address.street_name != ''"
              required
            >
            </b-form-input>

            <b-form-input
              id="input-street-number"
              type="text"
              placeholder="Súpisné číslo"
              class="col-6 mx-1"
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
              class="col-6 mx-1"
              v-model="form.address.city"
              :state="form.address.city != ''"
              required
            >
            </b-form-input>

            <b-form-input
              id="input-psc"
              type="text"
              placeholder="PSČ"
              class="col-6 mx-1"
              v-model="form.address.postal_code"
              :state="isPostalCode(form.address.postal_code)"
              required
            ></b-form-input>
          </div>
        </b-form-group>
      </div>
      <!-- Meno  -->
      <b-form-group
        id="input-group-first_name"
        label="Meno a priezvisko"
        label-for="input-name"
      >
        <div class="d-flex justify-content-between">
          <b-form-input
            id="input-first_name"
            type="text"
            v-model="form.contact.first_name"
            :state="form.contact.first_name != ''"
            placeholder="Meno"
            required
            class="col-sm-6"
          >
          </b-form-input>

          <b-form-input
            id="input-last_name"
            type="text"
            v-model="form.contact.last_name"
            placeholder="Priezvisko"
            :state="form.contact.last_name != ''"
            required
          ></b-form-input>
        </div>
      </b-form-group>

      <!-- tel. cislo  -->
      <b-form-group
        id="input-group-phoneNumber"
        label="Telefónne číslo"
        label-for="input-for-phoneNumber"
        description="Formát: +421"
      >
        <b-form-input
          id="input-1"
          v-model="form.contact.phone_number"
          :state="
            isPhoneNumber(form.contact.phone_number) &&
            form.contact.phone_number != ''
          "
          type="text"
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
          v-model="form.contact.email"
          type="email"
          :disabled="true"
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
          v-model="form.contact.password"
          type="password"
          placeholder="Zadajte heslo"
          required
        ></b-form-input>
      </b-form-group>

      <b-button
        class="btn btn-primary btn-block"
        type="submit"
        variant="info"
        >{{ submitButtonText }}</b-button
      >
    </b-form>
  </div>
</template>

<script>
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "addPerson",
  data() {
    return {
      form: {
        contact: {
          first_name: "",
          last_name: "",
          email: this.$props.email,
          phone_number: "",
          password: "Heslo",
        },
        address: {
          street_name: "",
          street_number: "",
          city: "",
          postal_code: "",
        },
      },
      choosenRole: this.$props.selectedRole,
      user: JSON.parse(sessionStorage.getItem("user")),
      submitButtonText:
        this.$props.selectedRole.roleId === 0 ? "Registrovať" : "Podať žiadosť",
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();

      const createdCase = await this.CreateCase(
        this.user.token,
        this.form.contact.email + this.choosenRole.suffix,
        this.choosenRole.netId
      );

      const tasksOfCase = await this.GetTasksOfCase(
        this.user.token,
        createdCase.data.stringId
      );

      const createTaskId = tasksOfCase.data._embedded.tasks[0].stringId;

      const asignedTask = await this.AssignTask(this.user.token, createTaskId);
      let formatedPayload;

      if (this.choosenRole.roleId === 0) {
        formatedPayload = ResponseParser.formatClientDataPayload(
          this.form,
          asignedTask
        );

        await this.EditDataByTask(
          this.user.token,
          createTaskId,
          formatedPayload.contact
        );

        await this.EditDataByTask(
          this.user.token,
          createTaskId,
          formatedPayload.address
        );
      } else {
        formatedPayload = ResponseParser.formatNoTaskRefForm(this.form.contact);

        await this.EditDataByTask(
          this.user.token,
          createTaskId,
          formatedPayload
        );
      }

      const finalResponse = await this.FinishTask(
        this.user.token,
        createTaskId
      );

      if (finalResponse.status === 200) {
        // klient
        if (this.choosenRole.roleId === 0) {
          this.$modal.hideAll();
          this.$toasted.global.success({
            message: "Registrácia prebehla úspešne",
          });
        } else {
          this.$modal.hideAll();
          this.$toasted.global.success({
            message: "Vaša žiadosť bola odoslaná",
          });
        }
      } else {
        this.$toasted.global.error({
          message: "Došlo k chybe pri spracovaní žiadosti",
        });
      }
    },
    setSessionAndLogin() {
      this.setSession();
      this.$modal.hideAll();
      this.$router.push("/profile");
    },
    setSession() {
      const user = {
        ...this.user,
        type: this.choosenRole.roleId,
        email: this.form.contact.email,
      };

      sessionStorage.setItem("user", JSON.stringify(user));
    },
  },

  props: ["selectedRole", "email"],
};
</script>

<style scoped lang="css">
</style>
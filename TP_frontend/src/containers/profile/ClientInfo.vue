<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">Informácie o používateľovi</h3>
    </b-row>
    <b-row
      class="d-flex justify-content-center text-info font11"
      v-if="!clientData || clientData.address == {} || clientData.contact == {}"
    >
      Nenašli sa žiadne údaje
    </b-row>
    <b-row class="d-flex justify-content-center" v-else>
      <b-form class="px-4 pb-4">
        <b-form-row class="px-3">
          <b-col md="6" class="px-3">
            <b-form-row class="d-flex justify-content-center">
              <h4>Kontaktné údaje</h4>
            </b-form-row>

            <b-form-group label-for="input-name">
              <template v-slot:label>
                <span class="text-danger" v-if="editView">*</span> Meno a
                priezvisko
              </template>
              <div class="d-flex justify-content-between">
                <b-form-input
                  id="input-firstname"
                  v-model="customer.contact.first_name"
                  placeholder="Meno"
                  required
                  class="mr-1"
                  :disabled="!editView"
                >
                </b-form-input>
                <b-form-input
                  id="input-lastname"
                  v-model="customer.contact.last_name"
                  placeholder="Priezvisko"
                  :disabled="!editView"
                  required
                ></b-form-input>
              </div>
            </b-form-group>

            <!-- tel. cislo  -->
            <b-form-group
              label-for="input-phoneNumber"
              description="Formát: +421"
            >
              <template v-slot:label>
                <span class="text-danger" v-if="editView">*</span> Telefónne
                číslo
              </template>
              <b-form-input
                id="input-phoneNumber"
                v-model="customer.contact.phone_number"
                placeholder="Enter phone number"
                :disabled="!editView"
              ></b-form-input>
            </b-form-group>

            <!-- Email  -->
            <b-form-group label-for="input-email">
              <template v-slot:label>
                <span class="text-danger" v-if="editView">*</span> Email
              </template>
              <b-form-input
                id="input-email"
                v-model="customer.contact.email"
                placeholder="Enter email"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="6" class="px-3">
            <b-form-row class="d-flex justify-content-center">
              <h4>Adresa</h4>
            </b-form-row>
            <b-form-group>
              <div class="d-flex justify-content-between">
                <b-form-group label-for="input-street" class="mr-1">
                  <template v-slot:label>
                    <span class="text-danger" v-if="editView">*</span> Ulica
                  </template>
                  <b-form-input
                    id="input-street"
                    v-model="customer.address.street_name"
                    placeholder="Ulica"
                    required
                    :disabled="!editView"
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group
                  label="Číslo domu"
                  label-for="input-street-number"
                >
                  <b-form-input
                    id="input-street-number"
                    v-model="customer.address.street_number"
                    placeholder="Číslo domu"
                    :disabled="!editView"
                  ></b-form-input>
                </b-form-group>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex justify-content-between">
                <b-form-group label-for="input-city" class="mr-1">
                  <template v-slot:label>
                    <span class="text-danger" v-if="editView">*</span> Mesto
                  </template>
                  <b-form-input
                    id="input-city"
                    v-model="customer.address.city"
                    placeholder="Mesto"
                    :disabled="!editView"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group label-for="input-postal-code">
                  <template v-slot:label>
                    <span class="text-danger" v-if="editView">*</span> PSČ
                  </template>
                  <b-form-input
                    id="input-postal-code"
                    v-model="customer.address.postal_code"
                    placeholder="PSČ"
                    :disabled="!editView"
                    required
                  ></b-form-input>
                </b-form-group>
              </div>
              <b-form-group label-for="input-picture" v-if="editView">
                <h4>Profilová fotka</h4>
                <b-form-file
                  id="input-picture"
                  v-model="file"
                  placeholder="Nahrajte súbor"
                ></b-form-file>
              </b-form-group>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row class="d-flex justify-content-center mt-3">
          <b-button
            variant="secondary"
            class="mx-1"
            size="lg"
            v-if="editView"
            @click="cancel"
          >
            Zrušiť
          </b-button>
          <b-button
            variant="info"
            class="mx-1"
            size="lg"
            v-if="editView"
            @click="onSubmit"
            :disabled="!isValid"
          >
            Uložiť
          </b-button>
          <b-button variant="secondary" size="lg" @click="edit" v-else>
            Upraviť informácie
          </b-button>
        </b-form-row>
      </b-form>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "ClientInfo",
  props: {
    clientData: { type: Object },
    editTaskId: { type: String },
  },
  data() {
    return {
      customer: this.$props.clientData,
      editView: false,
      user: JSON.parse(sessionStorage.getItem("user")),
      file: null,
    };
  },
  computed: {
    isValid() {
      return (
        this.customer.contact.first_name != "" &&
        this.customer.contact.last_name != "" &&
        this.isPhoneNumber(this.customer.contact.phone_number) &&
        this.isEmail(this.customer.contact.email) &&
        this.customer.address.street_name != "" &&
        this.customer.address.city != "" &&
        this.isPostalCode(this.customer.address.postal_code)
      );
    },
  },
  methods: {
    async onSubmit(event) {
      this.editView = false;
      event.preventDefault();

      var contactPayload = {};
      // kontakt
      var contactTaskId = this.customer.contact.taskId;

      contactPayload[contactTaskId + "-first_name"] = {
        type: "text",
        value: this.customer.contact.first_name,
      };
      contactPayload[contactTaskId + "-last_name"] = {
        type: "text",
        value: this.customer.contact.last_name,
      };
      contactPayload[contactTaskId + "-phone_number"] = {
        type: "text",
        value: this.customer.contact.phone_number,
      };
      contactPayload[contactTaskId + "-email"] = {
        type: "text",
        value: this.customer.contact.email,
      };

      // adresa
      var addressPayload = {};
      var addressTaskId = this.customer.address.taskId;
      addressPayload[addressTaskId + "-street_name"] = {
        type: "text",
        value: this.customer.address.street_name,
      };
      addressPayload[addressTaskId + "-street_number"] = {
        type: "text",
        value: this.customer.address.street_number,
      };
      addressPayload[addressTaskId + "-city"] = {
        type: "text",
        value: this.customer.address.city,
      };
      addressPayload[addressTaskId + "-postal_code"] = {
        type: "text",
        value: this.customer.address.postal_code,
      };
      // token, taskId
      console.log(
        await this.AssignTask(this.user.token, this.$props.editTaskId)
      );
      // edit contact: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editTaskId,
          contactPayload
        )
      );
      // edit address: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editTaskId,
          addressPayload
        )
      );

      if (this.file) {
        let formData = new FormData();
        formData.append("file", this.file);

        await this.SubmitFile(
          this.user.token,
          this.$props.editTaskId,
          contactTaskId + "-picture",
          formData
        );
      }

      // // token, taskId
      console.log(
        await this.FinishTask(this.user.token, this.$props.editTaskId)
      );

      this.$emit("reload");
      return "done";
    },
    edit() {
      this.editView = true;
    },
    cancel() {
      this.editView = false;
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  // content: " *";
  color: red !important;
}
</style>
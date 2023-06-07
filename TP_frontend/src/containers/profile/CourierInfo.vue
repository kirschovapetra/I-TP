<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">Informácie o kuriérovi</h3>
    </b-row>
    <b-row
      class="d-flex justify-content-center text-info font11"
      v-if="!courierData"
    >
      Nenašli sa žiadne údaje
    </b-row>
    <div v-else>
      <b-row class="d-flex justify-content-center">
        <h4>Kontaktné údaje</h4>
      </b-row>
      <b-row class="d-flex justify-content-center">
        <b-form class="px-4 pb-4">
          <b-form-group label-for="input-name">
            <template v-slot:label>
              <span class="text-danger" v-if="editView">*</span> Meno a
              priezvisko
            </template>
            <div class="d-flex justify-content-between">
              <b-form-input
                id="input-firstname"
                v-model="courierData.first_name"
                placeholder="Meno"
                required
                class="mr-1"
                :disabled="!editView"
              >
              </b-form-input>
              <b-form-input
                id="input-lastname"
                v-model="courierData.last_name"
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
              <span class="text-danger" v-if="editView">*</span> Telefónne číslo
            </template>
            <b-form-input
              id="input-phoneNumber"
              v-model="courierData.phone_number"
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
              v-model="courierData.email"
              placeholder="Enter email"
              disabled
            ></b-form-input>
          </b-form-group>
          <b-form-group label-for="input-picture" v-if="editView">
            <h4>Profilová fotka</h4>
            <b-form-file
              id="input-picture"
              v-model="file"
              placeholder="Nahrajte súbor"
            ></b-form-file>
          </b-form-group>
          <b-button
            variant="info"
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
        </b-form>
      </b-row>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "CourierInfo",
  props: { courierData: { type: Object }, editTaskId: { type: String } },
  data() {
    return {
      editView: false,
      file: null,
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
  computed: {
    isValid() {
      return (
        this.isEmail(this.courierData.email) &&
        this.isPhoneNumber(this.courierData.phone_number) &&
        this.courierData.first_name != "" &&
        this.courierData.last_name != ""
      );
    },
  },
  methods: {
    async onSubmit(event) {
      this.editView = false;
      event.preventDefault();

      // kontakt
      var payload = {};
      payload[this.courierData.taskId + "-first_name"] = {
        type: "text",
        value: this.courierData.first_name,
      };
      payload[this.courierData.taskId + "-last_name"] = {
        type: "text",
        value: this.courierData.last_name,
      };
      payload[this.courierData.taskId + "-phone_number"] = {
        type: "text",
        value: this.courierData.phone_number,
      };
      payload[this.courierData.taskId + "-email"] = {
        type: "text",
        value: this.courierData.email,
      };

      // token, taskId
      console.log(
        await this.AssignTask(this.user.token, this.$props.editTaskId)
      );
      // token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editTaskId,
          payload
        )
      );

      if (this.file) {
        let formData = new FormData();
        formData.append("file", this.file);

        await this.SubmitFile(
          this.user.token,
          this.$props.editTaskId,
          this.courierData.taskId + "-picture",
          formData
        );
      }

      // token, taskId
      console.log(
        await this.FinishTask(this.user.token, this.$props.editTaskId)
      );

      this.$emit("reload");
      return "done";
    },
    edit() {
      this.editView = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
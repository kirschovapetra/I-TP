<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">Informácie o firme</h3>
    </b-row>
    <b-row
      class="d-flex justify-content-center text-info font11"
      v-if="
        !companyInfo || companyInfo.address == {} || companyInfo.company == {}
      "
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
                <span class="text-danger" v-if="editView">*</span> Názov
                spoločnosti
              </template>
              <b-form-input
                id="input-name"
                v-model="companyInfo.company.company_name"
                placeholder="Názov spoločnosti"
                :disabled="!editView"
                required
              ></b-form-input>
            </b-form-group>

            <!-- typ  -->
            <b-form-group label-for="input-type">
              <template v-slot:label>
                <span class="text-danger" v-if="editView">*</span> Typ
                spoločnosti
              </template>
              <b-form-select
                id="input-type"
                v-model="companyInfo.company.company_type"
                :options="companyOptions"
                required
                :disabled="!editView"
              ></b-form-select>
            </b-form-group>

            <b-form-group>
              <div class="d-flex justify-content-between">
                <!-- ico -->
                <b-form-group
                  label-for="input-ico"
                  description="Identifikačné číslo organizácie (8-miestne)"
                  class="mx-1"
                >
                  <template v-slot:label>
                    <span class="text-danger" v-if="editView">*</span> IČO
                  </template>
                  <b-form-input
                    id="input-ico"
                    v-model="companyInfo.company.ico"
                    placeholder="00000000"
                    :disabled="!editView"
                    required
                  ></b-form-input>
                </b-form-group>
                <!-- ic dph  -->
                <b-form-group
                  label-for="input-ic-dph"
                  description="Identifikačné číslo pre DPH (kód krajiny + DIČ)"
                  class="mx-1"
                >
                  <template v-slot:label>
                    <span class="text-danger" v-if="editView">*</span> IČ DPH
                  </template>
                  <b-form-input
                    id="input-ic-dph"
                    v-model="companyInfo.company.ic_dph"
                    placeholder="SK0000000000"
                    :disabled="!editView"
                    required
                  ></b-form-input>
                </b-form-group>
              </div>
            </b-form-group>

            <!-- dic  -->
            <b-form-group
              label-for="input-dic"
              description="Daňové identifikačné číslo (10-miestne)"
              style="margin-top: -5%"
            >
              <template v-slot:label>
                <span class="text-danger" v-if="editView">*</span> DIČ
              </template>
              <b-form-input
                id="input-dic"
                v-model="companyInfo.company.dic"
                placeholder="0000000000"
                :disabled="!editView"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="6" class="px-3">
            <b-form-row class="d-flex justify-content-center">
              <h4>Adresa</h4>
            </b-form-row>
            <b-form-group>
              <div class="d-flex justify-content-between">
                <b-form-group label-for="input-street">
                  <template v-slot:label>
                    <span class="text-danger" v-if="editView">*</span> Ulica
                  </template>
                  <b-form-input
                    id="input-street"
                    v-model="companyInfo.address.street_name"
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
                    v-model="companyInfo.address.street_number"
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
                    v-model="companyInfo.address.city"
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
                    v-model="companyInfo.address.postal_code"
                    placeholder="PSČ"
                    :disabled="!editView"
                    required
                  ></b-form-input>
                </b-form-group>
              </div>
            </b-form-group>
            <b-form-group label-for="input-picture" v-if="editView">
              <h4>Profilová fotka</h4>
              <b-form-file
                id="input-picture"
                v-model="file"
                placeholder="Nahrajte súbor"
              ></b-form-file>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row class="d-flex justify-content-center mt-3">
          <b-button
            variant="secondary"
            size="lg"
            class="mx-1"
            v-if="editView"
            @click="cancel"
          >
            Zrušiť
          </b-button>
          <b-button
            variant="info"
            size="lg"
            class="mx-1"
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
  name: "CompanyInfo",
  props: {
    companyData: { type: Object },
    editTaskId: { type: String },
  },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      companyInfo: this.$props.companyData,
      companyOptions: [
        "",
        "Verejná obchodná spoločnosť (v.o.s.)",
        "Komanditná spoločnosť (k.s.)",
        "Spoločnosť s ručením obmedzeným (s.r.o.)",
        "Akciová spoločnosť (a.s.)",
      ],
      selected: "",
      editView: false,
      file: null,
    };
  },
  computed: {
    isValid() {
      return (
        this.companyInfo.company.company_name != "" &&
        this.companyInfo.company.company_type != "" &&
        this.isICO(this.companyInfo.company.ico) &&
        this.isDIC(this.companyInfo.company.dic) &&
        this.isICDPH(this.companyInfo.company.ic_dph) &&
        this.companyInfo.address.street_name != "" &&
        this.companyInfo.address.city != "" &&
        this.isPostalCode(this.companyInfo.address.postal_code)
      );
    },
  },
  methods: {
    async onSubmit(event) {
      this.editView = false;
      event.preventDefault();

      var companyPayload = {};
      companyPayload["company_type"] = {
        type: "enumeration",
        value: this.selected,
      };
      companyPayload["company_name"] = {
        type: "text",
        value: this.companyInfo.company.company_name,
      };
      companyPayload["ico"] = {
        type: "text",
        value: this.companyInfo.company.ico,
      };
      companyPayload["dic"] = {
        type: "text",
        value: this.companyInfo.company.dic,
      };
      companyPayload["ic_dph"] = {
        type: "text",
        value: this.companyInfo.company.ic_dph,
      };

      // adresa
      var addressPayload = {};
      var addressTaskId = this.companyInfo.address.taskId;
      addressPayload[addressTaskId + "-street_name"] = {
        type: "text",
        value: this.companyInfo.address.street_name,
      };
      addressPayload[addressTaskId + "-street_number"] = {
        type: "text",
        value: this.companyInfo.address.street_number,
      };
      addressPayload[addressTaskId + "-city"] = {
        type: "text",
        value: this.companyInfo.address.city,
      };
      addressPayload[addressTaskId + "-postal_code"] = {
        type: "text",
        value: this.companyInfo.address.postal_code,
      };
      // token, taskId
      console.log(
        await this.AssignTask(this.user.token, this.$props.editTaskId)
      );
      // edit company: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editTaskId,
          companyPayload
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
          this.$props.editTaskId + "-picture",
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
</style>
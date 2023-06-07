<template>
  <div class="example-modal-center">
    <div class="text-center pt-4">
      <h1>Pobočka: {{ form.branch.name }}</h1>
    </div>
    <b-form class="px-4 pb-4">
      <!-- nazov  -->
      <b-form-group label-for="input-name">
        <template v-slot:label>
          <span class="text-danger">*</span> Názov pobočky
        </template>
        <b-form-input
          id="input-name"
          type="text"
          placeholder="Názov"
          v-model="form.branch.name"
          :state="form.branch.name != ''"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Adresa -->
      <b-form-group class="pr-3" label-for="input-address">
        <template v-slot:label>
          <span class="text-danger">*</span> Adresa
        </template>
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
          >
          </b-form-input>
        </div>
      </b-form-group>

      <!-- tel. cislo  -->
      <b-form-group
        label="Telefónne číslo"
        label-for="input-phone-number"
        description="Formát: +421"
      >
        <b-form-input
          id="input-phone-number"
          type="text"
          placeholder="Telefónne číslo"
          v-model="form.branch.phone_number"
          :state="isPhoneNumber(form.branch.phone_number)"
        ></b-form-input>
      </b-form-group>

      <!-- Email  -->
      <b-form-group label="Email" label-for="input-email">
        <b-form-input
          id="input-email"
          type="email"
          placeholder="Enter email"
          v-model="form.branch.email"
          :state="isEmail(form.branch.email)"
        ></b-form-input>
      </b-form-group>

      <!-- Meno  -->
      <b-form-group
        label="Otváracia doba"
        label-for="input-opening-hours"
        description="Od - Do"
      >
        <b-form-input
          id="input-opening-hours"
          type="text"
          v-model="form.branch.opening_hours"
        >
        </b-form-input>
      </b-form-group>
      <div class="d-flex justify-content-between">
        <b-button @click="cancel" size="lg" variant="secondary">
          Zrušiť
        </b-button>
        <b-button
          @click="onSubmit"
          size="lg"
          variant="info"
          :disabled="!isValid"
        >
          Uložiť
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "addBranch",
  props: [
    "branchJson",
    "addBranchTaskId",
    "editBranchTaskId",
    "deleteBranchTaskId",
  ],
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      action: "",
      form: {
        id: "",
        title: "",
        editTaskId: "",
        deleteTaskId: "",
        branch: {
          name: "",
          email: "",
          phone_number: "",
          opening_hours: "",
          taskId: "",
        },
        address: {
          street_name: "",
          street_number: "",
          city: "",
          postal_code: "",
          taskId: "",
        },
      },
    };
  },
  mounted() {
    if (this.$props.branchJson == undefined) {
      this.action = "add";
    } else {
      this.form = this.$props.branchJson;
      this.action = "edit";
    }
  },
  computed: {
    isValid() {
      return (
        this.form.branch.name != "" &&
        this.form.address.street_name != "" &&
        this.form.address.street_number != "" &&
        this.form.address.city != "" &&
        this.isPostalCode(this.form.address.postal_code) &&
        this.isEmail(this.form.branch.email) &&
        this.isPhoneNumber(this.form.branch.phone_number)
      );
    },
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    async onSubmit(event) {
      event.preventDefault();

      if (this.action == "add") {
        await this.addBranch();
      } else if (this.action == "edit") {
        await this.editBranch();
      }

      this.cancel();
      return "done";
    },

    async addBranch() {
      // token, taskId
      var data = await this.AssignTask(
        this.user.token,
        this.$props.addBranchTaskId
      );

      /*************** branch data ****************/
      var branchPayload = {};
      var storeTaskId = data.data.changedFields.store_taskRef.value[0];

      branchPayload[storeTaskId + "-name"] = {
        type: "text",
        value: this.form.branch.name,
      };
      branchPayload[storeTaskId + "-email"] = {
        type: "text",
        value: this.form.branch.email,
      };
      branchPayload[storeTaskId + "-phone_number"] = {
        type: "text",
        value: this.form.branch.phone_number,
      };
      branchPayload[storeTaskId + "-opening_hours"] = {
        type: "text",
        value: this.form.branch.opening_hours,
      };

      // edit branch: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.addBranchTaskId,
          branchPayload
        )
      );

      /*************** address data ****************/

      var newBranchData = await this.GetDataByTask(
        this.user.token,
        storeTaskId
      );
      var addressData =
        newBranchData.data._embedded.dataGroups[1].fields._embedded
          .localisedTextFields;

      var addressPayload = {};
      for (var x in addressData) {
        addressPayload[addressData[x].stringId] = {
          type: "text",
          value: this.form.address[addressData[x].stringId.split("-")[1]],
        };
      }
      // edit address: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.addBranchTaskId,
          addressPayload
        )
      );
      // token, taskId
      console.log(
        await this.FinishTask(this.user.token, this.$props.addBranchTaskId)
      );

      return "done";
    },
    async editBranch() {
      // token, taskId
      console.log(
        await this.AssignTask(this.user.token, this.$props.editBranchTaskId)
      );

      /*************** branch data ****************/
      var branchPayload = {};
      branchPayload["name"] = {
        type: "text",
        value: this.form.branch.name,
      };
      branchPayload["email"] = {
        type: "text",
        value: this.form.branch.email,
      };
      branchPayload["phone_number"] = {
        type: "text",
        value: this.form.branch.phone_number,
      };
      branchPayload["opening_hours"] = {
        type: "text",
        value: this.form.branch.opening_hours,
      };

      // edit branch: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editBranchTaskId,
          branchPayload
        )
      );

      /*************** address data ****************/
      var addressPayload = {};
      addressPayload[this.form.address.taskId + "-street_name"] = {
        type: "text",
        value: this.form.address.street_name,
      };
      addressPayload[this.form.address.taskId + "-street_number"] = {
        type: "text",
        value: this.form.address.street_number,
      };
      addressPayload[this.form.address.taskId + "-city"] = {
        type: "text",
        value: this.form.address.city,
      };
      addressPayload[this.form.address.taskId + "-postal_code"] = {
        type: "text",
        value: this.form.address.postal_code,
      };

      // edit address: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editBranchTaskId,
          addressPayload
        )
      );
      // token, taskId
      console.log(
        await this.FinishTask(this.user.token, this.$props.editBranchTaskId)
      );

      return "done";
    },
  },
};
</script>

<style scoped lang="css">
</style>
<template>
  <div class="d-flex justify-content-center align-self-center mt-5">
    <div class="d-flex justify-content-center col-sm-3 wrap-div p-4">
      <div class="col-sm-10 form-div" style="background-color: white">
        <div class="text-center">
          <div class="w-100 mb-2" style="height: 30px">
            <h3>Prihlásenie</h3>
          </div>
        </div>
        <b-form @submit="onSubmit" class="px-4 pb-4">
          <!-- Nazov  -->
          <b-form-group
            id="input-group-loginMail"
            label="Email"
            label-for="input-mail"
          >
            <b-form-input
              id="input-mail"
              type="text"
              v-model="form.loginMail"
              placeholder="Email"
              :state="emailIsValid"
              required
              @blur="validateEmail()"
            ></b-form-input>
          </b-form-group>

          <b-button
            class="btn btn-primary btn-block"
            type="submit"
            variant="info"
            :disabled="disabledButton"
            >Pokračovať</b-button
          >
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import RoleSelectModal from "@/components/Login/RoleSelectModal.vue";
import ResponseParser from "@/HelperObjects/ResponseParser.js";

export default {
  name: "CompanyRegistration",
  data() {
    return {
      form: {
        loginMail: "",
      },
      emailIsValid: null,
      disabledButton: false,
    };
  },
  methods: {
    validateEmail() {
      this.emailIsValid =
        this.isEmail(this.form.loginMail) && this.form.loginMail != "";
    },
    selectRole(caseIds, processIds, email) {
      this.$modal.show(
        RoleSelectModal,
        { caseIds: caseIds, processIds: processIds, email: email },
        { width: "20%", height: "auto" }
      );
    },
    async onSubmit(event) {
      event.preventDefault();

      if (!this.emailIsValid) {
        return;
      }

      this.disabledButton = true;
      var response = await this.Login();

      if (response.status == 200) {
        let user = JSON.parse(sessionStorage.getItem("user"));
        const caseIdsOfRoles = await this.findCaseIds(user.token, user.groupId);
        const processIds = await this.getNetIds(user.token, user.groupId);

        this.selectRole(caseIdsOfRoles, processIds, this.form.loginMail);
        this.disabledButton = false;
      } else {
        this.$toasted.global.error({
          message: "Vyskytla sa neočakávaná chyba",
        });
        this.disabledButton = false;
      }

      //   this.$toasted.global.my_app_error();
    },
    async findCaseIds(token, groupId) {
      var tmp = await this.GetActiveCases(token, groupId);

      // tuto sa preklikam na array case-ov
      this.allCases = tmp.data._embedded.cases;

      // tasky do session
      sessionStorage.setItem("activeTasks", JSON.stringify(this.allCases));

      const filteredClientCases = this.allCases.filter((_case) => {
        return _case.title === this.form.loginMail + "_klient";
      });

      const filteredCourierCases = this.allCases.filter((_case) => {
        return _case.title === this.form.loginMail + "_kurier";
      });

      const filteredCompanyCases = this.allCases.filter((_case) => {
        return _case.title === this.form.loginMail + "_company";
      });

      // toto necitajte ak je vam zivot mily
      const rightCourierName =
        filteredCourierCases.length === 2
          ? groupId + "_kurier"
          : groupId + "_kurier_registracia";

      const finalCourier = filteredCourierCases.filter((_case) => {
        return _case.processIdentifier === rightCourierName;
      });

      return [
        this.valueOrString(filteredClientCases[0]),
        this.valueOrString(filteredCompanyCases[0]),
        this.valueOrString(finalCourier[0]),
        "pagace",
      ];
    },
    async getNetIds(token, groupId) {
      let allProceses = await this.GetAllProcesses(token, groupId);
      allProceses = allProceses.data._embedded.petriNetReferences;

      return [
        // netId of laste version
        ResponseParser.getLastVersion(allProceses, groupId + "_klient"),
        ResponseParser.getLastVersion(allProceses, groupId + "_company"),
        ResponseParser.getLastVersion(
          allProceses,
          groupId + "_kurier_registracia"
        ),
      ];
    },
    valueOrString(value) {
      return value === undefined || value === null ? "" : value.stringId;
    },
  },
  async mounted() {
    // resetne sa session
    sessionStorage.clear();

    var response = await this.Login();
    //let tmpUser = JSON.parse(sessionStorage.getItem("user"));
    // user v session sa s kazdym prihlasenim refreshne

    sessionStorage.setItem(
      "user",
      JSON.stringify({
        //...tmpUser, // toto mergovanie je docasne. tieto udaje by sa mali getnut z tasku
        token: response.headers["x-auth-token"],
        groupId: response.data.nextGroups[0],
      })
    );
  },
};
</script>

<style scoped lang="css">
.wrap-div {
  background-color: #18b7be;
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
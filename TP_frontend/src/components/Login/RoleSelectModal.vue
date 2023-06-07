<template>
  <div class="example-modal-center">
    <div class="text-center">
      <h2>Zvoľte rolu</h2>
    </div>
    <b-form @submit="onSubmit" class="px-4 pb-4">
      <b-form-group v-slot="{ ariaDescribedby }">
        <div v-for="role in roles" v-bind:key="role.title">
          <b-form-radio
            v-model="selectedRole"
            :aria-describedby="ariaDescribedby"
            name="some-radios"
            :value="role.roleId"
            ><div v-bind:class="{ 'text-danger': !doesCaseExist(role.roleId) }">
              {{ role.title }}
            </div></b-form-radio
          >
        </div>
      </b-form-group>

      <b-form-group
        id="input-group-loginMail"
        label="Heslo"
        label-for="input-mail"
        v-bind:class="{
          invisible: !doesCaseExist(selectedRole),
        }"
      >
        <b-form-input
          id="input-password"
          type="password"
          v-model="password"
          placeholder="Zadajte heslo"
        ></b-form-input>
      </b-form-group>

      <b-button class="btn btn-primary btn-block" type="submit" variant="info"
        >{{
          doesCaseExist(selectedRole)
            ? "Pokračovať do aplikácie"
            : "Registrovať"
        }}
      </b-button>
    </b-form>
  </div>
</template>

<script>
import ResponseParser from "@/HelperObjects/ResponseParser.js";
import UserModal from "@/components/User/AddModal.vue";
import CompanyModal from "@/components/company/RegistrationModal.vue";

export default {
  name: "RoleSelectModal",
  data() {
    return {
      selectedRole: 0,
      roles: {},
      //email: this.$props.email,
      password: "",
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();

      if (this.doesCaseExist(this.selectedRole)) {
        await this.logIntoApp();
      } else {
        this.register();
      }
    },
    initRoles(caseIds, processNetIds) {
      return [
        {
          roleId: 0,
          title: "Klient",
          caseId: caseIds[0],
          dataTaskName: "Info o klientskom konte",
          netId: processNetIds[0],
          suffix: "_klient",
        },
        {
          roleId: 1,
          title: "Firma",
          caseId: caseIds[1],
          dataTaskName: "Zobraziť informácie o firme / Firma, Admin",
          netId: processNetIds[1],
          suffix: "_company",
        },
        {
          roleId: 2,
          title: "Kuriér",
          caseId: caseIds[2],
          dataTaskName: "Zobrazenie informácií o kuriérovi",
          netId: processNetIds[2],
          suffix: "_kurier",
        },
        {
          roleId: 3,
          title: "Admin",
          caseId: caseIds[3],
        },
      ];
    },
    doesCaseExist(roleId) {
      if (this.roles[roleId] === undefined) {
        return false;
      }

      return this.roles[roleId].caseId !== "";
    },
    async getUserInfoFromCaseId() {
      const actualcaseId = this.roles[this.selectedRole].caseId;

      const tasksOfCase = await this.GetTasksOfCase(
        this.user.token,
        actualcaseId
      );

      return await this.getKontaktFromTasks(tasksOfCase);
    },
    async getKontaktFromTasks(tasksResponse) {
      const tasks = tasksResponse.data._embedded.tasks;

      const infoTaskName = this.roles[this.selectedRole].dataTaskName;

      if (!ResponseParser.hasThisTask(tasks, infoTaskName)) {
        this.$toasted.global.error({
          message: "Žiadosť o registráciu zatiaľ nebola schválená",
        });
        return;
      }

      const taskId = ResponseParser.stringIdByTitle(tasks, infoTaskName);

      const dataResponse = await this.GetTaskData(this.user.token, taskId);
      const dataGroups = dataResponse.data._embedded.dataGroups;

      if (this.selectedRole === this.roles[1].roleId) {
        return ResponseParser.getFirmaObject(dataGroups);
      }

      return ResponseParser.getKontaktObject(dataGroups);
    },

    setSession(email) {
      const user = {
        ...this.user,
        type: this.selectedRole,
        email: email,
      };

      sessionStorage.setItem("user", JSON.stringify(user));
    },
    setSessionAndLogin(email) {
      this.setSession(email);
      this.$modal.hideAll();
      this.$router.push("/profile");
    },
    async logIntoApp() {
      //admin
      if (this.selectedRole === 3 && this.password === "Heslo") {
        this.setSessionAndLogin(this.$props.email);
        return;
      }

      const contact = await this.getUserInfoFromCaseId();

      if (contact === undefined) {
        return;
      }

      if (contact.password === this.password) {
        this.setSessionAndLogin(contact);
      } else {
        this.$toasted.global.error({
          message: "Nesprávne heslo",
        });
      }
    },
    async register() {
      const email = this.$props.email;

      // firma
      if (this.selectedRole === this.roles[1].roleId) {
        this.registerCompanyModal(this.roles[this.selectedRole], email);
      } else {
        this.registerUserModal(this.roles[this.selectedRole], email);
      }
    },
    registerUserModal(selectedRole, email) {
      this.$modal.show(
        UserModal,
        { selectedRole: selectedRole, email: email },
        { width: "30%", height: "auto" }
      );
    },
    registerCompanyModal(selectedRole, email) {
      this.$modal.show(
        CompanyModal,
        { selectedRole: selectedRole, email: email },
        { width: "30%", height: "auto" }
      );
    },
  },
  props: ["caseIds", "processIds", "email"],
  mounted() {
    this.roles = this.initRoles(this.$props.caseIds, this.$props.processIds);
    this.selectedRole = 0;
  },
};
</script>

<style scoped lang="css">
</style>
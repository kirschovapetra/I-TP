<template>
  <div class="home">
    <!-- <div>
      <categorySideBar />
    </div> -->

    <div>
      <Navigation />

      <h3>Prístup ku konštantám</h3>
      <div>
        Prístup ku konštante pre userType: {{ this.$const.USER_TYPE.CLIENT }}
      </div>
      <div>Prístup ku session pre userType: {{ user.type }}</div>
      <h3>Modal na pridanie kuriéra</h3>
      <button
        type="button"
        class="btn"
        @click="toggleCourierModal('Pridanie kuriéra')"
      >
        New User
      </button>

      <div>
        <h3>Pridanie firmy</h3>
        <router-link to="/company/registration"
          >Registrácia spoločnosti</router-link
        >
      </div>

      <h3>Modal na pridanie pobočky</h3>
      <button type="button" class="btn" @click="toggleBranchModal('Dráčik')">
        New Branch
      </button>

      <h3>API calls (kuk do konzoly)</h3>
      <b-button @click="login">Login (zmeni token)</b-button>
      <b-button @click="logout"> Logout</b-button>
      <br />
      <b-button @click="userInfo">User Info (zmeni group)</b-button>
      <br /><br />TOKEN: {{ token }} <br />USER GROUP: {{ groupId }}
      <br /><br />
      <b-button @click="processesAll">Vsetky procesy (array)</b-button>
      <br /><br />
      <b-button @click="lastProcessById('klient')">
        Najnovsi proces s id = klient (zmenit na take, ake treba)
      </b-button>
      <br />
      dostanem stringId: {{ stringId }} <br />
      <br />
      <b-button @click="casesAll">Vsetky case-y (array)</b-button> <br />
      <br />
      <b-button @click="newCase('klient')">
        Novy case s id = klient (zmenit na take, ake treba) a stringId =
        {{ stringId }}
      </b-button>
      <br />
      <b-button @click="findCase('demo')">
        Najdi case podla stringu = 'demo' (search cez title i guess)
      </b-button>
      <br />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from "@/containers/general/Navigation.vue";
// import categorySideBar from "@/components/ItemCategory/SideBar.vue";
import UserModal from "@/components/User/AddModal.vue";
import BranchModal from "@/components/Branch/AddModal.vue";

export default {
  name: "Demos",
  components: {
    Navigation,
    // categorySideBar,
  },
  data() {
    return {
      isModalVisible: false,
      user: JSON.parse(sessionStorage.getItem("user")),
      token: "238ee6af-c730-403e-941a-9a2844646206", // ziskam z loginu
      groupId: "5f86b22ff9ac3b272d6b5f85", // ziskam z UserInfo
      stringId: "", // case ID (ked chceme vytvorit novy proces) - ziskam z GetAllProcesses odkial vyfiltrujem posledny proces s id = "klient" napr.
    };
  },
  methods: {
    toggleCourierModal(title) {
      this.$modal.show(UserModal, { title: title }, { height: "auto" });
    },
    toggleBranchModal(title) {
      this.$modal.show(BranchModal, { title: title }, { height: "auto" });
    },

    /******************************** API calls ***********************************/

    async login() {
      var data = await this.Login();
      console.log(data);
      this.token = data.headers["x-auth-token"];
    },
    async userInfo() {
      var data = await this.GetUserInfo(this.token);
      console.log(data.data);
      this.groupId = data.data.nextGroups[0];
    },
    async processesAll() {
      var data = await this.GetAllProcesses(this.token, this.groupId);
      console.log(data.data._embedded.petriNetReferences);
    },
    async lastProcessById(processId) {
      var data = await this.GetAllProcesses(this.token, this.groupId);

      var filteredProc = data.data._embedded.petriNetReferences.filter(
        (net) => {
          return net.identifier.includes(processId);
        }
      );

      this.stringId = filteredProc[filteredProc.length - 1].stringId;
      console.log(filteredProc[filteredProc.length - 1]);
    },
    async casesAll() {
      var data = await this.GetAllCases(this.token, this.groupId);
      console.log(data.data._embedded.cases);
    },
    async newCase(stringId) {
      console.log(stringId);
      var data = await this.CreateCase(
        this.user.token,
        "Demo Klient",
        stringId
      );
      console.log(data);
    },

    async logout() {
      var data = await this.Logout(this.token);
      console.log(data);
    },

    async findCase(searchString) {
      var data = await this.SearchCaseFulltext(
        this.token,
        this.groupId,
        searchString
      );
      console.log(data);
    },
  },
};
</script>

<style scoped lang="css">
.btn {
  margin: 2px;
}
</style>

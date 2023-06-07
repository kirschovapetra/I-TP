<template>
  <b-container>
    <b-row>
      <b-col class="inner-content">
        <img :src="imageURL" class="w-75 pt-2 profile-pic" />
        <p class="profile-name">{{ userName }}</p>
        <hr />

        <!-- Menu -->
        <div v-for="(value, key) in menuItems" :key="key">
          <p
            :class="[{ active: active == key }, 'line']"
            @click="selectButton(key)"
          >
            {{ value }}
          </p>

          <hr />
        </div>

        <div class="button-home">
          <router-link to="/"><button>Domov</button></router-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "ProfileMenu",
  props: {
    userName: { type: String },
    imageURL: { type: String },
  },
  data() {
    return {
      active: "",
      user: JSON.parse(sessionStorage.getItem("user")),
      clientMenu: {
        Settings: "Nastavenia",
        OrderHistory: "História objednávok",
        FavoriteProducts: "Obľúbené produkty",
        FavoriteCompanies: "Obľúbené firmy",
      },
      companyMenu: {
        Settings: "Nastavenia",
        Products: "Produkty",
        Branches: "Pobočky",
      },
      courierMenu: {
        Settings: "Nastavenia",
        Orders: "Objednávky",
      },
      adminMenu: { Requests: "Žiadosti" },
    };
  },
  mounted() {
    this.active =
      this.user.type == this.$const.USER_TYPE.ADMIN ? "Requests" : "Settings";
  },
  methods: {
    selectButton(name) {
      this.active = name;
      this.$emit("selected", name);
    },
  },
  computed: {
    menuItems() {
      return this.user.type == this.$const.USER_TYPE.CLIENT
        ? this.clientMenu
        : this.user.type == this.$const.USER_TYPE.COMPANY
        ? this.companyMenu
        : this.user.type == this.$const.USER_TYPE.COURIER
        ? this.courierMenu
        : this.adminMenu;
    },
  },
};
</script>

<style scoped lang="css">
.container {
  background-color: #18b7be;
  border-radius: 6px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.inner-content {
  height: calc(100vh - 60px - 4em - 55px);
  display: block;
  padding-left: 0;
  padding-right: 0;
}
p {
  margin: 0;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
p.profile-name {
  padding: 1.5rem;
  font-size: 20px;
  color: white;
  text-shadow: 2px 2px 2px #5f949d;
}
p.line {
  padding: 1rem 0;
  color: white;
  font-size: 1.1em;
  text-shadow: 2px 2px 2px #5f949d;
}
.active {
  background-color: #f9f7f0;
  text-shadow: none !important;
  color: #178ca4 !important;
}
p.line:hover {
  cursor: pointer;
  text-shadow: none !important;
  background-color: #f9f7f0;
  color: #178ca4;
  transition: all 0.4s cubic-bezier(0.3, 0, 0, 1) 0s;
}
hr {
  background-color: #f9f7f0;
  width: 80%;
  margin-top: 0;
  margin-bottom: 0;
}
.button-home {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 1.5rem;
}
.button-home button {
  color: #178ca4;
  font-size: 16px;
  width: 70%;
  margin: auto;
  padding: 0.4rem;
  cursor: pointer;
  background-color: #f9f7f0;
  border-radius: 4px;
  border-color: transparent;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.button-home button:hover {
  transform: scale(1.05, 1.05);
  transition: all 0.4s cubic-bezier(0.3, 0, 0, 1) 0s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.button-home button:focus {
  border-color: transparent;
  color: #f9f7f0;
  background-color: #18272a;
  transition: all 0.4s cubic-bezier(0.3, 0, 0, 1) 0s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
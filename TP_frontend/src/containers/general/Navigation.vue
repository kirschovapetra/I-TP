<template>
  <b-navbar toggleable="lg" class="font11">
    <b-navbar-brand
      tag="router-link"
      to="/"
      active-class="logo-active"
      class="logo"
      exact
    >
      <img src="@/assets/movingDotsLogo.png" width="70px" height=auto>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav style="margin-bottom: 0 !important">
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-item tag="router-link" to="/demos" exact class="nav-a">
          Demá
        </b-nav-item> -->
        <b-nav-item
          v-if="user.type == this.$const.USER_TYPE.CLIENT"
          tag="router-link"
          to="/"
          exact
          class="nav-a"
        >
          Domov
        </b-nav-item>
        <b-nav-item tag="router-link" to="/profile" class="nav-a">
          Profil
        </b-nav-item>
        <b-nav-item
          v-if="user.type == this.$const.USER_TYPE.CLIENT"
          tag="router-link"
          to="/companyList"
          class="nav-a"
        >
          Zoznam firiem
        </b-nav-item>
        <b-nav-item
          v-if="user.type == this.$const.USER_TYPE.CLIENT"
          tag="router-link"
          to="/cart"
          class="nav-a"
        >
          <b-icon icon="cart4" scale="1"></b-icon>
          <b class="items-in-cart">{{ itemsInCart }}</b>
        </b-nav-item>
        <b-nav-item tag="router-link" class="nav-a" @click="logout">
          Odhlásiť sa
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      itemsInCart: 0,
    };
  },
  props: {
    active: {
      type: String,
      required: false,
    },
    trigger: {
      type: Number,
      required: false,
    },
  },
  mounted() {
    this.updateItems();
  },
  methods: {
    async logout() {
      console.log(await this.Logout(this.user.token));
      this.$router.go("/");
    },
    updateItems() {
      this.itemsInCart = sessionStorage.getItem("productsInCart")
        ? Object.keys(JSON.parse(sessionStorage.getItem("productsInCart")))
            .length
        : 0;
    },
  },
  watch: {
    trigger: function () {
      this.updateItems();
    },
  },
};
</script>

<style scoped lang="css">
.items-in-cart {
  font-size: 0.8em;
  position: relative;
  top: -1em;
}
/* .num-in-circle {
  height: 2em;
  width: 2em;
  line-height: 2em;
  top: -1em;
  border-radius: 50%;
  border: 2px solid white;
  text-align: center;
} */
.logo {
  background-color: hsl(0, 0%, 100%);
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 4px;
}
a {
  color: white !important;
  height: 100%;
  padding: 12px;
}

.router-link-active {
  background-color: #72b9ccc4;
}
a:hover {
  color: rgba(255, 255, 255, 0.673) !important;
}
a:focus {
  color: rgba(255, 255, 255, 0.673) !important;
}
.navbar {
  background: #178ca4d4;
  margin-bottom: 2rem;
}
.navbar-collapse {
  z-index: 999999 !important;
}

a.navbar-brand.logo.router-link-exact-active.logo-active {
  padding: 0.7rem;
}
</style>
<template>
  <b-container>
    <b-row>
      <b-col class="inner-content">
        <div class="pt-3 pb-3" style="padding-top: 2rem !important">
          <h4>Kategórie</h4>
          <div
            class="category-type"
            v-for="category in categoryItems"
            v-bind:key="category"
          >
            <a
              @click="redirect(category), selectButton(category)"
              :class="{ active: active == category }"
            >
              {{ category }}
            </a>
            <hr />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      active: "",
      categoryItems: [
        "Elektronika",
        "Biela technika",
        "Dom a záhrada",
        "Chovateľstvo",
        "Detský tovar",
        "Knihy, filmy, hry",
        "Potraviny",
        "Kozmetika a zdravie",
        "Oblečenie",
        "Šport",
        "Nábytok",
      ],
    };
  },
  props: {
    category: {
      type: String,
      default: null,
    },
  },
  methods: {
    redirect(category) {
      if (this.active != category) {
        return this.$router.push({
          name: "ProductCategory",
          params: {
            category: category,
          },
        });
      }
    },
    selectButton(name) {
      this.active = name;
    },
  },
  mounted() {
    this.selectButton(this.category);
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
  display: block;
  padding-left: 0;
  padding-right: 0;
}
h4 {
  padding: 1.5rem;
  font-size: 25.5px;
  color: white;
  text-shadow: 2px 2px 2px #5f949d;
  text-decoration: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
a {
  padding: 1rem 0;
  color: white;
  font-size: 1.1em;
  text-shadow: 2px 2px 2px #5f949d;
  display: block;
  text-decoration: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
a:hover {
  cursor: pointer;
  text-shadow: none !important;
  background-color: #f9f7f0;
  color: #178ca4 !important;
  transition: all 0.4s cubic-bezier(0.3, 0, 0, 1) 0s;
}
.category-type {
  color: white;
  font-size: 1.1em;
  text-shadow: 2px 2px 2px #5f949d;
}
.active {
  background-color: #f9f7f0;
  text-shadow: none !important;
  color: #178ca4 !important;
}
hr {
  background-color: #f9f7f0;
  width: 80%;
  margin-top: 0;
  margin-bottom: 0;
}
</style>

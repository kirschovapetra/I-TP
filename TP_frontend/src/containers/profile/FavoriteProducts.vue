<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">Obľúbené produkty</h3>
    </b-row>
    <b-row class="p-2 px-5" v-if="items.length > 0">
      <b-col v-for="(item, id) in items" :key="id" lg="3">
        <ProfileProductCard :product="item.product" />
      </b-col>
    </b-row>
    <b-row v-else class="font12 text-info d-flex justify-content-center">
      V zozname obľúbených nemáte žiadne produkty.
    </b-row>
  </b-container>
</template>


<script>
import ProfileProductCard from "@/components/product/ProfileProductCard.vue";
export default {
  name: "FavoriteProducts",
  components: {
    ProfileProductCard,
  },
  mounted() {
    let favoriteProducts = sessionStorage.getItem("favoriteProducts")
      ? JSON.parse(sessionStorage.getItem("favoriteProducts"))
      : {};

    for (var product in favoriteProducts) {
      this.items.push(favoriteProducts[product]);
    }
  },
  data() {
    return {
      items: [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
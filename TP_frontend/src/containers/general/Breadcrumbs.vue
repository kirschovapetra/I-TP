<template>
  <b-container class="font13 bg-white shadow">
    <b-row class="px-2 pt-3">
      <b-breadcrumb class="bg-white">
        <!-- :active="link.url == '' -->
        <b-breadcrumb-item
          v-for="(link, i) in links"
          :key="i"
          :to="link.url"
          :active="link.url == $router.currentRoute.path"
        >
          <b-icon v-if="link.url == '/'" icon="house-fill" />
          <span v-else>{{ link.title }} </span>
        </b-breadcrumb-item>
      </b-breadcrumb>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="css">
.breadcrumb-item a {
  color: #17a2b8;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  font-family: Calibri;
}
</style>
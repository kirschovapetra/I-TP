<template>
  <b-container class="footer-container">
    <b-row class="footer-background" align-v="center">
      <b-col> &#169; TP2 </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Footer",
};
</script>

<style scoped lang="css">
.footer-container {
  color: white;
  height: 30px;
}
.footer-background {
  background-color: transparent;
  height: 100%;
}
</style>
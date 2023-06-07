<template>
  <div class="d-flex justify-content-center pt-5">
    <p class="text-center text-break h4">
      Vaša platba bola prijatá <br />
      Prebieha presmerovanie na domovskú stránku. <br />
      <b class="text-info"> {{ countDown }} </b>
    </p>
  </div>
</template>

<script>
export default {
  name: "PaymentReceivedModal",
  data() {
    return {
      countDown: 5,
    };
  },
  methods: {
    redirectHomeTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.redirectHomeTimer();
        }, 1000);
      } else {
        if (sessionStorage.getItem("productsInCart")) {
          sessionStorage.removeItem("productsInCart");
        }
        this.$emit("close");
        this.$router.push("/");
      }
    },
  },
  mounted() {
    this.redirectHomeTimer();
  },
};
</script>

<style lang="scss" scoped>
</style>
<template>
  <div class="px-5 py-3">
    <b-row class="d-flex justify-content-center my-4">
      <h4>Vygenerovaný kód</h4>
    </b-row>
    <b-form-input
      id="input-num"
      required
      v-model="code_gen"
      disabled
    ></b-form-input>
    <b-row class="d-flex justify-content-center my-3" v-if="countDown > 0">
      Platnosť vyprší o <b class="ml-1"> {{ countDown }} sekúnd</b>
    </b-row>
    <b-row class="d-flex justify-content-center my-3" v-else>
      Platnosť vypršala
    </b-row>
    <b-row class="d-flex justify-content-center my-3">
      <b-button variant="info" @click="reset" :disabled="countDown > 0">
        Vygenerovať nový kód
      </b-button>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "CodeGenModal",
  // props: { codeChanged: { type: Function } },
  props: { code_gen: { type: String } },
  data() {
    return {
      countDown: 30,
      tmp_kody: ["1234", "2345", "3456", "4567", "5678"],
    };
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    reset() {
      // this.code_gen = this.tmp_kody[this.getRandomInt(5)]; // TODO kod pojde z backendu
      // this.codeChanged(this.code_gen);
      this.countDown = 30;
      this.countDownTimer();
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
  },
  mounted() {
    this.reset();
  },
};
</script>

<style lang="scss" scoped>
</style>
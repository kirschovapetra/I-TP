<template>
  <b-container>
    <b-row class="d-flex justify-content-end pt-5 pr-5">
      <b-button
        size="sm"
        variant="info"
        id="submit-review-button"
        class="font12 shadow-sm"
        @click="toggleBranchModal()"
      >
        Pridať pobočku
      </b-button>
    </b-row>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="profile-h3">Pobočky</h3>
    </b-row>
    <b-row v-if="this.$props.branchDataList.length > 0">
      <div class="accordion" role="tablist">
        <BranchCard
          v-for="(branch, i) in branchesData"
          :key="i"
          :branchData="branch"
          @reload="reload"
        />
      </div>
    </b-row>
    <b-row v-else class="text-info p-2 d-flex justify-content-center font12">
      Nenašli sa žiadne pobočky
    </b-row>
  </b-container>
</template>

<script>
import BranchCard from "@/components/Branch/BranchCard.vue";
import BranchModal from "@/components/Branch/AddModal.vue";

export default {
  name: "BranchList",
  components: {
    BranchCard,
  },
  props: { branchDataList: { type: Array }, addBranchTaskId: { type: String } },
  data() {
    return { branchesData: this.$props.branchDataList };
  },
  methods: {
    reload() {
      this.$emit("reload");
    },
    toggleBranchModal() {
      this.$modal.show(
        BranchModal,
        { addBranchTaskId: this.$props.addBranchTaskId },
        { height: "auto" },
        { "before-close": this.reload }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
h3 {
  color: #072a40;
  font-weight: bold;
}
hr {
  width: 50%;
  margin: -3% auto 0 auto;
  background-color: rgb(188, 211, 238);
}
.accordion {
  width: 80%;
  margin: auto;
  padding-bottom: 10%;
}
</style>
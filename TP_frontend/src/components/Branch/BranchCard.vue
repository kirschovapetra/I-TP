<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button
        block
        variant="light"
        class="text-left d-flex justify-content-between"
        @click="toggleBranchModal()"
      >
        <div class="font12">
          {{ branchJson.branch.name }}
        </div>
      </b-button>
    </b-card-header>
  </b-card>
</template>

<script>
import BranchModal from "@/components/Branch/AddModal.vue";

export default {
  name: "BranchCard",
  props: {
    branchData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      branchJson: this.$props.branchData,
    };
  },
  methods: {
    reload() {
      this.$emit("reload");
    },
    toggleBranchModal() {
      this.$modal.show(
        BranchModal,
        {
          branchJson: this.branchJson,
          editBranchTaskId: this.$props.branchData.editTaskId,
          deleteBranchTaskId: this.$props.branchData.deleteTaskId,
        },
        { height: "auto" },
        { "before-close": this.reload }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
h5 {
  margin-bottom: 5%;
}
.card-body {
  padding: 2% 7% 5% 7%;
}
</style>
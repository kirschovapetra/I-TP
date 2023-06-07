<template>
  <b-container>
    <b-row>
      <b-col md="5" class="pr-3">
        <b-form-group style="width: 100%">
          <label for="review-title-input" class="font12 font-weight-bold">
            Názov
          </label>
          <b-form-input
            id="review-title-input"
            class="font12 shadow-sm"
            placeholder="Názov recenzie"
            v-model="formData.review_title"
          ></b-form-input>
        </b-form-group>
        <b-form-group style="width: 100%">
          <label for="rating" class="font-weight-bold font12">Hodnotenie</label>
          <b-form-rating
            icon-empty="heart"
            icon-half="heart-half"
            icon-full="heart-fill"
            id="rating"
            variant="info"
            icon-clear="slash-circle"
            show-clear
            v-model="formData.stars"
            no-border
            size="lg"
            style="margin-left: -8%"
          />
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group class="review-form-group">
          <label for="review-name-input" class="font12 font-weight-bold">
            Meno
          </label>
          <b-form-input
            id="review-name-input"
            class="font12 shadow-sm"
            placeholder="Meno"
            v-model="formData.reviewer"
          ></b-form-input>
        </b-form-group>
        <b-form-group class="review-form-group">
          <label for="review-textarea" class="font12 font-weight-bold">
            Recenzia
          </label>
          <b-form-textarea
            id="review-textarea"
            placeholder="Napíšte recenziu"
            class="font12 shadow-sm"
            rows="5"
            v-model="formData.review_text"
          >
          </b-form-textarea>
        </b-form-group>

        <b-form-group class="d-flex justify-content-end review-form-group">
          <b-button
            variant="info"
            id="submit-review-button"
            class="font12 shadow-sm"
            @click="onSubmit"
            :disabled="!isValid"
          >
            Odoslať recenziu
          </b-button>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    addReviewTaskId: { type: String },
  },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      formData: {
        reviewer: null,
        review_text: null,
        review_title: null,
        stars: null,
      },
    };
  },
  methods: {
    async onSubmit() {
      var data = await this.AssignTask(
        this.user.token,
        this.$props.addReviewTaskId
      );
      console.log(data);

      var reviewTaskId = data.data.changedFields.add_review_taskref.value[0];

      var reviewPayload = {};

      reviewPayload[reviewTaskId + "-reviewer"] = {
        type: "text",
        value: this.formData.reviewer,
      };
      reviewPayload[reviewTaskId + "-review_text"] = {
        type: "text",
        value: this.formData.review_text,
      };
      reviewPayload[reviewTaskId + "-review_title"] = {
        type: "text",
        value: this.formData.review_title,
      };
      reviewPayload[reviewTaskId + "-review_stars"] = {
        type: "enumeration",
        value: "★".repeat(this.formData.stars),
      };

      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.addReviewTaskId,
          reviewPayload
        )
      );

      console.log(
        await this.FinishTask(this.user.token, this.$props.addReviewTaskId)
      );

      this.formData = {
        reviewer: null,
        review_text: null,
        review_title: null,
        stars: null,
      };

      this.$emit("reload");
    },
  },
  computed: {
    isValid() {
      return (
        this.formData.reviewer &&
        this.formData.review_text &&
        this.formData.review_title &&
        this.formData.stars
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.review-form-group {
  width: 100%;
}
</style>
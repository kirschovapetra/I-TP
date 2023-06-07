<template>
  <b-container>
    <b-row class="d-flex justify-content-between pt-5 px-5">
      <b-button
        size="sm"
        variant="info"
        id="add-button"
        class="font12 shadow-sm"
        @click="toggleAddProductModal()"
      >
        Pridať produkt
      </b-button>
      <b-button
        size="sm"
        variant="info"
        type="submit"
        id="upload-button"
        class="font12 shadow-sm"
        @click="toggleUploadModal()"
      >
        Nahrať produkty z csv
      </b-button>
    </b-row>

    <b-row class="d-flex justify-content-center py-5">
      <h3 class="profile-h3">Produkty</h3>
    </b-row>

    <b-row class="p-2 px-5" v-if="this.$props.productDataList.length > 0">
      <b-col v-for="(product, id) in products" :key="id" lg="3">
        <b-card
          no-body
          class="overflow-hidden mb-2 shadow-sm py-2"
          border-variant="light"
        >
          <b-row
            no-gutters
            class="d-flex align-items-center justify-content-center"
          >
            <b-card-img :src="product.picture" style="width: 75%"></b-card-img>
            <b-card-body no-body>
              <b-link @click="toggleEditProductModal(id)" class="text-info">
                <h3>
                  <u>{{ product.prod_name }} </u>
                </h3>
              </b-link>
              <b-card-text>
                <p>{{ product.description }}</p>
                <p class="text-info h4">
                  <b> {{ product.price_dph }} €</b>
                </p>
                <p class="text-secondary h6">{{ product.price_no_dph }} €</p>
              </b-card-text>
            </b-card-body>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-else class="text-info font12 d-flex justify-content-center p-2">
      Nenašli sa žiadne produkty
    </b-row>
  </b-container>
</template>


<script>
import ProductModal from "@/components/product/ProductModal.vue";
import FileUploadModal from "@/components/product/FileUploadModal.vue";
export default {
  name: "Products",

  props: {
    productDataList: { type: Array },
    addProductTaskId: { type: String },
    uploadFileTaskId: { type: String },
  },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      products: this.$props.productDataList,
    };
  },
  methods: {
    reload() {
      this.$emit("reload");
    },
    toggleAddProductModal() {
      this.$modal.show(
        ProductModal,
        { addProductTaskId: this.$props.addProductTaskId },
        { width: "60%", height: "auto" },
        { "before-close": this.reload }
      );
    },
    toggleUploadModal() {
      this.$modal.show(
        FileUploadModal,
        { uploadFileTaskId: this.$props.uploadFileTaskId },
        { width: "60%", height: "auto" },
        { "before-close": this.reload }
      );
    },
    toggleEditProductModal(id) {

      this.$modal.show(
        ProductModal,
        {
          productJson: this.products[id],
          editProductTaskId: this.products[id].editTaskId,
          deleteProductTaskId: this.products[id].deleteTaskId,
        },
        { width: "60%", height: "auto" },
        { "before-close": this.reload }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
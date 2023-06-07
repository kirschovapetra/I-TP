<template>
  <div class="example-modal-center">
    <div class="text-center py-4">
      <h1>Produkt: {{ form.prod_name }}</h1>
      <div style="display: none">{{ form }}</div>
    </div>
    <b-form>
      <b-form-row>
        <b-col class="px-4 pb-4">
          <b-form-group class="pr-3 ml-3" label-for="input-name">
            <template v-slot:label>
              <span class="text-danger">*</span> Názov produktu
            </template>
            <b-form-input
              id="input-name"
              rows="6"
              placeholder="Názov"
              v-model="form.prod_name"
              required
              :state="form.prod_name != ''"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group>
            <div class="d-flex justify-content-between">
              <b-form-group class="col-6" label-for="input-code">
                <template v-slot:label>
                  <span class="text-danger">*</span> Kód produktu
                </template>
                <b-form-input
                  id="input-code"
                  type="text"
                  placeholder="Kód produktu"
                  v-model="form.prod_code"
                  required
                  :state="form.prod_code != ''"
                >
                </b-form-input>
              </b-form-group>
              <b-form-group class="col-6" label="Stav" label-for="input-status">
                <b-form-select
                  id="input-status"
                  type="text"
                  placeholder="Stav"
                  v-model="form.order_status"
                  :options="statusOptions"
                  :state="form.order_status != ''"
                >
                </b-form-select>
              </b-form-group>
            </div>
          </b-form-group>
          <b-form-group
            class="pr-3 ml-3"
            label="Kategória"
            label-for="input-code"
          >
            <template v-slot:label>
              <span class="text-danger">*</span> Kategória
            </template>
            <b-form-select
              id="input-code"
              type="text"
              placeholder="Kategória"
              v-model="form.category_type"
              :options="categoryOptions"
              required
              :state="form.category_type != ''"
            >
            </b-form-select>
          </b-form-group>

          <b-form-group>
            <div class="d-flex justify-content-between">
              <b-form-group class="col-6" label-for="input-priceVAT">
                <template v-slot:label>
                  <span class="text-danger">*</span> Cena s DPH
                </template>
                <b-form-input
                  id="input-priceVAT"
                  type="number"
                  placeholder="Cena s DPH"
                  description="Cena musí byť väčšia ako 0!"
                  v-model="form.price_dph"
                  required
                  :state="form.price_dph > 0"
                >
                </b-form-input>
              </b-form-group>

              <b-form-group
                class="col-6"
                label="Cena bez DPH"
                label-for="input-priceNoVAT"
              >
                <b-form-input
                  id="input-priceNoVAT"
                  type="number"
                  placeholder="Cena bez DPH"
                  :value="noVat"
                  disabled
                >
                </b-form-input>
              </b-form-group>
            </div>
          </b-form-group>

          <b-form-group
            class="pr-3 ml-3"
            label="Záruka"
            label-for="input-warranty"
          >
            <b-form-input
              id="input-warranty"
              type="number"
              placeholder="Počet rokov"
              v-model="form.warranty"
            >
            </b-form-input>
          </b-form-group>

          <b-form-group
            class="pr-3 ml-3"
            description="Počet kusov musí byť väčší ako 0!"
            label-for="input-quantity"
          >
            <template v-slot:label>
              <span class="text-danger">*</span> Počet kusov na sklade
            </template>
            <b-form-input
              id="input-quantity"
              type="number"
              placeholder="Počet kusov na sklade"
              v-model="form.quantity"
              required
              :state="form.quantity > 0"
            >
            </b-form-input>
          </b-form-group>
        </b-col>

        <b-col class="px-4 pb-4">
          <b-form-group class="d-flex justify-content-center">
            <b-img :src="form.picture" height="150" />
          </b-form-group>
          <b-form-group class="pr-3 ml-3">
            <b-form-file
              id="input-picture"
              v-model="file"
              placeholder="Nahrajte súbor"
            ></b-form-file>
          </b-form-group>
          <b-form-group
            class="pr-3 ml-3"
            label="Popis"
            label-for="input-description"
          >
            <b-form-textarea
              id="input-description"
              rows="3"
              placeholder="Krátky popis"
              v-model="form.description"
            >
            </b-form-textarea>
          </b-form-group>

          <b-form-group
            class="pr-3 ml-3"
            label="Parametre"
            label-for="input-parameters"
            description="Parametre oddelené čiarkou"
          >
            <b-form-textarea
              id="input-parameters"
              rows="3"
              placeholder="Parametre"
              v-model="form.parameters"
            >
            </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row class="d-flex justify-content-between px-5 pb-5">
        <b-button @click="cancel" size="lg" variant="secondary">
          Zrušiť
        </b-button>
        <b-button
          @click="onSubmit"
          size="lg"
          variant="info"
          :disabled="!isValid"
        >
          Uložiť
        </b-button>
      </b-form-row>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "ProductModal",
  props: [
    "productJson",
    "addProductTaskId",
    "editProductTaskId",
    "deleteProductTaskId",
  ],
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      action: "",
      file: null,
      form: {
        category_type: "",
        order_status: "Na sklade",
        prod_code: "",
        prod_name: "",
        parameters: "",
        description: "",
        price_dph: 0,
        price_no_dph: 0,
        warranty: 0,
        quantity: 1,
        picture: "https://via.placeholder.com/250",
      },
      categoryOptions: [
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
      statusOptions: ["Na objednávku", "Predpredaj", "Na sklade"],
    };
  },
  mounted() {
    if (this.$props.productJson == undefined) {
      this.action = "add";
    } else {
      this.form = this.$props.productJson;
      this.action = "edit";
    }
  },
  computed: {
    noVat() {
      return (parseFloat(this.form.price_dph) / 1.2).toFixed();
    },
    isValid() {
      return (
        this.form.prod_name != "" &&
        this.form.prod_code != "" &&
        this.form.order_status != "" &&
        this.form.category_type != "" &&
        this.form.price_dph > 0 &&
        this.form.quantity > 0
      );
    },
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    async onSubmit(event) {
      event.preventDefault();

      if (this.action == "add") {
        await this.addProduct();
      } else if (this.action == "edit") {
        await this.editProduct();
      }

      this.cancel();
      return "done";
    },

    async addProduct() {
      // token, taskId
      var data = await this.AssignTask(
        this.user.token,
        this.$props.addProductTaskId
      );

      var productTaskId = data.data.changedFields.product_taskRef.value[0];

      /*************** product data ****************/
      var productPayload = {};

      productPayload[productTaskId + "-category_type"] = {
        type: "enumeration",
        value: this.form.category_type,
      };
      productPayload[productTaskId + "-order_status"] = {
        type: "text",
        value: this.form.order_status,
      };
      productPayload[productTaskId + "-prod_code"] = {
        type: "text",
        value: this.form.prod_code,
      };
      productPayload[productTaskId + "-prod_name"] = {
        type: "text",
        value: this.form.prod_name,
      };
      productPayload[productTaskId + "-parameters"] = {
        type: "text",
        value: this.form.parameters,
      };
      productPayload[productTaskId + "-description"] = {
        type: "text",
        value: this.form.description,
      };
      productPayload[productTaskId + "-price_dph"] = {
        type: "number",
        value: parseFloat(this.form.price_dph),
      };
      productPayload[productTaskId + "-warranty"] = {
        type: "number",
        value: parseInt(this.form.warranty),
      };
      productPayload[productTaskId + "-quantity"] = {
        type: "number",
        value: parseInt(this.form.quantity),
      };

      // edit product: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.addProductTaskId,
          productPayload
        )
      );

      if (this.file) {
        let formData = new FormData();
        formData.append("file", this.file);

        await this.SubmitFile(
          this.user.token,
          this.$props.addProductTaskId,
          productTaskId + "-picture",
          formData
        );
      }

      // token, taskId
      console.log(
        await this.FinishTask(this.user.token, this.$props.addProductTaskId)
      );

      return "done";
    },
    async editProduct() {
      // token, taskId
      console.log(
        await this.AssignTask(this.user.token, this.$props.editProductTaskId)
      );

      /*************** product data ****************/
      var productPayload = {};

      productPayload["category_type"] = {
        type: "enumeration",
        value: this.form.category_type,
      };
      productPayload["order_status"] = {
        type: "text",
        value: this.form.order_status,
      };
      productPayload["prod_code"] = {
        type: "text",
        value: this.form.prod_code,
      };
      productPayload["prod_name"] = {
        type: "text",
        value: this.form.prod_name,
      };
      productPayload["parameters"] = {
        type: "text",
        value: this.form.parameters,
      };
      productPayload["description"] = {
        type: "text",
        value: this.form.description,
      };
      productPayload["price_dph"] = {
        type: "number",
        value: parseFloat(this.form.price_dph),
      };
      productPayload["price_no_dph"] = {
        type: "number",
        value: parseFloat(this.form.price_no_dph),
      };
      productPayload["warranty"] = {
        type: "number",
        value: parseInt(this.form.warranty),
      };
      productPayload["quantity"] = {
        type: "number",
        value: parseInt(this.form.quantity),
      };

      // edit product: token, taskId, payload
      console.log(
        await this.EditDataByTask(
          this.user.token,
          this.$props.editProductTaskId,
          productPayload
        )
      );

      if (this.file) {
        let formData = new FormData();
        formData.append("file", this.file);

        await this.SubmitFile(
          this.user.token,
          this.$props.editProductTaskId,
          "picture",
          formData
        );
      }

      // token, taskId
      console.log(
        await this.FinishTask(this.user.token, this.$props.editProductTaskId)
      );

      return "done";
    },
  },
};
</script>

<style scoped lang="css">
</style>
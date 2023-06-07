<template>
	<div>
    <!-- Cart Modal -->
    <b-modal ref="cart-modal" id="cart-modal" hide-footer centered modal-class="cart-modal">
      <template #modal-header="">
        <h5 style="margin:auto">Produkt bol pridaný do košíka.</h5>
      </template>
      <div class="d-block text-center">
        <b-button variant="outline-info" id="add-to-cart-button" class="btn-modal" @click="$bvModal.hide('cart-modal')">Pokračovať v nákupe</b-button>
        <router-link to="/cart"><b-button variant="info" id="add-to-cart-button" class="btn-modal">Do košíka</b-button></router-link>
      </div>
    </b-modal>

		<b-container class="bg-white p-4 my-3 shadow" v-if="productData">
			<b-row class="product-main">

				<b-col md="6" class="image"><ProductImageCarousel :images="[productData.picture]"/></b-col>
				
				<b-col md="6" class="details">
					<b-row class="d-flex justify-content-between"> 
            <p class="h1">{{productData.prod_name}} </p>
            <b-icon :icon="favorited? 'heart-fill' : 'heart'" variant="info" font-scale="2.5" class="ml-3" @click="addToFavorites"></b-icon> 
           
        </b-row>
					<b-row>
						<p class="text-secondary"><i>Kód produktu: {{productData.prod_code}}</i></p>
					</b-row>
					<b-row><p class="mt-4 text-secondary text-left">{{productData.description}}</p></b-row>
					<b-row class="text-secondary text-left" v-if="productData.parameters">
						<p>
							<ul>
								<li v-for="(param, i) in productData.parameters.split(',')" :key="i">{{param}}</li>
								<li>Záruka: {{warranty}}</li>
							</ul>
						</p>
					</b-row>
					<b-row class="py-3 px-2">
						<b-col md="5">
							<b-row class="mb-3">
								<h4 :class="!soldOut ? ['text-info', 'ml-3'] : ['text-info', 'ml-3', 'text-danger']">{{productData.order_status}}</h4>
							</b-row>
						</b-col>
						<b-col>
							<b-row class="price-dph" v-if="productData.price_dph">
								<b-col class="text-left"><h4>Cena s DPH:</h4></b-col>
								<b-col class="text-right"><h4>{{parseFloat(productData.price_dph).toFixed(2)}} €</h4></b-col>
							</b-row>
							<b-row class="text-secondary" v-if="productData.price_no_dph">
								<b-col class="text-left">Cena bez DPH:</b-col>
								<b-col class="text-right">{{parseFloat(productData.price_no_dph).toFixed(2)}} €</b-col>
							</b-row>
						</b-col>
					</b-row>
					<b-row class="ml-1 mt-5" align-h="end">
						<b-form inline>
							<b-form-input v-model="quantityToBuy" type="number" id="amount" class="font12 m-2 text-center shadow-sm" min="1" :max="maxAmount"/>
							<b-button variant="info" id="add-to-cart-button" class="font12 shadow-sm" @click="addToCart">Vložiť do košíka</b-button>
						</b-form>
					</b-row>
				</b-col>
			</b-row>
		</b-container>
    <b-container class="bg-white p-4 my-3 shadow" v-else> Nenašli sa žiadne údaje</b-container>
	</div>
</template>


<script>
import ProductImageCarousel from "@/components/product/ProductImageCarousel.vue";

export default {
  name: "ProductDetail",
  props: {
    productData: { type: Object },
    caseId: { type: String },
  },
  components: {
    ProductImageCarousel,
  },
  data() {
    return {
      shoppingTaskId: null,
      quantityToBuy: 1,
      soldOut: false,
      state: "Na sklade",
      favoriteProducts: {},
      favorited: false,
      allCases: null,
      user: null,
    };
  },
  created() {
    this.getState();

    this.favoriteProducts = sessionStorage.getItem("favoriteProducts")
      ? JSON.parse(sessionStorage.getItem("favoriteProducts"))
      : {};

    this.favorited = this.favoriteProducts[this.$props.caseId] != null;
  },
  methods: {
    async addProductToBE() {
      await this.getShoppingTask();
      let shoppingTaskRefId = null;
      if (!JSON.parse(sessionStorage.getItem("assignedShopping"))) {
        let response = await this.AssignTask(
          this.user.token,
          this.shoppingTaskId
        );
        console.log(response);
        sessionStorage.setItem("assignedShopping", JSON.stringify(true));
        shoppingTaskRefId = response.data.changedFields.cart_taskRef.value[0];
        sessionStorage.setItem("shoppingTaskRefId", shoppingTaskRefId);
      } else {
        shoppingTaskRefId = sessionStorage.getItem("shoppingTaskRefId");
      }

      let payload = {
        [shoppingTaskRefId + "-allItemsSelect"]: {
          type: "enumeration_map",
          value: this.caseId,
        },
        [shoppingTaskRefId + "-count"]: {
          type: "number",
          value: this.quantityToBuy,
        },
        [shoppingTaskRefId + "-addButton"]: {
          type: "button",
          value: 1,
        },
      };
      await this.EditDataByTask(this.user.token, this.shoppingTaskId, payload);
    },
    async getShoppingTask() {
      this.allCases = JSON.parse(sessionStorage.getItem("activeTasks"));
      this.user = JSON.parse(sessionStorage.getItem("user"));
      /************ tasky v klientskom ucte ***********/
      var clientCase = this.allCases.filter((_case) => {
        return (
          _case.processIdentifier == this.user.groupId + "_klient" &&
          _case.title == this.user.email.email + "_klient"
        );
      })[0];

      if (!clientCase) {
        console.log("nenasiel sa taky klientsky case");
        return "failure";
      }

      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        clientCase.stringId
      );
      var clientTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];

      for (var i in clientTasks) {
        if (clientTasks[i].transitionId == 19) {
          this.shoppingTaskId = clientTasks[i].stringId;
        }
      }
    },

    addToCart() {
      let productsInCart = {};
      if (sessionStorage.getItem("productsInCart")) {
        productsInCart = JSON.parse(sessionStorage.getItem("productsInCart"));
      }
      productsInCart["product" + this.$props.productData.prod_code] = {
        product: this.$props.productData,
        quantityToBuy: this.quantityToBuy,
      };
      this.$emit("updateItemsCount");
      sessionStorage.setItem("productsInCart", JSON.stringify(productsInCart));
      this.$refs["cart-modal"].show();

      this.addProductToBE();
    },
    addToFavorites() {
      this.favoriteProducts = sessionStorage.getItem("favoriteProducts")
        ? JSON.parse(sessionStorage.getItem("favoriteProducts"))
        : {};

      if (this.favorited) {
        delete this.favoriteProducts[this.$props.caseId];
        this.favorited = false;
      } else {
        this.favoriteProducts[this.$props.caseId] = {
          product: this.$props.productData,
        };
        this.favorited = true;
      }

      if (Object.keys(this.favoriteProducts).length === 0) {
        sessionStorage.removeItem("favoriteProducts");
      } else {
        sessionStorage.setItem(
          "favoriteProducts",
          JSON.stringify(this.favoriteProducts)
        );
      }
    },
    getState() {
      if (this.$props.productData.quantity < 5) {
        this.state = "Zostávajú posledné kusy";
      }
      if (this.$props.productData.quantity <= 0) {
        this.state = "Vypredané";
        this.soldOut = true;
      }
    },
  },
  computed: {
    maxAmount() {
      return this.$props.productData.quantity > 99
        ? 99
        : this.$props.productData.quantity;
    },
    warranty() {
      return this.$props.productData.warranty == 1
        ? this.$props.productData.warranty + " rok"
        : this.$props.productData.warranty <= 4
        ? this.$props.productData.warranty + " roky"
        : this.$props.productData.warranty + " rokov";
    },
  },
};
</script>

<style scoped lang="css">
.details {
  padding: 3% 5% 0 5%;
}

#amount {
  width: 30%;
  margin-right: 1%;
  font-size: 1.2em;
}

.btn-modal {
  margin: 0 1rem;
}

.btn-outline-info:hover {
  background-color: #f2f2f2;
  color: #17a2bb;
}

.b-icon {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.b-icon:hover {
  /* cursor: pointer; */
  color: #17a3b8a1 !important;

  transform: scale(1.3);
}
</style>

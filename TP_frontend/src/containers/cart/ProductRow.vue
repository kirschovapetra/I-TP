<template>
  <b-container :id="id" class="product-row">
    <b-row align-v="center">
      <b-col lg="1" class="product-image">
        <!-- TODO: upravit link na konkretny produkt ked bude spraveny-->
        <a @click="clickOnProduct(value.product)">
          <!-- <img :src="value.product.images[0]" alt="product image"/> -->
        </a>
      </b-col>
      <b-col lg="3" class="product-name" align="left">
        <!-- TODO: upravit link na konkretny produkt ked bude spraveny-->
        <a style="color: #17a2b8" @click="click(value.product.caseId)"
          ><p>{{ value.product.prod_name }}</p></a
        >
      </b-col>
      <b-col lg="1" class="product-quantity" style="padding: 0" align="center">
        <div style="display: inline-flex; margin: auto">
          {{ quantityToBuy }} ks
          <!-- <input
            class="quantity-input"
            v-model.number="quantityToBuy"
            type="number"
            min="1"
            :max="MaxAmount"
          />
          <div class="quantity-buttons">
            <b-button
              variant="info"
              class="quantity-increment"
              @click="quantityInc"
            >
              <p>+</p>
            </b-button>
            <b-button
              variant="info"
              class="quantity-decrement"
              @click="quantityDec"
            >
              <p>-</p>
            </b-button>
          </div> -->
        </div>
      </b-col>
      <!-- <b-col lg="2" class="product-availability">
        <p :style="{ color: AvailabilityColor }">{{ Availability }}</p>
      </b-col> -->
      <b-col lg="2">
        <p v-if="quantityToBuy > 1">
          {{ value.product.price_dph.toFixed(2) }} € / ks
        </p>
      </b-col>
      <b-col lg="2" class="product-price">
        <p>{{ (value.product.price_dph * quantityToBuy).toFixed(2) }} €</p>
      </b-col>
      <b-col lg="1">
        <b-icon
          class="product-remove"
          icon="trash"
          scale="1.3"
          @click="removeProduct"
        ></b-icon>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "ProductRow",
  props: {
    value: Object,
    id: String,
  },
  data() {
    return {
      quantityToBuy: parseInt(this.value.quantityToBuy),
      storedQuantity: parseInt(this.value.quantityToBuy),
      availabilityColor: "",
    };
  },
  computed: {
    MaxAmount() {
      return this.value.product.quantity > 99
        ? 99
        : this.value.product.quantity;
    },
    // AvailabilityColor() {
    //   if (
    //     this.value.product.quantity > 0 &&
    //     this.value.product.quantity < this.quantityToBuy
    //   ) {
    //     return "orange";
    //   } else if (this.value.product.quantity > 0) {
    //     return "green";
    //   } else {
    //     return "#e02323";
    //   }
    // },
    // Availability() {
    //   if (
    //     this.value.product.quantity > 0 &&
    //     this.value.product.quantity < this.quantityToBuy
    //   ) {
    //     return "Na sklade len " + this.value.product.quantity + " ks";
    //   } else if (this.value.product.quantity > 0) {
    //     return "Na sklade";
    //   } else {
    //     return "Momentálne nedostupné";
    //   }
    // },
  },
  methods: {
    quantityInc() {
      this.quantityToBuy += 1;
      // this.$emit('update-total-price', this.value.product.price_dph.toFixed(2), this.value.product.price_no_dph.toFixed(2), "inc");
    },
    quantityDec() {
      if (this.quantityToBuy > 1) {
        this.quantityToBuy -= 1;
        // this.$emit('update-total-price', this.value.product.price_dph.toFixed(2), this.value.product.price_no_dph.toFixed(2), "dec");
      }
    },
    removeProduct() {
      let productsInCart = JSON.parse(sessionStorage.getItem("productsInCart"));
      delete productsInCart[this.id];
      if (Object.keys(productsInCart).length === 0) {
        sessionStorage.removeItem("productsInCart");
      } else {
        sessionStorage.setItem(
          "productsInCart",
          JSON.stringify(productsInCart)
        );
      }
      this.$emit(
        "update-total-price",
        this.value.product.price_dph.toFixed(2),
        this.value.product.price_no_dph.toFixed(2),
        this.storedQuantity,
        this.quantityToBuy,
        "dec"
      );
      this.$emit(
        "remove-product",
        this.id,
        productsInCart,
        this.value.product.prod_name
      );
      this.$emit("updateItemsCount");
    },
  },
  watch: {
    quantityToBuy() {
      if (this.storedQuantity < this.quantityToBuy) {
        //inc
        this.$emit(
          "update-total-price",
          this.value.product.price_dph.toFixed(2),
          this.value.product.price_no_dph.toFixed(2),
          this.storedQuantity,
          this.quantityToBuy,
          "inc"
        );
        this.storedQuantity = this.quantityToBuy;
      } else if (this.storedQuantity > this.quantityToBuy) {
        // dec
        this.$emit(
          "update-total-price",
          this.value.product.price_dph.toFixed(2),
          this.value.product.price_no_dph.toFixed(2),
          this.storedQuantity,
          this.quantityToBuy,
          "dec"
        );
        this.storedQuantity = this.quantityToBuy;
      }
    },
  },
  mounted() {
    this.$emit(
      "calculate-total-price",
      this.value.product.price_dph.toFixed(2),
      this.value.product.price_no_dph.toFixed(2),
      this.quantityToBuy
    );
  },
};
</script>

<style scoped lang="css">
a {
  cursor: pointer;
}
p {
  margin: 0;
}
.product-row {
  transition: all 0.8s cubic-bezier(0.1, 0, 0, 1) 0s;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.product-row:hover {
  background-color: #f2f2f2;
  transition: all 0.8s cubic-bezier(0.1, 0, 0, 1) 0s;
}
.product-image img {
  width: 100%;
  max-width: 15rem;
}
.product-remove:hover {
  color: #e02323;
  transition: all 0.8s cubic-bezier(0.1, 0, 0, 1) 0s;
  cursor: pointer;
}
.product-name,
.product-price {
  color: #17a2b8;
  font-weight: bold;
}
.product-quantity {
  display: flex;
  align-items: center;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.quantity-buttons {
  display: flex;
  flex-direction: column;
}
.quantity-increment,
.quantity-decrement,
.btn p {
  max-height: 1.25rem;
  padding: 0;
  border-radius: 0;
}
.quantity-increment,
.quantity-decrement {
  display: flex;
  align-items: center;
  width: 1.5rem;
}
.quantity-decrement p {
  padding-bottom: 0.2rem;
}
.quantity-decrement {
  border-bottom-right-radius: 4px;
}
.quantity-increment {
  border-top-right-radius: 4px;
}
.btn p {
  display: flex;
  align-items: center;
  margin: auto;
}
.quantity-input {
  height: 2.5rem;
  width: 3rem;
  text-align: center;
  border: 1px solid #999999;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.btn-info:not(:disabled):not(.disabled):focus {
  box-shadow: none !important;
}

@media all and (max-width: 992px) {
  .product-name {
    text-align: center;
  }
  p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  #amount {
    max-width: 5rem;
    margin: auto;
  }
}
</style>

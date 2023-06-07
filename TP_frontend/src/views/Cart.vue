<template>
  <div class="view-bg">
    <Navigation :trigger="trigger" />
    <b-container class="cart-container">
      <!-- BREADCRUMBS -->
      <b-container class="font13 bg-white shadow mb-3">
        <b-row class="px-2 pt-3">
          <b-breadcrumb class="bg-white">
            <b-breadcrumb-item @click="toCart" :active="cartView">
              Košík
            </b-breadcrumb-item>
            <b-breadcrumb-item
              :class="{ 'breadcrumb-link-disabled': emptyCart }"
              :disabled="emptyCart"
              @click="toShipping"
              :active="shippingView"
            >
              Objednávka
            </b-breadcrumb-item>
            <b-breadcrumb-item
              :class="{ 'breadcrumb-link-disabled': emptyShipping }"
              :disabled="emptyShipping"
              @click="toOrderCheck"
              :active="orderCheckView"
            >
              Rekapitulácia
            </b-breadcrumb-item>
          </b-breadcrumb>
        </b-row>
      </b-container>

      <b-row class="py-3 breadcrumb shadow" v-if="!orderCheckView">
        <b-col class="cart-content">
          <template v-if="!emptyCart">
            <ProductRow
              v-for="(value, key, index) in products"
              :key="index"
              :id="'product' + value.product.prod_code"
              :value="value"
              @remove-product="removeProduct"
              @calculate-total-price="calculateTotalPrice"
              @update-total-price="updateTotalPrice"
              @updateItemsCount="updateItemsCount"
            />
          </template>
          <template v-if="emptyCart">
            <p>Košík je prázdny.</p>
          </template>
        </b-col>
        <b-col md="12" style="padding: 0"><hr /></b-col>
        <b-col md="12">
          <table class="total-prices">
            <tr>
              <td>
                <p>Celkom bez DPH</p>
              </td>
              <td>
                <p>{{ totalPriceWithoutVAT.toFixed(2) }} €</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Celkom s DPH</p>
              </td>
              <td>
                <p>{{ totalPriceVAT.toFixed(2) }} €</p>
              </td>
            </tr>
            <tr>
              <td>
                <p><b>K úhrade</b></p>
              </td>
              <td>
                <p style="color: #17a2b8">
                  <b>{{ totalPriceVAT.toFixed(2) }} €</b>
                </p>
              </td>
            </tr>
          </table>
          <!-- <router-link to="/shipping"><b-button variant="info">Pokračovať</b-button></router-link> -->
          <b-button :disabled="emptyCart" variant="info" @click="toShipping">
            Pokračovať
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="shippingView" class="breadcrumb shadow">
        <b-col md="12">
          <Order
            @back="toCart"
            @check="toOrderCheck"
            :formDataProp="formData"
          />
        </b-col>

        <!-- <b-col md="3" class="bg-light round-border box-shadow">
        </b-col> -->
      </b-row>

      <b-row
        v-if="orderCheckView"
        class="breadcrumb shadow d-flex justify-content-between"
      >
        <OrderCheck
          :delivery_address="formData.delivery_address"
          :billing_address="formData.billing_address"
          :items="parseProducts(products)"
          :totalPriceVAT="totalPriceVAT"
          :totalPriceWithoutVAT="totalPriceWithoutVAT"
        />

        <b-button
          variant="secondary"
          id="back-button"
          class="shadow-sm mt-3 mb-4"
          style="margin-left: 10%"
          @click="toShipping"
        >
          Späť
        </b-button>

        <b-button
          variant="info"
          id="order-button"
          class="shadow-sm mt-3 mb-4"
          type="submit"
          style="margin-right: 10%"
          @click="payment"
        >
          Objednať s povinnosťou platby
        </b-button>
      </b-row>
    </b-container>

    <div class="bg-white p-5 shadow code-input" v-if="codeEnter">
      <b-row class="d-flex justify-content-center my-4">
        <h4>Zadajte overovací kód</h4>
      </b-row>
      <b-form-input id="input-num" required v-model="code"></b-form-input>
      <b-row
        class="d-flex justify-content-center text-danger mt-2"
        v-if="incorrect"
      >
        Nesprávny kód!
      </b-row>
      <b-row class="d-flex justify-content-center my-3">
        <b-button
          variant="info"
          @click="codeSubmit"
          :disabled="code.length <= 0"
        >
          Odoslať
        </b-button>
      </b-row>
    </div>

    <div class="card-footer"><Footer /></div>
  </div>
</template>

<script>
import ResponseParser from "@/HelperObjects/ResponseParser.js";
import Navigation from "@/containers/general/Navigation.vue";
import ProductRow from "@/containers/cart/ProductRow.vue";
import Order from "@/containers/order/OrderTab.vue";
import OrderCheck from "@/containers/order/OrderCheck.vue";
import Footer from "@/containers/general/Footer.vue";
import PaymentModal from "@/components/payment/PaymentModal.vue";
import PaymentReceivedModal from "@/components/payment/PaymentReceivedModal.vue";
import CodeGenModal from "@/components/payment/CodeGenModal.vue";

export default {
  name: "Cart",
  components: {
    Navigation,
    ProductRow,
    Order,
    OrderCheck,
    Footer,
  },
  data() {
    return {
      res: {},
      paymentTask: null,
      shoppingTaskId: null,
      allCases: JSON.parse(sessionStorage.getItem("activeTasks")),
      clientCase: null,
      user: JSON.parse(sessionStorage.getItem("user")),
      products: [],
      totalPriceWithoutVAT: 0.0,
      totalPriceVAT: 0.0,
      emptyCart: true,
      emptyShipping: true,
      cartView: true,
      shippingView: false,
      orderCheckView: false,
      codeEnter: false,
      incorrect: false,
      code: "",
      code_gen: "",
      trigger: 0,
      orderTaskRef: "",
      caseIdObjednavky: "",
      items: [
        {
          text: "Košík",
          active: true,
        },
        {
          text: "Doprava a platba",
          to: { name: "Home" },
          disabled: true,
        },
        {
          text: "Dodacie údaje",
          to: { name: "Home" },
          disabled: true,
        },
      ],
      formData: {
        billing_address: {
          first_name: "",
          last_name: "",
          city: "",
          postal_code: "",
          street_name: "",
          street_number: "",
          phone_number: "",
          email: "",
        },
        delivery_address: {
          first_name: "",
          last_name: "",
          city: "",
          postal_code: "",
          street_name: "",
          street_number: "",
          phone_number: "",
          email: "",
        },
      },
    };
  },
  methods: {
    parseProducts(productList) {
      var items = [];
      for (var i in productList) {
        items.push({
          name: productList[i].product.prod_name,
          price: productList[i].product.price_dph,
          amount: productList[i].quantityToBuy,
        });
      }
      return items;
    },
    async getShoppingTask() {
      this.allCases = JSON.parse(sessionStorage.getItem("activeTasks"));
      this.user = JSON.parse(sessionStorage.getItem("user"));
      /************ tasky v klientskom ucte ***********/
      this.clientCase = this.allCases.filter((_case) => {
        return (
          _case.processIdentifier == this.user.groupId + "_klient" &&
          _case.title == this.user.email.email + "_klient"
        );
      })[0];

      if (!this.clientCase) {
        console.log("nenasiel sa taky klientsky case");
        return "failure";
      }

      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        this.clientCase.stringId
      );
      var clientTasks = tasks.data._embedded ? tasks.data._embedded.tasks : [];

      for (var i in clientTasks) {
        if (clientTasks[i].transitionId == 19) {
          console.log(clientTasks[i]);
          this.shoppingTaskId = clientTasks[i].stringId;
        }
      }
    },
    updateItemsCount() {
      this.trigger++;
    },
    async codeSubmit() {
      if (this.code == this.code_gen) {
        var objednavkaTasks = await this.GetTasksByCaseId(
          this.user.token,
          this.caseIdObjednavky
        );
        var enterCodeTask = objednavkaTasks.data._embedded.tasks.filter(
          (task) => {
            return task.title.includes("Zadať kód");
          }
        )[0];
        console.log(
          await this.AssignTask(this.user.token, enterCodeTask.stringId)
        );

        // edit
        var payload = {};
        payload["code"] = {
          type: "text",
          value: this.code_gen,
        };
        console.log(
          await this.EditDataByTask(
            this.user.token,
            enterCodeTask.stringId,
            payload
          )
        );

        console.log(
          await this.FinishTask(this.user.token, enterCodeTask.stringId)
        );

        this.incorrect = false;
        this.codeEnter = false;
        this.$modal.hideAll();
        this.$modal.show(
          PaymentReceivedModal,
          { height: "auto" },
          { "before-close": this.beforeClose }
        );
      } else {
        this.incorrect = true;
      }
    },
    async payment() {
      var objednavkaTasks = await this.GetTasksByCaseId(
        this.user.token,
        this.caseIdObjednavky
      );

      this.paymentTask = objednavkaTasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Zadať kartu");
      })[0];

      console.log(this.paymentTask);

      console.log(
        await this.AssignTask(this.user.token, this.paymentTask.stringId)
      );

      this.$modal.show(
        PaymentModal,
        { price: this.totalPriceVAT },
        { height: "auto" },
        { closed: this.codeGen }
      );
    },
    beforeClose(event) {
      event.cancel();
    },

    async codeGen() {
      console.log(
        await this.FinishTask(this.user.token, this.paymentTask.stringId)
      );

      var objednavkaTasks = await this.GetTasksByCaseId(
        this.user.token,
        this.caseIdObjednavky
      );

      var smsTask = objednavkaTasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Poslanie kódu");
      })[0];

      console.log(await this.AssignTask(this.user.token, smsTask.stringId));

      var smsData = await this.GetDataByTask(this.user.token, smsTask.stringId);

      console.log(await this.FinishTask(this.user.token, smsTask.stringId));

      this.code_gen =
        smsData.data._embedded.dataGroups[0].fields._embedded.localisedTextFields[0].value;

      console.log(this.code_gen);
      this.codeEnter = true;

      this.$modal.show(
        CodeGenModal,
        {
          code_gen: this.code_gen,
          // codeChanged: (newValue) => {
          //   this.code_gen = newValue;
          // },
        },
        { height: "auto", shiftX: 1, shiftY: 1 },
        { "before-close": this.beforeClose }
      );
    },

    toCart() {
      this.shippingView = false;
      this.cartView = true;
      this.orderCheckView = false;
    },
    async toShipping() {
      /******** ukoncit nakupovat *********/
      console.log(await this.FinishTask(this.user.token, this.shoppingTaskId));

      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        this.clientCase.stringId
      );

      /******** objednat *********/
      var objednatTask = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("Objednať");
      })[0];
      console.log(objednatTask);

      console.log(
        await this.AssignTask(this.user.token, objednatTask.stringId)
      );
      console.log(
        await this.FinishTask(this.user.token, objednatTask.stringId)
      );

      var historiaObjednavokTask = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes("História objednávok");
      })[0];

      var historiaObjednavokData = await this.GetDataByTask(
        this.user.token,
        historiaObjednavokTask.stringId
      );

      var caseIdsObjednavok = Object.keys(
        historiaObjednavokData.data._embedded.dataGroups[0].fields._embedded
          .localisedEnumerationMapFields[0].options
      );
      this.caseIdObjednavky = caseIdsObjednavok[caseIdsObjednavok.length - 1];

      console.log("id poslednej objednavky: " + this.caseIdObjednavky);

      var objednavkaTasks = await this.GetTasksByCaseId(
        this.user.token,
        this.caseIdObjednavky
      );

      var objednavkaDetailTask = objednavkaTasks.data._embedded.tasks.filter(
        (task) => {
          return task.title.includes("Detail");
        }
      )[0];

      var poslednaObjednavkaData = await this.GetDataByTask(
        this.user.token,
        objednavkaDetailTask.stringId
      );

      var usefulDataGroups = poslednaObjednavkaData.data._embedded.dataGroups.filter(
        (group) => {
          return group.fields._embedded != null;
        }
      );
      var parsovanaObjednavka = await ResponseParser.parseOrderHistory(
        0,
        this.user.token,
        objednavkaDetailTask.caseTitle,
        usefulDataGroups
      );

      this.formData.billing_address = {
        first_name: parsovanaObjednavka.contact.first_name,
        last_name: parsovanaObjednavka.contact.last_name,
        city: parsovanaObjednavka.billing_address.city,
        postal_code: parsovanaObjednavka.billing_address.postal_code,
        street_name: parsovanaObjednavka.billing_address.street_name,
        street_number: parsovanaObjednavka.billing_address.street_number,
        phone_number: parsovanaObjednavka.contact.phone_number,
        email: parsovanaObjednavka.contact.email,
      };
      this.formData.delivery_address = {
        first_name: parsovanaObjednavka.contact.first_name,
        last_name: parsovanaObjednavka.contact.last_name,
        city: parsovanaObjednavka.delivery_address.city,
        postal_code: parsovanaObjednavka.delivery_address.postal_code,
        street_name: parsovanaObjednavka.delivery_address.street_name,
        street_number: parsovanaObjednavka.delivery_address.street_number,
        phone_number: parsovanaObjednavka.contact.phone_number,
        email: parsovanaObjednavka.contact.email,
      };

      this.cartView = false;
      this.shippingView = true;
      this.orderCheckView = false;
    },
    toOrderCheck(data) {
      console.log(data);
      this.formData = data;
      this.shippingView = false;
      this.orderCheckView = true;
      this.emptyShipping = false;
    },
    updateTotalPrice(
      priceWithVAT,
      priceWithoutVAT,
      storedQuantity,
      quantityToBuy,
      operation
    ) {
      let quantity = 0;
      if (storedQuantity < quantityToBuy) {
        quantity = quantityToBuy - storedQuantity;
      } else if (storedQuantity > quantityToBuy) {
        quantity = storedQuantity - quantityToBuy;
      } else {
        quantity = quantityToBuy;
      }

      if (operation == "inc") {
        this.totalPriceVAT += parseFloat(priceWithVAT) * quantity;
        this.totalPriceWithoutVAT += parseFloat(priceWithoutVAT) * quantity;
      } else if (operation == "dec") {
        this.totalPriceVAT -= parseFloat(priceWithVAT) * quantity;
        this.totalPriceWithoutVAT -= parseFloat(priceWithoutVAT) * quantity;
      }
    },
    calculateTotalPrice(priceWithVAT, priceWithoutVAT, quantityToBuy) {
      this.totalPriceVAT =
        this.totalPriceVAT + parseFloat(priceWithVAT) * quantityToBuy;
      this.totalPriceWithoutVAT =
        this.totalPriceWithoutVAT + parseFloat(priceWithoutVAT) * quantityToBuy;
    },
    async removeProduct(id, productsInCart, prod_name) {
      let array = this.res.data._embedded.dataGroups;
      for (let i in array) {
        let payload = {};
        if (
          array[i].fields != undefined &&
          array[i].fields._embedded != undefined &&
          array[i].fields._embedded.localisedTextFields != undefined &&
          prod_name == array[i].fields._embedded.localisedTextFields[0].value
        ) {
          payload[
            array[i - 1].fields._embedded.localisedBooleanFields[0].stringId
          ] = { type: "boolean", value: true };
          await this.EditDataByTask(
            this.user.token,
            this.shoppingTaskId,
            payload
          );
        }

        if (Object.keys(payload).length != 0) {
          payload = {};
        }
        payload[array[1].fields._embedded.localisedFields[0].stringId] = {
          type: "button",
          value: 1,
        };

        await this.EditDataByTask(
          this.user.token,
          this.shoppingTaskId,
          payload
        );
      }

      if (Object.keys(productsInCart).length === 0) {
        this.emptyCart = true;
      } else {
        document.getElementById(id).remove();
        // this.$router.go();
      }
    },
    async deleteDuplicatesFromCart(response) {
      let product = null;
      let array = response.data._embedded.dataGroups.slice(2);
      let payload = {};

      for (let i in array) {
        payload = {};
        if (
          (product === null &&
            array[i].fields._embedded != undefined &&
            array[i].fields._embedded.localisedTextFields != undefined) ||
          (array[i].fields != undefined &&
            array[i].fields._embedded != undefined &&
            array[i].fields._embedded.localisedTextFields != undefined &&
            product != array[i].fields._embedded.localisedTextFields[0].value)
        ) {
          product = array[i].fields._embedded.localisedTextFields[0].value;
          continue;
        }

        if (
          array[i].fields != undefined &&
          array[i].fields._embedded != undefined &&
          array[i].fields._embedded.localisedTextFields != undefined &&
          product == array[i].fields._embedded.localisedTextFields[0].value
        ) {
          payload[
            array[i - 1].fields._embedded.localisedBooleanFields[0].stringId
          ] = { type: "boolean", value: true };
          await this.EditDataByTask(
            this.user.token,
            this.shoppingTaskId,
            payload
          );
        }
      }
      if (Object.keys(payload).length != 0) {
        payload = {};
      }
      payload[
        response.data._embedded.dataGroups[1].fields._embedded.localisedFields[0].stringId
      ] = { type: "button", value: 1 };

      await this.EditDataByTask(this.user.token, this.shoppingTaskId, payload);
    },
    prepareProductData(response) {
      let array = response.data._embedded.dataGroups.slice(2);
      let tmpProducts = {};

      for (let i in array) {
        if (
          array[i].fields != undefined &&
          array[i].fields._embedded != undefined &&
          array[i].fields._embedded.localisedTextFields != undefined
        ) {
          tmpProducts[
            array[i].fields._embedded.localisedTextFields[0].value + i
          ] = {
            product: {
              prod_name: array[i].fields._embedded.localisedTextFields[0].value,
              price_dph:
                array[i].fields._embedded.localisedNumberFields[1].value,
              price_no_dph:
                array[i].fields._embedded.localisedNumberFields[2].value,
            },
            quantityToBuy:
              array[i].fields._embedded.localisedNumberFields[0].value,
          };
        }
      }

      return tmpProducts;
    },
  },
  created() {
    if (sessionStorage.getItem("productsInCart")) {
      this.products = JSON.parse(sessionStorage.getItem("productsInCart"));
      this.emptyCart = false;
    } else {
      this.emptyCart = true;
    }
  },
  async mounted() {
    await this.getShoppingTask();
    let shoppingTaskRefId = null;
    if (!JSON.parse(sessionStorage.getItem("assignedShopping"))) {
      let response = await this.AssignTask(
        this.user.token,
        this.shoppingTaskId
      );
      JSON.stringify(sessionStorage.setItem("assignedShopping", true));
      shoppingTaskRefId = response.data.changedFields.cart_taskRef.value[0];
      sessionStorage.setItem("shoppingTaskRefId", shoppingTaskRefId);
    } else {
      shoppingTaskRefId = sessionStorage.getItem("shoppingTaskRefId");
    }

    let response = await this.GetDataByTask(
      this.user.token,
      this.shoppingTaskId
    );
    await this.deleteDuplicatesFromCart(response);
    response = await this.GetDataByTask(this.user.token, this.shoppingTaskId);
    this.res = response;
    await this.prepareProductData(response);
  },
};
</script>

<style scoped lang="css">
.code-input {
  position: fixed;
  bottom: 50%;
  right: 40%;
  width: 20%;
  z-index: 999999 !important;
}
.breadcrumb-item a {
  color: #17a2b8;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  font-family: Calibri;
}
.cart-container {
  padding: 0;
}
.view-bg {
  min-height: calc(100vh);
}
.breadcrumb {
  margin-left: 0;
  width: 100%;
  background-color: white;
  border-radius: 0;
}
.path {
  padding: 0;
  margin: 0 1%;
  font-size: 1.3em;
  text-align: left;
}
.path a {
  color: #17a2b8;
  margin: 0 1%;
}
.cart-content {
  background-color: white;
  padding: 0;
}
.total-prices {
  text-align: right;
  margin-left: auto;
}
.total-prices td {
  padding: 0 1rem;
}
.round-border {
  border-radius: 20px;
}
.box-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.breadcrumb-link {
  color: #17a2b8;
  display: inline;
  margin: 0 1%;
  cursor: pointer;
}
.breadcrumb-link-disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.5 !important;
}
</style>

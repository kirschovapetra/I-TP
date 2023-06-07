<template>
  <div class="pt-3">
    <b-row>
      <b-col
        v-for="(input, i) in inputs"
        :key="i"
        md="6"
        align="left"
        class="form-group address-col"
      >
        <label>
          <b style="color: red" v-if="input.required">* </b>
          <b>{{ input.name }}:</b>
        </label>
        <b-form-input
          :id="addressType + '-address-' + input.name"
          class="shadow-sm"
          :placeholder="input.placeholder"
          :required="input.required"
          :autocomplete="input.autocomplete"
          v-model="value[input.model]"
          :type="input.type"
          :pattern="input.pattern"
        ></b-form-input>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "OrderAddress",
  props: {
    addressType: {
      type: String,
      require: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  watch: {
    value() {
      this.$emit("input", this.value);
    },
  },
  data() {
    return {
      inputs: [
        {
          name: "Meno",
          placeholder: "Meno",
          required: true,
          model: "first_name",
          autocomplete: "given-name",
          type: "text",
          pattern: "(.*?)",
        },
        {
          name: "Priezvisko",
          placeholder: "Priezvisko",
          required: true,
          model: "last_name",
          autocomplete: "family-name",
          type: "text",
          pattern: "(.*?)",
        },
        {
          name: "PSČ",
          placeholder: "00000",
          required: true,
          model: "postal_code",
          autocomplete: "postal-code",
          type: "text",
          pattern: "(^\\d{5}$)|(^\\d\\d\\d \\d\\d$)",
        },
        {
          name: "Mesto",
          placeholder: "Mesto",
          required: true,
          model: "city",
          autocomplete: "address-level2",
          type: "text",
          pattern: "(.*?)",
        },
        {
          name: "Ulica",
          placeholder: "Ulica",
          required: true,
          model: "street_name",
          autocomplete: "street-address",
          type: "text",
          pattern: "(.*?)",
        },
        {
          name: "Číslo domu",
          placeholder: "Číslo domu",
          required: false,
          model: "street_number",
          autocomplete: "house-number",
          type: "text",
          pattern: "(.*?)",
        },
        {
          name: "Telefónne číslo",
          placeholder: "+421000000000",
          required: true,
          model: "phone_number",
          autocomplete: "tel",
          type: "text",
          pattern: "((^[+]\\d*)|(\\d*))",
        },
        {
          name: "E-mail",
          placeholder: "xx@xx.xx",
          required: true,
          model: "email",
          autocomplete: "email",
          type: "email",
          pattern: "^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(.\\w{2,3})+$",
        },
      ],
    };
  },
};
</script>

<style lang="css" scoped>
::placeholder {
  color: #c5c5c5;
}
</style>
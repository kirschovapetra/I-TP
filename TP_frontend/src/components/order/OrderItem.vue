<template>
    <b-container>
        <b-row class="font12">
            <b-col><b>{{item.name}}</b></b-col>
            <b-col class="text-right">{{item.amount}} ks</b-col>
            <b-col class="text-right">{{item.price.toFixed(2) }} €</b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
  name: "OrderItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.col {
  line-height: 80px;
}
</style>
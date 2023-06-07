<template>
  <div
    class="mt-3 p-3 card-borders card-shadow bg-light mx-3 text-break text-wrap"
  >
    <b class="font12 text-info"
      > {{ branchData.branch.name }} </b
    ><br />
    <ul class="text-left ml-4 pt-3">
      <li><b>Ulica:</b> {{ branchData.address.street_name }} {{ branchData.address.street_number }} <br>
    </li>
      <li><b>Mesto</b> {{ branchData.address.city }} <br />
      <li><b>PSČ</b> {{ branchData.address.postal_code }} <br />
    </li>
      <li><b>Telefónne číslo:</b> {{ branchData.branch.phone_number }} <br />
    </li>
      <li><b>E-mail:</b> {{ branchData.branch.email }} 
    </li>
    </ul>
    <p>
    </p>
    <b class="text-info">Otváracie hodiny</b> 
    <p v-if="branchData.branch.opening_hours!=''"> {{ branchData.branch.opening_hours }}</p>
    <p v-else><br></p>
  </div>
</template>

<script>
export default {
  name: "BranchCardReadonly",
  props: {
    branchData: {
      type: Object,
      required: true,
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
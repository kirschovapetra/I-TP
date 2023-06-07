<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-5">
      <h3 class="mt-5 profile-h3">Objednávky</h3>
    </b-row>
    <b-row v-if="this.ordersData.length > 0">
      <div class="accordion" role="tablist">
        <div v-for="(order, i) in ordersData" :key="i">
          <OrderCard
            :orderData="order"
            @book="callEvent(i, 'Rezervovať', 'Rezervovaná kuriérom')"
            @cancel="callEvent(i, 'Zrušiť rezerváciu', 'Zaplatená')"
            @stock="callEvent(i, 'Naskladniť', 'Pripravená na doručenie')"
            @takeOrder="callEvent(i, 'Vyzdvihnúť', 'Prevzatá na doručenie')"
            @deliver="callEvent(i, 'Doručiť', 'Doručená')"
          />
        </div>
      </div>
    </b-row>
    <b-row v-else class="font11 text-info d-flex justify-content-center">Nenašli sa žiadne objednávky</b-row>
  </b-container>
</template>

<script>
import OrderCard from "@/containers/order/OrderCard.vue";
export default {
  name: "Orders",
  components: {
    OrderCard,
  },
  props: { orderDataList: { type: Array } },
  data() {
    return {
      ordersData: this.$props.orderDataList,
      user: JSON.parse(sessionStorage.getItem("user")),
      orderCases: [],
    };
  },
  async mounted() {
    for (var id in this.ordersData) {
      var caseFull = await this.SearchCaseFulltext(
        this.user.token,
        this.user.groupId,
        this.ordersData[id].title.split(" ")[1]
      );
      if (caseFull) this.orderCases.push(caseFull.data._embedded.cases[0]);
    }

    return "done";
  },
  methods: {
    async callEvent(id, taskTitle, newStatus) {
      var tasks = await this.GetTasksByCaseId(
        this.user.token,
        this.orderCases[id].stringId
      );
      var orderDetail = tasks.data._embedded.tasks.filter((task) => {
        return task.title.includes(taskTitle);
      })[0];

      console.log(await this.AssignTask(this.user.token, orderDetail.stringId));
      console.log(await this.FinishTask(this.user.token, orderDetail.stringId));

      this.ordersData[id].status = newStatus;

      this.$emit("reload");
      return "done";
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  width: 50%;
  margin: -3% auto 0 auto;
  background-color: rgb(188, 211, 238);
}
.accordion {
  width: 80%;
  margin: auto;
  padding-bottom: 10%;
}
</style>
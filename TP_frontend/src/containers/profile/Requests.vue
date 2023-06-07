<template>
  <b-container>
    <b-row class="d-flex justify-content-center pt-5 pb-3">
      <h3 class="mt-5 profile-h3">Žiadosti kuriérov</h3>
    </b-row>

    <b-row v-if="this.courierData.length > 0">
      <div class="accordion" role="tablist">
        <b-card
          no-body
          class="mb-1"
          v-for="(req, id) in this.courierData"
          :key="id"
        >
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button
              block
              v-b-toggle="('accordion-' + req.title).replace(/\s/g, '')"
              variant="light"
              class="text-left d-flex justify-content-between"
            >
              <div class="font12">{{ req.title }}</div>
              <div><b-icon icon="caret-down-fill"></b-icon></div>
            </b-button>
          </b-card-header>
          <b-collapse
            :id="('accordion-' + req.title).replace(/\s/g, '')"
            role="tabpanel"
            class="text-left"
          >
            <b-card-body class="card-body font11">
              <b-card-text>
                <b>Meno a priezvisko: </b>{{ req.first_name }}
                {{ req.last_name }} <br />
                <b>Telefónne číslo: </b> {{ req.phone_number }} <br />
                <b>Email: </b> {{ req.email }} <br />
                <b>Stav: </b>
                <span>{{ req.status }}</span>
                <br />
                <div class="mt-2">
                  <b-button
                    class="mr-2"
                    variant="info"
                    @click="approve(id, 'courier')"
                    v-if="
                      !['Schválená', 'Zamietnutá'].includes(
                        courierData[id].status
                      )
                    "
                  >
                    Schváliť
                  </b-button>
                  <b-button
                    @click="reject(id, 'courier')"
                    v-if="
                      !['Schválená', 'Zamietnutá'].includes(
                        courierData[id].status
                      )
                    "
                    >Zamietnuť</b-button
                  >
                </div>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-row>
    <b-row v-else class="d-flex justify-content-center font12 text-info mb-3">
      Nemáte žiadne žiadosti na schválenie.
    </b-row>

    <b-row class="d-flex justify-content-center pt-2 pb-3">
      <h3 class="mt-5 profile-h3">Žiadosti firiem</h3>
    </b-row>
    <b-row v-if="this.companyData.length > 0">
      <div class="accordion" role="tablist">
        <b-card
          no-body
          class="mb-1"
          v-for="(req, id) in this.companyData"
          :key="id"
        >
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button
              block
              v-b-toggle="('accordion-' + req.title).replace(/\s/g, '')"
              variant="light"
              class="text-left d-flex justify-content-between"
            >
              <div class="font12">{{ req.title }}</div>
              <div><b-icon icon="caret-down-fill"></b-icon></div>
            </b-button>
          </b-card-header>
          <b-collapse
            :id="('accordion-' + req.title).replace(/\s/g, '')"
            role="tabpanel"
            class="text-left"
          >
            <b-card-body class="card-body font11">
              <b-card-text>
                <b>Názov spoločnosti: </b>{{ req.company_name }}
                {{ req.last_name }} <br />
                <b>Typ spoločnosti: </b> {{ req.company_type }} <br />
                <b>IČO: </b> {{ req.ico }} <br />
                <b>DIČ: </b> {{ req.dic }} <br />
                <b>IČ DPH: </b> {{ req.ic_dph }} <br />
                <b>Stav: </b>
                <span>{{ req.status }} </span>
                <br />
                <div class="mt-2">
                  <b-button
                    class="mr-2"
                    variant="info"
                    @click="approve(id, 'company')"
                    v-if="
                      !['Schválená', 'Zamietnutá'].includes(
                        companyData[id].status
                      )
                    "
                  >
                    Schváliť
                  </b-button>
                  <b-button
                    @click="reject(id, 'company')"
                    v-if="
                      !['Schválená', 'Zamietnutá'].includes(
                        companyData[id].status
                      )
                    "
                  >
                    Zamietnuť
                  </b-button>
                </div>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-row>
    <b-row v-else class="d-flex justify-content-center font12 text-info mb-3">
      Nemáte žiadne žiadosti na schválenie.
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Requests",
  props: {
    courierRequests: { type: Array },
    companyRequests: { type: Array },
  },
  data() {
    return {
      courierData: {},
      companyData: {},
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },

  mounted() {
    this.courierData = this.$props.courierRequests;
    this.companyData = this.$props.companyRequests;
  },
  methods: {
    async approve(id, type) {
      var taskId;

      switch (type) {
        case "courier":
          taskId = this.courierData[id].approveTaskId;
          this.courierData[id].status = "Schválená";
          break;
        case "company":
          taskId = this.companyData[id].approveTaskId;
          this.companyData[id].status = "Schválená";
          break;
      }
      console.log(await this.AssignTask(this.user.token, taskId));
      console.log(await this.FinishTask(this.user.token, taskId));

      this.$emit("reload");
      return "done";
    },
    async reject(id, type) {
      var taskId;

      switch (type) {
        case "courier":
          taskId = this.courierData[id].rejectTaskId;
          this.courierData[id].status = "Zamietnutá";
          break;
        case "company":
          taskId = this.companyData[id].rejectTaskId;
          this.companyData[id].status = "Zamietnutá";
          break;
      }
      console.log(await this.AssignTask(this.user.token, taskId));
      console.log(await this.FinishTask(this.user.token, taskId));

      this.$emit("reload");
      return "done";
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion {
  width: 80%;
  margin: auto;
  padding-bottom: 6%;
}
</style>
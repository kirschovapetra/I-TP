<template>
  <div>
    <div class="text-center pt-5"><h3>Nahrávanie produktov</h3></div>
    <div class="d-flex justify-content-center p-5">
      <b-form>
        <b-form-file v-model="file" placeholder="Nahrajte csv súbor">
        </b-form-file>
        <b-row class="mt-3">Súbor: {{ file ? file.name : "" }}</b-row>
        <b-row class="mt-3">
          <b-button variant="info" :disabled="!file" @click="uploadFile">
            Nahrať
          </b-button>
        </b-row>
        <b-row class="pt-5">
          <b-col md="6">
            <h3>Popis stĺpcov</h3>
            <ul>
              <li>kod (String, povinný)</li>
              <li>nazov (String, povinný)</li>
              <li>cenaDPH (Float, povinná)</li>
              <li>stav (String)</li>
              <li>kategoria (String)</li>
              <li>popis (String)</li>
              <li>parametre (String)</li>
              <li>pocetKS (Integer)</li>
              <li>zaruka (Integer)</li>
            </ul>
          </b-col>
          <b-col md="6">
            <h3>Kategórie</h3>
            <ul>
              <li>Elektronika</li>
              <li>Biela technika</li>
              <li>Dom a záhrada</li>
              <li>Chovateľstvo</li>
              <li>Detský tovar</li>
              <li>Knihy, filmy, hry</li>
              <li>Potraviny</li>
              <li>Kozmetika a zdravie</li>
              <li>Oblečenie</li>
              <li>Šport</li>
              <li>Nábytok</li>
            </ul>
          </b-col>
          <b-col>
            <h3>Stav</h3>
            <ul>
              <li>Na sklade</li>
              <li>Na objednávku</li>
              <li>Predpredaj</li>
            </ul>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileUploadModal",
  props: {
    uploadFileTaskId: { type: String },
  },
  data() {
    return {
      file: null,
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
  methods: {
    async uploadFile() {
      let formData = new FormData();
      formData.append("file", this.file);

      var data = await this.AssignTask(
        this.user.token,
        this.$props.uploadFileTaskId
      );
      console.log(data);
      var fileTaskId = data.data.changedFields.product_import_ref.value[0];

      await this.SubmitFile(
        this.user.token,
        this.$props.uploadFileTaskId,
        fileTaskId + "-csv_file",
        formData
      );

      console.log(
        await this.FinishTask(this.user.token, this.$props.uploadFileTaskId)
      );

      this.$emit("close");
      return "done";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
<template>
  <div v-if="store.getters.getDefaultLocation.length" class="table">
    <NDataTable
      :columns="columns"
      :data="store.getters.getDefaultLocation"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
  <div class="loader" v-else></div>
</template>

<script>
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { NButton, NDataTable } from "naive-ui";

export default defineComponent({
  components: {
    NButton,
    NDataTable,
  },
  setup() {
    const store = useStore();
    const createColumns = () => {
      return [
        {
          title: "Default location",
          key: "name",
        },
        {
          title: "Weather",
          key: "weather",
        },
        {
          title: "Temperaure",
          key: "temp",
        },
        {
          title: "Wind speed",
          key: "windSpeed",
        },
      ];
    };

    return {
      store,
      columns: createColumns({
        play(row) {
        },
      }),
      pagination: false,
    };
  },
});
</script>

<style lang="scss" scoped>
.table {
  margin-top: 30px;
  width: 700px;
}
.loader {
  margin: 15px 0;
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #32a852;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 750px) {
  .table {
      width: 500px;
  }
}

@media (max-width: 550px) {
  .table {
      width: 370px;
      .n-data-table {
          font-size: 10px;
          line-height: 12px;
          &-tr {

            .n-button {
                width: 42px;
                height: 20px;
            }
          }
      }
  }
}
</style>

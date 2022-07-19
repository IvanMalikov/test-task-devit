<template>
  <AddLocationComponent />
  <DisplayDefaultWeather />
  <DisplayWeatherComponent />
</template>

<script>
import { useStore } from 'vuex'
import { defineComponent } from "vue";
import AddLocationComponent from "./components/AddLocationComponent.vue";
import DisplayWeatherComponent from "./components/DisplayWeatherComponent.vue";
import DisplayDefaultWeather from './components/DisplayDefaultWeather.vue';
export default defineComponent({
  async created() {
    let res = await this.tryGetUsersLocation();
    if(!res) {
      const response = await this.store.dispatch("fetchWeather", {location: {latitude: 50.4297742, longitude: 30.5211754}, isDefault: true});
      this.store.commit('setDisabledByName', response.name)
      this.store.commit('fillDefaultLocation', response)
    }
  },
  name: "App",
  components: {
    AddLocationComponent,
    DisplayWeatherComponent,
    DisplayDefaultWeather,
  },
  setup() {
    const store = useStore()
    const getPosistion = ()=>{
      return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    }
    const tryGetUsersLocation = async () => {
      let result = false
      try {
        const position = await getPosistion();
        const response = await store.dispatch("fetchWeather", {location: position.coords, isDefault: true});
        store.commit('setDisabledByName', response.name)
        store.commit('fillDefaultLocation', response)
        result = true;
      } catch (error) {
        alert(error.message)
      }
      return result;
    }
    return {
      store,
      tryGetUsersLocation,
      getPosistion
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

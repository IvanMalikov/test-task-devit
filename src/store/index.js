import { createStore } from "vuex";

export default createStore({
  state: {
    selectedLocations: [],
    defaultLocation: [],
    options: [
      {
        label: "Kyiv",
        key: '{"name":"Kyiv","latitude":50.45,"longitude":30.52}',
        disabled: false,
      },
      {
        label: "Odessa",
        key: '{"name": "Odessa","latitude": 46.48, "longitude": 30.73}',
        disabled: false,
      },
      {
        label: "Dnipro",
        key: '{"name":"Dnipro","latitude":48.46,"longitude":35.04}',
        disabled: false,
      },
      {
        label: "Lviv",
        key: '{"name": "Lviv","latitude": 49.84, "longitude": 24.02}',
        disabled: false,
      },
      {
        label: "Kharkiv",
        key: '{"name":"Kharkiv","latitude":49.98,"longitude":36.25}',
        disabled: false,
      },
      {
        label: "Madagascar",
        key: '{"name":"Madagascar","latitude":-19.12,"longitude":46.53}',
        disabled: false,
      },
      {
        label: "London",
        key: '{"name":"London","latitude":51.5,"longitude":-0.12}',
        disabled: false,
      },
      {
        label: "Birmingham",
        key: '{"name":"Birmingham","latitude":52.49,"longitude":-1.96}',
        disabled: false,
      },
      {
        label: "Warsaw",
        key: '{"name":"Warsaw","latitude":52.23,"longitude":21}',
        disabled: false,
      },
      {
        label: "Lodz",
        key: '{"name":"Lodz","latitude":51.77,"longitude":19.45}',
        disabled: false,
      },
      {
        label: "Krakow",
        key: '{"name":"Krakow","latitude":50.04,"longitude":19.94}',
        disabled: false,
      },
    ],
  },
  getters: {
    getOptions(state) {
      return state.options;
    },
    getSelectedLocations(state) {
      return state.selectedLocations;
    },
    getDefaultLocation(state) {
      return state.defaultLocation;
    },
  },
  mutations: {
    fillSelectedLocation(state, payload) {
      state.selectedLocations.push({ ...payload });
    },

    setDisabledByName(state, payload) {
      const result = state.options.find(item => item.label === payload)
      if(result) result.disabled = true
    },

    removeSelectedLocation(state, payload) {
      const spliceInd = state.selectedLocations.findIndex((item) => item.name === payload.name);
      state.selectedLocations.splice(spliceInd, 1);
      for (let index = 0; index < state.options.length; index++) {
        if(payload.name === state.options[index].label) {
          state.options[index].disabled = false
        }
      }
    },

    fillDefaultLocation(state, payload) {
      state.defaultLocation.push({ ...payload });
    },
  },
  actions: {
    async fetchSavedLocations({ dispatch, commit }) {
      const keys = Object.keys(localStorage);
      let i = keys.length;
      while (i--) {
        const response = await dispatch("fetchWeather", {
          location: JSON.parse(localStorage.getItem(keys[i])),
          isDefault: false,
        });
        commit("fillSelectedLocation", response);
      }
    },

    async fetchSelectedLocation({ dispatch, commit }, location) {
      const response = await dispatch("fetchWeather", {
        location,
        isDefault: false,
      });
      commit("fillSelectedLocation", response);
    },

    fetchWeather({}, { location, isDefault }) {
      return fetch(
        `https://fcc-weather-api.glitch.me/api/current?lat=${location.latitude}&lon=${location.longitude}`
      )
        .then((res) => res.json())
        .then((data) => {
          const name = isDefault ? data.name : location.name;
          return {
            name,
            weather: data.weather[0].main,
            temp: data.main.temp,
            windSpeed: data.wind.speed,
          };
        });
    },
  },
  modules: {},
});

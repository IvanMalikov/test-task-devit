<template>
    <div class="table">
        <NDataTable
            :columns="columns"
            :data="store.getters.getSelectedLocations"
            :pagination="pagination"
            :bordered="false"
        />
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { h, defineComponent, computed, reactive } from 'vue'
import { NDataTable, NButton } from 'naive-ui'

export default defineComponent ({
    components: {
        NDataTable,
        NButton
    },
    async created() {
        await this.store.dispatch('fetchSavedLocations')
    },
    setup () {
        const paginationReactive = reactive({
            page: 1,
            pageSize: 4,
            onChange: (page) => {
                paginationReactive.page = page;
            }
        });
        const createColumns = ({
            play
        }) => {
            return [
                {
                    title: "Location",
                    key: "name"
                },
                {
                    title: "Weather",
                    key: "weather"
                },
                {
                    title: "Temperaure",
                    key: "temp"
                },
                {
                    title: "Wind speed",
                    key: "windSpeed"
                },
                {
                    title: "Delete",
                    key: "actions",
                    render(row) {
                        return h(NButton, {
                            strong: true,
                            error: true,
                            size: "small",
                            onClick: () => play(row)
                        }, { default: () => "Delete" });
                    }
                }
            ];
        };
        const store = useStore()

        const getNewLocations = computed (() => {
            return store.getters.getSelectedLocations.map(item => {
                fetch(`https://fcc-weather-api.glitch.me/api/current?latitude=${item.key.latitude}&longitude=${item.key.longitude}`)
                .then(res => res.json())
                .then(data => {
                    item.key.windSpeed = data.wind.speed
                    item.key.temp = data.main.temp
                    item.key.weather = data.weather[0].main
                })
                return {...item.key}
            })
        })

        return {
            store,
            getNewLocations,
            createColumns,
            columns: createColumns({
                play(row) {
                    store.commit('removeSelectedLocation', row)
                    localStorage.removeItem(row.name)
                }
            }),
            pagination: paginationReactive
        }
    }
})
</script>

<style lang="scss" scoped>
.table {
    width: 700px;
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
            font-size: 9px;
            line-height: 12px;

            .n-button {
                font-size: 10px;
                line-height: 12px;
            }
        }
    }
}
</style>
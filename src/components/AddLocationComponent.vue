<template>
    <div>
        <NDropdown :disabled="isDisabledDropdown" trigger="hover" :options="options" @select="handleSelect">
            <NButton>{{changeOnSelect}}</NButton>
        </NDropdown>
        <NButton :disabled="isDisabledButton" type="success" @click="addLocation">Add</NButton>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { defineComponent, computed, reactive } from 'vue'
import { NButton, NDropdown } from 'naive-ui'
export default defineComponent ({
    components: {
        NButton,
        NDropdown
    },
    created() {
        const keys = Object.keys(localStorage)
        for (let i = 0; i < this.options.length; i++) {
            for (let j = 0; j < keys.length; j++) {
                if(this.options[i].label === keys[j]) {
                    this.options[i].disabled = true
                }
            }
        }
    },
    setup () {
        const store = useStore()
        const options = store.getters.getOptions
        let selectedLocation = reactive({
            label: null,
            key: null
        })

        const isDisabledDropdown = computed(() => {
            return Boolean(!store.getters.getDefaultLocation.length)
        })

        const isDisabledButton = computed(() => {
            return !selectedLocation.label
        })

        const handleSelect = (label, key) => {
            Object.keys(selectedLocation).forEach((item) => {
                selectedLocation[item] = key[item]
            })
        }

        const changeOnSelect = computed(() => {
            return selectedLocation.label ? selectedLocation.label : 'Choose new location'
        })

        const addLocation = () => {
            options.forEach(item => {
                if(item.label === selectedLocation.label) {
                    item.disabled = true
                }
            })
            localStorage.setItem(selectedLocation.label, selectedLocation.key)
            selectedLocation.key = JSON.parse(selectedLocation.key)
            store.dispatch('fetchSelectedLocation', selectedLocation.key)
            selectedLocation.label = null
        }

        return {
            store,
            isDisabledDropdown,
            isDisabledButton,
            selectedLocation,
            options,
            handleSelect,
            changeOnSelect,
            addLocation
        }
    }
})
</script>

<style lang="scss" scoped>
.n-button:not(:last-child) {
    margin-right: 30px;
}
</style>
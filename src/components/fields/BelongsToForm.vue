<template>
    <select class="form-control" :value="id" @change="$emit('update:id', $event.target.value)">
        <option value="" v-if="nullable">--</option>
        <option :value="item.id" v-for="item in items" :selected="item.id == id">
            {{item[label]}}
        </option>
    </select>
</template>

<script>
    export default {
        props: {
            resource: {
                type: String,
                required: true
            },

            nullable: {
                type: Boolean,
                default: true
            },

            id: {
                required: true
            },

            label: {
                type: String,
                default: 'name'
            }
        },

        asyncComputed: {
            items(){
                return this.$store.dispatch('search', {resource: this.resource})
                    .then(items => items)
            }
        }
    }
</script>
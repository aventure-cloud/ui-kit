<template>
    <div>
        <SearchableInput
                placeholder="Cerca..."
                :options="filteredItems"
                label_key="full_name"
                @typing="search"
                @selected="addItem"
                :auto-clean="true"
                :label-key="labelKey"
                class="mb-4"
        />
        <ul class="list-group list-group-flush">
            <li
                    v-for="(item, index) in selectedItems"
                    class="list-group-item"
                    :style="{borderTopWidth: index===0 ? 0 : 1}"
            >
                <div class="float-right">
                    <button type="button"
                            @click="removeItem(item.id)"
                            class="btn btn-light btn-sm"
                    >
                        <i class="fa fa-times"></i>
                    </button>
                </div>

                <slot name="item-selected">
                    {{ item[labelKey] }}
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Array,
                required: true
            },

            resource: {
                type: String,
                required: true
            },

            labelKey: {
                type: String,
                default: 'name'
            }
        },

        data(){
            return {
                items: [],
                selected: []
            }
        },

        computed: {
            filteredItems(){
                return this.items.filter(test => this.selected.indexOf(test.id) === -1)
            },

            selectedItems(){
                return this.selected.map(id => this.$store.getters.item({
                    resource: this.resource,
                    id
                }))
            }
        },

        watch: {
            value(newVal){
                this.$store.dispatch('fetchItems', {resource: this.resource, ids: newVal})
                this.selected = newVal
            }
        },

        methods: {
            search({q}){
                axios.get('/api/'+this.resource+'/search?q=' + q)
                    .then(res => {
                        this.items = res.data

                        this.items.forEach(item => {
                            this.$store.commit('setItem', {
                                resource: this.resource,
                                id: item.id,
                                item
                            })
                        })
                    })
            },

            addItem(id){
                if (this.selected.indexOf(id) !== -1)
                    return

                this.selected.unshift(id)

                this.emit()
            },

            removeItem(id){
                this.$alerts.confirm(() => {
                    this.selected.splice(this.selected.indexOf(id), 1)
                    this.emit()
                })
            },

            emit(){
                this.$emit('input', this.selected)
            }
        }
    }
</script>
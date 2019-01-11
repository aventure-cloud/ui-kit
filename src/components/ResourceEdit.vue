<template>
    <div>
        <slot name="form" :item="item" :errors="errors"></slot>

        <div class="text-right my-4">
            <SaveButton @click="save"/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            resource: {
                type: String,
                required: true
            },

            id: {required: true},
        },

        data: () => ({errors: {}}),

        computed: {
            item(){
                return this.$store.getters.item({
                    resource: this.resource,
                    id: this.id
                })
            }
        },

        created() {
            this.$store.dispatch('fetchItem', {
                resource: this.resource,
                id: this.id
            })
        },

        methods: {
            save(){
                this.errors = {}

                this.$store.dispatch('updateItem', {
                    resource: this.resource,
                    item: this.item
                }).then(() =>{
                    this.$toasted.show(__('The action was executed'), {type: 'success'})
                }).catch(e => {
                    if(e.response.status === 422){
                        this.errors = e.response.data.errors
                    } else {
                        this.$toasted.show(e.response.data.message||'You are not authorized to execute this action.', {type: 'error'})
                    }
                })
            }
        }
    }
</script>
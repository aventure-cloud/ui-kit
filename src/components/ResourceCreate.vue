<template>
    <div>
        <slot name="form" :item="form" :errors="errors"></slot>

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

            default: {type: Object},

            title: {
                type: String,
                default: ''
            }
        },

        data: () => ({
            errors: {},
            form: {}
        }),

        created() {
            this.form = Object.assign(this.form, this.default)
        },

        methods: {
            save() {
                this.errors = {}

                this.$store.dispatch('createItem', {
                    resource: this.resource,
                    item: this.form
                }).then(item => {
                    this.$toasted.show(__('The action was executed'), {type: 'success'})
                    this.$router.push({path: '/' + this.resource + '/' + item.id})
                }).catch(e => {
                    if (e.response.status === 422) {
                        this.errors = e.response.data.errors
                    } else {
                        this.$toasted.show(e.response.data.message || 'You are not authorized to execute this action.', {type: 'error'})
                    }
                })
            }
        }
    }
</script>
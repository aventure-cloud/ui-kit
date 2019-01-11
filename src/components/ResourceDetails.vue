<template>
    <div>
        <div class="row align-items-center mb-4">
            <div class="col">
                <slot name="title">
                    <h2>{{_.upperFirst(title)}}</h2>
                </slot>
            </div>

            <div class="col text-right">
                <ActionsDropdown
                        :actions="actions"
                        @run="runAction"
                        class="mr-3"
                />

                <router-link
                        :to="{path: basePath+'/'+resource+'/'+item.id+'/edit'}"
                        class="btn btn-light"
                        title="Modifica"
                        v-if="canEdit"
                >
                    <i class="fa fa-pencil"></i>
                    {{__('Edit')}}
                </router-link>

                <button
                        type="button"
                        class="btn btn-danger"
                        title="Elimina"
                        @click="destroy"
                        v-if="canDelete"
                >
                    <i class="fa fa-trash-o"></i>
                    {{__('Delete')}}
                </button>
            </div>
        </div>

        <!--
        Resource Details
        -->
        <div class="mb-4">
            <slot name="details" :item="item"></slot>
        </div>
    </div>
</template>

<script>
    import ActionsDropdown from './ActionsDropdown'

    export default {
        components: {
            ActionsDropdown
        },

        props: {
            resource: {
                type: String,
                required: true
            },

            id: {
                required: true
            },

            title: {
                type: String
            },

            actions: {
                type: Array,
                default(){
                    return []
                }
            },

            canRead: {
                type: Boolean,
                default: true
            },

            canEdit: {
                type: Boolean,
                default: true
            },

            canDelete: {
                type: Boolean,
                default: true
            },

            relations: {
                type: Array,
                default(){
                    return []
                }
            },

            basePath: {
                type: String,
                default: ''
            }
        },

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
            runAction({action}){
                this.$alerts.confirm(() => {
                    action.handler(this.id)
                })
            },

            destroy(){
                this.$alerts.confirm(() => {
                    this.$store.dispatch('deleteItem', {
                        resource: this.resource,
                        id: this.id
                    }).then(res => {
                        this.$toasted.show(__('The action was executed'), {type: 'success'})
                        this.$router.push({path: '/'+this.resource})
                    }).then(e => {
                        this.$toasted.show(e.response.data.message, {type: 'error'})
                    })
                });
            }
        }
    }
</script>
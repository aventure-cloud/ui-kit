<template>
    <span>
        <component
                :is="link ? 'router-link' : 'span'"
                :to="{path: '/'+resource+'/'+id}"
                class="strong"
        >
            <slot>
                {{text}}
            </slot>
        </component>

        <span v-if="!text">--</span>
    </span>
</template>

<script>
    export default {
        props: {
            /**
             * The name of the linked resource
             */
            resource: {
                type: String,
                required: true,
                default: null
            },

            /**
             * The ID to the linked resource
             */
            id: {
                required: true,
                default: null
            },

            /**
             * The object's key to use when display content
             */
            label: {
                type: String,
                default: 'name'
            },

            /**
             * Flag to link item details route
             */
            link: {
                default: true
            }
        },

        data(){
            return {
                item: {}
            }
        },

        computed: {
            text(){
                return this.item[this.label]
            }
        },

        created(){
            this.getItem()
        },

        methods: {
            getItem(){
                if(this.$store.state[this.resource].hasOwnProperty(this.id)) {
                    this.item = this.$store.getters.item({
                        resource: this.resource,
                        id: this.id
                    })
                }

                this.$store.dispatch('fetchItem', {
                    resource: this.resource,
                    id: this.id
                }).then(item => {
                    this.item =  item
                })
            }
        }
    }
</script>
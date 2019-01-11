<template>
    <span>
        <router-link :to="{path: '/'+resource+'/'+id}" class="strong" v-if="text">
            <avatar-img :src="avatar_url" width="30" v-if="avatar_url"/>
            {{text}}
        </router-link>
        <span v-else>--</span>
    </span>
</template>

<script>
    export default {
        props: {
            resource: {
                type: String,
                required: true,
                default: null
            },

            id: {
                required: true,
                default: null
            },

            label: {
                type: String,
                default: 'name'
            }
        },

        data(){
            return {
                avatar_url: null
            }
        },

        asyncComputed: {
            text(){
                if(this.resource === null || this.id === null)
                    return

                if(this.$store.state[this.resource].hasOwnProperty(this.id)) {
                    let item = this.$store.getters.item({
                        resource: this.resource,
                        id: this.id
                    })
                    this.checkAvatar(item)
                    return item[this.label]
                }

                return this.$store.dispatch('fetchItem', {
                    resource: this.resource,
                    id: this.id
                }).then(item => {
                    this.checkAvatar(item)
                    return item[this.label]
                })
            }
        },

        methods: {
            checkAvatar(item){
                if(item.hasOwnProperty('avatar_url'))
                    this.avatar_url = item.avatar_url
            }
        }
    }
</script>
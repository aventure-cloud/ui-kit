<template>
    <img :src="src" class="rounded-circle shadow-sm"/>
</template>

<script>
    export default {
        props: {
            user: {type: Object},

            urlKey: {
                type: String,
                default: 'avatar_url'
            }
        },

        computed: {
            src(){
                if(this.user[this.urlKey]){
                    return this.user[this.urlKey]
                }
                return 'https://ui-avatars.com/api?size=256&name='+this.user.name
            }
        }
    }
</script>
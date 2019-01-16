<template>
    <span>{{ formattedDate }}</span>
</template>

<script>
    export default {
        props: {
            date: {
                required: true,
            },

            format: {
                type: String,
                default: 'LL'
            }
        },

        computed: {
            formattedDate(){
                return _.isEmpty(this.date)
                    ? '--'
                    : this.$moment.utc(this.date).local().format(this.format)
            }
        }
    }
</script>
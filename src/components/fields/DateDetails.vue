<template>
    <span>{{ _.isEmpty(date) ? '--' : date | moment(format) }}</span>
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
        }
    }
</script>
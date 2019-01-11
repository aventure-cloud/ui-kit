<template>
    <span>
        <i class="fas fa-circle"
           :class="{'text-success': flag, 'text-danger': !flag}"
        ></i>
        {{flag ? trueText : falseText}}
    </span>
</template>

<script>
    export default {
        props: {
            flag: {
                required: true
            },

            trueText: {
                type: String,
                default: __('Yes')
            },

            falseText: {
                type: String,
                default: __('No')
            }
        }
    }
</script>
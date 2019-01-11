<template>
    <button class="btn btn-primary" v-on="listeners">
        <slot name="icon">
            <i class="fas fa-check-circle"></i>
        </slot>

        <slot>{{__('Save')}}</slot>
    </button>
</template>

<script>
    export default {
        computed: {
            /**
             * To avoid ".native" in listeners declaration in parent components
             *
             * @returns {{}}
             */
            listeners(){
                return {
                    ...this.$listeners
                }
            }
        }
    }
</script>
<template>
    <div class="custom-control custom-checkbox">
        <input type="checkbox"
               class="custom-control-input"
               :id="'checkbox-'+id"
               :checked="flag"
               v-on="listeners"
        />
        <label class="custom-control-label" :for="'checkbox-'+id">
            {{flag ? trueText : falseText}}
        </label>
    </div>
</template>

<script>
    export default {
        props: {
            flag: {
                type: Boolean|Number,
                default: false
            },

            trueText: {
                type: String,
                default: __('Yes')
            },

            falseText: {
                type: String,
                default: __('No')
            }
        },

        computed: {
            listeners(){
                return {
                    ...this.$listeners,
                    change: event => this.$emit('update:flag', event.target.checked)
                }
            }
        },

        data(){
            return {
                id: (new Date).getMilliseconds(),
            }
        }
    }
</script>
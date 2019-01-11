<template>
    <div>
        <div class="form-group mb-3" v-bind:class="{'row':horizontal, 'has-errors': errors.length>0}">
            <!--
            Label
            -->
            <label :class="{'col-sm-3 col-form-label text-right': horizontal}">
                <slot name="label"></slot>
            </label>

            <div :class="{'col-sm-9': horizontal}">
                <!--
                Input form tag by default component's content
                -->
                <slot></slot>
                <em class="form-text text-secondary small">
                    <slot name="helper"></slot>
                </em>

                <!--
                Errors messages
                -->
                <div class="text-danger small strong" v-if="errors.length>0">
                    <ul class="list-unstyled">
                        <li v-for="msg in errors">
                            <i class="fas fa-exclamation-triangle"></i>
                            {{ msg }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            horizontal: {
                type: Boolean,
                default: false
            },

            errors: {
                type: Array,
                default() {
                    return [];
                }
            }
        }
    }
</script>

<style scoped>
    .has-errors input {
        border-color: #bf4034;
    }
</style>
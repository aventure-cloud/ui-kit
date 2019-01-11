<template>
    <div class="btn-group" v-if="actions.length>0">
        <button class="btn btn-light dropdown-toggle" type="button" data-toggle="dropdown">
            <i class="fa fa-bolt text-primary"></i>
            {{__('Actions')}}
        </button>
        <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item"
               style="cursor: pointer;"
               v-for="action in actions"
               @click="$emit('run', {action})"
               v-if="action.hasOwnProperty('show') ? action.show : true"
            >
                <i :class="action.icon" v-if="action.icon"></i>
                {{ action.label }}
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            /**
             * Actions is an array of object
             *
             * {
             *  icon: String, optional
             *  show: Boolean, optional
             *  label: String, mandatory
             *  handler: Function, mandatory
             * }
             */
            actions: {
                type: Array,
                default(){
                    return []
                }
            }
        }
    }
</script>
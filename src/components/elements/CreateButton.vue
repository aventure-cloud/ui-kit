<template>
    <router-link :to="to" class="btn btn-primary">
        <slot name="icon">
            <i class="fa fa-plus"></i>
        </slot>

        <slot>{{__('Create')}}</slot>
    </router-link>
</template>

<script>
    export default {
        props: ['to']
    }
</script>
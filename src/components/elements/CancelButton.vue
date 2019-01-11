<template>
    <button type="button" class="btn btn-light">
        <slot name="icon">
            <i class="fa fa-times"></i>
        </slot>

        <slot>{{__('Cancel')}}</slot>
    </button>
</template>
<template>
    <div class="text-center p-3">
        <div class="text-muted" style="font-size: 50px;">
            <slot name="icon">
                <i class="fas fa-clipboard-list"></i>
            </slot>
        </div>

        <slot name="title">
            <h3>{{__('Empty list')}}</h3>
        </slot>

        <slot name="message"></slot>
    </div>
</template>
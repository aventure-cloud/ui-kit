<template>
    <div class="breadcrumbs">
        <ul>
            <li>
                <router-link :to="{path: '/'}" class="badge badge-light">
                    <i class="fa fa-home"></i>
                    Home
                </router-link>
            </li>
            <li v-for="item in crumbs">
                <router-link :to="{name: item.name, params: item.params}">
                    {{ item.label }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['crumbs']
    }
</script>
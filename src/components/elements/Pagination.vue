<template>
    <div class="p-3 text-center">
        <button
                class="btn btn-link"
                :class="{'disabled': pagination.current_page <= 1}"
                @click.prevent="changePage(pagination.current_page - 1)"
        >
            {{ prev }}
        </button>
        &nbsp;&nbsp;
        <span class="p-2">
            Pag. {{pagination.current_page}} / {{pagination.last_page}}
        </span>
        &nbsp;&nbsp;
        <button
                class="btn btn-link"
                :class="{'disabled': pagination.current_page >= pagination.last_page}"
                @click.prevent="changePage(pagination.current_page + 1)"
        >
            {{ next }}
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            pagination: {
                type: Object,
                required: true
            },

            offset: {
                type: Number,
                default: 4
            },

            next: {
                type: String,
                default: __('Next') + ' »'
            },

            prev: {
                type: String,
                default: '«' + __('Prev')
            }
        },

        computed: {
            pagesNumber() {
                if (!this.pagination.to) {
                    return []
                }
                let from = this.pagination.current_page - this.offset
                if (from < 1) {
                    from = 1
                }
                let to = from + (this.offset * 2)
                if (to >= this.pagination.last_page) {
                    to = this.pagination.last_page
                }
                let pagesArray = []
                for (let page = from; page <= to; page++) {
                    pagesArray.push(page)
                }
                return pagesArray
            }
        },

        methods: {
            changePage(page) {
                if (page !== this.pagination.current_page)
                    this.$emit('paginate', {page})
            }
        }
    }
</script>
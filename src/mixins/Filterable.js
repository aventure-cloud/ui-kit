import defaults from 'lodash/defaults'
import debounce from 'lodash/debounce'

export default {
    data(){
        return {
            currentFilters: {}
        }
    },

    created(){
        this.currentFilters = this.getFilterValuesFromQueryString()
    },

    methods: {
        /**
         * Update the given query string values.
         */
        updateQueryString(value) {
            this.$router.push({ query: defaults(value, this.$route.query) })
        },

        /**
         * Initialize the current filter values from the decoded query string.
         */
        getFilterValuesFromQueryString() {
            return JSON.parse(atob(this.encodedFilters))
        },

        /**
         * Handle a filter state change.
         */
        filterChanged() {
            this.updateQueryString({
                [this.resource+'_filters']: btoa(JSON.stringify(this.currentFilters)),
            })
        },

        applyFilter: debounce(function (field, value) {
            this.currentFilters[field] = value
            this.filterChanged()
        }, 400),

        mergeFilters(filters={}){
            return {
                ...(this.getFilterValuesFromQueryString()),
                ...(filters)
            }
        },
    },

    computed: {
        /**
         * Get the encoded filters from the query string.
         */
        encodedFilters() {
            return this.$route.query[this.resource + '_filters'] || btoa(JSON.stringify({}))
        },
    }
}
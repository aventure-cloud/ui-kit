<template>
    <div class="dropdown">
        <input type="text"
               v-model="searchText"
               class="form-control"
               :placeholder="placeholder"
               @keydown.down="moveDown"
               @keydown.up="moveUp"
               @keyup.enter="select(filteredOptions[highlightedPosition])"
               @input="typing"
               @focus="hasFocus = true"
               @blur="hasFocus = false"
        />

        <!--
        Options list
        -->
        <div class="dropdown-menu" :class="{show: showDropdown}" @mouseleave="highlightedPosition = -1">
            <div
                    class="dropdown-item"
                    :class="{'highlighted': index === highlightedPosition}"
                    @mouseenter="highlightedPosition = index"
                    @mousedown.prevent="select(item)"
                    v-for="(item, index) in filteredOptions"
            >
                {{ formatter(item) }}
                &nbsp;
                <i class="fa fa-check" v-if="item[valueKey]==value"></i>
            </div>

            <div class="dropdown-item" v-if="filteredOptions.length === 0">
                <em class="small">{{__('No results')}}...</em>
            </div>
        </div>
    </div>
</template>

<script>
    import {debounce} from 'lodash'

    export default {
        props: {
            /**
             * Parent binding.
             */
            value: {required: false},

            /**
             * Property to use as option's value.
             */
            valueKey: {
                type: String,
                default: 'id'
            },

            /**
             * Property to use as option's label.
             */
            labelKey: {
                type: String,
                default: 'name'
            },

            /**
             * Placeholder string.
             */
            placeholder: {
                type: String,
                default: __('Search')+'...'
            },

            /**
             * Callback called on input change to filter options by parent component
             */
            customFilter: {type: Function},

            /**
             * Transformer to show visible label for each option
             */
            customFormatter: {type: Function},

            /**
             * List of selectable options
             */
            options: {
                type: Array,
                default() {
                    return []
                }
            },

            /**
             * Limit number of visible suggestions
             */
            limit: {type: Number, default: 8},

            /**
             * Format displayed text when selecting an item
             */
            textFormat: {
                type: Function,
                default(item) {
                    return item;
                }
            },

            /**
             * Auto clean input text after select
             */
            autoClean: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                searchText: '',
                hasFocus: false,
                highlightedPosition: -1
            };
        },

        computed: {
            filteredOptions(){
                return this.options.filter(o => this.filter(o)).slice(0, this.limit)
            },

            showDropdown(){
                return this.hasFocus && this.searchText.length > 0
            }
        },

        watch: {
            options(){
                this.select(
                    this.options.find(o => o[this.valueKey] === this.value)
                )
            }
        },

        mounted(){
            this.select(
                this.options.find(o => o[this.valueKey] === this.value)
            )
        },

        methods: {
            moveDown() {
                this.highlightedPosition = (this.highlightedPosition + 1) % this.options.length;
            },

            moveUp() {
                this.highlightedPosition = this.highlightedPosition - 1 < 0
                    ? this.options.length - 1
                    : this.highlightedPosition - 1
            },

            select(item) {
                if(!item)
                    return

                this.searchText = this.autoClean
                    ? ''
                    : this.formatter(item)

                this.highlightedPosition = -1

                let payload = this.valueKey
                    ? item[this.valueKey]
                    : item

                this.$emit('input', payload)
                this.$emit('selected', payload)
            },

            filter(item) {
                return _.isFunction(this.customFilter)
                    ? this.customFilter(item)
                    : String(item[this.labelKey])
                        .toLowerCase()
                        .indexOf(String(this.searchText || '').toLowerCase()) !== -1
            },

            formatter(item) {
                if(item){
                    return _.isFunction(this.customFormatter)
                        ? this.customFormatter(item)
                        : item[this.labelKey]
                }
            },

            typing: debounce(function () {
                this.clear()
                this.$emit('typing', {q: this.searchText})
            }, 400),

            clear() {
                this.$emit('input', '')
            }
        }
    }
</script>

<style scoped>
    .dropdown-item.highlighted {
        background-color: aliceblue;
        cursor: pointer;
    }
</style>
<template>
    <div>
        <div class="row mb-4" v-if="searchable">
            <div class="col-sm-6">
                <!--
                Search
                -->
                <div class="input-group">
                    <input
                            type="search"
                            :value="currentFilters.q"
                            @input="e => applyFilter('q', e.target.value)"
                            class="form-control"
                            placeholder="Search"
                    />
                </div>
            </div>
        </div>

        <!--
        Table
        -->
        <div class="row align-items-center mb-4" v-if="isActionable || filters.length > 0">
            <div class="col" v-if="isActionable">
                <!--
                Checkbox to select all
                -->
                <div class="custom-control custom-checkbox float-left mr-4">
                    <input type="checkbox"
                           class="custom-control-input"
                           id="selectAllCk"
                           @click="toggleAll"
                           :checked="allIsChecked">
                    <label class="custom-control-label" for="selectAllCk">
                        <i class="fa fa-caret-down"></i>
                    </label>
                </div>
            </div>

            <div class="col text-sm-right">
                <!--
                Actions dropdown
                -->
                <ActionsDropdown
                        v-if="isActionable && selected.length>0"
                        :actions="actions"
                        @run="runAction"
                />

                <!--
                Filters dropdown
                -->
                <div class="btn-group" v-if="filters.length > 0">
                    <button class="btn btn-light dropdown-toggle" type="button" data-toggle="dropdown">
                        <i class="fa fa-filter"></i>
                        'Filters'
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" style="width: 280px">
                        <a class="dropdown-item"
                           v-for="filter in activeFilters"
                           :key="filter"
                           @click.prevent="e => e.stopPropagation()"
                        >
                            <label class="small text-muted strong">{{filter.label}}</label>
                            <select class="form-control" @change="applyFilter(filter.field, $event.target.value)">
                                <option value="">--</option>
                                <option
                                        v-for="option in filter.options"
                                        :key="option"
                                        :value="Object.values(option)[0]"
                                        :selected="currentFilters.hasOwnProperty(filter.field)
                                                    ? currentFilters[filter.field] == Object.values(option)[0]
                                                    : false"
                                >
                                    {{Object.keys(option)[0]}}
                                </option>
                            </select>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!--
        Resources List
        -->
        <div v-if="items.length>0">
            <table class="table">
                <thead style="background-color: aliceblue">
                <tr>
                    <th class="align-baseline"></th><!-- Empty col for checkbox space -->
                    <th v-for="header in headers" class="align-baseline" :key="header">{{ header }}</th>
                    <th class="align-baseline"></th><!-- Crud Actions -->
                </tr>
                </thead>

                <tbody>
                <tr v-for="item in items" :key="item.id">
                    <td class="text-center align-baseline">
                        <div class="custom-control custom-checkbox" v-if="isActionable">
                            <input type="checkbox"
                                   class="custom-control-input"
                                   :id="'select-item-'+item.id"
                                   :checked="selected.indexOf(item.id) !== -1"
                                   @click="toggle(item)">
                            <label class="custom-control-label" :for="'select-item-'+item.id">&nbsp;</label>
                        </div>
                    </td>

                    <slot name="list-item" :item="item">
                        <td v-for="key in headers" class="align-baseline" :key="key">
                            {{item[_.snakeCase(key)]}}
                        </td>
                    </slot>

                    <td class="text-right align-baseline">
                        <slot name="actions" :item="item"></slot>
                    </td>
                </tr>
                </tbody>
            </table>

            <!--
            Pagination
            -->
            <div class="my-4">
                <Pagination
                        :pagination="$store.state[resource+'_pagination']"
                        @paginate="getResources($event.page)"
                />
            </div>
        </div>

        <empty-spot v-else>
            <h4 slot="title"></h4>

            <div class="text-center" slot="message">
                <p class="text-muted">
                    No resources matched the given criteria
                </p>
            </div>
        </empty-spot>
    </div>
</template>

<script>
    import ActionsDropdown from './ActionsDropdown'
    import Filterable from "../mixins/Filterable"

    export default {
        components: {
            ActionsDropdown
        },

        mixins: [Filterable],

        props: {
            resource: {
                type: String,
                required: true
            },

            headers: {
                type: Array,
                required: true
            },

            actions: {
                type: Array,
                default() {
                    return []
                }
            },

            /**
             * Filters is an array of object like {label, options}
             */
            filters: {
                type: Array,
                default() {
                    return []
                }
            },

            actionable: {
                type: Boolean,
                default: true
            },

            canDelete: {
                type: Boolean,
                default: true
            },

            /**
             * Default filters to apply on "paginate" request
             */
            defaultFilters: {
                type: Object,
                default() {
                    return {}
                }
            },

            searchable: {
                type: Boolean,
                default: true
            },

            basePath: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                selected: []
            }
        },

        computed: {
            items() {
                return this.$store.getters.list(this.resource)
            },

            allIsChecked() {
                return (this.selected.length > 0) && (this.selected.length === this.items.length)
            },

            isActionable() {
                return this.actionable
            },

            activeFilters(){
                return this.filters.filter(f => f.show)
            }
        },

        created() {
            this.addDefaultDeleteAction()
            this.getResources()

            this.$watch(
                () => {
                    return (
                        this.encodedFilters +
                        this.defaultFilters
                    )
                },
                () => {
                    this.getResources()
                },
                {
                    deep: true
                })
        },

        methods: {
            addDefaultDeleteAction() {
                this.actions.push({
                    icon: 'fas fa-trash',
                    label: 'Destroy selected',
                    show: this.canDelete,
                    handler: id => this.performDestroy(id)
                })
            },

            /**
             * Run action for all selected resources
             *
             * @param action
             */
            runAction({action}) {
                this.$alerts.confirm(() => {
                    this.selected.forEach(item => {
                        action.handler(item)
                    })
                }, {
                    title: 'Are you sure?',
                    text: '"OK" to confirm, "Cancel" to return without any executions.'
                })
            },

            deleteItem(id) {
                this.$alerts.confirm(() => {
                    this.performDestroy(id)
                }, {
                    title: 'Are you sure?',
                    text: '"OK" to confirm, "Cancel" to return without any executions.'
                })
            },

            performDestroy(id) {
                this.$store.dispatch('deleteItem', {resource: this.resource, id})
                    .then(() => this.$toasted.show('The action was executed', {type: 'success'}))
                    .catch(e => this.$toasted.show(e.response.data.message, {type: 'error'}))
            },

            getResources(page = 1) {
                this.clearSelection()

                let payload = {
                    page,
                    filters: this.mergeFilters(this.defaultFilters)
                }

                this.$store.dispatch('paginate', {resource: this.resource, payload})
                    .then(collection => this.$emit('ready', {collection}))
            },

            toggleAll() {
                if (this.allIsChecked)
                    this.selected = []
                else
                    this.items.forEach(item => {
                        if (this.selected.indexOf(item.id) === -1)
                            this.selected.push(item.id)
                    })
            },

            toggle(item) {
                let index = this.selected.indexOf(item.id)
                if (index === -1)
                    this.selected.push(item.id)
                else
                    this.selected.splice(index, 1)
            },

            clearSelection() {
                this.selected = []
            }
        }
    }
</script>

<style scoped>
    .index_crud_action_link {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 24px;
        cursor: pointer;
        margin-right: 15px
    }

    .index_crud_action_link:hover {
        color: #0f69ae;
    }
</style>
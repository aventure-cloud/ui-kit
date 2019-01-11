import Vue from 'vue';
import EventBus from '../helpers/EventBus';
import Filterable from '../mixins/Filterable'


let requireComponents = require.context('.', true, /\.vue$/);


requireComponents.keys().forEach(filename => {
    const component = requireComponents(filename).default
    const name = filename.split('/')[filename.split('/').length-1].split('.')[0]

    console.log('import ui component: ', filename, name)

    Vue.component(name, component)
});


export {
    EventBus,
    Filterable
};
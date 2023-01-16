import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const dark_string = window.localStorage.getItem("dark")
const dark = (!(dark_string !== undefined && dark_string === "false"))
export default new Vuetify({
    theme: { dark: dark },
});

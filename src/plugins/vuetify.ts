import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import {getCookie} from "typescript-cookie";

Vue.use(Vuetify);

const dark_cookie = getCookie("dark")
const dark = (!(dark_cookie !== undefined && dark_cookie === "false"))
export default new Vuetify({
    theme: { dark: dark },
});

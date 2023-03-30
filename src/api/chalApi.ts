import {Challenge} from "../../cs6131-backend/types/chalTypes";
import {getCookie} from "typescript-cookie";
import Vue from "vue";

export const create = (chal: Challenge): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/chals/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({'challenge': chal})
        }).then(res => resolve(res))
    })
}
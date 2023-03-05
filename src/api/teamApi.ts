import {Team} from "../../cs6131-backend/types/teamTypes";
import Vue from "vue";
import {getCookie} from "typescript-cookie";

export const getUserTeams = (): Promise<Array<Team>> => {
    return new Promise<Array<Team>>((resolve, reject) => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/teams/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) return res.json();
            else reject(res.statusText);
        }).then(json => resolve(json)
        ).catch(reason => reject(reason))
    })
}
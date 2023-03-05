import {Team} from "../../cs6131-backend/types/teamTypes";
import Vue from "vue";

export const getUserTeams = (username: string): Promise<Array<Team>> => {
    return new Promise<Array<Team>>((resolve, reject) => {
        fetch(`${Vue.prototype.$apilink}/teams/user/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) return res.json();
            else reject(res.statusText);
        }).then(json => resolve(json)
        ).catch(reason => reject(reason))
    })
}
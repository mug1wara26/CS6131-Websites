import {ctf} from "../../cs6131-backend/types/ctfTypes";
import {getCookie} from "typescript-cookie";
import Vue from "vue";

export const getTeamCTFs = (teamName: string): Promise<Array<ctf>> => {
    return new Promise<Array<ctf>>((resolve, reject) => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/ctfs/teamCTFs/${teamName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
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

import {getCookie} from "typescript-cookie";
import {BasicCTF, CTF} from "../../cs6131-backend/types/ctfTypes";
import Vue from "vue";

export const getTeamCTFs = (teamName: string): Promise<Array<CTF>> => {
    return new Promise<Array<CTF>>((resolve, reject) => {
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

export const ctfExists = (name: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        fetch(`${Vue.prototype.$apilink}/ctfs/public/${name}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) resolve(true);
            else resolve(false)
        })
    })
}

export const createCTF = (ctf: BasicCTF): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/ctfs/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({'ctf': ctf})
        }).then(res => resolve(res))
    });
}
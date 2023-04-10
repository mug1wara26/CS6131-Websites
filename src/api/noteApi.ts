import {BasicWriteup, Writeup} from "../../cs6131-backend/types/writeupTypes";
import {getCookie} from "typescript-cookie";
import Vue from "vue";

export const getUserWriteups = (username: string): Promise<Array<Writeup>> => {
    return new Promise<Array<Writeup>>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/notes/getWriteups/${username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => resolve(data.writeups))
            else resolve([])
        })
    })
}

export const createWriteup = (writeup: BasicWriteup): Promise<Writeup> => {
    return new Promise<Writeup>((resolve, reject) => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/notes/createWriteup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({writeup: writeup})
        }).then(res => {
            if (res.status === 200) res.json().then(data => resolve(data.writeup))
            else reject(res)
        })
    })
}

export const getWriteup = (noteid: string): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/notes/getWriteup/${noteid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => resolve(res))
    })
}
import {Writeup} from "../../cs6131-backend/types/writeupTypes";
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
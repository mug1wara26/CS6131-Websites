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


export const updateWriteup = (writeup: BasicWriteup): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/notes/updateWriteup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({writeup: writeup})
        }).then(res => resolve(res))
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

export const validateWriteupTitle = (title: string, callback: Function) => {
    if (title) {
        if (title.length > 128) return callback('Title cannot be longer than 128 characters')
        if (!/^[A-Za-z0-9\s]*$/.test(title)) return callback('Title can only contain alphanumeric characters and spaces')

        return callback(null)
    }
    else return callback('Please specify a title')

}
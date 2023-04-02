import {BasicChallenge, Challenge} from "../../cs6131-backend/types/chalTypes";
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

export const getChal = (name: string, ctfid: string): Promise<BasicChallenge> => {
    return new Promise<BasicChallenge>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/chals/${ctfid}/${name}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                if (Object.keys(data).length === 0) resolve({} as BasicChallenge)
                else resolve(data.challenge as BasicChallenge)
            })
            else resolve({} as BasicChallenge)
        })
    })
}

export const solve = (ctfid: string, chalName: string, flag: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/chals/solve`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ctfid: ctfid, chalName: chalName, flag: flag})
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                if (data.solved) resolve(true)
                else resolve(false)
            })
            else resolve(false)
        })
    })
}

interface ChalUserData {
    challenge: BasicChallenge,
    isPublic: boolean,
    isSolved: boolean
}
export const getChalUserData = (ctfid: string, chalName: string): Promise<ChalUserData> => {
    return new Promise<ChalUserData>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/chals/getChalUserData`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ctfid: ctfid, chalName: chalName})
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data)
            })
            else resolve({} as ChalUserData)
        })
    })
}
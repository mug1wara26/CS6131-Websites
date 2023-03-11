import {RegisteringTeam, Team} from "../../cs6131-backend/types/teamTypes";
import Vue from "vue";
import {getCookie} from "typescript-cookie";

export const getUserTeams = (): Promise<Array<Team>> => {
    return new Promise<Array<Team>>((resolve, reject) => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/teams/userTeams`, {
            method: 'POST',
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

export const teamExists = (name: string): Promise<string> => {
    return new Promise<string>(resolve => {
        fetch(`${Vue.prototype.$apilink}/teams/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(value => {
            if (value === {}) resolve("")
            else resolve(value.teamName)
        })
    })
}

export const createTeam = (team: RegisteringTeam, token: string): Promise<Response> => {
    return new Promise<Response>(resolve => {
        fetch(`${Vue.prototype.$apilink}/teams/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(team)
        }).then(res => resolve(res))
    })
}
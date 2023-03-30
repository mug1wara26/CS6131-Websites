import {BasicTeam, Team} from "../../cs6131-backend/types/teamTypes";
import Vue from "vue";
import {getCookie} from "typescript-cookie";

export const getUserTeams = (username: string): Promise<Array<Team>> => {
    return new Promise<Array<Team>>((resolve, reject) => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/teams/userTeams/${username}`, {
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

export const teamExists = (name: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        fetch(`${Vue.prototype.$apilink}/teams/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) resolve(true);
            else resolve(false)
        })
    })
}

export const createTeam = (team: BasicTeam, token: string): Promise<Response> => {
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

export const getTeam = (name: string): Promise<Team> => {
    const headers: Record<string, any> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': getCookie('token') || ''
    }
    return new Promise<Team>(resolve => {
        fetch(`${Vue.prototype.$apilink}/teams/${name}`, {
            method: 'GET',
            headers: headers
        }).then(res => {
            if (res.status === 200) res.json().then(data => {

                // data.hasAccess is only there if user does not have access so this has to be checked first
                if (data.hasAccess === false) resolve({} as Team)
                else resolve(data as Team)
            })
            else resolve({} as Team)
        })
    })
}

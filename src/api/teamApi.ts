import {BasicTeam, MemberStat, Team} from "../../cs6131-backend/types/teamTypes";
import Vue from "vue";
import {getCookie} from "typescript-cookie";
import {BasicUser} from "../../cs6131-backend/types/userTypes";

export const getUserTeams = (username: string): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/teams/userTeams/${username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            resolve(res)
        })
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

export const getMembers = (name: string): Promise<Array<string>> => {
    return new Promise<Array<string>>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/members/${name}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.members)
            })
            else resolve([])
        })
    })
}

export const getMemberStats = (name: string): Promise<Array<MemberStat>> => {
    return new Promise<Array<MemberStat>>((resolve, reject) => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/getMemberStats/${name}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data)
            })
            else reject(res)
        })
    })
}
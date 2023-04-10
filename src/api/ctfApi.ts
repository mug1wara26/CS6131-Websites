import {getCookie} from "typescript-cookie";
import {BasicCTF, CTF, TeamUserLeaderboard} from "../../cs6131-backend/types/ctfTypes";
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

export const getCompetingCTFs = (teamName: string): Promise<Array<CTF>> => {
    return new Promise<Array<CTF>>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/ctfs/competingctfs/${teamName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.ctfs)
            });
            else resolve([])
        })
    })
}

export const ctfNameExists = (name: string): Promise<boolean> => {
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

export const getCTF = (id: string): Promise<CTF> => {
    return new Promise<CTF>(resolve => {
        fetch(`${Vue.prototype.$apilink}/ctfs/get/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': getCookie('token') || ''
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                // data.hasAccess is only there if user does not have access so this has to be checked first
                if (data.hasAccess === false) resolve({} as CTF)
                else resolve(data as CTF)
            })
            else resolve({} as CTF)
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

export const getCTFChals = (ctfid: string): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/ctfs/chals/${ctfid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => resolve(res))
    })
}

export const compete = (ctfid: string, teamName: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/ctfs/compete/${ctfid}/${teamName}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) resolve(true)
            else resolve(false)
        })
    })
}

export function getLeaderboard<T>(leaderboard: string, ctfid: string): Promise<Array<T>> {
    return new Promise<Array<T>>((resolve, reject) => {
        const url = `${Vue.prototype.$apilink}/ctfs/${leaderboard}/${ctfid}`

        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => resolve(data.leaderboard))
            else reject(res.statusText)
        })
    })
}

export const getTeamUserLeaderboard = (ctfid: string, teamName: string): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/ctfs/teamUserLeaderboard/${ctfid}/${teamName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => resolve(res))
    })
}
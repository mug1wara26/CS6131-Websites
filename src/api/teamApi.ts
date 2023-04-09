import {BasicTeam, MemberStat, Team} from "../../cs6131-backend/types/teamTypes";
import Vue from "vue";
import {getCookie} from "typescript-cookie";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import jwt_decode from "jwt-decode";

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

export const getUserTeamsFromToken = ():Promise<Array<Team>> => {
    return new Promise<Array<Team>>(resolve => {
        const token = getCookie('token') || '';
        fetch(`${Vue.prototype.$apilink}/teams/userTeams`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.teams)
            })
            else resolve([])
        })
    })
}

export const teamExists = (name: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        fetch(`${Vue.prototype.$apilink}/teams/getTeam/${name}`, {
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
        fetch(`${Vue.prototype.$apilink}/teams/getTeam/${name}`, {
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
                resolve(data)
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

const requestOrInviteTeam = (endpoint: string, teamName: string, username: string): Promise<Response> => {
    return new Promise<Response>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/${endpoint}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName, username: username})
        }).then(res => {
            resolve(res)
        })
    })
}

export const requestToJoin = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        requestOrInviteTeam('request', teamName, username).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const inviteToTeam = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        requestOrInviteTeam('invite', teamName, username).then(res => {
            resolve(res.status === 200)
        })
    })
}

const hasRequestedOrInvited = (endpoint: string, teamName: string, username: string): Promise<Response> => {
    return new Promise<Response>(resolve => {

        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/${endpoint}/${teamName}/${username}`, {
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

export const hasRequested = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        hasRequestedOrInvited('hasRequested', teamName, username).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.hasRequested)
            })
            else resolve(false)
        })
    })
}

export const hasInvited = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        hasRequestedOrInvited('hasInvited', teamName, username).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.hasInvited)
            })
            else resolve(false)
        })
    })
}

export const getRequestedOrInvitedTeams = (endpoint: string, username: string): Promise<Array<Team>> => {
    return new Promise<Array<Team>>(resolve => {
        const token = getCookie('token') || ''

        fetch(`${Vue.prototype.$apilink}/teams/${endpoint}/${username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.teams)
            })
            else resolve([])
        })
    })
}

const getRequestedOrInvitedUsers = (endpoint: string, teamName: string): Promise<Array<BasicUser>> => {
    return new Promise<Array<BasicUser>>(resolve => {
        const token = getCookie('token') || ''

        fetch(`${Vue.prototype.$apilink}/teams/${endpoint}/${teamName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.users)
            })
            else resolve([])
        })
    })
}

export const getRequestedUsers = (teamName: string): Promise<Array<BasicUser>> => {
    return new Promise<Array<BasicUser>>(resolve => {
        getRequestedOrInvitedUsers('getRequestedUsers', teamName).then(users => {
            resolve(users)
        })
    })
}

export const getInvitedUsers = (teamName: string): Promise<Array<BasicUser>> => {
    return new Promise<Array<BasicUser>>(resolve => {
        getRequestedOrInvitedUsers('getInvitedUsers', teamName).then(users => {
            resolve(users)
        })
    })
}

export const getNotInvitedTeams = (username: string): Promise<Array<Team>> => {
    return new Promise<Array<Team>>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/getNotInvitedTeams/${username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(res => {
            if (res.status === 200) res.json().then(data => {
                resolve(data.teams)
            })
            else resolve([])
        })
    })
}

export const acceptRequest = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/acceptRequest`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName, username: username})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const denyRequest = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/denyRequest`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName, username: username})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const acceptInvite = (teamName: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/acceptInvite`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const removeInvite = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/removeInvite`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName, username: username})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const rejectInvite = (teamName: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/rejectInvite`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const leave = (teamName: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/leave`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}

export const transferOwner = (teamName: string, username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const token = getCookie('token') || ''
        fetch(`${Vue.prototype.$apilink}/teams/transferOwnership`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({teamName: teamName, username: username})
        }).then(res => {
            resolve(res.status === 200)
        })
    })
}
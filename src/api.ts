import {BasicUser, RegisteringUser} from "../cs6131-backend/types/user";
import Vue from "vue";
import {getCookie, removeCookie} from "typescript-cookie";
import jwt_decode from "jwt-decode";

export const register = (user: RegisteringUser): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        fetch(`${Vue.prototype.$apilink}/users/register`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        }).then(response => {
            resolve(response);
        });
    });
};

export const getUser = (username: string): Promise<BasicUser> => {
    return new Promise<BasicUser>((resolve, reject) => {
        fetch(`${Vue.prototype.$apilink}/users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(res => {
            if (res.status == 200) return res.json()
            else reject(res)
        }).then(json => {
            resolve(json.data)
        }).catch(err => reject(err))
    })
};

export const userExists = (username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        getUser(username).then(_ => {
            resolve(true)
        }).catch(_ => {
            return resolve(false)
        })
    });
}

export const login = (username: string, password: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        fetch(`${Vue.prototype.$apilink}/users/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    resolve(data.token);
                })
            }
            if (res.status === 400) reject(res.statusText);
        })
    });
}

export interface AlertError {
    errorType: string;
    errorTitle: string;
    errorText: string;
}

export const onLogin = (callback: Function) => {
    const token = getCookie('token');
    if (token) {
        try {
            const decoded = jwt_decode(token);
            const decodedKeys = Object.getOwnPropertyNames(decoded);
            if(Object.keys(new BasicUser()).every((key) => decodedKeys.includes(key))) {
                // eslint-disable-next-line no-unused-vars
                const {iat, exp, ...user} =decoded as any;
                callback(null, user);
            }
            else {
                removeCookie('token')
                callback({errorType: "error", errorTitle: "Login Error", errorText: "Please login again"} as AlertError);
            }
        }
        catch {
            removeCookie('token')
            callback({errorType: "error", errorTitle: "Login Error", errorText: "Please login again"} as AlertError);
        }
    }
    callback(null, {} as BasicUser)
}
import {BasicUser, RegisteringUser} from "../cs6131-backend/types/user";
import Vue from "vue";

export const register = (user: RegisteringUser): Promise<Response> => {
    return new Promise<Response>( (resolve, reject) => {
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

export const getUser = (username: string) : Promise<BasicUser> => {
    return new Promise<BasicUser>((resolve, reject) => {
            fetch(`${Vue.prototype.$apilink}/users/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            ).then(res => {
                if (res.status==200) return res.json()
                else reject(res)
            }).then(json => {
                resolve(json.data)
            }).catch(err => reject(err))
        }
    )
};

export const userExists = (username: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        getUser(username).then(res => {
            resolve(true)
        }).catch(err => {
            return resolve(false)
        })
    });
}

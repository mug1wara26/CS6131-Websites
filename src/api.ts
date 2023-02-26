import {RegisteringUser} from "../cs6131-backend/types/user";
import Vue from "vue";

export const register = (user: RegisteringUser): Promise<object> => {
    return new Promise<object>( (resolve, reject) => {
        fetch(`${Vue.prototype.$apilink}/users/register`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        }).then(response => response.json()).then(json => {
            resolve(json);
        })
    })
}
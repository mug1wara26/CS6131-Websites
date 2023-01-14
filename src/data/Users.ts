import {User} from "@/schemas/User";

const users: Array<User> = [
    {
        name: "Alice",
        uid: "1",
        bio: "Alice's bio",
        email: "alice@gmail.com"
    },
    {
        name: "Bob",
        uid: "2",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        email: "bob@gmail.com"
    },
    {
        name: "Charlie",
        uid: "3",
        bio: "Charlie's bio",
        email: "charlie@gmail.com"
    },
]

export default users
import { resolve } from "path";

export interface User {
    email: string;
    passowrd: string;
    name: string;
    role: string;
    others: string;
}

export interface Credential {
    token: string;
    email: string;
    name: string;
    role: string;
}

const users: User[] = [
    {
        email: "user@company.com",
        name: "นายใช้งาน ธรรมดา",
        passowrd: "pass",
        role: "user",
        others: ".."
    },
    {
        email: "admin@company.com",
        name: "นายใช้งาน ธรรมดา",
        passowrd: "pass",
        role: "user",
        others: ".."
    },
    {
        email: "manager@company.com",
        name: "นายใช้งาน ธรรมดา",
        passowrd: "pass",
        role: "user",
        others: ".."
    }
]

export const login = (email: string, pass: string): Promise<Credential> => {
    return new Promise((res, rej) => {
        const user = users.find((u) => u.email === email && u.passowrd === pass);

        if (user !== undefined) {
            res({
                token: crypto.randomUUID(),
                email: user.email,
                name: user.name,
                role: user.role
            });
        } else {
            rej("user not found")
        }
    })
}

export const logout = () => {
    return localStorage.removeItem("credential")
}
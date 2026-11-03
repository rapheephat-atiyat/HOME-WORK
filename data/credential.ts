import { resolve } from "path";

export interface User {
    email: string;
    passowrd:string;
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
        name:"นายใช้งาน ธรรมดา",
        passowrd: "pass",
        role: "user",
        others: ".."
    }
]

export const login = (email: string, pass: string): Promise<Credential> => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(Math.random() <= 0.8) {
                const user = users.find((u) => u.email === email && u.passowrd === pass);
                
                if(user !== undefined) {
                    res({
                        token: crypto.randomUUID(),
                        email: user.email,
                        name: user.name,
                        role: user.role
                    });
                } else {
                    rej("user not found")
                }
            } else {
                rej("connection refused");
            }
        }, 1000+ Math.random() * 2000)
    })
}

export const logout = () => {
    return localStorage.removeItem("credential")
}
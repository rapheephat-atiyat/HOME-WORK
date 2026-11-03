"use client"
import { Button } from "@/components/tailgrids/core/button";
import { Dialog, DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/tailgrids/core/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/tailgrids/core/input-group";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { login } from "@/data/credential";
import { EyeDisabled, Keyboard } from "@tailgrids/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const route = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handlerLogin = async () => {
        try {
            console.log(email, pass);
            const returnPath = localStorage.getItem("returnPath") || "/";
            const user = await login(email, pass);
            localStorage.setItem("credential", JSON.stringify(user));
            alert("login success");
            route.replace(returnPath)
        } catch(err) {
            alert(err)
        }
        
    }

    return (
        <Backdrop isOpen={true}>
            <Dialog showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-center" >Who are you?</DialogTitle>
                </DialogHeader>

                <DialogBody className="flex flex-col gap-2">
                    <InputGroup>
                        <InputGroupAddon align={"inline-start"}>
                            <Keyboard />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="user | admin | manager" onChange={(e) => setEmail(e.target.value)} />
                        <InputGroupAddon align="inline-end">@company.com</InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon align={"inline-start"}>
                            <EyeDisabled />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="pass" type="password" onChange={(e) => setPass(e.target.value)}/>
                    </InputGroup>
                </DialogBody>

                <DialogFooter>
                    <DialogClose appearance={"outline"} onClick={handlerLogin}>
                        Login
                    </DialogClose>
                </DialogFooter>
            </Dialog>
        </Backdrop>
    )
        
}
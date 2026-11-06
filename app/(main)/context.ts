"use client";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Products } from "./product/data";
import { Credential } from "@/data/credential";

export const globalDataContext = createContext<{
    isProductLoading: boolean;
    products: Products[],
    setProducts: Dispatch<SetStateAction<Products[]>>;
    carts: Products[],
    setCarts: Dispatch<SetStateAction<Products[]>>;
    user: Credential | null,
    setUser: Dispatch<SetStateAction<Credential | null>>;
    handleLogout: () => void;
} | null>(null);

export function useGlobalData() {
    const context = useContext(globalDataContext);
    if (!context) {
        throw new Error("err");
    }
    return context;
}
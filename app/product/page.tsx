"use client";
import { Card, CardAction, CardHeader } from "@/components/tailgrids/core/card";
import Image from "next/image";
import { useContext } from "react";
import { globalDataContext } from "../context";
import { Products } from "./data";

export default function page() {
    const { products, carts }: { products: Products[], carts: any[] } = useContext(globalDataContext)
    console.log(products);

    return (
        <div className="product-page">
            <div className="container outline outline-red-500">
                <div className="grid grid-cols-5">
                    {products.map((p, i) => (
                        <div key={p.id}>{p.price}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
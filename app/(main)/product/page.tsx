"use client";
import { Card, CardAction, CardHeader } from "@/components/tailgrids/core/card";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { globalDataContext, useGlobalData } from "../context";
import { Products } from "./data";
import { Button } from "@/components/tailgrids/core/button";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

export default function page() {
    const router = useRouter();
    useEffect(() => checkLogin(router, "/product"), [router])
    const { products, carts, setCarts, isProductLoading } = useGlobalData()
    console.log(products);
    console.log(carts);

    const handleAddToCart = (product: Products) => {
        setCarts((prev) => [...prev, product]);
    };

    return (
        <div className="prodcut-page">
            {isProductLoading ?
                <div className="text-center text-5xl animate-pulse my-20">
                    กำลังโหลดข้อมูล
                </div>
                : <div className=" my-5">
                    <div className="container border border-gray-400 rounded-lg bg-blue-100">
                        <div className="grid grid-cols-5 gap-5 p-5">
                            {products.map((p, i) => (
                                <div key={p.id} className="border rounded-lg relative">
                                    <span className="bg-black/80 rounded-full px-2 py-0.5 absolute right-0.5 top-0.5 text-white">{Intl.NumberFormat("th-TH", {
                                        style: "currency",
                                        currency: "THB"
                                    }).format(p.price!)}</span>
                                    <div>
                                        <img
                                            src={p.thumbnailUrl}
                                            alt={p.title}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                    <Button onClick={() => handleAddToCart(p)} appearance={"outline"} className={"w-full rounded-t-none border border-green-400 bg-green-100 hover:bg-green-200 text-green-700 font-semibold"}>
                                        Add to Carts
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
        </div>
    );
}
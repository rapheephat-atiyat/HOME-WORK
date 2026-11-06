'use client';
import { Button } from "@/components/tailgrids/core/button";
import { useGlobalData } from "../context";
import { Cart2 } from "@tailgrids/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkLogin } from "@/utils/login";

export default function page() {
    const router = useRouter();
    useEffect(() => checkLogin(router, "/cart"), [router])
    const { carts, setCarts } = useGlobalData();

    const handleRemoveFromCart = (indexToRemove: number) => {
        setCarts((prev) => prev.filter((_, index) => index !== indexToRemove));
    };


    const totalPrice = carts.reduce((sum, item) => sum + (item.price || 0), 0)

    return (
        <div className="cart-page">
            {carts?.length > 0 ?
                <>
                    <div className="container border border-gray-400 rounded-lg bg-blue-100 my-5">
                        <div className="grid grid-cols-5 gap-5 m-5">
                            {carts.map((c, i) => (
                                <div key={i} className="border rounded-lg relative">
                                    <span className="bg-black/80 rounded-full px-2 py-0.5 absolute right-0.5 top-0.5 text-white">{Intl.NumberFormat("th-TH", {
                                        style: "currency",
                                        currency: "THB"
                                    }).format(c.price!)}</span>
                                    <div>
                                        <img
                                            src={c.thumbnailUrl}
                                            alt={c.title}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                    <Button onClick={() => handleRemoveFromCart(i)} appearance={"outline"} className={"w-full rounded-t-none border border-red-400 bg-red-100 hover:bg-red-200 text-red-700 font-semibold"}>
                                        Remove
                                    </Button>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-5 mb-5">
                        <div className="border-gray-500 bg-amber-500 text-white font-semibold rounded-full px-2 py-1">Count: {carts.length} items</div>
                        <div className="border-gray-500 bg-red-600 text-white font-semibold rounded-full px-2 py-1">Price: {Intl.NumberFormat("th-TH", {
                            currency: "THB",
                            style: "currency"
                        }).format(totalPrice)}</div>
                    </div>
                </>
                : <div className="text-5xl my-20">
                    <div className="flex gap-2 items-center justify-center">
                        <Cart2 size={50} color="blue" /> ไม่มีสินค้าในตะกร้า
                    </div>
                </div>
            }
        </div>
    );
}
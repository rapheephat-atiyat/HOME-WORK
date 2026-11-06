"use client"
import Link from "next/link";
import "../globals.css";
import { useEffect, useState } from "react";
import { globalDataContext } from "./context";
import { fetchProdcuts, Products } from "./product/data";
import { Credential, logout } from "@/data/credential";
import { Button } from "@/components/tailgrids/core/button";
import { useRouter } from "next/navigation";

const navigationStyle = "rounded border border-[#0d6efd] px-3 py-1.5 text-[#0d6efd] transition-colors hover:bg-[#0d6efd] hover:text-white max-sm:px-2";
const tiles = [
  "rotate-[5deg] bg-[#dc3545]", "-rotate-[5deg] bg-[#198754]",
  "rotate-[5deg] bg-[#0d6efd] sm:w-[50px] max-sm:w-[34px]", "-rotate-[5deg] bg-[#0dcaf0]",
  "rotate-[5deg] bg-[#ffc107]", "-rotate-[5deg] bg-[#6c757d]",
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  const [products, setProducts] = useState<Products[]>([]);
  const [carts, setCarts] = useState<Products[] | []>([])
  const [user, setUser] = useState<Credential | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let isMounted = true;
    const credential = localStorage.getItem("credential");
    if (credential) {
      try {
        setUser(JSON.parse(credential));
      } catch (err) {
        alert("err")
      }
    }
    if (products.length === 0) {
      setIsProductLoading(true);
      fetchProdcuts()
        .then((data) => {
          if (isMounted) {
            setProducts(data);
          }
        })
        .catch((err) => {
          console.error(err);
          alert(err)
        })
        .finally(() => {
          if (isMounted) {
            setIsProductLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.replace("/")
  };

  return (
    <globalDataContext.Provider value={{ isProductLoading, products, setProducts, carts, setCarts, user, setUser, handleLogout }}>
      <html lang="th">
        <body>
          <div className="group mx-auto my-9 w-[calc(100%-40px)] max-w-227.5 px-1.5 pt-4.5 pb-4  max-sm:my-5 max-sm:w-[calc(100%-24px)] max-sm:px-2.5">
            <header className="text-center">
              <div className="mb-2.5 flex justify-center gap-3.5 max-sm:gap-2" aria-label="CSI205">
                {"CSI205".split("").map((letter, index) => (
                  <span key={index} className={`grid h-13.75 w-16 place-items-center rounded-[5px] text-[34px] font-bold text-white max-sm:h-10.5 max-sm:w-10 max-sm:text-[26px] ${tiles[index]}`} aria-hidden="true">{letter}</span>
                ))}
              </div>
              <p className="mb-8.75 inline-block rounded bg-[#212529] px-3.5 py-0.75 text-[22px] font-bold text-white max-sm:mb-6 max-sm:px-2.25 max-sm:py-1.75 max-sm:text-[13px]">FRONT END SOFTWARE DEVELOPMENT</p>
              <nav className="mb-3.75 flex flex-wrap justify-center gap-2 max-sm:gap-1.5" aria-label="Main navigation">
                <Link href="/" className={`${navigationStyle} group-has-[.home-page]:border-[#0b5ed7] group-has-[.home-page]:bg-[#0b5ed7] group-has-[.home-page]:text-white`}>Home</Link>
                <Link href="/calculator" className={`${navigationStyle} group-has-[.calculator-page]:border-[#0b5ed7] group-has-[.calculator-page]:bg-[#0b5ed7] group-has-[.calculator-page]:text-white`}>Calculator</Link>
                <Link href="/animation" className={`${navigationStyle} group-has-[.animation-page]:border-[#0b5ed7] group-has-[.animation-page]:bg-[#0b5ed7] group-has-[.animation-page]:text-white`}>Animation</Link>
                <Link href="/todos" className={`${navigationStyle} group-has-[.todo-page]:border-[#0b5ed7] group-has-[.todo-page]:bg-[#0b5ed7] group-has-[.todo-page]:text-white`}>Todos</Link>
                <Link href="/product" className={`${navigationStyle} group-has-[.prodcut-page]:border-[#0b5ed7] group-has-[.prodcut-page]:bg-[#0b5ed7] group-has-[.prodcut-page]:text-white`}>Product {products?.length > 0 && <span>({products.length})</span>}</Link>
                <Link href="/cart" className={`${navigationStyle} group-has-[.cart-page]:border-[#0b5ed7] group-has-[.cart-page]:bg-[#0b5ed7] group-has-[.cart-page]:text-white relative`}>Carts {carts?.length > 0 && <div className="absolute bg-red-500 -right-2 -top-2 rounded-full size-5 text-white">{carts.length}</div>}</Link>
                {user && (
                  <Button onClick={handleLogout} variant={"danger"}>
                    Log out
                  </Button>
                )}
              </nav>
            </header>
            {children}
            <footer className="text-center">
              <p className="mb-2 inline-block rounded bg-[#cfe2ff] px-3.5 py-0.75 text-[22px] font-bold max-sm:text-lg">68000639 นายรพีภัทร เอติยัติ LAB:002</p>
              <div className="flex justify-center">
                <Link
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="flex h-10 w-16 items-center justify-center border-r border-gray-300 text-[#1877F2]"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.972H15.83c-1.491 0-1.956.931-1.956 1.886v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.099 24 12.073z" />
                  </svg>
                </Link>

                <Link
                  href="https://youtube.com"
                  aria-label="YouTube"
                  className="flex h-10 w-16 items-center justify-center text-red-600"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a2.96 2.96 0 0 0-2.083-2.096C19.577 3.6 12 3.6 12 3.6s-7.577 0-9.415.49A2.96 2.96 0 0 0 .502 6.186 30.6 30.6 0 0 0 0 12a30.6 30.6 0 0 0 .502 5.814 2.96 2.96 0 0 0 2.083 2.096C4.423 20.4 12 20.4 12 20.4s7.577 0 9.415-.49a2.96 2.96 0 0 0 2.083-2.096A30.6 30.6 0 0 0 24 12a30.6 30.6 0 0 0-.502-5.814ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
                  </svg>
                </Link>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </globalDataContext.Provider >
  );
}


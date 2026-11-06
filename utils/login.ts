import { useRouter } from "next/navigation";

export const checkLogin = (router: ReturnType<typeof useRouter>, returnPath: string) => {
    const credential = localStorage.getItem("credential");
    if (credential !== null) {
        // valid

        localStorage.removeItem("returnPath")
        if (window.location.pathname !== returnPath) {
            return router.replace(returnPath);
        }
    } else {
        localStorage.setItem("returnPath", returnPath)
        return router.replace("/login");
        // invalid
    }
}
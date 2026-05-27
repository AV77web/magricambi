import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import SignOutButton from "@/src/components/auth/SignOutButton";
import Navbar from "@/src/components/Navbar";

export default async function MainLayout({
    children,

}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div>
            <Navbar actions={<SignOutButton />} />
            <p className="bg-violet-700 text-white w-full text-center py-2">
                Sono del layout (main)
            </p>
            <main>{children}</main>
        </div>
    );
}

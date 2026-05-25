import { redirect } from "next/navigation";

export default function ContentLayout({
    children,

}: {
    children: React.ReactNode;
}) {

    const user = false;
    if (!user) {
        redirect("/");
    }
    return (
        <div>
            <p className="bg-violet-700 text-white w-full text-center py-2">
                Sono del layout (content)
            </p>
            <main>{children}</main>
        </div>
    );
}
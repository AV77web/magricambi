export default function MainLayout({
    children,

}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="bg-violet-700 text-white w-full text-center py-2">
                Sono del layout (main)
            </p>
            <main>{children}</main>
        </div>
    );
}
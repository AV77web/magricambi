export default function MarketingLayout({
    children,

}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="bg-violet-700 text-white w-full text-center py-2">
                Sono del layout (marketing)
            </p>
            <main>{children}</main>
        </div>
    );
}
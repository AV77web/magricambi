interface DocPage {
    path: string[],
    title: string,
    content: string,
}

interface DocPageProps {
    params: Promise<{
        slug: string[];
    }>
}

const docs: DocPage[] = [
    {
        path: ["intro"],
        title: "Introduzione",
        content: "Benvenuti alla documentazione...",
    },
    {
        path: ["intro", "getting-started"],
        title: "Getting Started",
        content: "Ecco come iniziare...",
    },
    {
        path: ["advanced", "configuration"],
        title: "Configurazione Avanzata",
        content: "Configurazioni dettagliate..."
    },
];

export default async function DocPage({ params }: DocPageProps) {
    const { slug } = await params;


    const doc = docs.find(doc => doc.path.join("/") === slug.join("/"));

    if (!doc) {
        return <div>Pagina non trovata</div>;
    }

    return (
        <div className="max-w-4xl ma-auto p-8">
            <h1 className="text-3xl font-bold mb-4">{doc.title}</h1>
            <p>{doc.content}</p>
            <div className="mt-r text-sm text-gray-500">Path: /{slug.join("/")}</div>
        </div>
    )
}
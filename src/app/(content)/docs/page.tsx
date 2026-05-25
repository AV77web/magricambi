//app/docs/page.tsx
import Link from "next/link";

interface DocSection {

    path: string;
    title: string;
    subsections?: { path: string; title: string}[];
}

// dati hardcodati
const docSections: DocSection[] = [
    {
        path: "intro",
        title: "introduzione",
        subsections: [
            { path: "getting-started", title: "Getting Started"},
            { path: "installation", title: "Installazione"},
        ],
    },
    {
        path: "advanced",
        title: "Guide Avanzate",
        subsections: [
            {path: "configuration", title: "Configurazione"},
            {path: "deployment", title: "Deployment"},
        ],
    },
];

export default function DocPage() {
    return (
        <div className="max-w-4xl mx-auro p-8">
            <h1 className="text-3xl font-bold mb-g">Documentazione</h1>
            <div className="space-y-8">
                {docSections.map((section)=> (
                    <div key={section.path} className="bg-zinc-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">
                            <Link
                                href={`/docs/${section.path}
                                `}
                                className="hover:text-zinc-300 transition-colors">
                                {section.title}
                            </Link>
                        </h2>
                        {section.subsections && (
                            <ul className="space-y-2 ml-4">{section.subsections.map((sub)=> {
                                return (
                            <li key={sub.path}>
                                <Link 
                                href={`/docs/${section.path}/${sub.path}`}
                                className="text-zinc-400 hover:text-zinc-300 transition-colors"
                                >
                                    {sub.title}
                                </Link>
                            </li>)
                        })}

                            </ul>
                        )}
                    </div>
                ))}

            </div>
        </div>
    )
}
//====================================
// File: Navbar.tsx
// componente Navbar
// @author: "villari.andrea@libero.it"
// @version: "1.0.0 2026-05-07"
//====================================
"use client"
import { useState , MouseEvent} from "react";
import Link from "next/link"; 

interface NavLink {
    href: string;
    label: string;
}

interface ServiceLink {
    href: string;
    label: string;
}

const navLinks: NavLink[] = [
    { href: "/", label: "Home"},
    { href: "/movimenti", label: "Movimenti"},
    { href: "/articoli", label: "Articoli"},
    { href: "/macchine", label: "Macchine"},
    { href: "/utenti", label: "Utenti"},
    
];

const serviceLinks: ServiceLink[] = [
    { href: "/services/web", label: "Web Development"},
    { href: "/services/mobile", label: "Mobile Development"},
    { href: "/services/consulting", label: "Consulting"},
    
]

export default function Navbar() {
    
        const [ isServicesOpen, setIsServicesOpen] = useState<boolean>(false);

        const toggleServices = ( e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsServicesOpen(!isServicesOpen);
        }
        return (
 <nav className="border-b border-zinc-800 bg-black">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between h-16">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center font-bold text-zinc-100 hover:text-zinc-300 transition-colors"
                    >
                        LOGO
                    </Link>

                    {/* Navigation */}
                    <div className="flex space-x-8">

                        {/* Link normali */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center text-zinc-300 hover:text-zinc-100 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Dropdown menu */}
                        <div className="relative flex items-center">

                            <button
                                className="flex items-center text-zinc-300 hover:text-zinc-100 transition-colors"
                                onClick={toggleServices}
                                aria-expanded={isServicesOpen}
                                aria-label="Toggle services menu"
                            >
                                Services

                                <svg
                                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Menu dropdown */}
                            {isServicesOpen && (
                                <div
                                    className="absolute top-full mt-2 w-48 bg-zinc-800 rounded-md shadow-lg py-1 border border-zinc-700"
                                    role="menu"
                                    aria-orientation="vertical"
                                >
                                    {serviceLinks.map((service) => (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            className="block px-4 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
                                        >
                                            {service.label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
}

const blogPosts: Post[]= [
  {
    slug: "primo-post",
    title: "Il mio primo post",
    excerpt: "Una breve introduzione al mio primo post...",
  },
  {
    slug: "secondo-post",
    title: "Il mio secondo post",
    excerpt: "Qualcosa di interessante sul seondo post",

  },
  { 
    slug: "terzo post",
    title: "Il mio terzo post",
    excerpt: "Un altro post interessante da leggere",
  }
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        { blogPosts.map((post) => (
        <article key={post.slug} className="p-6 bg-zinc-800 reounded-lg">
          <h2 className="text-xl font-bold mb-2">
            <Link href={`/blog/${post.slug}`}
              className="hover:text-zinc-200 transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-zinc-400">{post.excerpt}</p>

        </article>
        ))}
      </div>

    </div>
  );
}
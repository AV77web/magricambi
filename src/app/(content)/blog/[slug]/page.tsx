// [slug]/page.tsx
interface Post {
  slug: string;
  title: string;
  content: string;
}

const blogPosts: Post[] = [
  {
    slug: "primo-post",
    title: "Il mio primo post",
    content: "Questo è il contenuto del primo post...",
  },
  {
    slug: "secondo-post",
    title: "Il mio secondo post",
    content: "Questo è il contenuto del secondo post...",
  },
  {
    slug: "terzo-post",
    title: "Il mio terzo post",
    content: "Questo è il contenuto del terzo post...",
  },
];

/** Next 14: `params` è un oggetto sincrono. */
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <div>Post non trovato</div>;
  }

  return (
    <article className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

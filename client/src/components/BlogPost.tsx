import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) {
                return null;
            }
            return (
                <img
                    src={urlFor(value).width(800).fit('max').auto('format').url()}
                    alt={value.alt || ' '}
                    className="rounded-lg my-8 w-full shadow-md"
                />
            );
        }
    },
    block: {
        h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-12 mb-6 text-brand-teal">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-10 mb-5 text-brand-teal">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-2xl font-semibold mt-8 mb-4 text-foreground">{children}</h3>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-brand-teal pl-4 italic text-muted-foreground my-6">
                {children}
            </blockquote>
        ),
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed text-muted-foreground text-lg">{children}</p>,
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">{children}</ol>,
    },
    marks: {
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
            return (
                <a href={value.href} rel={rel} target="_blank" className="text-brand-teal hover:underline font-medium">
                    {children}
                </a>
            )
        },
    }
};

export default function BlogPost() {
    const [, params] = useRoute("/blog/:slug");
    const slug = params?.slug;

    const [post, setPost] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const query = `*[_type == "post" && slug.current == $slug][0] {
          title,
          mainImage,
          publishedAt,
          body,
          "name": author->name,
          "authorImage": author->image
        }`;
                const result = await client.fetch(query, { slug });
                setPost(result);
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="py-24 text-center">
                <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-64 bg-gray-200 rounded w-full"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                <Link href="/blog">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <article className="py-24 px-4 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/blog">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
                    </Button>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-brand-teal font-medium mb-4">
                        {post.publishedAt && (
                            <>
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                        {post.title}
                    </h1>
                </div>

                {post.mainImage && (
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-xl aspect-video relative">
                        <img
                            src={urlFor(post.mainImage).width(1200).height(675).fit('crop').url()}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-brand-teal hover:prose-a:text-brand-aqua">
                    {post.body && (
                        <PortableText value={post.body} components={ptComponents} />
                    )}
                </div>

                <div className="mt-16 pt-8 border-t border-border">
                    <Link href="/blog">
                        <Button variant="outline" className="w-full sm:w-auto">
                            View All Articles
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </article>
    );
}

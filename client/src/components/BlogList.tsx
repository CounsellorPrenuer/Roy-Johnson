import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { client, urlFor } from "@/lib/sanity";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function BlogList() {
    const [posts, setPosts] = useState<any[] | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
          _id,
          title,
          slug,
          mainImage,
          publishedAt,
          excerpt,
          "contentPreview": body[0].children[0].text
        }`;
                const result = await client.fetch(query);
                setPosts(result);
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
                setPosts([]);
            }
        };
        fetchPosts();
    }, []);

    if (posts === null) {
        return (
            <div className="py-24 text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-24 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-teal to-brand-aqua bg-clip-text text-transparent mb-4">
                    Insights & Resources
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Expert advice on career development, leadership strategies, and professional growth.
                </p>
            </motion.div>

            {posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    <p>No posts available at the moment. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-brand-aqua/20 overflow-hidden group">
                                {post.mainImage && (
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={urlFor(post.mainImage).width(600).height(400).url()}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {post.publishedAt
                                                ? format(new Date(post.publishedAt), "MMMM d, yyyy")
                                                : "Unknown Date"}
                                        </span>
                                    </div>
                                    <CardTitle className="line-clamp-2 hover:text-brand-teal transition-colors">
                                        <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="relative">
                                        {/* Static preview (always visible on mobile, enhanced on desktop hover) */}
                                        <p className="text-muted-foreground line-clamp-3 transition-opacity duration-300 group-hover:opacity-80">
                                            {(() => {
                                                // Use excerpt if available, otherwise generate from content
                                                const preview = post.excerpt ||
                                                    (post.contentPreview ?
                                                        post.contentPreview.substring(0, 150) :
                                                        "Click to read more about this topic...");

                                                // Ensure it ends nicely
                                                return preview.length > 150
                                                    ? preview.substring(0, 147) + "..."
                                                    : preview;
                                            })()}
                                        </p>

                                        {/* Enhanced hover preview for desktop */}
                                        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <p className="text-sm text-foreground/90 line-clamp-4 p-2 pt-4">
                                                {post.excerpt || (post.contentPreview ? post.contentPreview.substring(0, 200) : "")}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/blog/${post.slug.current}`}>
                                        <Button variant="ghost" className="p-0 text-brand-teal font-semibold group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}

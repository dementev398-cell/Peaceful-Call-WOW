import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function PostCard({ post }: { post: any }) {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:border-primary/40 transition-colors bg-card group shadow-sm hover:shadow-md">
      {post.coverImageUrl && (
        <div className="h-48 overflow-hidden bg-muted">
          <img 
            src={post.coverImageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Статья
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="font-serif text-xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          <Link href={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground line-clamp-3 text-sm">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 mt-auto border-t border-border/40 pb-4 px-6 gap-3">
        <Link 
          href={`/posts/${post.slug}`} 
          className="text-sm font-semibold text-primary hover:text-primary/80 tracking-wide uppercase mt-4 inline-flex items-center"
        >
          Читать далее <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

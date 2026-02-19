import Link from 'next/link';
import { Eye, Clock } from 'lucide-react';

interface Props {
  article: {
    id: string;
    title_te: string;
    category: string;
    imageUrl: string;
    views: number;
    publishedAt: any;
    authorName: string;
  };
  variant?: 'vertical' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'vertical' }: Props) {
  const date = article.publishedAt?.toDate?.()?.toLocaleDateString?.('te-IN') || '';

  if (variant === 'horizontal') {
    return (
      <Link href={`/article/${article.id}`} className="featured-h-card">
        <img src={article.imageUrl || '/placeholder.jpg'} alt="" />
        <div className="article-card-body">
          <span className="article-card-category telugu">{article.category}</span>
          <h3 className="article-card-title" style={{ fontSize: '15px', WebkitLineClamp: 2 }}>{article.title_te}</h3>
          <div className="article-card-meta">
            <span><Clock size={12} /> {date}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`} className="article-card">
      {article.imageUrl && <img src={article.imageUrl} alt="" className="article-card-img" />}
      <div className="article-card-body">
        <span className="article-card-category telugu">{article.category}</span>
        <h3 className="article-card-title">{article.title_te}</h3>
        <div className="article-card-meta">
          <span><Eye size={12} /> {article.views || 0}</span>
          <span>{article.authorName}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}

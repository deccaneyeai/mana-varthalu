import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../models/article.dart';
import '../../app/theme.dart';

class ArticleCard extends StatelessWidget {
  final Article article;
  final bool compact;

  const ArticleCard({super.key, required this.article, this.compact = false});

  @override
  Widget build(BuildContext context) {
    if (compact) {
      return GestureDetector(
        onTap: () => context.push('/article/${article.id}'),
        child: Card(
          child: ListTile(
            leading: article.imageUrl.isNotEmpty
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: CachedNetworkImage(imageUrl: article.imageUrl, width: 56, height: 56, fit: BoxFit.cover),
                  )
                : null,
            title: Text(article.titleTe, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            subtitle: Text(article.category, style: TextStyle(color: saffron, fontSize: 11)),
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: () => context.push('/article/${article.id}'),
      child: Card(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (article.imageUrl.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), topRight: Radius.circular(12)),
                child: CachedNetworkImage(imageUrl: article.imageUrl, width: double.infinity, height: 180, fit: BoxFit.cover),
              ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: saffron.withOpacity(0.1), borderRadius: BorderRadius.circular(4)),
                        child: Text(article.category, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: saffron)),
                      ),
                      if (article.isBreaking) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: breakingRed, borderRadius: BorderRadius.circular(4)),
                          child: const Text('LIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(article.titleTe, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, height: 1.5), maxLines: 3, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.person_outline, size: 14, color: textMuted),
                      const SizedBox(width: 4),
                      Text(article.authorName, style: const TextStyle(fontSize: 12, color: textMuted)),
                      const Spacer(),
                      Icon(Icons.visibility_outlined, size: 14, color: textMuted),
                      const SizedBox(width: 4),
                      Text('${article.views}', style: const TextStyle(fontSize: 12, color: textMuted)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

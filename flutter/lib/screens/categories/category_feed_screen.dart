import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../services/articles_service.dart';
import '../../models/article.dart';
import '../../app/theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class CategoryFeedScreen extends ConsumerWidget {
  final String slug;
  const CategoryFeedScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final service = ref.watch(articlesServiceProvider);
    return Scaffold(
      appBar: AppBar(title: Text(slug)),
      body: StreamBuilder<List<Article>>(
        stream: service.getArticlesByCategory(slug),
        builder: (context, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator(color: saffron));
          final articles = snap.data!;
          if (articles.isEmpty) return Center(child: Text('\u0C08 \u0C35\u0C30\u0C4D\u0C17\u0C02\u0C32\u0C4B \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41', style: Theme.of(context).textTheme.titleMedium));
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: articles.length,
            itemBuilder: (context, i) {
              final a = articles[i];
              return GestureDetector(
                onTap: () => context.push('/article/${a.id}'),
                child: Card(
                  child: Row(
                    children: [
                      if (a.imageUrl.isNotEmpty)
                        ClipRRect(
                          borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), bottomLeft: Radius.circular(12)),
                          child: CachedNetworkImage(imageUrl: a.imageUrl, width: 120, height: 90, fit: BoxFit.cover),
                        ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(a.titleTe, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15), maxLines: 2, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 6),
                              Text('${a.views} views \u2022 ${a.authorName}', style: const TextStyle(fontSize: 11, color: textMuted)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/auth_service.dart';
import '../../services/articles_service.dart';
import '../../models/article.dart';
import '../../app/theme.dart';

class SavedScreen extends ConsumerWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C35\u0C3F')),
      body: userAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: saffron)),
        error: (_, __) => const Center(child: Text('Error loading saved articles')),
        data: (user) {
          if (user == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.bookmark_border_rounded, size: 64, color: textMuted),
                  const SizedBox(height: 16),
                  Text('\u0C32\u0C3E\u0C17\u0C3F\u0C28\u0C4D \u0C05\u0C2F\u0C3F \u0C2E\u0C40 \u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C1A\u0C42\u0C21\u0C02\u0C21\u0C3F',
                      style: const TextStyle(fontSize: 15, color: textMuted)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.push('/login'),
                    child: const Text('\u0C32\u0C3E\u0C17\u0C3F\u0C28\u0C4D'),
                  ),
                ],
              ),
            );
          }
          if (user.bookmarkedArticles.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.bookmark_border_rounded, size: 64, color: textMuted),
                  const SizedBox(height: 16),
                  Text('\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41', style: const TextStyle(fontSize: 15, color: textMuted)),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: user.bookmarkedArticles.length,
            itemBuilder: (context, i) {
              final articleId = user.bookmarkedArticles[i];
              return FutureBuilder<Article?>(
                future: ref.read(articlesServiceProvider).getArticleById(articleId),
                builder: (context, snap) {
                  if (!snap.hasData) return const SizedBox.shrink();
                  final a = snap.data!;
                  return GestureDetector(
                    onTap: () => context.push('/article/${a.id}'),
                    child: Card(
                      child: ListTile(
                        leading: a.imageUrl.isNotEmpty ? ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: CachedNetworkImage(imageUrl: a.imageUrl, width: 60, height: 60, fit: BoxFit.cover),
                        ) : null,
                        title: Text(a.titleTe, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: Text(a.category, style: TextStyle(color: saffron, fontSize: 12)),
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

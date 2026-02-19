import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../services/articles_service.dart';
import '../../models/article.dart';
import '../../app/theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final articlesService = ref.watch(articlesServiceProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('\u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search_rounded),
            onPressed: () => context.push('/search'),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: StreamBuilder<List<Article>>(
        stream: articlesService.getPublishedArticles(),
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: saffron));
          }
          final articles = snap.data ?? [];
          if (articles.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.article_outlined, size: 64, color: textMuted),
                  const SizedBox(height: 16),
                  Text('\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C24\u0C4D\u0C35\u0C30\u0C32\u0C4B \u0C35\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F', style: Theme.of(context).textTheme.titleMedium),
                ],
              ),
            );
          }

          return RefreshIndicator(
            color: saffron,
            onRefresh: () async {},
            child: CustomScrollView(
              slivers: [
                // Breaking Ticker
                SliverToBoxAdapter(child: _BreakingTicker(articles: articles.where((a) => a.isBreaking).toList())),

                // Hero Card
                if (articles.isNotEmpty)
                  SliverToBoxAdapter(
                    child: GestureDetector(
                      onTap: () => context.push('/article/${articles[0].id}'),
                      child: _HeroCard(article: articles[0]),
                    ),
                  ),

                // Article Feed (vertical swipe)
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final article = articles[index + 1];
                      return GestureDetector(
                        onTap: () => context.push('/article/${article.id}'),
                        child: _ArticleFeedCard(article: article),
                      );
                    },
                    childCount: articles.length > 1 ? articles.length - 1 : 0,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _BreakingTicker extends StatelessWidget {
  final List<Article> articles;
  const _BreakingTicker({required this.articles});

  @override
  Widget build(BuildContext context) {
    if (articles.isEmpty) return const SizedBox.shrink();
    return Container(
      color: breakingRed,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(4)),
            child: const Text('BREAKING', style: TextStyle(color: breakingRed, fontSize: 10, fontWeight: FontWeight.w800)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(articles[0].titleTe, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
          ),
        ],
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  final Article article;
  const _HeroCard({required this.article});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 280,
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 20, offset: const Offset(0, 8))],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (article.imageUrl.isNotEmpty)
              CachedNetworkImage(imageUrl: article.imageUrl, fit: BoxFit.cover)
            else
              Container(color: saffron),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black.withOpacity(0.8)],
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              left: 16,
              right: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Chip(
                    label: Text(article.category),
                    backgroundColor: saffron.withOpacity(0.9),
                    labelStyle: const TextStyle(color: Colors.white, fontSize: 11),
                    padding: EdgeInsets.zero,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  const SizedBox(height: 8),
                  Text(article.titleTe, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800, height: 1.4), maxLines: 3),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ArticleFeedCard extends StatelessWidget {
  final Article article;
  const _ArticleFeedCard({required this.article});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Row(
        children: [
          if (article.imageUrl.isNotEmpty)
            ClipRRect(
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), bottomLeft: Radius.circular(12)),
              child: CachedNetworkImage(imageUrl: article.imageUrl, width: 120, height: 100, fit: BoxFit.cover),
            ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(article.category, style: TextStyle(color: saffron, fontSize: 11, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text(article.titleTe, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, height: 1.4), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.visibility_outlined, size: 14, color: textMuted),
                      const SizedBox(width: 4),
                      Text('${article.views}', style: const TextStyle(fontSize: 11, color: textMuted)),
                      const SizedBox(width: 12),
                      Text(article.authorName, style: const TextStyle(fontSize: 11, color: textMuted)),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

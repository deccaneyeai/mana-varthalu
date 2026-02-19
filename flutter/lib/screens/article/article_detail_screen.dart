import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:just_audio/just_audio.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/articles_service.dart';
import '../../models/article.dart';
import '../../app/theme.dart';

class ArticleDetailScreen extends ConsumerStatefulWidget {
  final String articleId;
  const ArticleDetailScreen({super.key, required this.articleId});

  @override
  ConsumerState<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends ConsumerState<ArticleDetailScreen> {
  Article? article;
  bool loading = true;
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool isPlaying = false;

  @override
  void initState() {
    super.initState();
    _loadArticle();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  Future<void> _loadArticle() async {
    final service = ref.read(articlesServiceProvider);
    final a = await service.getArticleById(widget.articleId);
    if (a != null) await service.incrementViews(widget.articleId);
    setState(() { article = a; loading = false; });
  }

  Future<void> _toggleAudio() async {
    if (article?.audioUrl == null || article!.audioUrl.isEmpty) return;
    if (isPlaying) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.setUrl(article!.audioUrl);
      await _audioPlayer.play();
    }
    setState(() => isPlaying = !isPlaying);
  }

  void _share() {
    Share.share('${article!.titleTe}\n\nhttps://manavarthalu.com/article/${article!.id}');
    ref.read(articlesServiceProvider).incrementShares(widget.articleId);
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Scaffold(appBar: AppBar(), body: const Center(child: CircularProgressIndicator(color: saffron)));
    if (article == null) {
      return Scaffold(
        appBar: AppBar(),
        body: Center(child: Text('\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C15\u0C28\u0C41\u0C17\u0C4A\u0C28\u0C32\u0C47\u0C26\u0C41', style: Theme.of(context).textTheme.titleMedium)),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(article!.category),
        actions: [
          if (article!.audioUrl.isNotEmpty)
            IconButton(
              icon: Icon(isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled, size: 28),
              onPressed: _toggleAudio,
            ),
          IconButton(icon: const Icon(Icons.share_rounded), onPressed: _share),
          IconButton(icon: const Icon(Icons.bookmark_border_rounded), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            if (article!.imageUrl.isNotEmpty)
              CachedNetworkImage(imageUrl: article!.imageUrl, width: double.infinity, height: 240, fit: BoxFit.cover),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category + Breaking badge
                  Row(
                    children: [
                      Chip(label: Text(article!.category)),
                      if (article!.isBreaking) ...[
                        const SizedBox(width: 8),
                        Chip(
                          label: const Text('BREAKING'),
                          backgroundColor: breakingRed,
                          labelStyle: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(article!.titleTe, style: Theme.of(context).textTheme.headlineLarge?.copyWith(height: 1.5)),
                  const SizedBox(height: 12),

                  // Meta
                  Row(
                    children: [
                      const Icon(Icons.person_outline, size: 16, color: textMuted),
                      const SizedBox(width: 4),
                      Text(article!.authorName, style: const TextStyle(fontSize: 13, color: textMuted)),
                      const SizedBox(width: 16),
                      const Icon(Icons.visibility_outlined, size: 16, color: textMuted),
                      const SizedBox(width: 4),
                      Text('${article!.views}', style: const TextStyle(fontSize: 13, color: textMuted)),
                    ],
                  ),

                  const Divider(height: 32),

                  // Bullet Summary
                  if (article!.summaryBulletsTe.isNotEmpty) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF8F2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border(left: BorderSide(color: saffron, width: 4)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('\u0C38\u0C3E\u0C30\u0C3E\u0C02\u0C36\u0C02', style: TextStyle(fontWeight: FontWeight.w700, color: saffron, fontSize: 16)),
                          const SizedBox(height: 8),
                          ...article!.summaryBulletsTe.map((b) => Padding(
                            padding: const EdgeInsets.symmetric(vertical: 3),
                            child: Text('\u2022 $b', style: const TextStyle(fontSize: 15, height: 1.8)),
                          )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Body
                  Text(article!.bodyTe, style: Theme.of(context).textTheme.bodyLarge),

                  // Tags
                  if (article!.tags.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: article!.tags.map((t) => Chip(
                        label: Text('#$t'),
                        backgroundColor: const Color(0xFFF3F4F6),
                        labelStyle: const TextStyle(fontSize: 12, color: textSecondary),
                      )).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/articles_service.dart';
import '../../models/article.dart';
import '../../app/theme.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _controller = TextEditingController();
  List<Article> results = [];
  bool loading = false;
  bool searched = false;

  Future<void> _search() async {
    if (_controller.text.trim().isEmpty) return;
    setState(() { loading = true; searched = true; });
    results = await ref.read(articlesServiceProvider).searchArticles(_controller.text);
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          autofocus: true,
          style: const TextStyle(color: Colors.white, fontSize: 16),
          decoration: const InputDecoration(
            hintText: '\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F...',
            hintStyle: TextStyle(color: Colors.white54),
            border: InputBorder.none,
          ),
          onSubmitted: (_) => _search(),
        ),
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: _search),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator(color: saffron))
          : !searched
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search_rounded, size: 64, color: textMuted),
                      const SizedBox(height: 16),
                      Text('\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: textMuted)),
                    ],
                  ),
                )
              : results.isEmpty
                  ? Center(child: Text('\u0C2B\u0C32\u0C3F\u0C24\u0C3E\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41', style: Theme.of(context).textTheme.titleMedium))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: results.length,
                      itemBuilder: (context, i) {
                        final a = results[i];
                        return GestureDetector(
                          onTap: () => context.push('/article/${a.id}'),
                          child: Card(
                            child: ListTile(
                              leading: a.imageUrl.isNotEmpty ? ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: CachedNetworkImage(imageUrl: a.imageUrl, width: 60, height: 60, fit: BoxFit.cover),
                              ) : null,
                              title: Text(a.titleTe, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                              subtitle: Text('${a.category} \u2022 ${a.views} views', style: TextStyle(fontSize: 12, color: textMuted)),
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}

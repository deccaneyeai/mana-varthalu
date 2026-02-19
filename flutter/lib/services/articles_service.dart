import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/article.dart';

final articlesServiceProvider = Provider((ref) => ArticlesService());

class ArticlesService {
  final _db = FirebaseFirestore.instance;

  Stream<List<Article>> getPublishedArticles({int limit = 30}) {
    return _db
        .collection('articles')
        .where('status', isEqualTo: 'published')
        .orderBy('publishedAt', descending: true)
        .limit(limit)
        .snapshots()
        .map((snap) => snap.docs.map((d) => Article.fromFirestore(d)).toList());
  }

  Stream<List<Article>> getBreakingNews() {
    return _db
        .collection('articles')
        .where('status', isEqualTo: 'published')
        .where('isBreaking', isEqualTo: true)
        .orderBy('publishedAt', descending: true)
        .limit(10)
        .snapshots()
        .map((snap) => snap.docs.map((d) => Article.fromFirestore(d)).toList());
  }

  Stream<List<Article>> getArticlesByCategory(String category) {
    return _db
        .collection('articles')
        .where('status', isEqualTo: 'published')
        .where('category', isEqualTo: category)
        .orderBy('publishedAt', descending: true)
        .limit(20)
        .snapshots()
        .map((snap) => snap.docs.map((d) => Article.fromFirestore(d)).toList());
  }

  Stream<List<Article>> getArticlesByDistrict(String district) {
    return _db
        .collection('articles')
        .where('status', isEqualTo: 'published')
        .where('district', isEqualTo: district)
        .orderBy('publishedAt', descending: true)
        .limit(20)
        .snapshots()
        .map((snap) => snap.docs.map((d) => Article.fromFirestore(d)).toList());
  }

  Future<Article?> getArticleById(String id) async {
    final doc = await _db.collection('articles').doc(id).get();
    if (!doc.exists) return null;
    return Article.fromFirestore(doc);
  }

  Future<void> incrementViews(String id) async {
    await _db.collection('articles').doc(id).update({'views': FieldValue.increment(1)});
  }

  Future<void> incrementShares(String id) async {
    await _db.collection('articles').doc(id).update({'shares': FieldValue.increment(1)});
  }

  Future<List<Article>> searchArticles(String query) async {
    // Client-side search (for production, use Algolia/Typesense)
    final snap = await _db
        .collection('articles')
        .where('status', isEqualTo: 'published')
        .orderBy('publishedAt', descending: true)
        .limit(100)
        .get();
    final q = query.toLowerCase();
    return snap.docs
        .map((d) => Article.fromFirestore(d))
        .where((a) =>
            a.titleTe.toLowerCase().contains(q) ||
            a.titleEn.toLowerCase().contains(q) ||
            a.tags.any((t) => t.toLowerCase().contains(q)))
        .toList();
  }
}

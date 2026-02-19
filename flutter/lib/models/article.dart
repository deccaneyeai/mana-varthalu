import 'package:cloud_firestore/cloud_firestore.dart';

class Article {
  final String id;
  final String titleTe;
  final String titleEn;
  final String bodyTe;
  final String bodyEn;
  final List<String> summaryBulletsTe;
  final String imageUrl;
  final String audioUrl;
  final String category;
  final List<String> tags;
  final String authorId;
  final String authorName;
  final String status;
  final bool isBreaking;
  final bool isFeatured;
  final bool isSponsored;
  final String district;
  final String state;
  final int views;
  final int shares;
  final int bookmarks;
  final DateTime? publishedAt;
  final DateTime? createdAt;

  Article({
    required this.id,
    required this.titleTe,
    this.titleEn = '',
    this.bodyTe = '',
    this.bodyEn = '',
    this.summaryBulletsTe = const [],
    this.imageUrl = '',
    this.audioUrl = '',
    this.category = '',
    this.tags = const [],
    this.authorId = '',
    this.authorName = '',
    this.status = 'draft',
    this.isBreaking = false,
    this.isFeatured = false,
    this.isSponsored = false,
    this.district = '',
    this.state = '',
    this.views = 0,
    this.shares = 0,
    this.bookmarks = 0,
    this.publishedAt,
    this.createdAt,
  });

  factory Article.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return Article(
      id: doc.id,
      titleTe: d['title_te'] ?? '',
      titleEn: d['title_en'] ?? '',
      bodyTe: d['body_te'] ?? '',
      bodyEn: d['body_en'] ?? '',
      summaryBulletsTe: List<String>.from(d['summary_bullets_te'] ?? []),
      imageUrl: d['imageUrl'] ?? '',
      audioUrl: d['audioUrl'] ?? '',
      category: d['category'] ?? '',
      tags: List<String>.from(d['tags'] ?? []),
      authorId: d['authorId'] ?? '',
      authorName: d['authorName'] ?? '',
      status: d['status'] ?? 'draft',
      isBreaking: d['isBreaking'] ?? false,
      isFeatured: d['isFeatured'] ?? false,
      isSponsored: d['isSponsored'] ?? false,
      district: d['district'] ?? '',
      state: d['state'] ?? '',
      views: d['views'] ?? 0,
      shares: d['shares'] ?? 0,
      bookmarks: d['bookmarks'] ?? 0,
      publishedAt: (d['publishedAt'] as Timestamp?)?.toDate(),
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }
}

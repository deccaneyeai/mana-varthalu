import 'package:cloud_firestore/cloud_firestore.dart';

class Category {
  final String id;
  final String slug;
  final String nameTe;
  final String nameEn;
  final String icon;
  final int order;
  final bool isActive;

  Category({
    required this.id,
    required this.slug,
    required this.nameTe,
    required this.nameEn,
    this.icon = '',
    this.order = 0,
    this.isActive = true,
  });

  factory Category.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return Category(
      id: doc.id,
      slug: d['slug'] ?? '',
      nameTe: d['name_te'] ?? '',
      nameEn: d['name_en'] ?? '',
      icon: d['icon'] ?? '',
      order: d['order'] ?? 0,
      isActive: d['isActive'] ?? true,
    );
  }
}

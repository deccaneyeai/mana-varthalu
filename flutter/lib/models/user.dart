import 'package:cloud_firestore/cloud_firestore.dart';

class AppUser {
  final String uid;
  final String name;
  final String email;
  final String phone;
  final String photoUrl;
  final String role;
  final String fcmToken;
  final String district;
  final String state;
  final List<String> bookmarkedArticles;
  final List<String> followedCategories;
  final DateTime? createdAt;

  AppUser({
    required this.uid,
    this.name = '',
    this.email = '',
    this.phone = '',
    this.photoUrl = '',
    this.role = 'user',
    this.fcmToken = '',
    this.district = '',
    this.state = '',
    this.bookmarkedArticles = const [],
    this.followedCategories = const [],
    this.createdAt,
  });

  factory AppUser.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return AppUser(
      uid: doc.id,
      name: d['name'] ?? '',
      email: d['email'] ?? '',
      phone: d['phone'] ?? '',
      photoUrl: d['photoUrl'] ?? '',
      role: d['role'] ?? 'user',
      fcmToken: d['fcmToken'] ?? '',
      district: (d['location'] as Map?)?['district'] ?? '',
      state: (d['location'] as Map?)?['state'] ?? '',
      bookmarkedArticles: List<String>.from(d['bookmarkedArticles'] ?? []),
      followedCategories: List<String>.from(d['followedCategories'] ?? []),
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }
}

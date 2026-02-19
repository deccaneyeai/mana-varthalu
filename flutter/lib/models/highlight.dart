import 'package:cloud_firestore/cloud_firestore.dart';

class Highlight {
  final String id;
  final String date;
  final String summaryTextTe;
  final List<String> bulletPointsTe;
  final String audioUrl;
  final bool isAIGenerated;
  final DateTime? createdAt;

  Highlight({
    required this.id,
    required this.date,
    this.summaryTextTe = '',
    this.bulletPointsTe = const [],
    this.audioUrl = '',
    this.isAIGenerated = false,
    this.createdAt,
  });

  factory Highlight.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return Highlight(
      id: doc.id,
      date: d['date'] ?? '',
      summaryTextTe: d['summaryText_te'] ?? '',
      bulletPointsTe: List<String>.from(d['bulletPoints_te'] ?? []),
      audioUrl: d['audioUrl'] ?? '',
      isAIGenerated: d['isAIGenerated'] ?? false,
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../models/highlight.dart';
import '../../app/theme.dart';

class HighlightsScreen extends StatelessWidget {
  const HighlightsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D\u0C38\u0C4D')),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('highlights').orderBy('createdAt', descending: true).snapshots(),
        builder: (context, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator(color: saffron));
          final highlights = snap.data!.docs.map((d) => Highlight.fromFirestore(d)).toList();
          if (highlights.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.auto_awesome, size: 64, color: textMuted),
                  const SizedBox(height: 16),
                  Text('\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D\u0C38\u0C4D \u0C24\u0C4D\u0C35\u0C30\u0C32\u0C4B \u0C35\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F', style: Theme.of(context).textTheme.titleMedium),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: highlights.length,
            itemBuilder: (context, i) {
              final h = highlights[i];
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [const Color(0xFFFFF7ED), Colors.white]),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFDBA74)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text('\uD83D\uDCC5 ${h.date}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: saffronDark)),
                        if (h.isAIGenerated) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(4)),
                            child: const Text('\uD83E\uDD16 AI', style: TextStyle(fontSize: 11, color: Color(0xFF7C3AED), fontWeight: FontWeight.w600)),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(h.summaryTextTe, style: const TextStyle(fontSize: 15, height: 1.8)),
                    const SizedBox(height: 12),
                    ...h.bulletPointsTe.map((b) => Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.only(left: 12),
                      decoration: const BoxDecoration(border: Border(left: BorderSide(color: saffron, width: 3))),
                      child: Text(b, style: const TextStyle(fontSize: 14, height: 1.7)),
                    )),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

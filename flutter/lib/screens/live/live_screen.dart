import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../app/theme.dart';

class LiveScreen extends StatelessWidget {
  const LiveScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0C32\u0C48\u0C35\u0C4D \u0C1F\u0C40\u0C35\u0C40')),
      body: FutureBuilder<DocumentSnapshot>(
        future: FirebaseFirestore.instance.doc('youtube/config').get(),
        builder: (context, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator(color: saffron));
          final config = snap.data!.data() as Map<String, dynamic>? ?? {};
          final isLive = config['isLive'] ?? false;
          final videos = List<Map<String, dynamic>>.from(config['latestVideos'] ?? []);

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Live Status
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: isLive ? [breakingRed, breakingRed.withOpacity(0.8)] : [Colors.grey.shade200, Colors.grey.shade100],
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Icon(isLive ? Icons.live_tv : Icons.tv_off, size: 48, color: isLive ? Colors.white : textMuted),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(isLive ? '\uD83D\uDD34 LIVE NOW' : 'Not Live', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: isLive ? Colors.white : textMuted)),
                            Text(config['channelName'] ?? '', style: TextStyle(fontSize: 13, color: isLive ? Colors.white70 : textMuted)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
                Text('\u0C24\u0C3E\u0C1C\u0C3E \u0C35\u0C40\u0C21\u0C3F\u0C2F\u0C4B\u0C32\u0C41', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 12),

                if (videos.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(40),
                      child: Text('\u0C35\u0C40\u0C21\u0C3F\u0C2F\u0C4B\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41', style: TextStyle(color: textMuted)),
                    ),
                  )
                else
                  ...videos.map((v) => Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), topRight: Radius.circular(12)),
                          child: Image.network(v['thumbnail'] ?? '', width: double.infinity, height: 180, fit: BoxFit.cover),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Text(v['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                        ),
                      ],
                    ),
                  )),
              ],
            ),
          );
        },
      ),
    );
  }
}

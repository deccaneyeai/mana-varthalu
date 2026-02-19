import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:go_router/go_router.dart';
import '../../models/category.dart' as cat;
import '../../app/theme.dart';

class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0C35\u0C30\u0C4D\u0C17\u0C3E\u0C32\u0C41')),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('categories').where('isActive', isEqualTo: true).orderBy('order').snapshots(),
        builder: (context, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator(color: saffron));
          final categories = snap.data!.docs.map((d) => cat.Category.fromFirestore(d)).toList();
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 1.6, crossAxisSpacing: 12, mainAxisSpacing: 12),
            itemCount: categories.length,
            itemBuilder: (context, i) {
              final c = categories[i];
              return GestureDetector(
                onTap: () => context.push('/category/${c.slug}'),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [saffron.withOpacity(0.1), saffron.withOpacity(0.05)]),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: saffron.withOpacity(0.2)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.category_rounded, color: saffron, size: 32),
                      const SizedBox(height: 8),
                      Text(c.nameTe, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                      Text(c.nameEn, style: const TextStyle(fontSize: 12, color: textMuted)),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

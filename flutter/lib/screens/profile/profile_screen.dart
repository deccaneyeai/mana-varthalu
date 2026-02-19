import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../services/auth_service.dart';
import '../../app/theme.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('\u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D')),
      body: userAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: saffron)),
        error: (_, __) => const Center(child: Text('Error')),
        data: (user) {
          if (user == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.person_outline_rounded, size: 80, color: textMuted),
                  const SizedBox(height: 16),
                  Text('\u0C32\u0C3E\u0C17\u0C3F\u0C28\u0C4D \u0C05\u0C35\u0C02\u0C21\u0C3F', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => context.push('/login'),
                    icon: const Icon(Icons.login_rounded),
                    label: const Text('\u0C32\u0C3E\u0C17\u0C3F\u0C28\u0C4D'),
                  ),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 48,
                  backgroundImage: user.photoUrl.isNotEmpty ? NetworkImage(user.photoUrl) : null,
                  child: user.photoUrl.isEmpty ? const Icon(Icons.person, size: 48) : null,
                ),
                const SizedBox(height: 16),
                Text(user.name, style: Theme.of(context).textTheme.headlineMedium),
                Text(user.email, style: const TextStyle(color: textMuted, fontSize: 14)),
                if (user.district.isNotEmpty)
                  Chip(label: Text('\uD83D\uDCCD ${user.district}')),
                const SizedBox(height: 24),

                _ProfileTile(icon: Icons.bookmark_rounded, label: '\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C35\u0C3F', count: '${user.bookmarkedArticles.length}', onTap: () => context.go('/saved')),
                _ProfileTile(icon: Icons.notifications_rounded, label: '\u0C28\u0C4B\u0C1F\u0C3F\u0C2B\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C38\u0C46\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u0C38\u0C4D', onTap: () {}),
                _ProfileTile(icon: Icons.location_on_rounded, label: '\u0C32\u0C4A\u0C15\u0C47\u0C37\u0C28\u0C4D', value: user.district.isNotEmpty ? user.district : 'Set location', onTap: () {}),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      await ref.read(authServiceProvider).signOut();
                    },
                    icon: const Icon(Icons.logout_rounded, color: Colors.red),
                    label: const Text('\u0C32\u0C3E\u0C17\u0C4D \u0C05\u0C35\u0C41\u0C1F\u0C4D', style: TextStyle(color: Colors.red)),
                    style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.red)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? count;
  final String? value;
  final VoidCallback onTap;

  const _ProfileTile({required this.icon, required this.label, this.count, this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: saffron),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (count != null) Text(count!, style: TextStyle(color: saffron, fontWeight: FontWeight.w700)),
            if (value != null) Text(value!, style: const TextStyle(color: textMuted, fontSize: 13)),
            const SizedBox(width: 4),
            const Icon(Icons.chevron_right, color: textMuted),
          ],
        ),
        onTap: onTap,
      ),
    );
  }
}

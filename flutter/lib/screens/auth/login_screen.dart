import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../services/auth_service.dart';
import '../../app/theme.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  bool loading = false;
  String? error;

  Future<void> _signInWithGoogle() async {
    setState(() { loading = true; error = null; });
    try {
      final result = await ref.read(authServiceProvider).signInWithGoogle();
      if (result != null && mounted) context.go('/');
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [saffron, Color(0xFFFF8C00)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.newspaper_rounded, size: 80, color: Colors.white),
                  const SizedBox(height: 16),
                  const Text('\u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 8),
                  Text('\u0C2E\u0C40 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41, \u0C2E\u0C40 \u0C2D\u0C3E\u0C37\u0C32\u0C4B', style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.8))),
                  const SizedBox(height: 48),

                  if (error != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(color: Colors.red.shade100, borderRadius: BorderRadius.circular(8)),
                      child: Text(error!, style: const TextStyle(color: Colors.red)),
                    ),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      onPressed: loading ? null : _signInWithGoogle,
                      icon: loading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.g_mobiledata, size: 28),
                      label: Text(loading ? '\u0C32\u0C4B\u0C21\u0C3F\u0C02\u0C17\u0C4D...' : 'Google \u0C24\u0C4B \u0C32\u0C3E\u0C17\u0C3F\u0C28\u0C4D'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: textPrimary),
                    ),
                  ),

                  const SizedBox(height: 32),
                  TextButton(
                    onPressed: () => context.go('/'),
                    child: Text('\u0C38\u0C4D\u0C15\u0C3F\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F', style: TextStyle(color: Colors.white.withOpacity(0.7))),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

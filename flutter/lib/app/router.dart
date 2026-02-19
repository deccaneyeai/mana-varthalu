import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../screens/home/home_screen.dart';
import '../screens/article/article_detail_screen.dart';
import '../screens/categories/categories_screen.dart';
import '../screens/categories/category_feed_screen.dart';
import '../screens/live/live_screen.dart';
import '../screens/saved/saved_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/search/search_screen.dart';
import '../screens/highlights/highlights_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/shell/app_shell.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      ShellRoute(
        builder: (_, state, child) => AppShell(child: child),
        routes: [
          GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
          GoRoute(path: '/categories', builder: (_, __) => const CategoriesScreen()),
          GoRoute(path: '/live', builder: (_, __) => const LiveScreen()),
          GoRoute(path: '/saved', builder: (_, __) => const SavedScreen()),
          GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
        ],
      ),
      GoRoute(path: '/article/:id', builder: (_, state) => ArticleDetailScreen(articleId: state.pathParameters['id']!)),
      GoRoute(path: '/category/:slug', builder: (_, state) => CategoryFeedScreen(slug: state.pathParameters['slug']!)),
      GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),
      GoRoute(path: '/highlights', builder: (_, __) => const HighlightsScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    ],
  );
});

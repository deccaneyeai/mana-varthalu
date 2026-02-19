import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme.dart';

class AppShell extends StatefulWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _currentIndex = 0;

  static const _routes = ['/', '/categories', '/live', '/saved', '/profile'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
          context.go(_routes[index]);
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: '\u0C39\u0C4B\u0C2E\u0C4D'),
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_rounded), label: '\u0C35\u0C30\u0C4D\u0C17\u0C3E\u0C32\u0C41'),
          BottomNavigationBarItem(icon: Icon(Icons.live_tv_rounded), label: '\u0C32\u0C48\u0C35\u0C4D'),
          BottomNavigationBarItem(icon: Icon(Icons.bookmark_rounded), label: '\u0C38\u0C47\u0C35\u0C4D\u0C21\u0C4D'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: '\u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D'),
        ],
      ),
    );
  }
}

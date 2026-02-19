import 'package:flutter/material.dart';

const Color saffron = Color(0xFFFF6B00);
const Color saffronLight = Color(0xFFFF8C00);
const Color saffronDark = Color(0xFFE55D00);
const Color bgColor = Color(0xFFF8F9FA);
const Color cardColor = Colors.white;
const Color textPrimary = Color(0xFF1A1A1A);
const Color textSecondary = Color(0xFF555555);
const Color textMuted = Color(0xFF999999);
const Color breakingRed = Color(0xFFB91C1C);
const Color successGreen = Color(0xFF10B981);

final ThemeData appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: saffron,
    primary: saffron,
    onPrimary: Colors.white,
    surface: bgColor,
    brightness: Brightness.light,
  ),
  scaffoldBackgroundColor: bgColor,
  appBarTheme: const AppBarTheme(
    backgroundColor: saffron,
    foregroundColor: Colors.white,
    elevation: 0,
    centerTitle: false,
    titleTextStyle: TextStyle(
      fontFamily: 'NotoSansTelugu',
      fontSize: 20,
      fontWeight: FontWeight.w800,
      color: Colors.white,
    ),
  ),
  fontFamily: 'NotoSansTelugu',
  textTheme: const TextTheme(
    headlineLarge: TextStyle(fontFamily: 'NotoSansTelugu', fontWeight: FontWeight.w800, fontSize: 24, color: textPrimary),
    headlineMedium: TextStyle(fontFamily: 'NotoSansTelugu', fontWeight: FontWeight.w700, fontSize: 20, color: textPrimary),
    titleLarge: TextStyle(fontFamily: 'NotoSansTelugu', fontWeight: FontWeight.w700, fontSize: 18, color: textPrimary),
    titleMedium: TextStyle(fontFamily: 'NotoSansTelugu', fontWeight: FontWeight.w600, fontSize: 16, color: textPrimary),
    bodyLarge: TextStyle(fontFamily: 'NotoSansTelugu', fontSize: 16, color: textPrimary, height: 1.8),
    bodyMedium: TextStyle(fontFamily: 'NotoSansTelugu', fontSize: 14, color: textSecondary),
    labelSmall: TextStyle(fontSize: 12, color: textMuted),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: saffron,
      foregroundColor: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      textStyle: const TextStyle(fontFamily: 'NotoSansTelugu', fontWeight: FontWeight.w600, fontSize: 16),
    ),
  ),
  cardTheme: CardTheme(
    color: cardColor,
    elevation: 1,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
  ),
  chipTheme: ChipThemeData(
    backgroundColor: const Color(0xFFFFF8F2),
    labelStyle: const TextStyle(fontFamily: 'NotoSansTelugu', color: saffron, fontSize: 12, fontWeight: FontWeight.w600),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: saffron,
    unselectedItemColor: textMuted,
    type: BottomNavigationBarType.fixed,
    selectedLabelStyle: TextStyle(fontFamily: 'NotoSansTelugu', fontSize: 11, fontWeight: FontWeight.w600),
    unselectedLabelStyle: TextStyle(fontFamily: 'NotoSansTelugu', fontSize: 11),
  ),
);

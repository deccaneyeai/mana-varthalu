import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final fcmServiceProvider = Provider((ref) => FcmService());

class FcmService {
  final _messaging = FirebaseMessaging.instance;

  Future<String?> getToken() async {
    return await _messaging.getToken();
  }

  Future<void> requestPermission() async {
    await _messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );
  }

  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
  }

  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
  }

  void onForegroundMessage(void Function(dynamic) handler) {
    FirebaseMessaging.onMessage.listen(handler);
  }

  void onMessageOpenedApp(void Function(dynamic) handler) {
    FirebaseMessaging.onMessageOpenedApp.listen(handler);
  }

  Future<void> subscribeAll() async {
    await subscribeToTopic('news_all');
  }

  Future<void> subscribeDistrict(String district) async {
    await subscribeToTopic('district_$district');
  }

  Future<void> subscribeCategory(String category) async {
    await subscribeToTopic('category_$category');
  }
}

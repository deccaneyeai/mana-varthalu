import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';

final authServiceProvider = Provider((ref) => AuthService());

final authStateProvider = StreamProvider<User?>((ref) {
  return FirebaseAuth.instance.authStateChanges();
});

final currentUserProvider = FutureProvider<AppUser?>((ref) async {
  final auth = ref.watch(authStateProvider);
  final user = auth.value;
  if (user == null) return null;
  final doc = await FirebaseFirestore.instance.collection('users').doc(user.uid).get();
  if (!doc.exists) return null;
  return AppUser.fromFirestore(doc);
});

class AuthService {
  final _auth = FirebaseAuth.instance;
  final _db = FirebaseFirestore.instance;
  final _google = GoogleSignIn();

  Future<UserCredential?> signInWithGoogle() async {
    final googleUser = await _google.signIn();
    if (googleUser == null) return null;
    final googleAuth = await googleUser.authentication;
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    final userCredential = await _auth.signInWithCredential(credential);

    // Create or update user doc
    final uid = userCredential.user!.uid;
    final userDoc = await _db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      await _db.collection('users').doc(uid).set({
        'name': userCredential.user!.displayName ?? '',
        'email': userCredential.user!.email ?? '',
        'phone': '',
        'photoUrl': userCredential.user!.photoURL ?? '',
        'role': 'user',
        'fcmToken': '',
        'location': {'district': '', 'state': '', 'coordinates': null},
        'bookmarkedArticles': [],
        'followedCategories': [],
        'notificationPreferences': {
          'breaking': true, 'daily': true, 'district': true, 'category': true
        },
        'createdAt': FieldValue.serverTimestamp(),
      });
    }
    return userCredential;
  }

  Future<void> signOut() async {
    await _google.signOut();
    await _auth.signOut();
  }

  Future<void> toggleBookmark(String uid, String articleId) async {
    final userRef = _db.collection('users').doc(uid);
    final userDoc = await userRef.get();
    final bookmarks = List<String>.from(userDoc.data()?['bookmarkedArticles'] ?? []);
    if (bookmarks.contains(articleId)) {
      bookmarks.remove(articleId);
    } else {
      bookmarks.add(articleId);
    }
    await userRef.update({'bookmarkedArticles': bookmarks});
  }

  Future<void> updateFcmToken(String uid, String token) async {
    await _db.collection('users').doc(uid).update({'fcmToken': token});
  }

  Future<void> updateLocation(String uid, String district, String state) async {
    await _db.collection('users').doc(uid).update({
      'location.district': district,
      'location.state': state,
    });
  }
}

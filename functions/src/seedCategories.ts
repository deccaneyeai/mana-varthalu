// Cloud Function: seedCategories
// HTTPS Callable — seeds the 11 default categories into Firestore
// Call once during initial setup

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const CATEGORIES = [
  { slug: 'politics', name_te: 'రాజకీయాలు', name_en: 'Politics', icon: 'account_balance', order: 1 },
  { slug: 'sports', name_te: 'క్రీడలు', name_en: 'Sports', icon: 'sports_cricket', order: 2 },
  { slug: 'entertainment', name_te: 'వినోదం', name_en: 'Entertainment', icon: 'movie', order: 3 },
  { slug: 'business', name_te: 'వ్యాపారం', name_en: 'Business', icon: 'trending_up', order: 4 },
  { slug: 'crime', name_te: 'నేరాలు', name_en: 'Crime', icon: 'gavel', order: 5 },
  { slug: 'international', name_te: 'అంతర్జాతీయం', name_en: 'International', icon: 'public', order: 6 },
  { slug: 'technology', name_te: 'సాంకేతికత', name_en: 'Technology', icon: 'computer', order: 7 },
  { slug: 'health', name_te: 'ఆరోగ్యం', name_en: 'Health', icon: 'health_and_safety', order: 8 },
  { slug: 'education', name_te: 'విద్య', name_en: 'Education', icon: 'school', order: 9 },
  { slug: 'local', name_te: 'స్థానికం', name_en: 'Local', icon: 'location_on', order: 10 },
  { slug: 'devotional', name_te: 'భక్తి', name_en: 'Devotional', icon: 'temple_hindu', order: 11 },
];

export const seedCategories = functions
  .region('asia-south1')
  .https.onCall(async (data, context) => {
    // Only allow super admins to seed
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Login required');
    }

    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const userData = userDoc.data();
    if (!userData || userData.role !== 'superadmin') {
      throw new functions.https.HttpsError('permission-denied', 'Super admin access required');
    }

    const batch = db.batch();
    let count = 0;

    for (const cat of CATEGORIES) {
      const docRef = db.collection('categories').doc(cat.slug);
      batch.set(docRef, {
        id: cat.slug,
        ...cat,
        isActive: true,
      });
      count++;
    }

    await batch.commit();

    functions.logger.info(`Seeded ${count} categories`);
    return { success: true, count };
  });

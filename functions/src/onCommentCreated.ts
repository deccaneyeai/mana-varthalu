// Cloud Function: onCommentCreated
// Trigger: Firestore onCreate /comments/{commentId}
// Notifies super admin of new pending comments

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

export const onCommentCreated = functions
  .region('asia-south1')
  .firestore.document('comments/{commentId}')
  .onCreate(async (snapshot, context) => {
    const comment = snapshot.data();
    const commentId = context.params.commentId;

    if (!comment) {
      functions.logger.warn(`No comment data for ${commentId}`);
      return null;
    }

    try {
      // Fetch the article to get its title
      const articleRef = db.collection('articles').doc(comment.articleId);
      const articleSnap = await articleRef.get();
      const articleTitle = articleSnap.exists
        ? articleSnap.data()?.title_te || 'Unknown Article'
        : 'Unknown Article';

      // Find all superadmin users
      const adminsSnap = await db.collection('users')
        .where('role', '==', 'superadmin')
        .get();

      if (adminsSnap.empty) {
        functions.logger.warn('No super admins found to notify');
        return null;
      }

      // Collect admin FCM tokens
      const adminTokens: string[] = [];
      adminsSnap.forEach((doc) => {
        const adminData = doc.data();
        if (adminData.fcmToken) {
          adminTokens.push(adminData.fcmToken);
        }
      });

      // Send notification to admin topic
      const notification: admin.messaging.NotificationMessagePayload = {
        title: `కొత్త కామెంట్: ${comment.userName}`,
        body: `"${articleTitle}" పై కామెంట్: "${comment.text.substring(0, 80)}..."`,
      };

      const data: Record<string, string> = {
        type: 'comment',
        commentId,
        articleId: comment.articleId,
      };

      // Send to admin_notifications topic (admins subscribe to this)
      await messaging.sendToTopic('admin_notifications', { notification, data });

      functions.logger.info(`Comment notification sent for comment ${commentId} on article ${comment.articleId}`);
    } catch (error) {
      functions.logger.error(`Error in onCommentCreated: ${error}`);
    }

    return null;
  });

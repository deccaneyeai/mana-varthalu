// Mana Varthalu — Cloud Functions Entry Point
import { onArticleApproved } from './onArticleApproved';
import { onCommentCreated } from './onCommentCreated';
import { scheduledHighlights } from './scheduledHighlights';
import { youtubePoller } from './youtubePoller';
import { seedCategories } from './seedCategories';

export {
  onArticleApproved,
  onCommentCreated,
  scheduledHighlights,
  youtubePoller,
  seedCategories,
};

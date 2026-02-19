// Mana Varthalu — Shared TypeScript Types
// Used by: admin panel, web, cloud functions

export type UserRole = 'superadmin' | 'editor' | 'reporter' | 'admanager' | 'user';
export type ArticleStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type CommentStatus = 'pending' | 'approved' | 'rejected';
export type AdType = 'banner' | 'native' | 'video' | 'interstitial' | 'sponsored';
export type AdPlacement = 'manual' | 'auto';
export type NotificationType = 'breaking' | 'local' | 'category' | 'scheduled';
export type NotificationTarget = 'all' | 'district' | 'category';
export type NotificationStatus = 'sent' | 'scheduled' | 'failed';

export interface UserLocation {
  lat: number;
  lng: number;
  district: string;
  state: string;
}

export interface NotificationPrefs {
  breaking: boolean;
  local: boolean;
  categories: Record<string, boolean>;
}

export interface User {
  uid: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  photoUrl: string;
  location: UserLocation;
  followedCategories: string[];
  readingHistory: string[];
  bookmarks: string[];
  notificationPrefs: NotificationPrefs;
  fcmTopics: string[];
  createdAt: Date;
  lastActiveAt: Date;
}

export interface Article {
  id: string;
  title_te: string;
  title_en: string;
  body_te: string;
  body_en: string;
  summary_bullets_te: string[];
  imageUrl: string;
  audioUrl: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  rejectionReason: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isSponsored: boolean;
  district: string;
  state: string;
  views: number;
  shares: number;
  bookmarks: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name_te: string;
  name_en: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface Ad {
  id: string;
  type: AdType;
  imageUrl: string;
  videoUrl: string;
  targetUrl: string;
  placementType: AdPlacement;
  autoEveryN: number;
  manualPosition: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  clicks: number;
  impressions: number;
  createdBy: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  status: CommentStatus;
  createdAt: Date;
}

export interface Highlight {
  id: string;
  date: string;
  summaryText_te: string;
  summaryText_en: string;
  bulletPoints_te: string[];
  articleIds: string[];
  isAIGenerated: boolean;
  audioUrl: string;
  publishedAt: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title_te: string;
  body_te: string;
  articleId: string;
  type: NotificationType;
  targetAudience: NotificationTarget;
  targetValue: string;
  sentAt: Date;
  scheduledAt: Date;
  status: NotificationStatus;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubeConfig {
  channelId: string;
  channelName: string;
  isLive: boolean;
  liveStreamId: string;
  latestVideos: YouTubeVideo[];
  updatedAt: Date;
}

export interface AppConfig {
  breakingNewsTicker: string;
  tickerActive: boolean;
  adFrequencyNative: number;
  adFrequencyInterstitial: number;
  liveEnabled: boolean;
  maintenanceMode: boolean;
  minAppVersion: string;
  geminiEnabled: boolean;
  ttsEnabled: boolean;
}

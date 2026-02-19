// Mana Varthalu — Shared Constants

export const APP_NAME = 'మన వార్తలు';
export const APP_NAME_EN = 'Mana Varthalu';
export const APP_TAGLINE = 'మీ వార్తలు, మీ భాషలో';
export const APP_TAGLINE_EN = 'Your news, in your language';

// Branding Colors
export const COLORS = {
  saffron: '#FF6B00',
  saffronLight: '#FF8C00',
  saffronDark: '#E55B00',
  white: '#FFFFFF',
  background: '#F8F8F8',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E5E5E5',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
} as const;

// Category Seed Data
export const CATEGORIES = [
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
] as const;

// User Roles
export const ROLES = ['superadmin', 'editor', 'reporter', 'admanager', 'user'] as const;

// Article Statuses
export const ARTICLE_STATUSES = ['draft', 'pending', 'published', 'rejected'] as const;

// FCM Topic Prefixes
export const FCM_TOPICS = {
  all: 'all',
  districtPrefix: 'district_',
  categoryPrefix: 'category_',
  breaking: 'breaking',
} as const;

// Andhra Pradesh Districts
export const AP_DISTRICTS = [
  'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna',
  'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam',
  'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Alluri Sitharama Raju',
  'Anakapalli', 'Annamayya', 'Bapatla', 'Eluru', 'Kakinada',
  'Konaseema', 'NTR', 'Nandyal', 'Palnadu', 'Parvathipuram Manyam',
  'Sri Sathya Sai', 'Tirupati',
] as const;

// Telangana Districts
export const TS_DISTRICTS = [
  'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
  'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
  'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar',
  'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
  'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
  'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
  'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri',
  'Hanumakonda',
] as const;

// Gemini Prompts
export const AI_PROMPTS = {
  generateImage: (title: string) =>
    `Create a realistic news photograph for a Telugu news article about: ${title}. Style: professional photojournalism, no text overlays, suitable for a newspaper front page.`,
  rewriteTelugu: (body: string) =>
    `You are a senior Telugu journalist. Rewrite the following article in beautiful, literary Telugu suitable for a newspaper. Maintain all facts. Use proper Telugu grammar and vocabulary. Article: ${body}`,
  bulletSummary: (body: string) =>
    `Summarize the following Telugu news article into exactly 5 concise bullet points in Telugu. Each bullet must be under 15 words. Start each with •. Article: ${body}`,
  translateToTelugu: (body: string) =>
    `Translate the following English news article to natural, fluent Telugu. Maintain journalistic tone. Do not transliterate — use pure Telugu script. Article: ${body}`,
  suggestTags: (body: string) =>
    `Analyze this Telugu news article and return a JSON object with:\n- tags: array of 5 relevant Telugu keyword tags\n- category: one of [politics, sports, entertainment, business, crime, international, technology, health, education, local, devotional]\nArticle: ${body}\nReturn only valid JSON, no explanation.`,
} as const;

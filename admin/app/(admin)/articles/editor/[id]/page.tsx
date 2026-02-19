'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@lib/firebase';
import { rewriteInTelugu, generateBulletSummary, translateToTelugu, suggestTags } from '@lib/gemini';
import { Sparkles, Languages, ListChecks, Tags, Volume2, Save, Send, Wand2 } from 'lucide-react';

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState({
    title_te: '', title_en: '', body_te: '', body_en: '',
    category: 'local', tags: [] as string[], district: '',
    isBreaking: false, isFeatured: false,
    imageUrl: '', summary_bullets_te: [] as string[],
  });
  const [tab, setTab] = useState<'te' | 'en'>('te');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<string>('');

  const categories = [
    { slug: 'politics', name: '\u0C30\u0C3E\u0C1C\u0C15\u0C40\u0C2F\u0C3E\u0C32\u0C41' },
    { slug: 'sports', name: '\u0C15\u0C4D\u0C30\u0C40\u0C21\u0C32\u0C41' },
    { slug: 'entertainment', name: '\u0C35\u0C3F\u0C28\u0C4B\u0C26\u0C02' },
    { slug: 'business', name: '\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C3E\u0C30\u0C02' },
    { slug: 'crime', name: '\u0C28\u0C47\u0C30\u0C3E\u0C32\u0C41' },
    { slug: 'international', name: '\u0C05\u0C02\u0C24\u0C30\u0C4D\u0C1C\u0C3E\u0C24\u0C40\u0C2F\u0C02' },
    { slug: 'technology', name: '\u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15\u0C24' },
    { slug: 'health', name: '\u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F\u0C02' },
    { slug: 'education', name: '\u0C35\u0C3F\u0C26\u0C4D\u0C2F' },
    { slug: 'local', name: '\u0C38\u0C4D\u0C25\u0C3E\u0C28\u0C3F\u0C15\u0C02' },
    { slug: 'devotional', name: '\u0C2D\u0C15\u0C4D\u0C24\u0C3F' },
  ];

  useEffect(() => {
    if (!isNew) {
      getDoc(doc(db, 'articles', params.id as string)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            title_te: data.title_te || '', title_en: data.title_en || '',
            body_te: data.body_te || '', body_en: data.body_en || '',
            category: data.category || 'local', tags: data.tags || [],
            district: data.district || '',
            isBreaking: data.isBreaking || false, isFeatured: data.isFeatured || false,
            imageUrl: data.imageUrl || '', summary_bullets_te: data.summary_bullets_te || [],
          });
        }
      });
    }
  }, [isNew, params.id]);

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `articles/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setForm(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSave = async (status: 'draft' | 'pending') => {
    setSaving(true);
    try {
      if (imageFile) await handleImageUpload(imageFile);
      const articleData = {
        ...form,
        status,
        authorId: auth.currentUser?.uid || '',
        authorName: auth.currentUser?.displayName || auth.currentUser?.email || '',
        isSponsored: false,
        state: '',
        views: 0, shares: 0, bookmarks: 0,
        audioUrl: '', rejectionReason: '',
        updatedAt: new Date(),
        ...(isNew ? { createdAt: new Date() } : {}),
      };

      if (isNew) {
        await addDoc(collection(db, 'articles'), articleData);
      } else {
        await updateDoc(doc(db, 'articles', params.id as string), articleData);
      }
      router.push('/articles/list');
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  // AI Tool handlers
  const handleAI = async (action: string) => {
    setAiLoading(action);
    setAiResult('');
    try {
      switch (action) {
        case 'rewrite': {
          const result = await rewriteInTelugu(form.body_te);
          setForm(prev => ({ ...prev, body_te: result }));
          setAiResult('\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C05\u0C02\u0C26\u0C02\u0C17\u0C3E \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F!');
          break;
        }
        case 'bullets': {
          const bullets = await generateBulletSummary(form.body_te);
          setForm(prev => ({ ...prev, summary_bullets_te: bullets }));
          setAiResult(bullets.join('\n'));
          break;
        }
        case 'translate': {
          const translated = await translateToTelugu(form.body_en);
          setForm(prev => ({ ...prev, body_te: translated }));
          setAiResult('\u0C05\u0C28\u0C41\u0C35\u0C3E\u0C26\u0C02 \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C2F\u0C3F\u0C02\u0C26\u0C3F!');
          break;
        }
        case 'tags': {
          const suggestions = await suggestTags(form.body_te || form.body_en);
          setForm(prev => ({ ...prev, tags: suggestions.tags, category: suggestions.category }));
          setAiResult(`Category: ${suggestions.category}\nTags: ${suggestions.tags.join(', ')}`);
          break;
        }
      }
    } catch (err) {
      console.error('AI error:', err);
      setAiResult('AI \u0C32\u0C4B\u0C2A\u0C02 \u0C1C\u0C30\u0C3F\u0C17\u0C3F\u0C02\u0C26\u0C3F. \u0C2E\u0C33\u0C4D\u0C33\u0C40 \u0C2A\u0C4D\u0C30\u0C2F\u0C24\u0C4D\u0C28\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.');
    }
    setAiLoading(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="telugu">
          {isNew ? '\u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C35\u0C3E\u0C30\u0C4D\u0C24' : '\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C0E\u0C21\u0C3F\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F'}
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>
            <Save size={16} /> <span className="telugu">\u0C21\u0C4D\u0C30\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D \u0C38\u0C47\u0C35\u0C4D</span>
          </button>
          <button className="btn btn-primary" onClick={() => handleSave('pending')} disabled={saving}>
            <Send size={16} /> <span className="telugu">\u0C06\u0C2E\u0C4B\u0C26\u0C02 \u0C15\u0C4B\u0C38\u0C02 \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F</span>
          </button>
        </div>
      </div>

      <div className="two-panel">
        {/* Editor Panel */}
        <div>
          {/* Language Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
            <button
              className={`btn ${tab === 'te' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('te')}
            >\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41</button>
            <button
              className={`btn ${tab === 'en' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('en')}
            >English</button>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label telugu">\u0C36\u0C40\u0C30\u0C4D\u0C37\u0C3F\u0C15</label>
            <input
              className={`form-input ${tab === 'te' ? 'telugu' : ''}`}
              value={tab === 'te' ? form.title_te : form.title_en}
              onChange={(e) => setForm(prev => ({
                ...prev,
                [tab === 'te' ? 'title_te' : 'title_en']: e.target.value
              }))}
              placeholder={tab === 'te' ? '\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C36\u0C40\u0C30\u0C4D\u0C37\u0C3F\u0C15 \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F...' : 'Enter article headline...'}
            />
          </div>

          {/* Body */}
          <div className="form-group">
            <label className="form-label telugu">\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41</label>
            <textarea
              className={`form-input ${tab === 'te' ? 'telugu' : ''}`}
              style={{ minHeight: '300px', lineHeight: 1.8 }}
              value={tab === 'te' ? form.body_te : form.body_en}
              onChange={(e) => setForm(prev => ({
                ...prev,
                [tab === 'te' ? 'body_te' : 'body_en']: e.target.value
              }))}
              placeholder={tab === 'te' ? '\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F...' : 'Write article body...'}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Image</label>
            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: '8px',
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                background: form.imageUrl ? `url(${form.imageUrl}) center/cover` : 'var(--bg)',
                minHeight: form.imageUrl ? '200px' : 'auto',
              }}
              onClick={() => document.getElementById('image-input')?.click()}
            >
              {!form.imageUrl && <p style={{ color: 'var(--text-muted)' }}>\u0C1A\u0C3F\u0C24\u0C4D\u0C30\u0C02 \u0C05\u0C2A\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F</p>}
            </div>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setForm(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                }
              }}
            />
          </div>

          {/* Category & Settings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label telugu">\u0C35\u0C30\u0C4D\u0C17\u0C02</label>
              <select
                className="form-input telugu"
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input
                className="form-input"
                value={form.district}
                onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
                placeholder="e.g., Hyderabad"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <label className="toggle">
              <div className={`toggle-switch ${form.isBreaking ? 'active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, isBreaking: !prev.isBreaking }))} />
              <span className="telugu">\u0C2C\u0C4D\u0C30\u0C47\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C28\u0C4D\u0C2F\u0C42\u0C38\u0C4D</span>
            </label>
            <label className="toggle">
              <div className={`toggle-switch ${form.isFeatured ? 'active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, isFeatured: !prev.isFeatured }))} />
              <span className="telugu">\u0C2B\u0C40\u0C1A\u0C30\u0C4D\u0C21\u0C4D</span>
            </label>
          </div>

          {/* Tags */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Tags</label>
            <input
              className="form-input telugu"
              value={form.tags.join(', ')}
              onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
              placeholder="\u0C1F\u0C4D\u0C2F\u0C3E\u0C17\u0C4D\u0C32\u0C41 \u0C15\u0C3E\u0C2E\u0C3E\u0C24\u0C4B \u0C35\u0C47\u0C30\u0C41 \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F"
            />
          </div>
        </div>

        {/* AI Tools Sidebar */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wand2 size={20} color="#FF6B00" />
              <span className="telugu">AI \u0C1F\u0C42\u0C32\u0C4D\u0C38\u0C4D</span>
            </h3>

            <div className="ai-sidebar">
              <button className="ai-button" onClick={() => handleAI('rewrite')} disabled={!!aiLoading}>
                <Sparkles size={20} />
                <div>
                  <div className="telugu" style={{ fontWeight: 600 }}>\u0C05\u0C02\u0C26\u0C2E\u0C48\u0C28 \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41\u0C32\u0C4B \u0C30\u0C3E\u0C2F\u0C3F</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rewrite in beautiful Telugu</div>
                </div>
              </button>

              <button className="ai-button" onClick={() => handleAI('bullets')} disabled={!!aiLoading}>
                <ListChecks size={20} />
                <div>
                  <div className="telugu" style={{ fontWeight: 600 }}>Bullet Points \u0C24\u0C2F\u0C3E\u0C30\u0C41\u0C1A\u0C47\u0C2F\u0C3F</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Generate 5-point summary</div>
                </div>
              </button>

              <button className="ai-button" onClick={() => handleAI('translate')} disabled={!!aiLoading}>
                <Languages size={20} />
                <div>
                  <div className="telugu" style={{ fontWeight: 600 }}>\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41\u0C32\u0C4B \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C41</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Translate English to Telugu</div>
                </div>
              </button>

              <button className="ai-button" onClick={() => handleAI('tags')} disabled={!!aiLoading}>
                <Tags size={20} />
                <div>
                  <div className="telugu" style={{ fontWeight: 600 }}>Tags \u0C38\u0C42\u0C1A\u0C3F\u0C02\u0C1A\u0C41</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-suggest tags & category</div>
                </div>
              </button>

              <button className="ai-button" onClick={() => handleAI('audio')} disabled={!!aiLoading}>
                <Volume2 size={20} />
                <div>
                  <div className="telugu" style={{ fontWeight: 600 }}>Audio \u0C24\u0C2F\u0C3E\u0C30\u0C41\u0C1A\u0C47\u0C2F\u0C3F</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Generate TTS audio</div>
                </div>
              </button>
            </div>

            {aiLoading && (
              <div className="ai-loading" style={{ marginTop: '16px' }}>
                <div className="spinner" />
                <span className="telugu">AI \u0C2A\u0C28\u0C3F \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C4B\u0C02\u0C26\u0C3F...</span>
              </div>
            )}

            {aiResult && !aiLoading && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'var(--saffron-bg)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--saffron)',
              }}>
                <p className="telugu" style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{aiResult}</p>
              </div>
            )}

            {/* Bullet Summary Preview */}
            {form.summary_bullets_te.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4 className="telugu" style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>\u0C38\u0C3E\u0C30\u0C3E\u0C02\u0C36\u0C02:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {form.summary_bullets_te.map((bullet, i) => (
                    <li key={i} className="telugu" style={{ padding: '4px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

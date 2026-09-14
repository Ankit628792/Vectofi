/**
 * Vectofi Synonym Mapping & Search Suggestion Engine
 * Provides bidirectional semantic mapping between everyday concepts and icon naming conventions,
 * e.g., mapping 'delete' -> 'trash', 'bin', 'remove', 'rubbish', 'clear', 'discard'.
 */

// Bidirectional synonym groups
const SYNONYM_GROUPS: string[][] = [
  // Actions & Operations
  ['delete', 'trash', 'bin', 'remove', 'rubbish', 'recycle-bin', 'dump', 'erase', 'discard', 'clear', 'destroy', 'cross', 'x'],
  ['edit', 'pencil', 'pen', 'write', 'modify', 'draft', 'compose', 'update', 'note', 'rename', 'draw'],
  ['search', 'find', 'lookup', 'magnifier', 'explore', 'query', 'seek', 'filter', 'inspect', 'glass', 'zoom', 'locate'],
  ['settings', 'gear', 'cog', 'config', 'options', 'preferences', 'wrench', 'tools', 'tune', 'sliders', 'customize', 'setup', 'adjust'],
  ['add', 'plus', 'create', 'new', 'insert', 'more', 'increase', 'append', 'positive', 'join'],
  ['remove', 'minus', 'delete', 'decrease', 'sub', 'negative', 'reduce', 'less', 'exclude'],
  ['close', 'cancel', 'cross', 'x', 'dismiss', 'exit', 'quit', 'reject', 'stop', 'abort', 'clear'],
  ['check', 'tick', 'confirm', 'ok', 'done', 'success', 'verified', 'accept', 'complete', 'approve', 'badge-check'],
  ['copy', 'duplicate', 'clone', 'clipboard', 'replicate', 'paste', 'copy-check'],
  ['paste', 'clipboard', 'insert', 'copy', 'assignment'],
  ['save', 'disk', 'floppy', 'download', 'bookmark', 'keep', 'store', 'archive'],
  ['download', 'save', 'import', 'get', 'receive', 'install', 'fetch', 'down', 'pull'],
  ['upload', 'publish', 'send', 'export', 'cloud', 'push', 'share', 'up'],
  ['share', 'send', 'export', 'forward', 'social', 'distribute', 'link', 'broadcast'],
  ['refresh', 'reload', 'sync', 'rotate', 'update', 'restart', 'cycle', 'renew', 'repeat', 'spin'],
  ['sync', 'refresh', 'cloud', 'synchronize', 'update', 'exchange', 'arrows', 'transfer'],
  ['lock', 'security', 'protect', 'secure', 'key', 'privacy', 'padlock', 'safe', 'encrypt', 'password', 'shield'],
  ['unlock', 'open', 'insecure', 'access', 'decrypt', 'free', 'key-round'],
  ['hide', 'hidden', 'invisible', 'blind', 'mask', 'private', 'conceal', 'secret', 'eye-off', 'eye-closed'],
  ['show', 'view', 'visible', 'preview', 'look', 'watch', 'see', 'inspect', 'observe', 'eye', 'eye-open'],
  ['login', 'signin', 'enter', 'access', 'account', 'door', 'log-in'],
  ['logout', 'exit', 'signout', 'leave', 'quit', 'door', 'log-out'],
  ['filter', 'funnel', 'refine', 'sort', 'isolate', 'screen', 'adjust'],
  ['sort', 'order', 'arrange', 'rank', 'filter', 'sequence', 'reorder', 'ascending', 'descending'],
  ['send', 'airplane', 'paper-plane', 'submit', 'mail', 'dispatch', 'deliver', 'forward'],

  // Identity & People
  ['user', 'person', 'account', 'profile', 'member', 'avatar', 'people', 'human', 'admin', 'contact', 'customer'],
  ['users', 'team', 'group', 'crowd', 'members', 'community', 'organization', 'people', 'family', 'audience'],
  ['bot', 'robot', 'ai', 'automation', 'agent', 'machine', 'algorithm', 'intellect', 'assistant'],

  // Navigation & Location
  ['home', 'house', 'main', 'dashboard', 'start', 'landing', 'root', 'homepage', 'building', 'residence'],
  ['map', 'location', 'navigation', 'place', 'directions', 'route', 'gps', 'destination', 'pin', 'compass'],
  ['pin', 'location', 'marker', 'map', 'place', 'point', 'spot', 'destination', 'drop-pin'],
  ['compass', 'direction', 'navigate', 'explore', 'safari', 'orientation', 'gps', 'needle'],
  ['globe', 'world', 'earth', 'international', 'web', 'internet', 'language', 'locale', 'translate', 'planet'],
  ['arrow', 'pointer', 'direction', 'chevron', 'navigation', 'move', 'indicator', 'way'],
  ['chevron', 'arrow', 'direction', 'pointer', 'angle', 'navigate', 'next', 'prev', 'back', 'forward'],

  // Communication & Social
  ['mail', 'email', 'envelope', 'message', 'inbox', 'letter', 'send', 'contact', 'post', 'newsletter'],
  ['chat', 'message', 'comment', 'discussion', 'conversation', 'talk', 'bubble', 'speech', 'forum', 'dialog'],
  ['phone', 'call', 'telephone', 'mobile', 'contact', 'dial', 'cellular', 'ring', 'handset'],
  ['bell', 'notification', 'alert', 'alarm', 'reminder', 'ring', 'notice', 'badge', 'chime'],
  ['heart', 'like', 'love', 'favorite', 'favourite', 'rating', 'bookmark', 'wishlist', 'health'],
  ['star', 'favorite', 'rating', 'bookmark', 'review', 'score', 'featured', 'save', 'sparkle'],
  ['thumb', 'thumbs-up', 'like', 'approve', 'agree', 'positive', 'upvote'],
  ['thumbs-down', 'dislike', 'reject', 'disapprove', 'negative', 'downvote'],
  ['flame', 'fire', 'hot', 'popular', 'trending', 'burn', 'streak', 'energy'],
  ['sparkles', 'ai', 'magic', 'clean', 'star', 'generate', 'smart', 'gemini', 'new', 'fresh', 'enhance'],

  // Media & Assets
  ['image', 'photo', 'picture', 'graphic', 'media', 'canvas', 'camera', 'gallery', 'wallpaper', 'art', 'frame'],
  ['camera', 'photo', 'picture', 'video', 'capture', 'lens', 'snapshot', 'shoot'],
  ['video', 'movie', 'film', 'play', 'record', 'clip', 'camera', 'stream', 'broadcast', 'tv', 'player'],
  ['music', 'audio', 'song', 'sound', 'track', 'tune', 'melody', 'note', 'listen', 'headphone', 'speaker'],
  ['audio', 'sound', 'speaker', 'volume', 'headset', 'mic', 'microphone'],
  ['volume', 'sound', 'audio', 'speaker', 'loudness', 'mute', 'quiet', 'audio-high', 'volume-2'],
  ['mute', 'silent', 'quiet', 'sound-off', 'volume-off', 'volume-x', 'silence', 'no-sound'],

  // Files & Data
  ['file', 'document', 'page', 'sheet', 'doc', 'paper', 'record', 'text', 'pdf', 'file-text'],
  ['folder', 'directory', 'archive', 'files', 'storage', 'collection', 'group', 'binder'],
  ['database', 'db', 'storage', 'server', 'data', 'sql', 'tables', 'records', 'repository'],
  ['code', 'programming', 'developer', 'script', 'source', 'syntax', 'coding', 'tag', 'html', 'brackets', 'braces', 'dev'],
  ['terminal', 'console', 'cli', 'command', 'prompt', 'shell', 'bash', 'code'],

  // Commerce & Finance
  ['cart', 'shopping', 'store', 'buy', 'ecommerce', 'basket', 'purchase', 'shop', 'checkout', 'retail'],
  ['money', 'cash', 'dollar', 'currency', 'coin', 'payment', 'finance', 'price', 'wealth', 'cost', 'banknote'],
  ['card', 'credit-card', 'payment', 'debit', 'visa', 'mastercard', 'bank', 'wallet', 'atm'],
  ['wallet', 'money', 'payment', 'crypto', 'finance', 'card', 'cash', 'purse'],
  ['tag', 'label', 'badge', 'category', 'price', 'ticket', 'metadata', 'discount', 'coupon'],
  ['gift', 'present', 'reward', 'bonus', 'box', 'package', 'surprise', 'birthday'],

  // Time & Scheduling
  ['calendar', 'date', 'schedule', 'event', 'time', 'month', 'year', 'agenda', 'planner', 'timetable'],
  ['clock', 'time', 'watch', 'hour', 'minute', 'schedule', 'timer', 'history', 'recent', 'stopwatch', 'period'],

  // Devices & Hardware
  ['laptop', 'computer', 'notebook', 'macbook', 'pc', 'device', 'screen'],
  ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'cell', 'handset'],
  ['tablet', 'ipad', 'screen', 'device', 'display'],
  ['monitor', 'display', 'screen', 'desktop', 'tv', 'lcd'],
  ['cpu', 'processor', 'chip', 'hardware', 'computer', 'microchip', 'core', 'tech'],
  ['battery', 'power', 'energy', 'charge', 'level', 'electricity', 'accumulator'],
  ['wifi', 'internet', 'network', 'connection', 'wireless', 'signal', 'online', 'broadband', 'rss'],
  ['server', 'hosting', 'cloud', 'rack', 'network', 'datacenter'],

  // Weather & Environment
  ['sun', 'light', 'brightness', 'day', 'weather', 'summer', 'warmth', 'solar', 'shine', 'bright'],
  ['moon', 'dark', 'night', 'nightmode', 'lunar', 'weather', 'sleep', 'crescent', 'dark-mode'],
  ['cloud', 'weather', 'storage', 'sync', 'server', 'network', 'rain', 'backup', 'sky'],
  ['zap', 'lightning', 'electric', 'energy', 'power', 'fast', 'flash', 'voltage', 'quick', 'speed', 'bolt'],
  ['leaf', 'eco', 'nature', 'plant', 'green', 'environment', 'organic', 'tree'],

  // Status & Feedback
  ['alert', 'warning', 'bell', 'notification', 'alarm', 'caution', 'danger', 'error', 'info', 'exclamation', 'hazard'],
  ['error', 'bug', 'fail', 'issue', 'danger', 'cross', 'warning', 'problem', 'broken', 'alert-circle'],
  ['info', 'information', 'help', 'about', 'question', 'faq', 'details', 'hint', 'guide', 'info-circle'],
  ['help', 'question', 'support', 'faq', 'info', 'assistant', 'guide', 'aid', 'sos', 'lifesaver'],
  ['shield', 'security', 'protect', 'defense', 'safe', 'guard', 'antivirus', 'badge', 'trust'],

  // Design & Art
  ['palette', 'color', 'theme', 'paint', 'art', 'design', 'drawing', 'swatch'],
  ['brush', 'paint', 'draw', 'art', 'color', 'stroke'],
  ['layers', 'stack', 'levels', 'design', 'overlay', 'cards', 'canvas', 'pile'],
  ['layout', 'grid', 'dashboard', 'template', 'wireframe', 'structure', 'view'],
  ['crop', 'resize', 'frame', 'scale', 'cut', 'image-crop', 'scissors', 'trim'],
  ['wand', 'magic', 'sparkle', 'effect', 'wizard', 'auto', 'enhance', 'filter'],

  // Travel & Transport
  ['car', 'auto', 'vehicle', 'drive', 'transport', 'automobile', 'road'],
  ['plane', 'airplane', 'flight', 'travel', 'airport', 'fly', 'vacation', 'trip'],
  ['truck', 'delivery', 'transport', 'shipping', 'vehicle', 'logistics', 'van'],
  ['package', 'box', 'delivery', 'shipping', 'parcel', 'archive', 'product', 'cargo'],
];

/**
 * Built lookup index: token -> set of synonyms
 */
const synonymLookup = new Map<string, Set<string>>();

// Build the index
SYNONYM_GROUPS.forEach(group => {
  group.forEach(word => {
    const key = word.toLowerCase().trim();
    let set = synonymLookup.get(key);
    if (!set) {
      set = new Set<string>();
      synonymLookup.set(key, set);
    }
    group.forEach(otherWord => {
      const otherKey = otherWord.toLowerCase().trim();
      if (otherKey !== key) {
        set!.add(otherKey);
      }
    });
  });
});

/**
 * Pre-curated high-engagement search suggestions for users
 */
export const POPULAR_SEARCH_SUGGESTIONS = [
  { term: 'delete', label: 'delete (trash, remove, bin)', category: 'Actions' },
  { term: 'settings', label: 'settings (gear, cog, options)', category: 'Controls' },
  { term: 'user', label: 'user (avatar, profile, team)', category: 'Identity' },
  { term: 'edit', label: 'edit (pencil, pen, modify)', category: 'Actions' },
  { term: 'search', label: 'search (find, magnifier, zoom)', category: 'Navigation' },
  { term: 'mail', label: 'mail (email, envelope, message)', category: 'Communication' },
  { term: 'chat', label: 'chat (message, comment, conversation)', category: 'Communication' },
  { term: 'cart', label: 'cart (shopping, bag, store)', category: 'Commerce' },
  { term: 'heart', label: 'heart (like, love, favorite)', category: 'Social' },
  { term: 'calendar', label: 'calendar (date, schedule, event)', category: 'Productivity' },
  { term: 'bell', label: 'bell (notification, alert, alarm)', category: 'Interface' },
  { term: 'lock', label: 'lock (security, password, key)', category: 'Security' },
  { term: 'download', label: 'download (save, import, fetch)', category: 'Actions' },
  { term: 'upload', label: 'upload (cloud, publish, export)', category: 'Actions' },
  { term: 'star', label: 'star (rating, bookmark, favorite)', category: 'Social' },
  { term: 'copy', label: 'copy (duplicate, clipboard)', category: 'Actions' },
  { term: 'check', label: 'check (tick, verified, success)', category: 'Status' },
  { term: 'sparkles', label: 'sparkles (AI, magic, generate)', category: 'Creative' },
];

/**
 * Retrieves all synonyms for a single word or phrase token.
 */
export function getSynonymsForToken(token: string): string[] {
  const clean = token.toLowerCase().trim();
  if (!clean) return [];

  const direct = synonymLookup.get(clean);
  if (direct && direct.size > 0) {
    return Array.from(direct);
  }

  // Check stem-based matching if no direct match (e.g. 'deleting' -> 'delete', 'searches' -> 'search')
  for (const [key, set] of synonymLookup.entries()) {
    if (clean.startsWith(key) || key.startsWith(clean)) {
      return Array.from(set);
    }
  }

  return [];
}

/**
 * Expands a full search query into an array of related search terms,
 * including individual token synonyms and stemmed variants.
 */
export function expandQueryWithSynonyms(query: string): string[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return [];

  const tokens = clean.split(/[\s\-_]+/).filter(Boolean);
  const expandedTerms = new Set<string>();

  // Add the raw query and normalized tokens
  expandedTerms.add(clean);
  tokens.forEach(t => expandedTerms.add(t));

  // Expand each token with its synonyms
  tokens.forEach(token => {
    const synonyms = getSynonymsForToken(token);
    synonyms.forEach(syn => {
      expandedTerms.add(syn);
      // Also combine multi-word queries with primary synonyms
      if (tokens.length > 1) {
        const substituted = tokens.map(t => (t === token ? syn : t)).join(' ');
        expandedTerms.add(substituted);
      }
    });
  });

  return Array.from(expandedTerms);
}

export interface SearchSuggestionItem {
  term: string;
  label: string;
  matchedSynonym?: string;
  category?: string;
}

/**
 * Computes fast dynamic search suggestions based on the user's current query.
 */
export function getSearchSuggestions(query: string, maxResults = 6): SearchSuggestionItem[] {
  const clean = query.toLowerCase().trim();
  if (!clean) {
    return POPULAR_SEARCH_SUGGESTIONS.slice(0, maxResults).map(p => ({
      term: p.term,
      label: p.label,
      category: p.category,
    }));
  }

  const results: SearchSuggestionItem[] = [];
  const seenTerms = new Set<string>();

  // 1. Direct matches in popular suggestions
  POPULAR_SEARCH_SUGGESTIONS.forEach(pop => {
    if (pop.term.startsWith(clean) || pop.label.toLowerCase().includes(clean)) {
      if (!seenTerms.has(pop.term)) {
        seenTerms.add(pop.term);
        results.push({
          term: pop.term,
          label: pop.label,
          category: pop.category,
        });
      }
    }
  });

  // 2. Exact or prefix matches from the dictionary
  for (const [key, synonyms] of synonymLookup.entries()) {
    if (results.length >= maxResults) break;

    if (key.startsWith(clean) && !seenTerms.has(key)) {
      seenTerms.add(key);
      const topSyns = Array.from(synonyms).slice(0, 3).join(', ');
      results.push({
        term: key,
        label: `${key}${topSyns ? ` (${topSyns})` : ''}`,
        matchedSynonym: key,
      });
    }
  }

  // 3. Synonym matches (e.g. user typed 'del', we can suggest 'trash (synonym of delete)')
  for (const [key, synonyms] of synonymLookup.entries()) {
    if (results.length >= maxResults) break;

    if (key.includes(clean)) {
      synonyms.forEach(syn => {
        if (results.length < maxResults && !seenTerms.has(syn)) {
          seenTerms.add(syn);
          results.push({
            term: syn,
            label: `${syn} (related to ${key})`,
            matchedSynonym: key,
          });
        }
      });
    }
  }

  return results.slice(0, maxResults);
}

/**
 * Calculates search relevance score incorporating synonym mapping weights.
 */
export function calculateRelevanceScoreWithSynonyms(
  slug: string,
  name: string,
  category: string,
  tags: string[],
  query: string
): { score: number; matchedSynonym?: string } {
  const q = query.toLowerCase().trim();
  if (!q) return { score: 0 };

  const slugLower = slug.toLowerCase();
  const nameLower = name.toLowerCase();
  const categoryLower = category.toLowerCase();
  const tagsLower = tags.map(t => t.toLowerCase());

  // 1. Direct exact matches
  if (slugLower === q) return { score: 100 };
  if (nameLower === q) return { score: 95 };

  // 2. Direct prefix / start matches
  if (slugLower.startsWith(q)) return { score: 85 };
  if (nameLower.startsWith(q)) return { score: 80 };

  // 3. Exact tag match
  if (tagsLower.includes(q)) return { score: 75 };

  // 4. Substring matches
  if (slugLower.includes(q)) return { score: 60 };
  if (nameLower.includes(q)) return { score: 55 };
  if (tagsLower.some(t => t.includes(q))) return { score: 50 };
  if (categoryLower.includes(q)) return { score: 40 };

  // 5. Synonym matches (e.g. searching 'delete' -> finding 'trash')
  const synonyms = getSynonymsForToken(q);
  for (let i = 0; i < synonyms.length; i++) {
    const syn = synonyms[i];
    if (slugLower === syn) return { score: 70, matchedSynonym: syn };
    if (nameLower === syn) return { score: 68, matchedSynonym: syn };
    if (slugLower.startsWith(syn)) return { score: 65, matchedSynonym: syn };
    if (nameLower.startsWith(syn)) return { score: 62, matchedSynonym: syn };
    if (tagsLower.includes(syn)) return { score: 60, matchedSynonym: syn };
    if (slugLower.includes(syn) || nameLower.includes(syn) || tagsLower.some(t => t.includes(syn))) {
      return { score: 45, matchedSynonym: syn };
    }
  }

  return { score: 0 };
}

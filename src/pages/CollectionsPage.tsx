import React, { useState } from 'react';
import { IconItem, CollectionItem } from '../types';
import { IconCard } from '../components/icons/IconCard';
import { EmptyState } from '../components/ui/EmptyState';
import { downloadSvgFile } from '../utils/svgExport';

interface CollectionsPageProps {
  icons: IconItem[];
  collections: CollectionItem[];
  onCreateCollection: (name: string, description: string) => void;
  onDeleteCollection: (id: string) => void;
  onRemoveFromCollection: (collectionId: string, iconSlug: string) => void;
  favorites: string[];
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  onShowToast: (title: string, message?: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  icons,
  collections,
  onCreateCollection,
  onDeleteCollection,
  onRemoveFromCollection,
  favorites,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  onShowToast,
}) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string>(
    collections[0]?.id || ''
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const activeCollection =
    collections.find(c => c.id === activeCollectionId) || collections[0];

  // Resolve icon items in active collection
  const collectionIcons = (activeCollection?.iconSlugs || [])
    .map(slug => icons.find(i => i.slug === slug))
    .filter((i): i is IconItem => Boolean(i));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onCreateCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setShowCreateModal(false);
    onShowToast('Collection created', 'Now add icons using the laboratory!');
  };

  const handleBatchDownload = () => {
    if (collectionIcons.length === 0) return;
    collectionIcons.forEach((icon, idx) => {
      setTimeout(() => {
        downloadSvgFile(icon, false);
      }, idx * 100);
    });
    onShowToast(
      'Batch download started',
      `Downloading ${collectionIcons.length} SVG files to your device.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#e5e5e5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-light text-3xl text-white tracking-tight">
            Icon <span className="font-bold">Collections</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Organize and package custom icon subsets for specific features, projects, or applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer whitespace-nowrap shrink-0"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Create New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Sidebar: Collection Tabs (4 cols) with mobile horizontal scroll strip */}
        <div className="lg:col-span-4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2.5 scrollbar-none touch-pan-x">
          {collections.map(col => {
            const isActive = col.id === activeCollection?.id;
            return (
              <div
                key={col.id}
                onClick={() => setActiveCollectionId(col.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between shrink-0 w-[240px] sm:w-[280px] lg:w-full min-h-[44px] ${
                  isActive
                    ? 'border-blue-500/50 bg-blue-600/10 text-white shadow-md'
                    : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <h3 className="font-display font-bold text-sm text-white truncate">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-xs text-white/50 mt-0.5 line-clamp-1">
                      {col.description}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/50 whitespace-nowrap">
                    {col.iconSlugs.length} icons
                  </span>
                </div>

                {!col.isCurated && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteCollection(col.id);
                    }}
                    className="text-white/40 hover:text-rose-400 p-1.5 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
                    title="Delete collection"
                    aria-label="Delete collection"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Main Content: Active Collection Icons (8 cols) */}
        <div className="lg:col-span-8">
          {activeCollection ? (
            <div className="space-y-6">
              {/* Collection header banner */}
              <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-xl text-white">
                      {activeCollection.name}
                    </h2>
                    {activeCollection.isCurated && (
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
                        Curated Set
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-white/50 mt-1">
                    {activeCollection.description || 'Custom user collection.'}
                  </p>
                </div>

                {collectionIcons.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBatchDownload}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-blue-600/20 cursor-pointer min-h-[40px] whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Batch Download All ({collectionIcons.length})</span>
                  </button>
                )}
              </div>

              {/* Icons list */}
              {collectionIcons.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {collectionIcons.map(icon => (
                    <div key={icon.slug} className="relative group">
                      <IconCard
                        icon={icon}
                        isFavorite={favorites.includes(icon.slug)}
                        onToggleFavorite={onToggleFavorite}
                        onSelectIcon={onSelectIcon}
                        onQuickCopy={onQuickCopy}
                        onQuickDownload={onQuickDownload}
                      />
                      {!activeCollection.isCurated && (
                        <button
                          type="button"
                          onClick={() => onRemoveFromCollection(activeCollection.id, icon.slug)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 cursor-pointer"
                          title="Remove from collection"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="This collection is empty"
                  description="Open any icon laboratory and click 'Collect' to add icons into this collection."
                  actionLabel="Browse icons"
                  onAction={() => {
                    window.location.hash = '/icons';
                  }}
                  iconType="collection"
                />
              )}
            </div>
          ) : (
            <EmptyState title="No collection selected" description="Select or create a collection." />
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl space-y-4 text-[#e5e5e5]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg text-white">
              Create Collection
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/50 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                  placeholder="e.g. Dashboard Navigation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/50 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newColDesc}
                  onChange={e => setNewColDesc(e.target.value)}
                  placeholder="e.g. Icons used across the admin sidebar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

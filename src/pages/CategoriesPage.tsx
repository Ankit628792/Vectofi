import React from 'react';
import { IconItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { AnimatedIconRenderer } from '../components/icons/AnimatedIconRenderer';

interface CategoriesPageProps {
  icons: IconItem[];
  onSelectCategory: (catId: string) => void;
  onSelectIcon: (icon: IconItem) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  icons,
  onSelectCategory,
  onSelectIcon,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#e5e5e5]">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
          Curated Taxonomies
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-white mt-1">
          Explore by <span className="font-bold">Category</span>
        </h1>
        <p className="text-sm sm:text-base text-white/50 mt-2">
          Discover icons organized into 14 distinct functional domains for modern web, application, and dashboard design.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
          const categoryIcons = icons.filter(i => i.category === cat.id);
          const previewIcons = categoryIcons.slice(0, 4);

          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] hover:border-blue-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-lg text-white">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                    {categoryIcons.length} icons
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/50 mb-6 leading-relaxed">
                  {cat.description}
                </p>

                {/* 4 Preview Icons in this category */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {previewIcons.map(icon => (
                    <button
                      key={icon.slug}
                      type="button"
                      onClick={() => onSelectIcon(icon)}
                      className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600/10 hover:border-blue-500/30 text-white/70 hover:text-blue-400 transition-colors flex items-center justify-center cursor-pointer"
                      title={`Preview ${icon.name}`}
                    >
                      <AnimatedIconRenderer icon={icon} size={22} strokeWidth={1.8} animated={false} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-mono font-medium text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View {cat.name} Collection</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

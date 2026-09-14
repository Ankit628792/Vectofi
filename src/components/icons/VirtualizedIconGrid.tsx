import React, { useState, useEffect, useRef, useMemo, useCallback, CSSProperties, ReactElement } from 'react';
import { List, ListImperativeAPI } from 'react-window';
import { IconItem } from '../../types';
import { IconCard } from './IconCard';
import { IconCardSkeleton } from './IconCardSkeleton';
import { CatalogLoadingProgress, iconRegistry } from '../../data/icons';

interface VirtualizedIconGridProps {
  icons: IconItem[];
  favorites: string[];
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  globalAnimated?: boolean;
  reducedMotion?: boolean;
  isLoading?: boolean;
  isHydrating?: boolean;
  catalogProgress?: CatalogLoadingProgress;
}


interface CustomRowProps {
  rows: IconItem[][];
  columns: number;
  favorites: string[];
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  globalAnimated: boolean;
  reducedMotion: boolean;
}

interface RowRendererProps extends CustomRowProps {
  index: number;
  style: CSSProperties;
  ariaAttributes?: {
    'aria-posinset': number;
    'aria-setsize': number;
    role: 'listitem';
  };
}

const RowRenderer = ({
  index,
  style,
  rows,
  columns,
  favorites,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  globalAnimated,
  reducedMotion,
}: RowRendererProps): ReactElement | null => {
  const rowIcons = rows[index] || [];

  return (
    <div style={style} className="px-1 pb-3 sm:pb-4 box-border">
      <div
        className="grid gap-3 sm:gap-4 h-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {rowIcons.map(icon => (
          <IconCard
            key={icon.slug}
            icon={icon}
            isFavorite={favorites.includes(icon.slug)}
            onToggleFavorite={onToggleFavorite}
            onSelectIcon={onSelectIcon}
            onQuickCopy={onQuickCopy}
            onQuickDownload={onQuickDownload}
            globalAnimated={globalAnimated && !reducedMotion}
          />
        ))}
      </div>
    </div>
  );
};

export const VirtualizedIconGrid: React.FC<VirtualizedIconGridProps> = ({
  icons,
  favorites,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  globalAnimated = false,
  reducedMotion = false,
  isLoading = false,
  isHydrating = false,
  catalogProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ListImperativeAPI>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [containerHeight, setContainerHeight] = useState<number>(680);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);


  // Measure container dimensions responsively
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(rect.width);
        }
      }
      // Calculate responsive viewport height: viewport minus header/filter bar, min 540px
      const calculatedHeight = Math.max(540, Math.min(850, window.innerHeight - 280));
      setContainerHeight(calculatedHeight);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Determine column count and row height based on width
  const { columns, rowHeight } = useMemo(() => {
    if (containerWidth < 540) {
      return { columns: 2, rowHeight: 185 };
    } else if (containerWidth < 768) {
      return { columns: 3, rowHeight: 195 };
    } else if (containerWidth < 1024) {
      return { columns: 4, rowHeight: 205 };
    } else {
      return { columns: 6, rowHeight: 210 };
    }
  }, [containerWidth]);

  // Group icons into rows
  const rows = useMemo(() => {
    const result: IconItem[][] = [];
    for (let i = 0; i < icons.length; i += columns) {
      result.push(icons.slice(i, i + columns));
    }
    return result;
  }, [icons, columns]);

  const rowProps: CustomRowProps = useMemo(
    () => ({
      rows,
      columns,
      favorites,
      onToggleFavorite,
      onSelectIcon,
      onQuickCopy,
      onQuickDownload,
      globalAnimated,
      reducedMotion,
    }),
    [
      rows,
      columns,
      favorites,
      onToggleFavorite,
      onSelectIcon,
      onQuickCopy,
      onQuickDownload,
      globalAnimated,
      reducedMotion,
    ]
  );

  const handleScrollToTop = useCallback(() => {
    listRef.current?.scrollToRow({ index: 0, behavior: 'smooth' });
  }, []);

  const handleRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      setHasScrolled(visibleRows.startIndex > 0);

      // Pre-warm SVG geometries for visible rows + 2 overscan rows ahead
      const startIdx = Math.max(0, visibleRows.startIndex - 1);
      const endIdx = Math.min(rows.length - 1, visibleRows.stopIndex + 2);
      const visibleSlugs: string[] = [];
      for (let r = startIdx; r <= endIdx; r++) {
        const row = rows[r];
        if (row) {
          row.forEach(icon => visibleSlugs.push(icon.slug));
        }
      }
      if (visibleSlugs.length > 0) {
        iconRegistry.resolveBodies(visibleSlugs);
      }
    },
    [rows]
  );

  const isShowingSkeleton = isLoading || (isHydrating && icons.length === 0);

  return (
    <div id="virtualized-icon-grid-container" className="relative w-full" ref={containerRef}>
      {/* Virtualization & Hydration Status Bar */}
      <div
        id="virtualized-icon-grid-statusbar"
        className="mb-3 flex flex-col gap-1.5 text-xs font-mono text-white/50 px-1"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isShowingSkeleton ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="text-white/70">
                  Hydrating vector assets...{' '}
                  <span className="text-white/40 hidden sm:inline">
                    ({catalogProgress?.currentPack || 'Loading library'})
                  </span>
                </span>
              </>
            ) : isHydrating ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span>
                  Hydrating catalog:{' '}
                  <strong className="text-white/90">{icons.length.toLocaleString()}</strong> ready
                  {catalogProgress ? (
                    <span className="text-white/40 ml-1">
                      / ~{catalogProgress.totalEstimated.toLocaleString()} ({catalogProgress.currentPack})
                    </span>
                  ) : null}
                </span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>
                  Virtualized: <strong className="text-white/80">{icons.length.toLocaleString()}</strong> icons in{' '}
                  <strong className="text-white/80">{rows.length.toLocaleString()}</strong> rows ({columns} cols)
                </span>
              </>
            )}
          </div>

          {hasScrolled && !isShowingSkeleton && (
            <button
              id="btn-grid-back-to-top"
              type="button"
              onClick={handleScrollToTop}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              <span>Back to top</span>
            </button>
          )}
        </div>

        {/* Lightweight hydration progress bar */}
        {isHydrating && catalogProgress && (
          <div
            id="catalog-hydration-progress-track"
            className="w-full h-1 bg-white/5 rounded-full overflow-hidden"
          >
            <div
              id="catalog-hydration-progress-bar"
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300 ease-out rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(6, (catalogProgress.loadedCount / catalogProgress.totalEstimated) * 100)
                )}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Grid Container (Skeleton or Virtualized List) */}
      <div
        id="virtualized-icon-grid-viewport"
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 overflow-hidden backdrop-blur-xs"
      >
        {isShowingSkeleton ? (
          <div
            id="icon-grid-skeleton-container"
            className="grid gap-3 sm:gap-4 p-1 overflow-hidden"
            style={{
              height: containerHeight,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              alignContent: 'start',
            }}
          >
            {Array.from({ length: columns * 4 }).map((_, idx) => (
              <div
                key={`skel-${idx}`}
                id={`skel-wrapper-${idx}`}
                style={{ height: rowHeight - 16 }}
                className="w-full"
              >
                <IconCardSkeleton id={`icon-skeleton-item-${idx}`} />
              </div>
            ))}
          </div>
        ) : (
          <List<CustomRowProps>
            listRef={listRef}
            rowCount={rows.length}
            rowHeight={rowHeight}
            rowComponent={RowRenderer}
            rowProps={rowProps}
            overscanCount={3}
            onRowsRendered={handleRowsRendered}
            style={{ height: containerHeight, width: '100%' }}
          />
        )}
      </div>
    </div>
  );
};

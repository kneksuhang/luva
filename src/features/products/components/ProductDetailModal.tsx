import React from 'react';
import { 
  Package, 
  Tag as TagIcon, 
  FolderTree, 
  ExternalLink, 
  Calendar, 
  Edit3, 
  Trash2, 
  Archive, 
  ArchiveRestore,
  Globe
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Product } from '../../../types';
import { formatRupiah, formatDate, getFaviconFromUrl } from '../../../lib/utils';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleArchive: (product: Product) => void;
  onNavigateToCategory?: (categoryId: string) => void;
  onNavigateToTag?: (tagName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleArchive,
  onNavigateToCategory,
  onNavigateToTag,
}) => {
  if (!product) return null;

  const priorityLabels = {
    high: { label: 'Prioritas Tinggi', bg: 'bg-[#FCF2F4] text-[#C8556D] border-[#F2D7DC]' },
    medium: { label: 'Prioritas Sedang', bg: 'bg-[#FAF6F7] text-[#75686C] border-[#EFE3E6]' },
    low: { label: 'Prioritas Rendah', bg: 'bg-[#FAF6F7] text-[#75686C] border-[#EFE3E6]' },
  };

  const priorityMeta = product.priority ? priorityLabels[product.priority] : priorityLabels.medium;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--theme-accent)] font-medium tracking-wide">
            DETAIL PRODUK
          </span>
          {product.is_archived && (
            <span className="text-[10px] px-2 py-0.5 bg-[#FAF6F7] text-[#75686C] border border-[#EFE3E6] rounded-[3px]">
              Diarsipkan
            </span>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Top Section: Non-cropped Image + Primary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
          
          {/* Photo Slot - STRICT ZERO-CROP (object-contain with calm neutral background) */}
          <div className="sm:col-span-5 bg-[#FAF6F7] border border-[#EFE3E6] rounded-[4px] p-2 flex items-center justify-center min-h-[220px] max-h-[280px] overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[260px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#75686C]/60 py-10">
                <Package className="w-12 h-12 stroke-1 mb-1" />
                <span className="text-[11px]">Tanpa Foto Produk</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="sm:col-span-7 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 border rounded-[3px] font-medium ${priorityMeta.bg}`}>
                  {priorityMeta.label}
                </span>
                {product.category_name && (
                  <button
                    type="button"
                    onClick={() => {
                      if (product.category_id && onNavigateToCategory) {
                        onClose();
                        onNavigateToCategory(product.category_id);
                      }
                    }}
                    className="text-[11px] text-[var(--theme-primary)] hover:underline flex items-center gap-1"
                  >
                    <FolderTree className="w-3 h-3" />
                    <span>{product.category_name}</span>
                  </button>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-[#2C2528] leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price display with strict Intl.NumberFormat Rp format & Sora font */}
            <div className="p-3 bg-[#FAF6F7] border border-[#EFE3E6] rounded-[4px]">
              <span className="text-[11px] text-[#75686C] block">Estimasi Harga</span>
              <span className="font-sora text-xl sm:text-2xl font-bold text-[#2C2528] tracking-tight">
                {formatRupiah(product.price)}
              </span>
            </div>

            {/* Tags (Clickable to jump to tag page) */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] text-[#75686C] block">Label Penanda:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        if (onNavigateToTag) {
                          onClose();
                          onNavigateToTag(t);
                        }
                      }}
                      className="px-2 py-0.5 text-xs bg-white text-[#75686C] border border-[#EFE3E6] rounded-[4px] hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)] transition-colors flex items-center gap-1"
                    >
                      <TagIcon className="w-2.5 h-2.5" />
                      <span>#{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="flex items-center gap-4 text-[11px] text-[#75686C] pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Dicatat: {formatDate(product.created_at)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="border-t border-[#EFE3E6] pt-3">
            <h4 className="text-xs font-semibold text-[#2C2528] mb-1">
              Deskripsi & Catatan
            </h4>
            <p className="text-xs text-[#75686C] leading-relaxed whitespace-pre-line bg-[#FAF6F7]/50 p-3 rounded-[4px] border border-[#EFE3E6]">
              {product.description}
            </p>
          </div>
        )}

        {/* Multi-links Section with domain favicons */}
        {product.links && product.links.length > 0 && (
          <div className="border-t border-[#EFE3E6] pt-3">
            <h4 className="text-xs font-semibold text-[#2C2528] mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#75686C]" />
              <span>Tautan Pembelian ({product.links.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-white border border-[#EFE3E6] hover:border-[var(--theme-primary)] hover:bg-[#FAF6F7] rounded-[4px] transition-colors group text-xs text-[#2C2528]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={link.favicon || getFaviconFromUrl(link.url)}
                      alt="Favicon"
                      className="w-4 h-4 object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-medium truncate group-hover:text-[var(--theme-accent)]">
                      {link.title || 'Kunjungi Toko'}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#75686C] group-hover:text-[var(--theme-accent)] shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons: Edit, Hapus, Archive */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[#EFE3E6]">
          <button
            type="button"
            onClick={() => {
              onToggleArchive(product);
              onClose();
            }}
            className="px-3 py-1.5 text-xs text-[#75686C] hover:text-[#2C2528] border border-[#EFE3E6] rounded-[4px] transition-colors flex items-center gap-1.5"
          >
            {product.is_archived ? (
              <>
                <ArchiveRestore className="w-3.5 h-3.5" />
                <span>Pulihkan dari Arsip</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>Arsipkan Produk</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(product);
              }}
              className="px-3 py-1.5 text-xs text-[#C8556D] hover:bg-[#FCF2F4] border border-[#F2D7DC] rounded-[4px] transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="px-4 py-1.5 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-[4px] transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Produk</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

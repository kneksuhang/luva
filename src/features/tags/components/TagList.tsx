import React from 'react';
import { Tag as TagIcon, Plus, Edit2, ChevronRight } from 'lucide-react';
import { Tag, Product } from '../../../types';
import { formatRupiah } from '../../../lib/utils';

interface TagListProps {
  tags: Tag[];
  products: Product[];
  onSelectTag: (tagName: string) => void;
  onOpenAddModal: () => void;
  onEditTag: (tag: Tag) => void;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  products,
  onSelectTag,
  onOpenAddModal,
  onEditTag,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EFE3E6]">
        <div>
          <h2 className="text-base font-bold text-[#2C2528] tracking-tight">
            Daftar Label Tag
          </h2>
          <p className="text-xs text-[#75686C]">
            Kelompokkan barang wishlist dengan label tematik. Klik tag untuk melihat daftar produk terkait.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="h-8 px-3 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-[4px] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tag Baru</span>
        </button>
      </div>

      {tags.length === 0 ? (
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-8 text-center max-w-sm mx-auto my-6 space-y-2">
          <TagIcon className="w-8 h-8 text-[#75686C]/50 mx-auto stroke-1" />
          <p className="text-xs text-[#2C2528] font-semibold">Belum Ada Tag</p>
          <p className="text-[11px] text-[#75686C]">Buat label tag pertama Anda untuk menandai prioritas atau tujuan.</p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-2 text-xs text-[var(--theme-primary)] font-medium hover:underline"
          >
            + Tambah Tag
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-4 max-[480px]:gap-2.5">
          {tags.map((tag) => {
            const tagProducts = products.filter(
              (p) => !p.is_archived && p.tags.includes(tag.name)
            );
            const totalPrice = tagProducts.reduce((sum, p) => sum + p.price, 0);

            return (
              <div
                key={tag.id}
                onClick={() => onSelectTag(tag.name)}
                className="bg-white border border-[#EFE3E6] hover:border-[var(--theme-primary)] rounded-[4px] p-4 cursor-pointer group wabi-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-[2px]"
                        style={{ backgroundColor: tag.color || '#E87A90' }}
                      />
                      <h3 className="text-sm font-semibold text-[#2C2528] group-hover:text-[var(--theme-accent)] transition-colors">
                        #{tag.name}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTag(tag);
                      }}
                      className="p-1 text-[#75686C] hover:text-[#2C2528] rounded-[3px] hover:bg-[#FAF6F7] transition-colors"
                      title="Ubah Tag"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F6ECEE] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[#75686C]">
                      <strong className="font-sora text-[#2C2528]">{tagProducts.length}</strong> produk
                    </span>
                    <span className="font-sora text-xs font-semibold text-[#2C2528] block">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[var(--theme-accent)] font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

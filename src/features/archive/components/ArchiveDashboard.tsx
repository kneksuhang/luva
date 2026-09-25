import React from 'react';
import { Archive, ArchiveRestore, Trash2, Package } from 'lucide-react';
import { Product } from '../../../types';
import { formatRupiah } from '../../../lib/utils';

interface ArchiveDashboardProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onRestoreProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ArchiveDashboard: React.FC<ArchiveDashboardProps> = ({
  products,
  onSelectProduct,
  onRestoreProduct,
  onDeleteProduct,
}) => {
  const archivedProducts = products.filter((p) => p.is_archived);
  const totalArchivedValue = archivedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EFE3E6]">
        <div>
          <h2 className="text-base font-bold text-[#2C2528] tracking-tight flex items-center gap-2">
            <Archive className="w-4 h-4 text-[var(--theme-primary)]" />
            <span>Arsip Wishlist</span>
          </h2>
          <p className="text-xs text-[#75686C]">
            Koleksi barang impian yang telah terbeli atau disimpan sementara agar tidak memenuhi dasbor utama.
          </p>
        </div>

        <div className="text-xs text-[#75686C] bg-white px-3 py-1.5 border border-[#EFE3E6] rounded-[4px] self-start sm:self-auto">
          <span>
            Total: <strong className="font-sora text-[#2C2528]">{archivedProducts.length}</strong> item (
            <span className="font-sora font-semibold">{formatRupiah(totalArchivedValue)}</span>)
          </span>
        </div>
      </div>

      {/* Content */}
      {archivedProducts.length === 0 ? (
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-8 sm:p-12 text-center max-w-sm mx-auto my-6 space-y-2">
          <Archive className="w-8 h-8 text-[#75686C]/40 mx-auto stroke-1" />
          <p className="text-xs font-semibold text-[#2C2528]">Arsip Masih Kosong</p>
          <p className="text-[11px] text-[#75686C] leading-relaxed">
            Anda dapat mengarsipkan barang yang sudah dibeli atau tidak lagi diprioritaskan melalui modal detail produk.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3.5 sm:gap-4 max-[480px]:gap-2.5">
          {archivedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#EFE3E6] rounded-[4px] p-3 flex flex-col justify-between group opacity-90 hover:opacity-100 hover:border-[var(--theme-primary)] wabi-card"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer space-y-2"
              >
                {/* Image without crop */}
                <div className="w-full aspect-square bg-[#FAF6F7] border border-[#F6ECEE] rounded-[4px] flex items-center justify-center p-2 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain grayscale-20 group-hover:grayscale-0 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Package className="w-8 h-8 text-[#75686C]/40 stroke-1" />
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-[#75686C] block">
                    {product.category_name || 'Umum'}
                  </span>
                  <h3 className="text-xs font-semibold text-[#2C2528] line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="font-sora text-sm font-bold text-[#2C2528]">
                  {formatRupiah(product.price)}
                </div>
              </div>

              {/* Actions: Restore or Delete permanently */}
              <div className="pt-3 mt-2 border-t border-[#F6ECEE] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onRestoreProduct(product)}
                  className="px-2.5 py-1 text-[11px] text-[var(--theme-accent)] hover:bg-[var(--theme-primary-light)] border border-[var(--theme-primary)] rounded-[3px] transition-colors flex items-center gap-1"
                >
                  <ArchiveRestore className="w-3 h-3" />
                  <span>Pulihkan</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteProduct(product)}
                  className="p-1 text-[#75686C] hover:text-[#C8556D] hover:bg-[#FCF2F4] rounded-[3px] transition-colors"
                  title="Hapus Permanen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

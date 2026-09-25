import React from "react";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Product } from "../../../types";
import { formatRupiah, getFaviconFromUrl } from "../../../lib/utils";

interface ProductListItemProps {
  product: Product;
  onClick: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onNavigateToCategory?: (categoryId: string) => void;
  onNavigateToTag?: (tagName: string) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onClick,
  onEdit,
  onDelete,
  onNavigateToCategory,
  onNavigateToTag,
}) => {
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white border border-[#EFE3E6] hover:border-[var(--theme-primary)] rounded-[4px] p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Photo Slot */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#FAF6F7] border border-[#F6ECEE] rounded-[4px] flex items-center justify-center p-1 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Package className="w-6 h-6 text-[#75686C]/40 stroke-1" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {product.category_name && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.category_id && onNavigateToCategory) {
                    onNavigateToCategory(product.category_id);
                  }
                }}
                className="text-[11px] text-[var(--theme-primary)] hover:underline font-medium truncate"
              >
                {product.category_name}
              </button>
            )}
            {product.is_archived && (
              <span className="text-[10px] text-[#75686C] bg-[#FAF6F7] px-1 rounded-[3px]">
                Arsip
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-[#2C2528] truncate group-hover:text-[var(--theme-accent)] transition-colors">
            {product.name}
          </h3>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 hidden sm:flex">
              {product.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNavigateToTag) onNavigateToTag(tag);
                  }}
                  className="text-[10px] text-[#75686C] bg-[#FAF6F7] hover:text-[var(--theme-primary)] px-1.5 py-0.5 rounded-[3px] border border-[#EFE3E6]"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Price, Store Favicon Link & Action Buttons */}
      <div className="text-right shrink-0 pl-2 flex flex-col items-end gap-1">
        <span className="font-sora text-xs sm:text-base font-bold text-[#2C2528] block">
          {formatRupiah(product.price)}
        </span>

        <div className="flex items-center gap-2">
          {/* Favicon Link Toko */}
          {product.links && product.links.length > 0 && (
            <div className="flex items-center justify-end gap-1">
              {product.links.slice(0, 2).map((link) => (
                <a
                  key={link.id || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-0.5 hover:bg-[#FAF6F7] rounded-[3px] transition-colors"
                  title={link.title || "Buka Toko"}
                >
                  <img
                    src={link.favicon || getFaviconFromUrl(link.url)}
                    alt="Link"
                    className="w-3.5 h-3.5 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </a>
              ))}
            </div>
          )}

          {/* Tombol Edit & Hapus */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-0.5 z-10">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  className="p-1 text-[#75686C] hover:text-[var(--theme-primary)] hover:bg-[#FAF6F7] rounded-[3px] transition-colors"
                  title="Edit Produk"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product);
                  }}
                  className="p-1 text-[#75686C] hover:text-red-600 hover:bg-red-50 rounded-[3px] transition-colors"
                  title="Hapus Produk"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

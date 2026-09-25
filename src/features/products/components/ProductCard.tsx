import React from "react";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Product } from "../../../types";
import { formatRupiah, getFaviconFromUrl } from "../../../lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onNavigateToCategory?: (categoryId: string) => void;
  onNavigateToTag?: (tagName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
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
      className="bg-white border border-[#EFE3E6] hover:border-[var(--theme-primary)] rounded-[4px] p-3 flex flex-col justify-between cursor-pointer group wabi-card relative overflow-hidden"
    >
      <div>
        {/* Photo Container */}
        <div className="w-full aspect-square bg-[#FAF6F7] border border-[#F6ECEE] rounded-[4px] flex items-center justify-center p-2 mb-3 overflow-hidden group-hover:bg-[#FFF] transition-colors relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Package className="w-10 h-10 text-[#75686C]/40 stroke-1" />
          )}

          {/* Quick shop favicon link di pojok kanan atas foto */}
          {product.links &&
            product.links.length > 0 &&
            product.links[0].url && (
              <a
                href={product.links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white backdrop-blur-xs border border-[#EFE3E6] hover:border-[var(--theme-primary)] rounded-[3px] p-1 shadow-2xs transition-colors z-10"
                title={product.links[0].title || "Buka Tautan Toko"}
              >
                <img
                  src={
                    product.links[0].favicon ||
                    getFaviconFromUrl(product.links[0].url)
                  }
                  alt="Store"
                  className="w-3.5 h-3.5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </a>
            )}
        </div>

        {/* Category Header */}
        <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
          {product.category_name ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (product.category_id && onNavigateToCategory) {
                  onNavigateToCategory(product.category_id);
                }
              }}
              className="text-[var(--theme-primary)] hover:underline truncate max-w-[80%] text-left font-medium"
            >
              {product.category_name}
            </button>
          ) : (
            <span className="text-[#75686C]/60 text-[10px]">Umum</span>
          )}

          {product.is_archived && (
            <span className="text-[10px] text-[#75686C] bg-[#FAF6F7] px-1 rounded-[3px]">
              Arsip
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-[#2C2528] line-clamp-2 leading-snug group-hover:text-[var(--theme-accent)] transition-colors mb-2">
          {product.name}
        </h3>
      </div>

      {/* Footer: Price, Tags, & Action Buttons */}
      <div className="pt-2 border-t border-[#F6ECEE] space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-sora text-sm sm:text-base font-bold text-[#2C2528] tracking-tight">
            {formatRupiah(product.price)}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigateToTag) {
                    onNavigateToTag(tag);
                  }
                }}
                className="text-[10px] text-[#75686C] bg-[#FAF6F7] hover:text-[var(--theme-primary)] hover:bg-[#FAF0F3] px-1.5 py-0.5 rounded-[3px] border border-[#EFE3E6] transition-colors"
              >
                #{tag}
              </button>
            ))}
            {product.tags.length > 3 && (
              <span className="text-[10px] text-[#75686C] px-1 py-0.5 font-sora">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Tombol Action (Edit & Hapus) di Bawah Tag sebelah Kanan */}
        {(onEdit || onDelete) && (
          <div className="flex items-center justify-end gap-1 pt-1 z-10">
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
  );
};
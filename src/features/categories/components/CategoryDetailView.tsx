import React from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, FolderTree, Package } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Category, Product } from '../../../types';
import { ProductCard } from '../../products/components/ProductCard';
import { formatRupiah } from '../../../lib/utils';

interface CategoryDetailViewProps {
  category: Category;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddProductWithCategory: (categoryId: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  products,
  onBack,
  onSelectProduct,
  onAddProductWithCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const categoryProducts = products.filter(
    (p) => !p.is_archived && p.category_id === category.id
  );
  const totalValue = categoryProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-5">
      {/* Breadcrumb back */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#75686C] hover:text-[#2C2528] transition-colors py-1 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Semua Kategori</span>
        </button>
      </div>

      {/* Category Header Card */}
      <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${category.color || '#E87A90'}18`,
                borderColor: `${category.color || '#E87A90'}35`,
                color: category.color || '#E87A90',
              }}
            >
              {category.icon ? (
                <Icon icon={category.icon} className="w-5 h-5" />
              ) : (
                <FolderTree className="w-5 h-5" />
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#2C2528] tracking-tight">
              {category.name}
            </h1>
          </div>
          {category.description && (
            <p className="text-xs text-[#75686C] max-w-xl">
              {category.description}
            </p>
          )}

          <div className="pt-2 flex items-center gap-4 text-xs text-[#75686C]">
            <span>
              Total: <strong className="font-sora text-[#2C2528]">{categoryProducts.length}</strong> produk
            </span>
            <span>·</span>
            <span>
              Estimasi: <strong className="font-sora text-[#2C2528]">{formatRupiah(totalValue)}</strong>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="px-2.5 py-1.5 text-xs text-[#75686C] hover:text-[#2C2528] border border-[#EFE3E6] rounded-[4px] hover:bg-[#FAF6F7] flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span>Ubah</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory(category)}
            className="px-2.5 py-1.5 text-xs text-[#C8556D] hover:bg-[#FCF2F4] border border-[#F2D7DC] rounded-[4px] flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus</span>
          </button>
          <button
            type="button"
            onClick={() => onAddProductWithCategory(category.id)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-[4px] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item</span>
          </button>
        </div>
      </div>

      {/* Products in this category */}
      <div>
        <h2 className="text-xs font-semibold text-[#75686C] tracking-wide uppercase mb-3">
          Daftar Produk Kategori {category.name}
        </h2>

        {categoryProducts.length === 0 ? (
          <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-8 text-center max-w-sm mx-auto my-6 space-y-2">
            <Package className="w-8 h-8 text-[#75686C]/40 mx-auto stroke-1" />
            <p className="text-xs font-semibold text-[#2C2528]">Belum Ada Produk</p>
            <p className="text-[11px] text-[#75686C]">
              Kategori ini belum memiliki produk terkait.
            </p>
            <button
              type="button"
              onClick={() => onAddProductWithCategory(category.id)}
              className="mt-2 text-xs text-[var(--theme-primary)] font-medium hover:underline"
            >
              + Tambah Produk Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

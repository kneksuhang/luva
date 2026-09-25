import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Package, Plus } from "lucide-react";
import { Product, Category, Tag } from "../../../types";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { ProductFilterBar, FilterOptions } from "./ProductFilterBar";
import {
  ProductCardSkeleton,
  ProductListItemSkeleton,
} from "../../../components/ui/Skeleton";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  tags: Tag[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  onOpenAddModal: () => void;
  onNavigateToCategory?: (categoryId: string) => void;
  onNavigateToTag?: (tagName: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  tags,
  isLoading = false,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onOpenAddModal,
  onNavigateToCategory,
  onNavigateToTag,
}) => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    categoryId: "",
    tagName: "",
    sortBy: "newest",
  });

  // Active (non-archived) products
  const activeProducts = useMemo(() => {
    return products.filter((p) => !p.is_archived);
  }, [products]);

  // Fuse.js index
  const fuse = useMemo(() => {
    return new Fuse(activeProducts, {
      keys: ["name", "category_name", "tags", "description"],
      threshold: 0.35,
    });
  }, [activeProducts]);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = activeProducts;

    if (filters.searchQuery.trim()) {
      const searchResults = fuse.search(filters.searchQuery);
      result = searchResults.map((r) => r.item);
    }

    if (filters.categoryId) {
      result = result.filter((p) => p.category_id === filters.categoryId);
    }

    if (filters.tagName) {
      result = result.filter((p) => p.tags.includes(filters.tagName));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    return [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [activeProducts, filters, fuse]);

  return (
    <div className="space-y-4">
      {/* Search, View Mode, & Filter Controls */}
      <ProductFilterBar
        filters={filters}
        onChangeFilters={setFilters}
        categories={categories}
        tags={tags}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        totalProductsCount={activeProducts.length}
        filteredProductsCount={filteredProducts.length}
        onOpenAddModal={onOpenAddModal}
      />

      {/* Loading Skeleton state */}
      {isLoading ? (
        viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 max-[480px]:gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5 max-[480px]:space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductListItemSkeleton key={i} />
            ))}
          </div>
        )
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#EFE3E6] rounded-sm p-8 sm:p-12 text-center max-w-lg mx-auto my-6 space-y-3">
          <div className="w-12 h-12 bg-[#FAF6F7] border border-[#EFE3E6] rounded-sm flex items-center justify-center mx-auto text-[#75686C]">
            <Package className="w-6 h-6 stroke-1" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2C2528]">
              {filters.searchQuery || filters.categoryId || filters.tagName
                ? "Tidak ada produk yang cocok"
                : "Belum ada barang impian"}
            </h3>
            <p className="text-xs text-[#75686C] mt-1 max-w-xs mx-auto leading-relaxed">
              {filters.searchQuery || filters.categoryId || filters.tagName
                ? "Coba sesuaikan kata kunci pencarian atau ubah filter Anda."
                : "Mulai kumpulkan daftar wishlist favorit Anda dengan menekan tombol di bawah."}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="h-8 px-4 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-sm transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Produk Pertama</span>
            </button>
          </div>
        </div>
      ) : viewMode === "card" ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 max-[480px]:gap-2.5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onSelectProduct}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onNavigateToCategory={onNavigateToCategory}
              onNavigateToTag={onNavigateToTag}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5 max-[480px]:space-y-2">
          {filteredProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onClick={onSelectProduct}
              onNavigateToCategory={onNavigateToCategory}
              onNavigateToTag={onNavigateToTag}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { Category, Tag } from "../../../types";

export interface FilterOptions {
  searchQuery: string;
  categoryId: string;
  tagName: string;
  sortBy:
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc";
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: FilterOptions) => void;
  categories: Category[];
  tags: Tag[];
  viewMode: "card" | "list";
  onChangeViewMode: (mode: "card" | "list") => void;
  totalProductsCount: number;
  filteredProductsCount: number;
  onOpenAddModal: () => void;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filters,
  onChangeFilters,
  categories,
  tags,
  viewMode,
  onChangeViewMode,
  totalProductsCount,
  filteredProductsCount,
  onOpenAddModal,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.categoryId ? 1 : 0) +
    (filters.tagName ? 1 : 0) +
    (filters.sortBy !== "newest" ? 1 : 0) +
    (filters.minPrice !== undefined ? 1 : 0) +
    (filters.maxPrice !== undefined ? 1 : 0);

  const handleResetFilters = () => {
    onChangeFilters({
      searchQuery: "",
      categoryId: "",
      tagName: "",
      sortBy: "newest",
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Top Bar: Filter Toggle (Kiri) vs Tambah Item & View Switcher (Kanan) */}
      <div className="flex items-center justify-between gap-2.5">
        {/* Sisi Kiri: Hanya Tombol Filter */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`h-8 px-2.5 sm:px-3 text-xs border rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
            showAdvanced || activeFiltersCount > 0
              ? "bg-[var(--theme-primary-light)] border-[var(--theme-primary)] text-[var(--theme-accent)] font-medium"
              : "bg-white border-[#EFE3E6] text-[#75686C] hover:text-[#2C2528] hover:bg-[#FAF6F7]"
          }`}
          aria-label="Filter dan Urutkan"
          title="Filter & Urutkan"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filter & Urutkan</span>
          {activeFiltersCount > 0 && (
            <span className="font-sora text-[10px] bg-[var(--theme-primary)] text-white px-1.5 py-0.2 rounded-[3px]">
              {activeFiltersCount}
            </span>
          )}
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Sisi Kanan: Tombol Tambah Item & View Switcher Disatukan */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tombol Tambah Item */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="h-8 px-2.5 sm:px-3 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-sm transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
            aria-label="Tambah Item"
            title="Tambah Item"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah Item</span>
          </button>

          {/* View Mode Switcher: Card & List */}
          <div className="flex items-center border border-[#EFE3E6] rounded-sm p-0.5 bg-white shrink-0">
            <button
              type="button"
              onClick={() => onChangeViewMode("card")}
              className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                viewMode === "card"
                  ? "bg-[#FAF6F7] text-[var(--theme-accent)] shadow-2xs"
                  : "text-[#75686C] hover:text-[#2C2528]"
              }`}
              title="Tampilan Kartu"
              aria-label="Tampilan Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode("list")}
              className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#FAF6F7] text-[var(--theme-accent)] shadow-2xs"
                  : "text-[#75686C] hover:text-[#2C2528]"
              }`}
              title="Tampilan Daftar"
              aria-label="Tampilan Daftar"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Panel */}
      {showAdvanced && (
        <div className="bg-white border border-[#EFE3E6] rounded-sm p-4 shadow-2xs space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#F6ECEE] pb-2">
            <span className="text-xs font-semibold text-[#2C2528]">
              Pengaturan Filter & Urutan
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-[#75686C] hover:text-[var(--theme-accent)] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Search Input */}
            <div className="lg:col-span-1">
              <label className="block text-[11px] font-medium text-[#75686C] mb-1">
                Pencarian
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#75686C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    onChangeFilters({ ...filters, searchQuery: e.target.value })
                  }
                  placeholder="Cari produk..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs border border-[#EFE3E6] rounded-sm bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
                />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeFilters({ ...filters, searchQuery: "" })
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#75686C] hover:text-[#2C2528] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Category Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#75686C] mb-1">
                Kategori
              </label>
              <select
                value={filters.categoryId}
                onChange={(e) =>
                  onChangeFilters({ ...filters, categoryId: e.target.value })
                }
                className="w-full px-2.5 py-1.5 text-xs border border-[#EFE3E6] rounded-sm bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Tag Filter */}
            <div>
              <label className="block text-[11px] font-medium text-[#75686C] mb-1">
                Label Tag
              </label>
              <select
                value={filters.tagName}
                onChange={(e) =>
                  onChangeFilters({ ...filters, tagName: e.target.value })
                }
                className="w-full px-2.5 py-1.5 text-xs border border-[#EFE3E6] rounded-sm bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
              >
                <option value="">Semua Tag</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.name}>
                    #{t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Sort Advanced */}
            <div>
              <label className="block text-[11px] font-medium text-[#75686C] mb-1">
                Urutkan Berdasarkan
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    sortBy: e.target.value as FilterOptions["sortBy"],
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs border border-[#EFE3E6] rounded-sm bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
              >
                <option value="newest">Waktu: Terbaru</option>
                <option value="oldest">Waktu: Terlama</option>
                <option value="price-asc">Harga: Termurah</option>
                <option value="price-desc">Harga: Termahal</option>
                <option value="name-asc">Nama Produk: A - Z</option>
                <option value="name-desc">Nama Produk: Z - A</option>
              </select>
            </div>

            {/* 5. Price Range */}
            <div>
              <label className="block text-[11px] font-medium text-[#75686C] mb-1">
                Batas Harga Maksimal (Rp)
              </label>
              <input
                type="number"
                placeholder="Tanpa batas"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-sora border border-[#EFE3E6] rounded-sm bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#75686C] flex items-center justify-between border-t border-[#F6ECEE]">
            <span>
              Menampilkan{" "}
              <strong className="font-sora text-[#2C2528]">
                {filteredProductsCount}
              </strong>{" "}
              dari <span className="font-sora">{totalProductsCount}</span>{" "}
              produk aktif
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
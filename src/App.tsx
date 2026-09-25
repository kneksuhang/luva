import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./features/navigation/Navbar";
import { ProductList } from "./features/products/components/ProductList";
import { ProductFormModal } from "./features/products/components/ProductFormModal";
import { ProductDetailModal } from "./features/products/components/ProductDetailModal";
import { CategoryList } from "./features/categories/components/CategoryList";
import { CategoryDetailView } from "./features/categories/components/CategoryDetailView";
import { CategoryFormModal } from "./features/categories/components/CategoryFormModal";
import { TagList } from "./features/tags/components/TagList";
import { TagDetailView } from "./features/tags/components/TagDetailView";
import { TagFormModal } from "./features/tags/components/TagFormModal";
import { SummaryDashboard } from "./features/analytics/components/SummaryDashboard";
import { ArchiveDashboard } from "./features/archive/components/ArchiveDashboard";
import { SettingsDashboard } from "./features/settings/components/SettingsDashboard";
import { ConfirmDeleteModal } from "./features/modals/ConfirmDeleteModal";
import { ResetDataModal } from "./features/modals/ResetDataModal";
import { NotFoundPage } from "./features/error/NotFoundPage";
import { UnauthorizedPage } from "./features/error/UnauthorizedPage";
import { useWishlistStore } from "./store/useWishlistStore";
import { Product, Category, Tag } from "./types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function WishlistApp() {
  const {
    products,
    categories,
    tags,
    isLoading,
    fetchFromSupabase,
    deleteProduct,
    archiveProduct,
    deleteCategory,
    deleteTag,
  } = useWishlistStore();

  // Router Path State (Strictly clean URL paths without '#')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || "/";
  });

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Preselected category or tag for new product
  const [initialCategoryId, setInitialCategoryId] = useState<
    string | undefined
  >(undefined);
  const [initialTag, setInitialTag] = useState<string | undefined>(undefined);

  // Deletion Confirmation Modal State (Module 4)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Initial load from Supabase
  useEffect(() => {
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  // Clean HTML5 History Routing
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Open Add Product with preset
  const handleOpenAddProduct = (presetCatId?: string, presetTag?: string) => {
    setProductToEdit(null);
    setInitialCategoryId(presetCatId);
    setInitialTag(presetTag);
    setIsAddProductOpen(true);
  };

  // Open Edit Product
  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsAddProductOpen(true);
  };

  // Handle Delete Confirmation (Strictly NO window.confirm!)
  const handleRequestDeleteProduct = (product: Product) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Hapus Produk dari Wishlist",
      message:
        "Apakah Anda yakin ingin menghapus produk ini? Aksi ini akan menghapus data secara permanen.",
      itemName: product.name,
      onConfirm: async () => {
        await deleteProduct(product.id);
        setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        setSelectedProduct(null);
      },
    });
  };

  const handleRequestDeleteCategory = (category: Category) => {
    setIsCategoryModalOpen(false);
    setDeleteConfirmation({
      isOpen: true,
      title: "Hapus Master Kategori",
      message:
        "Apakah Anda yakin ingin menghapus kategori ini? Produk yang terhubung akan berubah menjadi tanpa kategori.",
      itemName: category.name,
      onConfirm: async () => {
        await deleteCategory(category.id);
        setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        if (currentPath.startsWith("/categories/")) {
          navigate("/categories");
        }
      },
    });
  };

  const handleRequestDeleteTag = (tag: Tag) => {
    setIsTagModalOpen(false);
    setDeleteConfirmation({
      isOpen: true,
      title: "Hapus Master Tag",
      message:
        "Apakah Anda yakin ingin menghapus tag label ini? Tag ini akan dicopot dari seluruh produk terkait.",
      itemName: `#${tag.name}`,
      onConfirm: async () => {
        await deleteTag(tag.id);
        setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        if (currentPath.startsWith("/tags/")) {
          navigate("/tags");
        }
      },
    });
  };

  // Resolve Route & View
  const renderCurrentView = () => {
    // 1. Category Detail Route: /categories/:id
    if (currentPath.startsWith("/categories/")) {
      const categoryId = currentPath.replace("/categories/", "");
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        return <NotFoundPage onGoHome={() => navigate("/categories")} />;
      }
      return (
        <CategoryDetailView
          category={category}
          products={products}
          onBack={() => navigate("/categories")}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddProductWithCategory={(catId) =>
            handleOpenAddProduct(catId, undefined)
          }
          onEditCategory={(cat) => {
            setCategoryToEdit(cat);
            setIsCategoryModalOpen(true);
          }}
          onDeleteCategory={handleRequestDeleteCategory}
        />
      );
    }

    // 2. Tag Detail Route: /tags/:id
    if (currentPath.startsWith("/tags/")) {
      const decodedTag = decodeURIComponent(currentPath.replace("/tags/", ""));
      const tag = tags.find(
        (t) =>
          t.name.toLowerCase() === decodedTag.toLowerCase() ||
          t.id === decodedTag,
      );
      if (!tag) {
        return <NotFoundPage onGoHome={() => navigate("/tags")} />;
      }
      return (
        <TagDetailView
          tag={tag}
          products={products}
          onBack={() => navigate("/tags")}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddProductWithTag={(tagName) =>
            handleOpenAddProduct(undefined, tagName)
          }
          onEditTag={(t) => {
            setTagToEdit(t);
            setIsTagModalOpen(true);
          }}
          onDeleteTag={handleRequestDeleteTag}
        />
      );
    }

    // 3. Primary Top Bar Pages
    switch (currentPath) {
      case "/":
      case "/products":
        return (
          <ProductList
            products={products}
            categories={categories}
            tags={tags}
            isLoading={isLoading}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenAddModal={() => handleOpenAddProduct()}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleRequestDeleteProduct}
            onNavigateToCategory={(catId) => navigate(`/categories/${catId}`)}
            onNavigateToTag={(tagName) =>
              navigate(`/tags/${encodeURIComponent(tagName)}`)
            }
          />
        );

      case "/categories":
        return (
          <CategoryList
            categories={categories}
            products={products}
            onSelectCategory={(catId) => navigate(`/categories/${catId}`)}
            onOpenAddModal={() => {
              setCategoryToEdit(null);
              setIsCategoryModalOpen(true);
            }}
            onEditCategory={(cat) => {
              setCategoryToEdit(cat);
              setIsCategoryModalOpen(true);
            }}
          />
        );

      case "/tags":
        return (
          <TagList
            tags={tags}
            products={products}
            onSelectTag={(tagName) =>
              navigate(`/tags/${encodeURIComponent(tagName)}`)
            }
            onOpenAddModal={() => {
              setTagToEdit(null);
              setIsTagModalOpen(true);
            }}
            onEditTag={(t) => {
              setTagToEdit(t);
              setIsTagModalOpen(true);
            }}
          />
        );

      case "/summary":
        return (
          <SummaryDashboard
            products={products}
            categories={categories}
            tags={tags}
          />
        );

      case "/archive":
        return (
          <ArchiveDashboard
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onRestoreProduct={(p) => archiveProduct(p.id, false)}
            onDeleteProduct={handleRequestDeleteProduct}
          />
        );

      case "/settings":
        return (
          <SettingsDashboard
            onOpenResetModal={() => setIsResetModalOpen(true)}
          />
        );

      case "/unauthorized":
        return <UnauthorizedPage onGoHome={() => navigate("/products")} />;

      default:
        return <NotFoundPage onGoHome={() => navigate("/products")} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col selection:bg-[var(--theme-primary-light)] selection:text-[var(--theme-accent)]">
      {/* Absolute Primary Menu Navigation */}
      <Navbar activePath={currentPath} onNavigate={navigate} />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-[1480px] min-[1200px]:max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 max-[480px]:px-2.5 py-4 sm:py-6">
        {renderCurrentView()}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#EFE3E6] bg-white/60 py-4 text-center text-xs text-[#75686C]">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2C2528]">Luva</span>
            <span>·</span>
            <span>Estetika Dento-iro Wishlist</span>
          </div>
          <p className="text-[11px] text-[#75686C]">
            Dirancang dengan ketenangan wabi-sabi dan keanggunan wanita
          </p>
        </div>
      </footer>

      {/* 1. Modal UI Form Tambah / Edit Produk */}
      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        initialCategoryId={initialCategoryId}
        initialTag={initialTag}
      />

      {/* 2. Modal UI Detail Produk */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={(prod) => {
          setProductToEdit(prod);
          setIsAddProductOpen(true);
        }}
        onDelete={handleRequestDeleteProduct}
        onToggleArchive={(prod) => archiveProduct(prod.id, !prod.is_archived)}
        onNavigateToCategory={(catId) => navigate(`/categories/${catId}`)}
        onNavigateToTag={(tagName) =>
          navigate(`/tags/${encodeURIComponent(tagName)}`)
        }
      />

      {/* 3. Modal UI Form Kategori */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        onDeleteRequest={handleRequestDeleteCategory}
      />

      {/* 4. Modal UI Form Tag */}
      <TagFormModal
        isOpen={isTagModalOpen}
        onClose={() => {
          setIsTagModalOpen(false);
          setTagToEdit(null);
        }}
        tagToEdit={tagToEdit}
        onDeleteRequest={handleRequestDeleteTag}
      />

      {/* 5. Modal UI Panel Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={deleteConfirmation.onConfirm}
        title={deleteConfirmation.title}
        message={deleteConfirmation.message}
        itemName={deleteConfirmation.itemName}
      />

      {/* 6. Modal Reset Data Database */}
      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistApp />
    </QueryClientProvider>
  );
}

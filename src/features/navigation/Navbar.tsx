import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  Package,
  FolderTree,
  Tag as TagIcon,
  BarChart3,
  Archive,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useWishlistStore } from "../../store/useWishlistStore";

interface NavbarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { products, categories, tags } = useWishlistStore();
  const drawerPanelRef = useRef<HTMLDivElement>(null);

  const activeProductsCount = products.filter((p) => !p.is_archived).length;
  const archivedProductsCount = products.filter((p) => p.is_archived).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      id: "products",
      label: "Produk",
      path: "/products",
      icon: Package,
      count: activeProductsCount,
    },
    {
      id: "categories",
      label: "Kategori",
      path: "/categories",
      icon: FolderTree,
      count: categories.length,
    },
    {
      id: "tags",
      label: "Tag",
      path: "/tags",
      icon: TagIcon,
      count: tags.length,
    },
    {
      id: "summary",
      label: "Ringkasan",
      path: "/summary",
      icon: BarChart3,
    },
    {
      id: "archive",
      label: "Arsip",
      path: "/archive",
      icon: Archive,
      count: archivedProductsCount,
    },
    {
      id: "settings",
      label: "Pengaturan",
      path: "/settings",
      icon: SettingsIcon,
    },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-[#EFE3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Wordmark (Ujung Kiri) */}
          <button
            onClick={() => handleNavClick("/products")}
            className="flex items-baseline gap-1.5 text-left group focus-visible:outline-hidden cursor-pointer shrink-0"
          >
            <span className="text-xl font-bold tracking-tight text-[#2C2528] group-hover:text-[var(--theme-primary)] transition-colors">
              Luva
            </span>
            <span className="text-[11px] text-[#75686C] font-normal tracking-wider">
              ルヴァ
            </span>
          </button>

          {/* Desktop Navigation Links (Ujung Kanan) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                activePath === item.path ||
                (item.path === "/products" && activePath === "/");
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
                    isActive
                      ? "text-[var(--theme-accent)] bg-[var(--theme-primary-light)] font-semibold"
                      : "text-[#75686C] hover:text-[#2C2528] hover:bg-[#FAF6F7]",
                  )}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="font-sora text-[10px] opacity-75 px-1 py-0.2 bg-black/5 rounded-[3px]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#75686C] hover:text-[#2C2528] hover:bg-[#FAF6F7] rounded-sm cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen &&
        mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[99999] md:hidden isolate"
          >
            <div
              className="fixed inset-0 luva-drawer-backdrop transition-opacity animate-in fade-in duration-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup panel menu"
            />

            <div
              ref={drawerPanelRef}
              className="fixed inset-y-0 right-0 z-[100000] w-[84%] max-w-xs luva-drawer-canvas p-5 flex flex-col justify-between border-l border-[#EFE3E6] animate-in slide-in-from-right duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EFE3E6]">
                  <div>
                    <span className="text-lg font-bold tracking-tight text-[#2C2528]">
                      Luva
                    </span>
                    <p className="text-[11px] text-[#75686C]">
                      Wishlist Pribadi · 私の願い
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#75686C] hover:text-[#2C2528] rounded-sm hover:bg-[#FAF6F7] transition-colors cursor-pointer"
                    aria-label="Tutup menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      activePath === item.path ||
                      (item.path === "/products" && activePath === "/");
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.path)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium transition-colors text-left cursor-pointer",
                          isActive
                            ? "text-[var(--theme-accent)] bg-[var(--theme-primary-light)] font-semibold"
                            : "text-[#2C2528] hover:bg-[#FAF6F7]",
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[#75686C]" />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className="font-sora text-[11px] text-[#75686C] bg-[#FAF6F7] px-1.5 py-0.5 rounded-[3px]">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
};
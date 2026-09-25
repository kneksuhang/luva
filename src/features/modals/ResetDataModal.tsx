import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { useWishlistStore } from '../../store/useWishlistStore';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { resetData, products, categories, tags } = useWishlistStore();
  const [resetProducts, setResetProducts] = useState(true);
  const [resetCategories, setResetCategories] = useState(false);
  const [resetTags, setResetTags] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReset = async () => {
    if (!resetProducts && !resetCategories && !resetTags) return;
    setIsProcessing(true);
    await resetData({
      products: resetProducts,
      categories: resetCategories,
      tags: resetTags,
    });
    setIsProcessing(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleSelectAll = () => {
    const allSelected = resetProducts && resetCategories && resetTags;
    setResetProducts(!allSelected);
    setResetCategories(!allSelected);
    setResetTags(!allSelected);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2 text-[#9E3E4B]">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset Data Database</span>
        </div>
      }
      subtitle="Pilih data yang ingin Anda kosongkan. Tindakan ini tidak dapat dibatalkan."
    >
      <div className="space-y-4">
        {/* Selection options */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-semibold text-[#2C2528]">Pilihan Entitas Data:</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] text-[var(--theme-accent)] hover:underline"
            >
              {resetProducts && resetCategories && resetTags ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </button>
          </div>

          {/* Option: Products */}
          <label className="flex items-center justify-between p-3 border border-[#EFE3E6] rounded-[4px] cursor-pointer hover:bg-[#FAF6F7] transition-colors">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setResetProducts(!resetProducts)}
                className="text-[var(--theme-primary)]"
              >
                {resetProducts ? (
                  <CheckSquare className="w-4 h-4 text-[var(--theme-primary)]" />
                ) : (
                  <Square className="w-4 h-4 text-[#75686C]" />
                )}
              </button>
              <div>
                <p className="text-xs font-medium text-[#2C2528]">Data Produk & Wishlist</p>
                <p className="text-[11px] text-[#75686C]">Kosongkan seluruh daftar barang impian dan arsip</p>
              </div>
            </div>
            <span className="font-sora text-xs text-[#75686C] bg-white px-2 py-0.5 border border-[#EFE3E6] rounded-[3px]">
              {products.length} item
            </span>
          </label>

          {/* Option: Categories */}
          <label className="flex items-center justify-between p-3 border border-[#EFE3E6] rounded-[4px] cursor-pointer hover:bg-[#FAF6F7] transition-colors">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setResetCategories(!resetCategories)}
                className="text-[var(--theme-primary)]"
              >
                {resetCategories ? (
                  <CheckSquare className="w-4 h-4 text-[var(--theme-primary)]" />
                ) : (
                  <Square className="w-4 h-4 text-[#75686C]" />
                )}
              </button>
              <div>
                <p className="text-xs font-medium text-[#2C2528]">Data Master Kategori</p>
                <p className="text-[11px] text-[#75686C]">Kosongkan seluruh kategori pengelompokan</p>
              </div>
            </div>
            <span className="font-sora text-xs text-[#75686C] bg-white px-2 py-0.5 border border-[#EFE3E6] rounded-[3px]">
              {categories.length} kategori
            </span>
          </label>

          {/* Option: Tags */}
          <label className="flex items-center justify-between p-3 border border-[#EFE3E6] rounded-[4px] cursor-pointer hover:bg-[#FAF6F7] transition-colors">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setResetTags(!resetTags)}
                className="text-[var(--theme-primary)]"
              >
                {resetTags ? (
                  <CheckSquare className="w-4 h-4 text-[var(--theme-primary)]" />
                ) : (
                  <Square className="w-4 h-4 text-[#75686C]" />
                )}
              </button>
              <div>
                <p className="text-xs font-medium text-[#2C2528]">Data Master Tag</p>
                <p className="text-[11px] text-[#75686C]">Kosongkan seluruh label penanda</p>
              </div>
            </div>
            <span className="font-sora text-xs text-[#75686C] bg-white px-2 py-0.5 border border-[#EFE3E6] rounded-[3px]">
              {tags.length} tag
            </span>
          </label>
        </div>

        <div className="p-3 bg-[#FCF2F4] border border-[#F2D7DC] rounded-[4px] text-[11px] text-[#8C3A48] flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Peringatan: Aksi ini langsung menghapus data yang dipilih dari database Supabase dan memori aplikasi.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE3E6]">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-3 py-1.5 text-xs font-medium text-[#75686C] hover:text-[#2C2528] rounded-[4px]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isProcessing || (!resetProducts && !resetCategories && !resetTags)}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#C8556D] hover:bg-[#B3455C] disabled:opacity-50 disabled:cursor-not-allowed rounded-[4px] transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Mengosongkan...' : 'Konfirmasi Kosongkan'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

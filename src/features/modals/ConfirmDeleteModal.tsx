import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isDeleting = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={
        <div className="flex items-center gap-2 text-[#9E3E4B]">
          <AlertTriangle className="w-4 h-4" />
          <span>{title}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-[#75686C] leading-relaxed">
          {message}
        </p>

        {itemName && (
          <div className="p-2.5 bg-[#FAF6F7] border border-[#EFE3E6] rounded-[4px] text-xs font-medium text-[#2C2528] truncate">
            {itemName}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE3E6]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs font-medium text-[#75686C] hover:text-[#2C2528] hover:bg-[#FAF6F7] rounded-[4px] transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isDeleting}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#C8556D] hover:bg-[#B3455C] rounded-[4px] transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

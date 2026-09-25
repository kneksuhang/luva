import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Tag } from '../../../types';
import { useWishlistStore } from '../../../store/useWishlistStore';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagToEdit?: Tag | null;
  onDeleteRequest?: (tag: Tag) => void;
}

const PRESET_COLORS = [
  '#E87A90', // Sakura
  '#8B81C3', // Fuji
  '#5BA983', // Wakatake
  '#CA7853', // Kohaku
  '#897858', // Rikyucha
  '#EE7989', // Nadeshiko
  '#75686C', // Shironezu
];

export const TagFormModal: React.FC<TagFormModalProps> = ({
  isOpen,
  onClose,
  tagToEdit,
  onDeleteRequest,
}) => {
  const { addTag, updateTag } = useWishlistStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tagToEdit) {
      setName(tagToEdit.name);
      setColor(tagToEdit.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
    }
    setError('');
  }, [tagToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama label tag wajib diisi.');
      return;
    }

    if (tagToEdit) {
      await updateTag(tagToEdit.id, {
        name: name.trim(),
        color,
      });
    } else {
      await addTag({
        name: name.trim(),
        color,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={
        <div className="flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-[var(--theme-primary)]" />
          <span>{tagToEdit ? 'Ubah Tag' : 'Tambah Tag Baru'}</span>
        </div>
      }
      subtitle="Kelola label penanda untuk mengelompokkan barang impian."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-[#FCF2F4] border border-[#F2D7DC] text-[#8C3A48] text-xs rounded-[4px]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1">
            Nama Tag <span className="text-[#C8556D]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Contoh: Impian Terbesar, Self Reward, Menunggu Promo"
            className="w-full px-3 py-2 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528]"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1.5">
            Warna Tag (Dento-iro)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-[4px] transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-[#2C2528] scale-110' : 'opacity-85 hover:opacity-100'
                }`}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EFE3E6]">
          {tagToEdit && onDeleteRequest ? (
            <button
              type="button"
              onClick={() => onDeleteRequest(tagToEdit)}
              className="text-xs text-[#C8556D] hover:text-[#9E3E4B] flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#75686C] hover:text-[#2C2528] rounded-[4px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-[4px] transition-colors"
            >
              {tagToEdit ? 'Simpan' : 'Tambah Tag'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

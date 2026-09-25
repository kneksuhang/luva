import React, { useState, useEffect } from 'react';
import { FolderTree, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Category } from '../../../types';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { IconPicker } from './IconPicker';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  onDeleteRequest?: (category: Category) => void;
}

const PRESET_COLORS = [
  '#E87A90', // Sakura
  '#EE7989', // Nadeshiko
  '#F4A7B9', // Toki
  '#5BA983', // Wakatake
  '#8B81C3', // Fuji
  '#897858', // Rikyucha
  '#CA7853', // Kohaku
  '#0089A7', // Shinbashi (Baru)
  '#E9A328', // Yamabuki (Baru)
  '#B7282E', // Akane (Baru)
  '#75686C', // Shironezu
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  onDeleteRequest,
}) => {
  const { addCategory, updateCategory } = useWishlistStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState('ph:sparkle-thin');
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || '');
      setColor(categoryToEdit.color || PRESET_COLORS[0]);
      setIcon(categoryToEdit.icon || 'ph:sparkle-thin');
    } else {
      setName('');
      setDescription('');
      setColor(PRESET_COLORS[0]);
      setIcon('ph:sparkle-thin');
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    if (categoryToEdit) {
      await updateCategory(categoryToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
      });
    } else {
      await addCategory({
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[var(--theme-primary)]" />
          <span>{categoryToEdit ? 'Ubah Kategori' : 'Tambah Kategori Baru'}</span>
        </div>
      }
      subtitle="Kelola kelompok barang wishlist dengan nuansa estetika Jepang."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-[#FCF2F4] border border-[#F2D7DC] text-[#8C3A48] text-xs rounded-[4px]">
            {error}
          </div>
        )}

        {/* Category Name */}
        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1">
            Nama Kategori <span className="text-[#C8556D]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Contoh: Perawatan Kulit, Pakaian, Dekorasi Kamar"
            className="w-full px-3 py-2 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528]"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1">
            Deskripsi (Opsional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Catatan singkat mengenai kategori ini..."
            className="w-full px-3 py-2 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528] resize-none"
          />
        </div>

        {/* Iconify Custom Icon Picker Real-Time */}
        <IconPicker
          selectedIcon={icon}
          onSelectIcon={setIcon}
          accentColor={color}
        />

        {/* Color Picker with Dento-iro presets */}
        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1.5">
            Warna Identitas (Dento-iro)
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

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EFE3E6]">
          {categoryToEdit && onDeleteRequest ? (
            <button
              type="button"
              onClick={() => onDeleteRequest(categoryToEdit)}
              className="text-xs text-[#C8556D] hover:text-[#9E3E4B] flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Kategori</span>
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
              {categoryToEdit ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  UploadCloud, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Globe, 
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Product, ProductLink } from '../../../types';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { formatRupiah, parseRupiahInput, getFaviconFromUrl } from '../../../lib/utils';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  initialCategoryId?: string;
  initialTag?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  initialCategoryId,
  initialTag,
}) => {
  const { categories, tags, addProduct, updateProduct } = useWishlistStore();

  // Form State
  const [name, setName] = useState('');
  const [rawPriceInput, setRawPriceInput] = useState('');
  const [numericPrice, setNumericPrice] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [links, setLinks] = useState<ProductLink[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset form
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setNumericPrice(productToEdit.price);
      setRawPriceInput(formatRupiah(productToEdit.price));
      setCategoryId(productToEdit.category_id || '');
      setSelectedTags(productToEdit.tags || []);
      setDescription(productToEdit.description || '');
      setImageUrl(productToEdit.image_url || '');
      setLinks(productToEdit.links || []);
      setPriority(productToEdit.priority || 'medium');
    } else {
      setName('');
      setNumericPrice(0);
      setRawPriceInput('');
      setCategoryId(initialCategoryId || '');
      setSelectedTags(initialTag ? [initialTag] : []);
      setDescription('');
      setImageUrl('');
      setLinks([]);
      setPriority('medium');
    }
    setErrors({});
  }, [productToEdit, isOpen, initialCategoryId, initialTag]);

  // Handle Price Input with dynamic Intl.NumberFormat formatting
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseRupiahInput(value);
    setNumericPrice(parsed);
    if (parsed === 0 && value.trim() === '') {
      setRawPriceInput('');
    } else {
      setRawPriceInput(formatRupiah(parsed));
    }
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
  };

  // Drag & drop photo upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag selection toggle
  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  // Multi-link handlers
  const handleAddLink = () => {
    setLinks([
      ...links,
      {
        id: `link-${Date.now()}`,
        title: '',
        url: '',
      },
    ]);
  };

  const handleUpdateLink = (id: string, field: 'title' | 'url', val: string) => {
    setLinks(
      links.map((link) => {
        if (link.id === id) {
          const updated = { ...link, [field]: val };
          if (field === 'url') {
            updated.favicon = getFaviconFromUrl(val);
          }
          return updated;
        }
        return link;
      })
    );
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama produk wajib diisi.';
    }
    if (!numericPrice || numericPrice <= 0) {
      newErrors.price = 'Harga wajib diisi dengan nominal lebih dari 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clean valid links
    const validLinks = links
      .filter((l) => l.url.trim() !== '')
      .map((l) => ({
        ...l,
        title: l.title.trim() || 'Tautan Produk',
        favicon: l.favicon || getFaviconFromUrl(l.url),
      }));

    if (productToEdit) {
      await updateProduct(productToEdit.id, {
        name: name.trim(),
        price: numericPrice,
        category_id: categoryId || null,
        tags: selectedTags,
        description: description.trim(),
        image_url: imageUrl.trim() || undefined,
        links: validLinks,
        priority,
      });
    } else {
      await addProduct({
        name: name.trim(),
        price: numericPrice,
        category_id: categoryId || null,
        tags: selectedTags,
        description: description.trim(),
        image_url: imageUrl.trim() || undefined,
        links: validLinks,
        is_archived: false,
        priority,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[var(--theme-primary)]" />
          <span>{productToEdit ? 'Ubah Produk Impian' : 'Tambah Produk Baru'}</span>
        </div>
      }
      subtitle="Catat detail barang yang Anda dambakan dengan format rapi dan teratur."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Price (Wajib) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#2C2528] mb-1">
              Nama Produk <span className="text-[#C8556D]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Contoh: Shiseido Ultimune Serum, Linen Haori..."
              className={`w-full px-3 py-2 text-xs border rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528] ${
                errors.name ? 'border-[#C8556D]' : 'border-[#EFE3E6]'
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="text-[11px] text-[#C8556D] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2C2528] mb-1">
              Harga (Rp) <span className="text-[#C8556D]">*</span>
            </label>
            <input
              type="text"
              value={rawPriceInput}
              onChange={handlePriceChange}
              placeholder="Rp 0"
              className={`w-full px-3 py-2 text-xs font-sora border rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528] ${
                errors.price ? 'border-[#C8556D]' : 'border-[#EFE3E6]'
              }`}
            />
            {errors.price && (
              <p className="text-[11px] text-[#C8556D] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.price}</span>
              </p>
            )}
          </div>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#2C2528] mb-1">
              Kategori (Opsional)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528]"
            >
              <option value="">-- Tanpa Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2C2528] mb-1">
              Tingkat Prioritas (Opsional)
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3 py-2 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528]"
            >
              <option value="high">Tinggi (Sangat Diinginkan)</option>
              <option value="medium">Sedang (Prioritas Wajar)</option>
              <option value="low">Rendah (Sekadar Tertarik)</option>
            </select>
          </div>
        </div>

        {/* Tag selection (Multi-tag) */}
        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1.5">
            Tag Label (Opsional)
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 border border-[#EFE3E6] rounded-[4px] bg-[#FAF6F7]/50 max-h-24 overflow-y-auto">
            {tags.length === 0 ? (
              <p className="text-[11px] text-[#75686C] py-0.5">Belum ada master tag.</p>
            ) : (
              tags.map((t) => {
                const isSelected = selectedTags.includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.name)}
                    className={`px-2 py-0.5 text-xs rounded-[4px] transition-colors border ${
                      isSelected
                        ? 'bg-[var(--theme-primary)] text-white border-[var(--theme-primary)] font-medium'
                        : 'bg-white text-[#75686C] border-[#EFE3E6] hover:text-[#2C2528]'
                    }`}
                  >
                    #{t.name}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Drag & Drop Photo + Image URL Input */}
        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1">
            Foto Produk (Drag & Drop atau Tautan Gambar)
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border border-dashed rounded-[4px] p-3 transition-colors ${
              isDragging
                ? 'border-[var(--theme-primary)] bg-[var(--theme-primary-light)]'
                : 'border-[#EFE3E6] bg-white'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Preview Box - Image without cropping (object-contain) */}
              <div className="w-20 h-20 shrink-0 bg-[#FAF6F7] border border-[#EFE3E6] rounded-[4px] flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview produk"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <UploadCloud className="w-6 h-6 text-[#75686C]/50" />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Tempel tautan URL gambar (https://...)"
                  className="w-full px-2.5 py-1.5 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528]"
                />
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] px-2.5 py-1 border border-[#EFE3E6] rounded-[4px] text-[#75686C] hover:text-[#2C2528] hover:bg-[#FAF6F7] transition-colors"
                  >
                    Pilih Berkas Lokal
                  </button>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[11px] text-[#C8556D] hover:underline"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-link URL Produk (Multi-link dan opsional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#2C2528] flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-[#75686C]" />
              <span>Tautan Pembelian (Multi-link & Opsional)</span>
            </label>
            <button
              type="button"
              onClick={handleAddLink}
              className="text-[11px] text-[var(--theme-accent)] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Link Toko</span>
            </button>
          </div>

          {links.length === 0 ? (
            <p className="text-[11px] text-[#75686C] italic p-2 border border-[#EFE3E6] rounded-[4px] bg-[#FAF6F7]/30">
              Belum ada tautan belanja. Klik &quot;Tambah Link Toko&quot; untuk menambahkan toko online seperti Shopee, Tokopedia, Toko Resmi, dll.
            </p>
          ) : (
            <div className="space-y-2">
              {links.map((l) => (
                <div key={l.id} className="flex items-center gap-2 p-2 border border-[#EFE3E6] rounded-[4px] bg-[#FAF6F7]/40">
                  {/* Auto extracted Favicon */}
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center bg-white rounded-[3px] border border-[#EFE3E6] overflow-hidden">
                    {l.url ? (
                      <img
                        src={getFaviconFromUrl(l.url)}
                        alt="Favicon"
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Globe className="w-3 h-3 text-[#75686C]" />
                    )}
                  </div>

                  <input
                    type="text"
                    value={l.title}
                    onChange={(e) => handleUpdateLink(l.id, 'title', e.target.value)}
                    placeholder="Nama Toko (e.g. Tokopedia)"
                    className="w-1/3 px-2 py-1 text-xs border border-[#EFE3E6] rounded-[4px] bg-white text-[#2C2528]"
                  />

                  <input
                    type="url"
                    value={l.url}
                    onChange={(e) => handleUpdateLink(l.id, 'url', e.target.value)}
                    placeholder="https://tokopedia.com/..."
                    className="flex-1 px-2 py-1 text-xs border border-[#EFE3E6] rounded-[4px] bg-white text-[#2C2528]"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(l.id)}
                    className="p-1 text-[#75686C] hover:text-[#C8556D]"
                    title="Hapus Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description (Textarea opsional) */}
        <div>
          <label className="block text-xs font-medium text-[#2C2528] mb-1">
            Deskripsi / Catatan (Opsional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Tuliskan alasan mengapa Anda menginginkan barang ini, varian warna, atau spesifikasi..."
            className="w-full px-3 py-2 text-xs border border-[#EFE3E6] rounded-[4px] focus:outline-hidden focus:border-[var(--theme-primary)] bg-white text-[#2C2528] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE3E6]">
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
            {productToEdit ? 'Simpan Perubahan' : 'Tambah ke Wishlist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Search, Loader2 } from "lucide-react";

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  accentColor?: string;
}

interface CuratedIcon {
  id: string;
  label: string;
  group: string;
}

// Preset kurasi lokal awal
const CURATED_CATEGORY_ICONS: CuratedIcon[] = [
  // Kecantikan & Skincare
  { id: "ph:sparkle-thin", label: "Kilau / Skincare", group: "Kecantikan" },
  { id: "ph:flower-tulip-thin", label: "Bunga Sakura", group: "Kecantikan" },
  { id: "ph:flower-lotus-thin", label: "Teratai / Spa", group: "Kecantikan" },
  { id: "ph:drop-thin", label: "Serum / Tetesan", group: "Kecantikan" },
  { id: "ph:sun-thin", label: "Sunscreen / Pagi", group: "Kecantikan" },
  { id: "ph:moon-stars-thin", label: "Night Care", group: "Kecantikan" },
  { id: "ph:magic-wand-thin", label: "Make Up / Rias", group: "Kecantikan" },
  { id: "ph:scissors-thin", label: "Hair Care", group: "Kecantikan" },

  // Fashion & Gaya Busana
  { id: "ph:t-shirt-thin", label: "Pakaian / Kaos", group: "Busana" },
  { id: "ph:dress-thin", label: "Gaun / Dress", group: "Busana" },
  { id: "ph:handbag-thin", label: "Tas / Handbag", group: "Busana" },
  { id: "ph:tote-thin", label: "Tote Bag Linen", group: "Busana" },
  { id: "ph:sunglasses-thin", label: "Kacamata Modis", group: "Busana" },
  { id: "ph:sketch-logo-thin", label: "Perhiasan Emas", group: "Busana" },
  { id: "ph:tag-thin", label: "Koleksi Desainer", group: "Busana" },

  // Living & Dekorasi Rumah
  { id: "ph:house-line-thin", label: "Dekorasi Rumah", group: "Living" },
  { id: "ph:coffee-thin", label: "Teh / Cangkir", group: "Living" },
  { id: "ph:plant-thin", label: "Tanaman Bonsai", group: "Living" },
  { id: "ph:lamp-thin", label: "Lampu Estetik", group: "Living" },
  { id: "ph:armchair-thin", label: "Ruang Santai", group: "Living" },
  { id: "ph:flame-thin", label: "Lilin Aromaterapi", group: "Living" },
  { id: "ph:bed-thin", label: "Sprei & Selimut", group: "Living" },
  { id: "ph:clock-thin", label: "Jam Minimalis", group: "Living" },

  // Buku, Alat Tulis & Seni
  { id: "ph:book-bookmark-thin", label: "Buku Jurnal", group: "Alat Tulis" },
  { id: "ph:pen-nib-thin", label: "Pena Kaligrafi", group: "Alat Tulis" },
  { id: "ph:notebook-thin", label: "Buku Catatan", group: "Alat Tulis" },
  { id: "ph:paint-brush-thin", label: "Kuas Seni", group: "Alat Tulis" },
  { id: "ph:palette-thin", label: "Palet Warna", group: "Alat Tulis" },
  { id: "ph:paperclip-thin", label: "Aksesoris Meja", group: "Alat Tulis" },

  // Gadget & Hobi
  { id: "ph:camera-thin", label: "Kamera Analog", group: "Hobi" },
  { id: "ph:headphones-thin", label: "Headphones Audio", group: "Hobi" },
  { id: "ph:device-mobile-thin", label: "Gadget Ponsel", group: "Hobi" },
  { id: "ph:music-notes-thin", label: "Piringan Hitam", group: "Hobi" },
  { id: "ph:cookie-thin", label: "Kue / Camilan", group: "Hobi" },
  { id: "ph:heart-thin", label: "Impian Favorit", group: "Hobi" },
  { id: "ph:star-thin", label: "Bintang Terpilih", group: "Hobi" },
  { id: "ph:gift-thin", label: "Kado Spesial", group: "Hobi" },
];

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  accentColor = "#E87A90",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [apiIcons, setApiIcons] = useState<string[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Live search ke Iconify API dengan debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setApiIcons([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const res = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(
            searchTerm,
          )}&limit=60`,
        );
        const data = await res.json();
        if (data && Array.isArray(data.icons)) {
          setApiIcons(data.icons);
        } else {
          setApiIcons([]);
        }
      } catch (err) {
        console.error("Error fetching icons from Iconify:", err);
        setApiIcons([]);
      } finally {
        setIsSearchingApi(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Gabungkan hasil lokal + pencarian API
  const displayIcons = useMemo(() => {
    if (!searchTerm.trim()) {
      return CURATED_CATEGORY_ICONS.map((i) => i.id);
    }

    // Filter preset lokal
    const query = searchTerm.toLowerCase();
    const localFiltered = CURATED_CATEGORY_ICONS.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.group.toLowerCase().includes(query),
    ).map((item) => item.id);

    // Gabungkan dengan hasil API (tanpa duplikat)
    const combined = Array.from(new Set([...localFiltered, ...apiIcons]));
    return combined;
  }, [searchTerm, apiIcons]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectIcon(customInput.trim());
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-3 p-3 bg-[#FAF6F7]/60 border border-[#EFE3E6] rounded-[4px]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#2C2528] flex items-center gap-1.5">
          <span>Kustomisasi Ikon Kategori (Iconify)</span>
        </label>
        {selectedIcon && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#75686C] bg-white px-2 py-0.5 border border-[#EFE3E6] rounded-[3px]">
            <span>Terpilih:</span>
            <Icon
              icon={selectedIcon}
              className="w-3.5 h-3.5"
              style={{ color: accentColor }}
            />
            <span className="font-mono text-[10px] text-[#2C2528]">
              {selectedIcon}
            </span>
          </div>
        )}
      </div>

      {/* Input Pencarian Live API */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#75686C] absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari ribuan ikon: bag, heart, shoes, makeup, shopping..."
          className="w-full pl-8 pr-8 py-1.5 text-xs border border-[#EFE3E6] rounded-[4px] bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
        />
        {isSearchingApi && (
          <Loader2 className="w-3.5 h-3.5 text-[#75686C] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {/* Grid Display Ikon (Kapasitas Grid diperbesar) */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-1.5 bg-white border border-[#EFE3E6] rounded-[4px]">
        {displayIcons.map((iconId) => {
          const isSelected = selectedIcon === iconId;
          return (
            <button
              key={iconId}
              type="button"
              onClick={() => onSelectIcon(iconId)}
              className={`p-2 rounded-[3px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-[var(--theme-primary-light)] ring-1 ring-[var(--theme-primary)] text-[var(--theme-accent)] shadow-2xs"
                  : "hover:bg-[#FAF6F7] text-[#75686C] hover:text-[#2C2528]"
              }`}
              title={iconId}
            >
              <Icon icon={iconId} className="w-4.5 h-4.5 shrink-0" />
            </button>
          );
        })}

        {!isSearchingApi && displayIcons.length === 0 && (
          <div className="col-span-full py-4 text-center text-xs text-[#75686C]">
            Tidak ditemukan ikon untuk &quot;{searchTerm}&quot;. Coba kata kunci
            lain dalam Bahasa Inggris (misal: <i>bag, skincare, dress</i>).
          </div>
        )}
      </div>

      {/* Input manual identifier */}
      <div className="pt-1 border-t border-[#F6ECEE] flex items-center gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Atau ketik nama Iconify (contoh: ph:bag-thin, mdi:heart)..."
          className="flex-1 px-2.5 py-1 text-[11px] font-mono border border-[#EFE3E6] rounded-[4px] bg-white text-[#2C2528] focus:outline-hidden focus:border-[var(--theme-primary)]"
        />
        <button
          type="button"
          onClick={handleApplyCustom}
          disabled={!customInput.trim()}
          className="px-2.5 py-1 text-[11px] font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] disabled:opacity-40 rounded-[4px] transition-colors cursor-pointer"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
};

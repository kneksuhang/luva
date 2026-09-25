import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Palette, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  FileText, 
  FileSpreadsheet, 
  FileCode 
} from 'lucide-react';
import { DENTO_IRO_PALETTES } from '../../../lib/constants';
import { useThemeStore } from '../../../store/useThemeStore';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { formatRupiah } from '../../../lib/utils';

interface SettingsDashboardProps {
  onOpenResetModal: () => void;
}

export const SettingsDashboard: React.FC<SettingsDashboardProps> = ({
  onOpenResetModal,
}) => {
  const { currentPaletteId, setPalette } = useThemeStore();
  const { products, categories, tags, importData } = useWishlistStore();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  // 1. Export to JSON
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      products,
      categories,
      tags,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `luva_wishlist_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2. Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Produk', 'Harga', 'Kategori', 'Tags', 'Arsip', 'Dibuat'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.price,
      `"${(p.category_name || '').replace(/"/g, '""')}"`,
      `"${p.tags.join(', ')}"`,
      p.is_archived ? 'Ya' : 'Tidak',
      p.created_at,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `luva_wishlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // 3. Export to Excel (XLSX via SheetJS)
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Products
    const productData = products.map((p) => ({
      'Nama Produk': p.name,
      'Harga (Rp)': p.price,
      'Kategori': p.category_name || '-',
      'Tag Label': p.tags.join(', '),
      'Status': p.is_archived ? 'Arsip' : 'Aktif',
      'Prioritas': p.priority || 'medium',
      'Deskripsi': p.description || '',
      'Tanggal Dibuat': p.created_at,
    }));
    const productSheet = XLSX.utils.json_to_sheet(productData);
    XLSX.utils.book_append_sheet(workbook, productSheet, 'Produk');

    // Sheet 2: Categories
    const categoryData = categories.map((c) => ({
      'Nama Kategori': c.name,
      'Deskripsi': c.description || '-',
      'Warna': c.color || '#E87A90',
    }));
    const categorySheet = XLSX.utils.json_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Kategori');

    // Sheet 3: Tags
    const tagData = tags.map((t) => ({
      'Nama Tag': t.name,
      'Warna': t.color || '#75686C',
    }));
    const tagSheet = XLSX.utils.json_to_sheet(tagData);
    XLSX.utils.book_append_sheet(workbook, tagSheet, 'Tag');

    XLSX.writeFile(workbook, `luva_wishlist_${Date.now()}.xlsx`);
  };

  // 4. Export to PDF (jsPDF with AutoTable)
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Title & Header
    doc.setFontSize(16);
    doc.setTextColor(44, 37, 40);
    doc.text('Luva - Laporan Wishlist Pribadi', 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(117, 104, 108);
    doc.text(`Diekspor pada: ${new Date().toLocaleDateString('id-ID')} | Total: ${products.length} produk`, 14, 24);

    // Products table
    const tableRows = products.map((p, idx) => [
      idx + 1,
      p.name,
      p.category_name || '-',
      p.tags.join(', ') || '-',
      formatRupiah(p.price),
      p.is_archived ? 'Arsip' : 'Aktif',
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['No', 'Nama Produk', 'Kategori', 'Tag', 'Harga', 'Status']],
      body: tableRows,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        textColor: [44, 37, 40],
      },
      headStyles: {
        fillColor: [250, 246, 247],
        textColor: [117, 104, 108],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [254, 253, 254],
      },
    });

    doc.save(`luva_wishlist_${Date.now()}.pdf`);
  };

  // Import JSON File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed.products) || Array.isArray(parsed.categories)) {
          await importData({
            products: parsed.products,
            categories: parsed.categories,
            tags: parsed.tags,
          });
          setImportStatus('Data berhasil diimpor!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Format berkas JSON tidak valid.');
        }
      } catch {
        setImportStatus('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-[#EFE3E6]">
        <h2 className="text-base font-bold text-[#2C2528] tracking-tight">
          Pengaturan & Kustomisasi
        </h2>
        <p className="text-xs text-[#75686C]">
          Kelola estetika warna tradisional Jepang, ekspor/impor data, dan koneksi Supabase.
        </p>
      </div>

      {/* 1. Dento-iro Palette Customization */}
      <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F6ECEE]">
          <Palette className="w-4 h-4 text-[var(--theme-primary)]" />
          <h3 className="text-sm font-bold text-[#2C2528]">
            Palet Warna Estetika Tradisional Jepang (Dento-iro Palette · 伝統色)
          </h3>
        </div>
        <p className="text-xs text-[#75686C] leading-relaxed">
          Pilih suasana warna tradisional Jepang khusus wanita yang anggun, tenang, dan tidak menyilaukan mata. Setiap palet mewakili filosofi luhur alam dan ketenangan hidup.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-1">
          {DENTO_IRO_PALETTES.map((palette) => {
            const isSelected = currentPaletteId === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setPalette(palette.id)}
                className={`p-3.5 rounded-[4px] border text-left transition-all relative flex flex-col justify-between wabi-card ${
                  isSelected
                    ? 'border-[var(--theme-primary)] bg-[var(--theme-primary-light)] ring-1 ring-[var(--theme-primary)]'
                    : 'border-[#EFE3E6] bg-white hover:border-[#D9C4CA]'
                }`}
              >
                <div>
                  {/* Top Bar with Authentic Kanji Stamp/Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* Color Preview Swatch */}
                      <span
                        className="w-4 h-4 rounded-[3px] border border-black/10 inline-block shrink-0 shadow-2xs"
                        style={{ backgroundColor: palette.primaryColor }}
                      />
                      <div>
                        <span className="text-xs font-bold text-[#2C2528] block leading-tight">
                          {palette.name}
                        </span>
                        <span className="text-[10px] text-[#75686C] font-normal">
                          {palette.japaneseName}
                        </span>
                      </div>
                    </div>

                    {/* Authentic Kanji Badge (Hanko style) */}
                    <div
                      className="w-7 h-7 rounded-[3px] border flex items-center justify-center font-bold text-xs select-none shadow-2xs shrink-0"
                      style={{
                        borderColor: palette.primaryColor,
                        color: palette.primaryColor,
                        backgroundColor: palette.bgColor,
                      }}
                      title={`${palette.kanji} - ${palette.philosophy}`}
                    >
                      {palette.character || palette.kanji[0]}
                    </div>
                  </div>

                  {/* Philosophy & Meaning Tag */}
                  <div className="mb-2 p-1.5 bg-[#FAF6F7] border border-[#F6ECEE] rounded-[3px]">
                    <span className="text-[10px] font-semibold text-[var(--theme-accent)] block truncate">
                      {palette.philosophy}
                    </span>
                    <span className="text-[9.5px] text-[#75686C] block leading-snug line-clamp-2 mt-0.5">
                      {palette.meaning}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#75686C] line-clamp-2 leading-relaxed">
                    {palette.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[#F6ECEE] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#75686C]">
                    {palette.primaryColor}
                  </span>
                  {isSelected ? (
                    <div className="text-[10px] font-semibold text-[var(--theme-accent)] flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Aktif</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#75686C] hover:text-[#2C2528]">
                      Pilih
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Export & Import Data Section */}
      <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F6ECEE]">
          <Download className="w-4 h-4 text-[var(--theme-primary)]" />
          <h3 className="text-sm font-bold text-[#2C2528]">
            Ekspor & Impor Data Wishlist
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#2C2528]">
              Cadangkan & Unduh Berkas:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportJSON}
                className="p-2.5 border border-[#EFE3E6] rounded-[4px] hover:bg-[#FAF6F7] text-left transition-colors group flex items-center gap-2"
              >
                <FileCode className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                <div>
                  <span className="text-xs font-medium text-[#2C2528] block">Format JSON</span>
                  <span className="text-[10px] text-[#75686C]">Struktur lengkap</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="p-2.5 border border-[#EFE3E6] rounded-[4px] hover:bg-[#FAF6F7] text-left transition-colors group flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                <div>
                  <span className="text-xs font-medium text-[#2C2528] block">Format CSV</span>
                  <span className="text-[10px] text-[#75686C]">Tabel universal</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportExcel}
                className="p-2.5 border border-[#EFE3E6] rounded-[4px] hover:bg-[#FAF6F7] text-left transition-colors group flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                <div>
                  <span className="text-xs font-medium text-[#2C2528] block">Format Excel</span>
                  <span className="text-[10px] text-[#75686C]">File .XLSX</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="p-2.5 border border-[#EFE3E6] rounded-[4px] hover:bg-[#FAF6F7] text-left transition-colors group flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#C8556D] shrink-0" />
                <div>
                  <span className="text-xs font-medium text-[#2C2528] block">Dokumen PDF</span>
                  <span className="text-[10px] text-[#75686C]">Cetak rapi</span>
                </div>
              </button>
            </div>
          </div>

          {/* Import JSON */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#2C2528]">
              Impor Cadangan Data (JSON):
            </h4>
            <div className="border border-dashed border-[#EFE3E6] rounded-[4px] p-4 text-center space-y-2 bg-[#FAF6F7]/40">
              <Upload className="w-6 h-6 text-[#75686C] mx-auto stroke-1" />
              <p className="text-[11px] text-[#75686C]">
                Pilih berkas format .JSON yang sebelumnya diekspor dari Luva.
              </p>
              <label className="inline-block cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <span className="px-3 py-1.5 text-xs font-medium text-[var(--theme-accent)] bg-white border border-[#EFE3E6] rounded-[4px] hover:bg-[#FAF6F7] transition-colors inline-block">
                  Pilih Berkas JSON
                </span>
              </label>

              {importStatus && (
                <p className="text-xs text-[var(--theme-primary)] font-medium mt-1">
                  {importStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reset Data Section (Module 5) */}
      <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#C8556D] flex items-center gap-1.5">
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Database (Reset Data)</span>
          </h3>
          <p className="text-xs text-[#75686C] mt-0.5">
            Buka modal pengaturan untuk memilih pengosongan produk saja, kategori saja, tag saja, atau seluruhnya.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenResetModal}
          className="px-3.5 py-1.5 text-xs font-medium text-[#C8556D] hover:bg-[#FCF2F4] border border-[#F2D7DC] rounded-[4px] transition-colors shrink-0"
        >
          Buka Modal Reset
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Package, FolderTree, Tag as TagIcon, TrendingUp } from 'lucide-react';
import { Product, Category, Tag } from '../../../types';
import { formatRupiah } from '../../../lib/utils';

// Helper Function: Konversi Angka ke Terbilang Bahasa Indonesia
function terbilangIndo(nominal: number): string {
  if (nominal === 0) return 'Nol Rupiah';
  if (nominal < 0) return 'Minus ' + terbilangIndo(Math.abs(nominal));

  const angka = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function konversi(n: number): string {
    if (n < 12) return angka[n];
    if (n < 20) return konversi(n - 10) + ' Belas';
    if (n < 100) return konversi(Math.floor(n / 10)) + ' Puluh ' + konversi(n % 10);
    if (n < 200) return 'Seratus ' + konversi(n - 100);
    if (n < 1000) return konversi(Math.floor(n / 100)) + ' Ratus ' + konversi(n % 100);
    if (n < 2000) return 'Seribu ' + konversi(n - 1000);
    if (n < 1000000) return konversi(Math.floor(n / 1000)) + ' Ribu ' + konversi(n % 1000);
    if (n < 1000000000) return konversi(Math.floor(n / 1000000)) + ' Juta ' + konversi(n % 1000000);
    if (n < 1000000000000) return konversi(Math.floor(n / 1000000000)) + ' Miliar ' + konversi(n % 1000000000);
    if (n < 1000000000000000) return konversi(Math.floor(n / 1000000000000)) + ' Triliun ' + konversi(n % 1000000000000);
    return '';
  }

  return (konversi(Math.floor(nominal)).trim() + ' Rupiah').replace(/\s+/g, ' ');
}

interface SummaryDashboardProps {
  products: Product[];
  categories: Category[];
  tags: Tag[];
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  products,
  categories,
  tags,
}) => {
  const activeProducts = products.filter((p) => !p.is_archived);
  const totalValue = activeProducts.reduce((sum, p) => sum + p.price, 0);

  // 1. Data for Bar Chart: Jumlah Produk per Kategori
  const categoryProductData = categories.map((cat) => {
    const count = activeProducts.filter((p) => p.category_id === cat.id).length;
    const catTotal = activeProducts
      .filter((p) => p.category_id === cat.id)
      .reduce((sum, p) => sum + p.price, 0);

    return {
      name: cat.name,
      jumlah: count,
      totalHarga: catTotal,
      color: cat.color || '#E87A90',
    };
  });

  // 2. Data for Pie Chart: Distribusi Nilai Belanja berdasarkan Kategori
  const pieData = categoryProductData.filter((d) => d.totalHarga > 0);

  // 3. Data for Line Chart: Akumulasi Nilai Produk / Timeline Trend
  const sortedProducts = [...activeProducts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let cumulativePrice = 0;
  const lineData = sortedProducts.map((p, idx) => {
    cumulativePrice += p.price;
    return {
      index: idx + 1,
      nama: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
      nilai: p.price,
      akumulasi: cumulativePrice,
    };
  });

  // 4. Data for Tag Bar Chart
  const tagCountData = tags.map((t) => {
    const count = activeProducts.filter((p) => p.tags.includes(t.name)).length;
    return {
      name: `#${t.name}`,
      jumlah: count,
      color: t.color || '#75686C',
    };
  }).sort((a, b) => b.jumlah - a.jumlah);

  const DENTO_COLORS = [
    '#E87A90',
    '#EE7989',
    '#8B81C3',
    '#5BA983',
    '#CA7853',
    '#897858',
    '#F4A7B9',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-[#EFE3E6]">
        <h2 className="text-base font-bold text-[#2C2528] tracking-tight">
          Ringkasan & Analitik Wishlist
        </h2>
        <p className="text-xs text-[#75686C]">
          Visualisasi data interaktif untuk memantau sebaran keinginan, estimasi finansial, dan kategori impian.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Products */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[#75686C]">
            <span className="text-[11px] font-medium">Jumlah Produk</span>
            <Package className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
          </div>
          <p className="font-sora text-xl sm:text-2xl font-bold text-[#2C2528]">
            {activeProducts.length}
          </p>
          <span className="text-[10px] text-[#75686C] block">
            Barang aktif dalam wishlist
          </span>
        </div>

        {/* Total Price (Dengan Terbilang) */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[#75686C]">
            <span className="text-[11px] font-medium">Total Estimasi Harga</span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
          </div>
          <p className="font-sora text-base sm:text-xl font-bold text-[#2C2528] truncate">
            {formatRupiah(totalValue)}
          </p>
          {/* Format UI Terbilang Ditambahkan Di Sini */}
          <span className="text-[10px] font-medium text-[var(--theme-primary)] block italic truncate">
            &quot;{terbilangIndo(totalValue)}&quot;
          </span>
        </div>

        {/* Total Categories */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[#75686C]">
            <span className="text-[11px] font-medium">Total Kategori</span>
            <FolderTree className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
          </div>
          <p className="font-sora text-xl sm:text-2xl font-bold text-[#2C2528]">
            {categories.length}
          </p>
          <span className="text-[10px] text-[#75686C] block">
            Kelompok minat tersusun
          </span>
        </div>

        {/* Total Tags */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[#75686C]">
            <span className="text-[11px] font-medium">Total Tag Label</span>
            <TagIcon className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
          </div>
          <p className="font-sora text-xl sm:text-2xl font-bold text-[#2C2528]">
            {tags.length}
          </p>
          <span className="text-[10px] text-[#75686C] block">
            Label penanda terdaftar
          </span>
        </div>
      </div>

      {/* Row 1: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart: Jumlah Produk per Kategori */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#F6ECEE] pb-2">
            <h3 className="text-xs font-bold text-[#2C2528]">
              Jumlah Produk per Kategori (Bar Chart)
            </h3>
            <span className="text-[10px] text-[#75686C]">Satuan Item</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryProductData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8EA" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#75686C', fontSize: 10 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#75686C', fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val ?? 0} Produk`, 'Jumlah']}
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #EFE3E6',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="jumlah" fill="var(--theme-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Proporsi Nilai per Kategori */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#F6ECEE] pb-2">
            <h3 className="text-xs font-bold text-[#2C2528]">
              Proporsi Nilai per Kategori (Pie Chart)
            </h3>
            <span className="text-[10px] text-[#75686C]">Persentase Nominal</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center text-xs">
            {pieData.length === 0 ? (
              <p className="text-xs text-[#75686C]">Belum ada data harga produk.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="totalHarga"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DENTO_COLORS[index % DENTO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val) || 0), 'Total']}
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #EFE3E6',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => <span className="text-[10px] text-[#75686C]">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Line Chart & Tag Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart: Akumulasi Nilai Keinginan */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#F6ECEE] pb-2">
            <h3 className="text-xs font-bold text-[#2C2528]">
              Tren Akumulasi Anggaran (Line Chart)
            </h3>
            <span className="text-[10px] text-[#75686C]">Rupiah (Rp)</span>
          </div>

          <div className="h-64 w-full text-xs">
            {lineData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#75686C]">
                Belum ada data produk
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E8EA" vertical={false} />
                  <XAxis 
                    dataKey="index" 
                    tick={{ fill: '#75686C', fontSize: 10 }}
                    label={{ value: 'Urutan Produk', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#75686C' }}
                  />
                  <YAxis 
                    tick={{ fill: '#75686C', fontSize: 10 }}
                    tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}jt`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val) || 0), 'Akumulasi']}
                    labelFormatter={(idx) => `Produk ke-${idx}`}
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #EFE3E6',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="akumulasi" 
                    stroke="var(--theme-primary)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--theme-primary)', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tag Frequency Bar Distribution */}
        <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#F6ECEE] pb-2">
            <h3 className="text-xs font-bold text-[#2C2528]">
              Sebaran Produk Berdasarkan Tag (Bar Chart)
            </h3>
            <span className="text-[10px] text-[#75686C]">Popularitas Label</span>
          </div>

          <div className="h-64 w-full text-xs">
            {tagCountData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#75686C]">
                Belum ada tag yang digunakan
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tagCountData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E8EA" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#75686C', fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#75686C', fontSize: 10 }} width={90} />
                  <Tooltip
                    formatter={(val: any) => [`${val ?? 0} Produk`, 'Tag Digunakan']}
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #EFE3E6',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="jumlah" fill="#8B81C3" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
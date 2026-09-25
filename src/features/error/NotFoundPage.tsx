import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-8 sm:p-14 text-center max-w-md mx-auto my-12 space-y-4">
      <div className="w-14 h-14 bg-[#FAF6F7] border border-[#EFE3E6] rounded-[4px] flex items-center justify-center mx-auto text-[#75686C]">
        <HelpCircle className="w-7 h-7 stroke-1 text-[var(--theme-primary)]" />
      </div>
      <div>
        <span className="font-sora text-2xl sm:text-3xl font-bold text-[#2C2528] block mb-1">
          404
        </span>
        <h2 className="text-sm font-semibold text-[#2C2528]">
          Halaman Tidak Ditemukan · ページが見つかりません
        </h2>
        <p className="text-xs text-[#75686C] mt-1.5 leading-relaxed">
          Tampaknya tautan atau rute yang Anda tuju belum terdaftar atau telah dipindahkan.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onGoHome}
          className="px-4 py-2 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-[4px] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Wishlist</span>
        </button>
      </div>
    </div>
  );
};

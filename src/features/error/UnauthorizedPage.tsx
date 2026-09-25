import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface UnauthorizedPageProps {
  onGoHome: () => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ onGoHome }) => {
  return (
    <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-8 sm:p-14 text-center max-w-md mx-auto my-12 space-y-4">
      <div className="w-14 h-14 bg-[#FCF2F4] border border-[#F2D7DC] rounded-[4px] flex items-center justify-center mx-auto text-[#C8556D]">
        <Lock className="w-7 h-7 stroke-1" />
      </div>
      <div>
        <span className="font-sora text-2xl sm:text-3xl font-bold text-[#C8556D] block mb-1">
          401
        </span>
        <h2 className="text-sm font-semibold text-[#2C2528]">
          Akses Tidak Dibenarkan · アクセス制限
        </h2>
        <p className="text-xs text-[#75686C] mt-1.5 leading-relaxed">
          Anda tidak memiliki izin untuk mengakses sumber daya ini atau sesi Anda tidak sah.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onGoHome}
          className="px-4 py-2 text-xs font-medium text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-[4px] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  );
};

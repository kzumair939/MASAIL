import { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  placeholder?: string;
}

export function ImageFileUpload({ label, value, onChange, placeholder }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange(dataUrl);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-bold text-slate-700">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group h-36">
          <img src={value} alt="Uploaded site photo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-bold hover:bg-white transition-colors"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Check size={12} /> Image Uploaded
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px]"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-1" />
          ) : (
            <UploadCloud size={28} className="text-blue-500 mb-1" />
          )}
          <p className="text-xs font-semibold text-slate-700">Click to upload photo file</p>
          <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import { UploadCloud, X, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MultiImageUploadProps {
  label?: string;
  images: string[];
  maxImages?: number;
  onChange: (images: string[]) => void;
}

export function MultiImageFileUpload({
  label = '📷 Upload Site Photos (Up to 10 photos)',
  images = [],
  maxImages = 10,
  onChange,
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    setLoading(true);
    let processed = 0;
    const newResults: string[] = [];

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) newResults.push(dataUrl);
        processed++;
        if (processed === filesToProcess.length) {
          onChange([...images, ...newResults]);
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <span className="text-[11px] font-semibold text-slate-400">
          {images.length} / {maxImages} photos uploaded
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Grid of uploaded thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        <AnimatePresence>
          {images.map((imgUrl, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-xs"
            >
              <img src={imgUrl} alt={`Uploaded ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                  title="Remove photo"
                >
                  <X size={16} />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                #{i + 1}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud size={24} className="text-blue-500 mb-1" />
            )}
            <span className="text-[11px] font-bold text-slate-700">Add Photo</span>
            <span className="text-[9px] text-slate-400">Max {maxImages}</span>
          </div>
        )}
      </div>
    </div>
  );
}

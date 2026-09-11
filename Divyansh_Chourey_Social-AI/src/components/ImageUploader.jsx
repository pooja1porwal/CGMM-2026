import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const ImageUploader = ({ value, onChange, error }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const handleFile = (file) => {
    setUploadError(null);
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      setUploadError('Please upload a valid PNG, JPG, or WEBP image.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({
      file,
      previewUrl,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (value?.previewUrl) {
      URL.revokeObjectURL(value.previewUrl);
    }
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleInputChange}
        id="product-image-input"
        aria-label="Upload Product Image"
      />

      {!value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-950/40 shadow-glow'
              : 'border-slate-700 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all text-indigo-400">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-base font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
            <span>Upload Product Image</span>
          </h4>
          <p className="text-xs text-slate-400 mb-3">PNG, JPG or WEBP (Max 10MB)</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 group-hover:border-indigo-500/40">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Click or drag and drop image</span>
          </span>
        </div>
      ) : (
        <div className="relative rounded-2xl border border-slate-700 bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview Container */}
            <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center group">
              <img
                src={value.previewUrl}
                alt="Product preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-slate-800/90 rounded-md hover:bg-slate-700 border border-slate-600"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 w-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Image uploaded successfully</span>
                </div>
                <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-sm">
                  {value.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{value.size}</p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors font-medium"
                >
                  Replace image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors font-medium"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(uploadError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}
    </div>
  );
};

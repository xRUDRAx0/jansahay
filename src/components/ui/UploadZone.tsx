"use client";

import React, { useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function UploadZone({ onFilesSelected, accept, maxSize, className }: UploadZoneProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-[#1a56db] transition-colors cursor-pointer group ${className || ''}`}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        multiple
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
      />
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1a56db] mb-4 group-hover:scale-110 transition-transform">
        <UploadCloud className="w-6 h-6" />
      </div>
      <p className="text-gray-700 font-medium text-center">
        Drop documents here or <span className="text-[#1a56db]">Browse Files</span>
      </p>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Supports PDF, JPEG, PNG {maxSize ? `up to ${maxSize}MB` : ''}
      </p>
    </div>
  );
}

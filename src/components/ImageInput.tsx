"use client";

import { forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ImageUpIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPE } from "@/core/constants/Image";

type OmitValue = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

interface ImageUploadInputProps extends OmitValue {
  label?: string;
  errors?: string;
  className?: string;
  multiple?: boolean;
  value?: File[];                          
  onChange?: (files: File[]) => void;      
}

export const ImageUploadInput = forwardRef<
  HTMLInputElement,
  ImageUploadInputProps
>(({ label, errors, className, value = [], multiple, onChange, ...rest }, ref) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      const validType = ACCEPTED_IMAGE_TYPE.includes(file.type);
      const validSize = file.size <= MAX_IMAGE_SIZE;
      return validType && validSize;
    });

    if (validFiles.length === 0) return;

    if (multiple) {
      onChange?.([...value, ...validFiles]);
    } else {
      onChange?.([validFiles[0]]);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {label && <label>{label}</label>}

      <div
        className={twMerge(
          "relative flex min-h-52 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-white p-3",
          errors ? "border-red-600" : "border-secondary-light",
          className
        )}
        onClick={() => {
          const input = document.getElementById(rest.id || "image-upload-input");
          input?.click();
        }}
      >
        <input
          id={rest.id || "image-upload-input"}
          type="file"
          accept={ACCEPTED_IMAGE_TYPE.join(",")}
          className="hidden"
          onChange={handleSelectFile}
          multiple={multiple}
          ref={ref}
          {...rest}
        />

        {/* preview */}
        {previews.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 w-full">
            {previews.map((src, i) => (
              <div key={i} className="relative w-full h-32 rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(i);
                  }}
                  className="absolute top-1 right-1 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div className="mb-2 flex size-11 items-center justify-center rounded-full border">
              <ImageUpIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Clique para selecionar</p>
            <p className="text-muted-foreground text-xs">
              Máximo 5MB • JPG/PNG/WEBP
            </p>
          </div>
        )}
      </div>

      {errors && <span className="text-sm text-red-600">{errors}</span>}
    </div>
  );
});

ImageUploadInput.displayName = "ImageUploadInput";

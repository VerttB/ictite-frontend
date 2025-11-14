"use client";
import Image from "next/image";
import { Plus } from "lucide-react";

type CardProps = {
  title?: string;
  image?: string;
  onClick?: () => void;
  isAddButton?: boolean;
};

export const CardGenerico = ({ title, image, onClick, isAddButton }: CardProps) => {
  if (isAddButton) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center w-32 h-32 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
      >
        <Plus className="w-10 h-10 text-black" />
      </button>
    );
  }

  return (
    <div className="relative w-32 h-32 rounded-md overflow-hidden shadow-sm group cursor-pointer">
      {image && (
        <Image
          src={image}
          alt={title ?? "Card"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      )}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm text-center py-1">
          {title}
        </div>
      )}
    </div>
  );
};

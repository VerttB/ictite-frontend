"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
type CardProps = {
  title?: string;
  image?: string;
  onClick?: () => void;
  isAddButton?: boolean;
};

export const CardGenerico = ({ title, image, onClick, isAddButton }: CardProps) => {
  if (isAddButton) {
    return (
      <Button
        onClick={onClick}
        className="flex items-center justify-center w-40 h-40 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">
        <Plus className="size-16 font-light text-primary" />
      </Button>
    );
  }

  return (
    <div 
        style={{boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}
        className="relative w-40 h-40 rounded-md overflow-hidden shadow-xs group cursor-pointer">
      {image && (
        <Image
          src={image}
          alt={title ?? "Card"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      )}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-background/70 text-font-primary text-sm text-center py-2">
          {title}
        </div>
      )}
    </div>
  );
};

"use client";

import { Button } from "@/components/ui/button";

import delays from "./utils";

interface CategorySelectorProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const onCategoryChangeEvent = (category: string) => () =>
    onCategoryChange(category);

  return (
    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
      {categories.map((category, index) => (
        <Button
          size="sm"
          className={`animate-fade-right ${delays[index]}`}
          key={`category-${category}`}
          onClick={onCategoryChangeEvent(category)}
          variant={activeCategory === category ? "default" : "outline"}
        >
          {category === "MAYOR" ? "Mayor" : `Categoría ${category}`}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelector;

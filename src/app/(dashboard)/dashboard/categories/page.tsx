import { getAllCategories } from "@/lib/data/dashboard";
import { CategoriesManager } from "@/components/sections/categories-manager";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return <CategoriesManager categories={categories} />;
}

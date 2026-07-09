import { getAllProducts, getActiveCategories } from "@/lib/data/dashboard";
import { ProductsManager } from "@/components/sections/products-manager";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getActiveCategories(),
  ]);

  return <ProductsManager products={products} categories={categories} />;
}

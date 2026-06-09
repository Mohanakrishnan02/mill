import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-[#5d3a1a]" style={{ fontFamily: "var(--font-yeseva)" }}>
        Traditional Rice Varieties
      </h1>
      <p className="mt-1 text-stone-500">
        {products.length} heritage varieties — cart saved automatically · Online payment only (No COD)
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

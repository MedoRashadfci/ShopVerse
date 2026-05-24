import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";

// Fetch products directly on the server component
async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  // Convert searchParams to URL query string
  const urlParams = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => urlParams.append(key, v));
      } else {
        urlParams.append(key, value);
      }
    }
  });

  try {
    const res = await fetch(`http://localhost:5000/api/products?${urlParams.toString()}`, {
      cache: 'no-store', // ensures fresh data always since it has filters
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [], pagination: {} };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const result = await getProducts(resolvedParams);
  const products = result.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">All Products</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Browse our collection of premium tech</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search term to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

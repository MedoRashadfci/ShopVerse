import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      next: { revalidate: 60 } // revalidate every minute
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | ShopVerse`,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors duration-300">
        <div className="flex flex-col md:flex-row">
          
          {/* Product Image */}
          <div className="w-full md:w-1/2 relative bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 flex items-center justify-center min-h-[400px] transition-colors duration-300">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={product.image || "/placeholder.jpg"}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {product.stock <= 0 && (
              <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm uppercase">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                {product.category?.name || "Category"}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {formatPrice(product.price)}
            </div>
            
            <div className="prose prose-slate dark:prose-invert mb-8 text-slate-600 dark:text-slate-300">
              <p>{product.description}</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-8 mt-auto">
              {/* Client Component for interactive Add to Cart */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

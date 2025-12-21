
import React from 'react';
import { useParams } from 'react-router-dom';
import { Product, CategoryType } from '../types';
import ProductCard from '../components/ProductCard';

interface CategoryProps {
  products: Product[];
  addToCart: (p: Product) => void;
}

const Category: React.FC<CategoryProps> = ({ products, addToCart }) => {
  const { cat } = useParams<{ cat: string }>();
  const filteredProducts = products.filter(p => p.category === cat);

  return (
    <div className="space-y-8">
      <div className="bg-gray-100 py-12 px-8 rounded-3xl">
        <h1 className="text-4xl font-extrabold">{cat}</h1>
        <p className="text-gray-500 mt-2">عرض جميع المنتجات في قسم {cat}</p>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
          <p className="text-gray-400">لا توجد منتجات حالياً في هذا القسم</p>
        </div>
      )}
    </div>
  );
};

export default Category;

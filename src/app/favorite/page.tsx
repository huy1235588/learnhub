import { ProductList } from '@/components/product/ProductList';

export default function FavoritesPage() {
    return (
        <div className='min-h-screen bg-background'>
            <h1 className='text-3xl font-bold text-center my-8'>Sản phẩm yêu thích</h1>
            <ProductList apiUrl={'/api/favorites'} />
        </div>
    );
}

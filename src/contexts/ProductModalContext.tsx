'use client';

import { ProductModal } from '@/components/product/ProductModal'; // Assuming you move ProductModal.tsx to components/modals/
import { Product } from '@/types/product';
import { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of the data and functions the context will provide.
interface ProductModalContextType {
    openModal: (product: Product) => void;
    closeModal: () => void;
}

// Create the context with an initial null value.
const ProductModalContext = createContext<ProductModalContextType | null>(null);

// Create the Provider component.
export function ProductModalProvider({ children }: { children: ReactNode }) {
    // State to hold the product data for the modal. `null` means the modal is closed.
    const [product, setProduct] = useState<Product | null>(null);

    // Function to open the modal with a specific product.
    const openModal = (productData: Product) => {
        setProduct(productData);
    };

    // Function to close the modal by clearing the product data.
    const closeModal = () => {
        setProduct(null);
    };

    // The value passed down by the provider includes the functions components can call.
    const value = { openModal, closeModal };

    return (
        <ProductModalContext.Provider value={value}>
            {children}
            {/* Render the actual modal component here.
        It's controlled by the state within this provider.
        The `isOpen` prop is true whenever `product` is not null.
      */}
            <ProductModal product={product} isOpen={!!product} onClose={closeModal} />
        </ProductModalContext.Provider>
    );
}

// Create the custom hook for easy consumption.
export function useProductModal() {
    const context = useContext(ProductModalContext);
    if (!context) {
        // This error is helpful for developers to ensure they wrap their app in the provider.
        throw new Error('useProductModal must be used within a ProductModalProvider');
    }
    return context;
}

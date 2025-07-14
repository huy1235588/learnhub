export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    description: string;
    fullDescription: string;
    instructor: {
        name: string;
        avatar: string;
        bio: string;
    };
    rating: number;
    reviewCount: number;
    category: string;
    duration: string;
    tags: string[];
    isFavorite: boolean;
    students: number;
    lastUpdated: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface ProductListProps {
    products: Product[];
    loading?: boolean;
    onProductClick: (product: Product) => void;
    onFavoriteToggle: (productId: string) => void;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    infiniteScroll?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

export interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    product: Product;
    onClick: (product: Product) => void;
    onFavoriteToggle: (productId: string) => void;
}

export interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onFavoriteToggle: (productId: string) => void;
}

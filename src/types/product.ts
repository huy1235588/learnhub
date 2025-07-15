export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    description: string;
    fullDescription: string;
    instructor: Instructor;
    rating: number;
    reviewCount: number;
    category: string;
    duration: string;
    tags: string[];
    students: number;
    lastUpdated: string;
    reviews?: Review[];
}

export interface Review {
    id: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Instructor {
    name: string;
    avatar: string;
    bio: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

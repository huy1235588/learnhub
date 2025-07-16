import { useFavorites } from '@/hooks/useFavorites'; // Giả sử bạn chuyển hook vào thư mục hooks
import { createContext, ReactNode, useContext } from 'react';

type FavoritesContextType = ReturnType<typeof useFavorites>;

const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
    children: ReactNode;
}

/** * FavoritesProvider component to provide favorites state and actions to the component tree.
 * It uses the useFavorites hook to manage the favorites state.
 * @param {ReactNode} children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The FavoritesContext provider wrapping the children.
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
    const favoritesData = useFavorites();

    return <FavoritesContext.Provider value={favoritesData}>{children}</FavoritesContext.Provider>;
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }

    return context;
};

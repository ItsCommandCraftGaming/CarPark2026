import { useState, useEffect, type PropsWithChildren } from "react";
import type { Car } from "../models/car";
import { FavoritesContext, type FavoritesContextType } from "./FavoritesContext";
import { getFavorites, createFavorite, deleteFavorite } from "../data/favorites";

export function FavoritesProvider({ children }: PropsWithChildren) {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favs = await getFavorites();
                setFavorites(favs.map(f => f.vin));
            } catch (err) {
                console.error("Error fetching favorites:", err);
            }
        };
        fetchFavorites();
    }, []);

    const toggleFavorite = async (car: Car) => {
        const isFav = favorites.includes(car.vin);
        try {
            if (isFav) {
                await deleteFavorite({ vin: car.vin });
                setFavorites(prev => prev.filter(vin => vin !== car.vin));
            } else {
                await createFavorite({ vin: car.vin });
                setFavorites(prev => [...prev, car.vin]);
            }
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    const isFavorite = (car: Car) => {
        return favorites.includes(car.vin);
    };

    const context: FavoritesContextType = {
        favorites,
        toggleFavorite,
        isFavorite
    };

    return (
        <FavoritesContext.Provider value={context}>
            {children}
        </FavoritesContext.Provider>
    );
}

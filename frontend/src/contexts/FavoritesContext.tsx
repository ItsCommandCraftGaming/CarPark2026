import { createContext } from "react";
import type { Car } from "../models/car";

export type FavoritesContextType = {
    favorites: string[]; // Array of VINs
    toggleFavorite: (car: Car) => Promise<void>;
    isFavorite: (car: Car) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

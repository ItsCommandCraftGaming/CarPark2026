import { createContext } from "react";
import type { Car } from "../models/car";

export type BasketContextType = {
    basketItems: Car[];
    isLoading: boolean;
    isError: boolean;
    addToBasket: (car: Car) => Promise<void>;
    removeFromBasket: (vin: string) => Promise<void>;
    isItemInBasket: (vin: string) => boolean;
}

export const BasketContext = createContext<BasketContextType | undefined>(undefined);

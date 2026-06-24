import { createContext } from "react";
import type { Car } from "../models/car";

export type CarListContextType = {
    carsList: Car[];
    isError: boolean;
    isLoading: boolean;
    totalPages: number;
    total: number;
}

export const CarListContext = createContext<CarListContextType | undefined>(undefined)

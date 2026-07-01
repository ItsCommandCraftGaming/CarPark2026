import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Car } from "../models/car";

export type SortOrder = "asc" | "desc";

export type Filters = {
    search?: string
    manufacturer: string
    constructionYearFrom?: string
    constructionYearTo?: string
    priceFrom?: string
    priceTo?: string
}

export type FiltersContextType = {
    filters: Filters;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    sort: keyof Car | "";
    setSort: Dispatch<SetStateAction<keyof Car | "">>;
    order: SortOrder;
    setOrder: Dispatch<SetStateAction<SortOrder>>;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    updateFilter: (field: keyof Filters, value: string) => void;
    resetFilters: () => void;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

import { createContext, type Dispatch, type SetStateAction } from "react";

export type Filters = {
    manufacturer: string
}

export type FiltersContextType = {
    filters: Filters;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    updateFilter: (field: keyof Filters, value: string) => void;
    resetFilters: () => void;
    showFavoritesOnly: boolean;
    handleFavoritesToggle: (checked: boolean) => void;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

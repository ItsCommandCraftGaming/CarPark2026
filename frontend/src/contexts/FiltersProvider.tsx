
import { useState } from "react";
import type { PropsWithChildren } from "react";
import type { Filters, FiltersContextType, SortOrder } from "./FiltersContext";
import { FiltersContext } from "./FiltersContext";
import type { Car } from "../models/car";

const defaultFilters: Filters = {
    manufacturer: "",
    search: "",
    constructionYearFrom: "",
    constructionYearTo: "",
    priceFrom: "",
    priceTo: "",
}

export function FiltersProvider({ children }: PropsWithChildren) {
    const [filters, setFilters] = useState<Filters>(defaultFilters)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(20)
    const [sort, setSort] = useState<keyof Car | "">("")
    const [order, setOrder] = useState<SortOrder>("asc")

    const updateFilter = (field: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }))
        setPage(1)
    }

    const resetFilters = () => {
        setFilters(defaultFilters)
        setPage(1)
        setSort("")
        setOrder("asc")
    }


    const context: FiltersContextType = {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        page,
        setPage,
        limit,
        setLimit,
        sort,
        setSort,
        order,
        setOrder
    }

    return (
        <FiltersContext.Provider value={context}>
            {children}
        </FiltersContext.Provider>
    )
}
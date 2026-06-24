
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { getCars, type GetCarsParams } from "../data/car";
import type { Car } from "../models/car";
import { CarListContext, type CarListContextType } from "./CarListContext";
import { useFilters } from "../hooks/useFilters";
import { useFavorites } from "../hooks/useFavorites";


export function CarListProvider({ children }: PropsWithChildren) {

    const [carsList, setCarsList] = useState<Car[]>([])
    const [totalPages, setTotalPages] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)

    const { filters, page, limit, sort, order, showFavoritesOnly } = useFilters()
    const { favorites } = useFavorites()

    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const getCarList = async () => {
        setIsLoading(true)
        setIsError(false)
        try {

            // convert Filters (typed object) to a simple Record<string,string>
            const filtersRecord: Record<string, string> = {}
            Object.entries(filters).forEach(([k, v]) => {
                if (v !== undefined && v !== null && String(v) !== '') {
                    filtersRecord[k] = String(v)
                }
            })

            const params: GetCarsParams = {
                filters: filtersRecord,
                page: page,
                limit: limit,
                sort: sort || undefined,
                order: order,
                showFavoritesOnly,
                favorites
            }

            const { items, total, totalPages } = await getCars(params)

            setCarsList(items)
            setTotalPages(totalPages)
            setTotal(total)

        } catch {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCarList()
    }, [filters, page, limit, sort, order, showFavoritesOnly, favorites])

    const context: CarListContextType = {
        carsList,
        isError,
        isLoading,
        totalPages,
        total
    }

    return (
        <CarListContext.Provider value={context}>
            {children}
        </CarListContext.Provider>
    )
}

import { useCallback, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { getCars, type GetCarsParams } from "../data/car";
import type { Car } from "../models/car";
import { CarListContext, type CarListContextType } from "./CarListContext";
import { useFilters } from "../hooks/useFilters";


export function CarListProvider({ children }: PropsWithChildren) {

    const [carsList, setCarsList] = useState<Car[]>([])
    const [totalPages, setTotalPages] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)

    const { filters, page, limit } = useFilters()

    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const getCarList = async () => {
        setIsLoading(true)
        setIsError(false)
        try {

            const params: GetCarsParams = {
                // filters: filters,
                page: page,
                limit: limit
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
    }, [filters, page, limit])

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
import "./Content.css"
import { CarItem } from "../CarItem/CarItem"
import { FiltersPanel } from "../FiltersPanel/FiltersPanel"
import { SortingPanel } from "../SortingPanel/SortingPanel"
import { useCarsList } from "../../hooks/useCarsList"
import { Pagination } from "../Pagination/Pagination"

export function Content() {
    const { carsList, isLoading, isError } = useCarsList()

    return (
        <div className="Content">
            <FiltersPanel />

            <SortingPanel />

            {isLoading && <p>Data is loading...</p>}
            {isError && <p>Something went wrong</p>}

            {!isLoading && !isError && (
                <div className="CarList">

                    <Pagination />

                    {carsList.map((car) => (
                        <CarItem key={car.vin} car={car} />
                    ))}

                    <Pagination />
                </div>
            )}
        </div>
    )
}
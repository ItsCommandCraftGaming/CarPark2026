import { useState } from "react"
import "./Content.css"
import { CarItem } from "../CarItem/CarItem"
import { FiltersPanel } from "../FiltersPanel/FiltersPanel"
import { SortingPanel } from "../SortingPanel/SortingPanel"
import { useCarsList } from "../../hooks/useCarsList"
import { Pagination } from "../Pagination/Pagination"
import SearchOffIcon from '@mui/icons-material/SearchOff'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

type Props = {
    isFavoritesTab?: boolean
    onGoToCatalog?: () => void
}

export function Content({ isFavoritesTab, onGoToCatalog }: Props) {
    const { carsList, isLoading, isError } = useCarsList()
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    return (
        <div className="Content">
            <FiltersPanel />

            <SortingPanel viewMode={viewMode} onViewModeChange={setViewMode} />

            {isLoading && carsList.length === 0 && <p>Data is loading...</p>}
            {isError && <p>Something went wrong</p>}

            {(carsList.length > 0 || (!isLoading && !isError)) && (
                <div className="CarList">
                    {carsList.length === 0 ? (
                        <div className="empty-state">
                            {isFavoritesTab ? (
                                <>
                                    <FavoriteBorderIcon sx={{ fontSize: 60, color: 'var(--gray-400)', marginBottom: '1rem' }} />
                                    <h3>Nu ai nicio mașină favorită!</h3>
                                    <p>Adaugă produse la favorite din catalog pentru a le vedea aici.</p>
                                    {onGoToCatalog && (
                                        <button 
                                            className="button" 
                                            style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', fontSize: '1rem' }} 
                                            onClick={onGoToCatalog}
                                        >
                                            Înapoi la Catalog
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <SearchOffIcon sx={{ fontSize: 60, color: 'var(--gray-400)', marginBottom: '1rem' }} />
                                    <h3>Nu am găsit nicio mașină!</h3>
                                    <p>Încearcă să modifici filtrele pentru a găsi ceea ce cauți.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Pagination />

                            <div className={viewMode === 'grid' ? 'CarList__grid' : 'CarList__list'}>
                                {carsList.map((car) => (
                                    <CarItem key={car.vin} car={car} />
                                ))}
                            </div>

                            <Pagination />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
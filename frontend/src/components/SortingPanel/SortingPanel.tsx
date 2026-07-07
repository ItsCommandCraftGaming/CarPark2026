import type { Car } from "../../models/car";
import './SortingPanel.css'
import SortIcon from '../../assets/sort.svg?react'
import { useFilters } from "../../hooks/useFilters"
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'

type Props = {
    viewMode?: 'list' | 'grid'
    onViewModeChange?: (mode: 'list' | 'grid') => void
}

const SORT_FIELDS: { value: keyof Car | "", label: string }[] = [
    { value: "", label: "Default" },
    { value: "manufacturer", label: "Manufacturer" },
    { value: "model", label: "Model" },
    { value: "constructionYear", label: "Construction Year" },
    { value: "mileage", label: "Mileage" },
    { value: "price", label: "Price" },
    { value: "power", label: "Power" },
]

const PAGE_SIZES = [5, 10, 20, 50]

export function SortingPanel({ viewMode = 'list', onViewModeChange }: Props) {
    const { sort, setSort, order, setOrder, limit, setLimit, setPage } = useFilters()

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value as keyof Car | "")
        setPage(1)
    }

    const toggleOrder = () => {
        setOrder(prev => prev === "asc" ? "desc" : "asc")
        setPage(1)
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value))
        setPage(1)
    }

    return (
        <div className="SortingPanel">
            <label className="SortingPanel__field">
                <span className="SortingPanel__label">Sort by</span>
                <div className="SortingPanel__select">
                    <select
                        value={sort}
                        onChange={handleSortChange}
                    >
                        {SORT_FIELDS.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                </div>
            </label>

            <button
                type="button"
                className="SortingPanel__order"
                onClick={toggleOrder}
                disabled={sort === ""}
                aria-label={order === "asc" ? "Sort ascending" : "Sort descending"}
                title={order === "asc" ? "Ascending" : "Descending"}
            >
                <SortIcon
                    className={`SortingPanel__orderIcon${order === "desc" ? " SortingPanel__orderIcon--desc" : ""}`}
                />
            </button>

            <label className="SortingPanel__field">
                <span className="SortingPanel__label">Per page</span>
                <div className="SortingPanel__select">
                    <select
                        value={limit}
                        onChange={handleLimitChange}
                    >
                        {PAGE_SIZES.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </label>

            <div className="SortingPanel__viewToggle">
                <button
                    type="button"
                    className={`SortingPanel__viewToggleBtn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => onViewModeChange?.('list')}
                    title="List View"
                >
                    <ViewListIcon />
                </button>
                <button
                    type="button"
                    className={`SortingPanel__viewToggleBtn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => onViewModeChange?.('grid')}
                    title="Grid View"
                >
                    <ViewModuleIcon />
                </button>
            </div>
        </div>
    )
}
import { useState, useEffect } from "react"
import { useFilters } from "../../hooks/useFilters"
import "./FiltersPanel.css"

export function FiltersPanel() {
    const { filters, updateFilter } = useFilters()
    const [searchTerm, setSearchTerm] = useState(filters.search ?? "")

    useEffect(() => {
        if (!filters.search) {
            setSearchTerm("")
        }
    }, [filters.search])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                if (searchTerm !== (filters.search ?? "")) {
                    updateFilter("search", searchTerm)
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm, updateFilter, filters.search])
    return (
        <div className="filtersPanel">
            <h3>Filters Cars</h3>
            <input
                type="text"
                placeholder="Search by manufacturer, model, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="number"
                    placeholder="Year from"
                    value={filters.constructionYearFrom ?? ''}
                    onChange={(e) => updateFilter('constructionYearFrom', e.target.value)}
                    style={{ width: '120px' }}
                />
                <input
                    type="number"
                    placeholder="Year to"
                    value={filters.constructionYearTo ?? ''}
                    onChange={(e) => updateFilter('constructionYearTo', e.target.value)}
                    style={{ width: '120px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="number"
                    placeholder="Price from"
                    value={filters.priceFrom ?? ''}
                    onChange={(e) => updateFilter('priceFrom', e.target.value)}
                    style={{ width: '140px' }}
                />
                <input
                    type="number"
                    placeholder="Price to"
                    value={filters.priceTo ?? ''}
                    onChange={(e) => updateFilter('priceTo', e.target.value)}
                    style={{ width: '140px' }}
                />
            </div>
        </div>
    )
}

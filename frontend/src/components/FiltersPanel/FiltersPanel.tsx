import { useFilters } from "../../hooks/useFilters"
import "./FiltersPanel.css"

export function FiltersPanel() {
    const { filters, updateFilter, showFavoritesOnly, handleFavoritesToggle } = useFilters()

    return (
        <div className="filtersPanel">
            <h3>Filters Cars</h3>
            <input
                type="text"
                placeholder="Search by manufacturer, model, etc."
                value={filters.search ?? ""}
                onChange={(e) => updateFilter("search", e.target.value)}
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
            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => handleFavoritesToggle(e.target.checked)}
                />
                Show only favorites
            </label>
        </div>
    )
}

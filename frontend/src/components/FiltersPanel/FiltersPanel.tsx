import { useState, useEffect } from "react"
import { useFilters } from "../../hooks/useFilters"
import "./FiltersPanel.css"

export function FiltersPanel() {
    const { filters, updateFilter } = useFilters()
    
    const { 
        search: globalSearch, 
        constructionYearFrom: globalYearFrom, 
        constructionYearTo: globalYearTo, 
        priceFrom: globalPriceFrom, 
        priceTo: globalPriceTo 
    } = filters

    // Local draft state for all inputs
    const [localFilters, setLocalFilters] = useState({
        search: globalSearch ?? "",
        constructionYearFrom: globalYearFrom ?? "",
        constructionYearTo: globalYearTo ?? "",
        priceFrom: globalPriceFrom ?? "",
        priceTo: globalPriceTo ?? "",
    })

    // Keep local draft in sync with any external resets/changes to the global context
    useEffect(() => {
        setLocalFilters({
            search: globalSearch ?? "",
            constructionYearFrom: globalYearFrom ?? "",
            constructionYearTo: globalYearTo ?? "",
            priceFrom: globalPriceFrom ?? "",
            priceTo: globalPriceTo ?? "",
        })
    }, [globalSearch, globalYearFrom, globalYearTo, globalPriceFrom, globalPriceTo])

    // Single debounced effect for all inputs
    useEffect(() => {
        const timer = setTimeout(() => {
            // Debounce search input
            if (localFilters.search.length >= 3 || localFilters.search.length === 0) {
                if (localFilters.search !== (globalSearch ?? "")) {
                    updateFilter("search", localFilters.search)
                }
            }
            
            // Debounce year and price inputs
            if (localFilters.constructionYearFrom !== (globalYearFrom ?? "")) {
                updateFilter("constructionYearFrom", localFilters.constructionYearFrom)
            }
            if (localFilters.constructionYearTo !== (globalYearTo ?? "")) {
                updateFilter("constructionYearTo", localFilters.constructionYearTo)
            }
            if (localFilters.priceFrom !== (globalPriceFrom ?? "")) {
                updateFilter("priceFrom", localFilters.priceFrom)
            }
            if (localFilters.priceTo !== (globalPriceTo ?? "")) {
                updateFilter("priceTo", localFilters.priceTo)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [
        localFilters,
        updateFilter,
        globalSearch,
        globalYearFrom,
        globalYearTo,
        globalPriceFrom,
        globalPriceTo
    ])

    const handleLocalChange = (key: string, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <div className="filtersPanel">
            <h3>Filters Cars</h3>
            <input
                type="text"
                placeholder="Search by manufacturer, model, etc."
                value={localFilters.search}
                onChange={(e) => handleLocalChange("search", e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="number"
                    placeholder="Year from"
                    value={localFilters.constructionYearFrom}
                    onChange={(e) => handleLocalChange("constructionYearFrom", e.target.value)}
                    style={{ width: '120px' }}
                />
                <input
                    type="number"
                    placeholder="Year to"
                    value={localFilters.constructionYearTo}
                    onChange={(e) => handleLocalChange("constructionYearTo", e.target.value)}
                    style={{ width: '120px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="number"
                    placeholder="Price from"
                    value={localFilters.priceFrom}
                    onChange={(e) => handleLocalChange("priceFrom", e.target.value)}
                    style={{ width: '140px' }}
                />
                <input
                    type="number"
                    placeholder="Price to"
                    value={localFilters.priceTo}
                    onChange={(e) => handleLocalChange("priceTo", e.target.value)}
                    style={{ width: '140px' }}
                />
            </div>
        </div>
    )
}

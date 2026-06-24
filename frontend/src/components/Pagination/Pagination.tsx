import { useFilters } from '../../hooks/useFilters'
import { useCarsList } from '../../hooks/useCarsList'
import './Pagination.css'

export function Pagination() {

    const { page, setPage } = useFilters()
    const { totalPages } = useCarsList()

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="Pagination">
            <button
                type="button"
                className="Pagination__button"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >
                Prev
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    className={`Pagination__button${p === page ? ' Pagination__button--active' : ''}`}
                    onClick={() => setPage(p)}
                >
                    {p}
                </button>
            ))}

            <button
                type="button"
                className="Pagination__button"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    )
}
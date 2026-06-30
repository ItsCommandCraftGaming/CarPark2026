import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import { useBasket } from "../../hooks/useBasket"
import { useFavorites } from "../../hooks/useFavorites"
import "./Navbar.css"

type Props = {
    currentTab: 'catalog' | 'basket' | 'favorites'
    setCurrentTab: (tab: 'catalog' | 'basket' | 'favorites') => void
}

export function Navbar({ currentTab, setCurrentTab }: Props) {
    const { basketItems } = useBasket()
    const { favorites } = useFavorites()

    return (
        <nav className="Navbar">
            <div className="Navbar__brand" onClick={() => setCurrentTab('catalog')}>
                <span className="Navbar__logo"><DirectionsCarIcon fontSize="large" /></span>
                <span className="Navbar__title">Mihai's Garage</span>
            </div>
            <div className="Navbar__links">
                <button
                    type="button"
                    className={`Navbar__link${currentTab === 'catalog' ? ' Navbar__link--active' : ''}`}
                    onClick={() => setCurrentTab('catalog')}
                >
                    Cars Catalog
                </button>
                <button
                    type="button"
                    className={`Navbar__link Navbar__link--basket${currentTab === 'favorites' ? ' Navbar__link--active' : ''}`}
                    onClick={() => setCurrentTab('favorites')}
                >
                    Favorites
                    {favorites.length > 0 && (
                        <span className="Navbar__badge" style={{ backgroundColor: 'var(--warning-500)' }}>{favorites.length}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={`Navbar__link Navbar__link--basket${currentTab === 'basket' ? ' Navbar__link--active' : ''}`}
                    onClick={() => setCurrentTab('basket')}
                >
                    Shopping Basket
                    {basketItems.length > 0 && (
                        <span className="Navbar__badge">{basketItems.length}</span>
                    )}
                </button>
            </div>
        </nav>
    )
}

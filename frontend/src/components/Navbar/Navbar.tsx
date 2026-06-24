import { useBasket } from "../../hooks/useBasket"
import "./Navbar.css"

type Props = {
    currentTab: 'catalog' | 'basket'
    setCurrentTab: (tab: 'catalog' | 'basket') => void
}

export function Navbar({ currentTab, setCurrentTab }: Props) {
    const { basketItems } = useBasket()

    return (
        <nav className="Navbar">
            <div className="Navbar__brand" onClick={() => setCurrentTab('catalog')}>
                <span className="Navbar__logo">🚗</span>
                <span className="Navbar__title">Topmotive Car Park</span>
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

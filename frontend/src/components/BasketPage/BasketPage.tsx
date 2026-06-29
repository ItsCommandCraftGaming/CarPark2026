import { useBasket } from "../../hooks/useBasket"
import { IMG_BASE_URL } from "../../data/constants"
import { useState } from "react"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SpeedIcon from '@mui/icons-material/Speed'
import SettingsIcon from '@mui/icons-material/Settings'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import CloseIcon from '@mui/icons-material/Close'
import "./BasketPage.css"

type Props = {
    setCurrentTab: (tab: 'catalog' | 'basket') => void
}

export function BasketPage({ setCurrentTab }: Props) {
    const { basketItems, removeFromBasket, isLoading, isError } = useBasket()
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    if (isLoading) {
        return (
            <div className="BasketPage BasketPage--loading">
                <div className="status-container">
                    <p>Loading basket items...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="BasketPage BasketPage--error">
                <div className="status-container">
                    <p>Something went wrong loading your basket.</p>
                </div>
            </div>
        )
    }

    if (basketItems.length === 0 && !checkoutSuccess) {
        return (
            <div className="BasketPage BasketPage--empty">
                <div className="empty-state">
                    <span className="empty-state__icon"><ShoppingCartIcon sx={{ fontSize: 64 }} /></span>
                    <h2>Your Basket is Empty</h2>
                    <p>You haven't added any vehicles to your basket yet.</p>
                    <button
                        type="button"
                        className="button"
                        onClick={() => setCurrentTab('catalog')}
                    >
                        Browse Cars Catalog
                    </button>
                </div>
            </div>
        )
    }

    // Calculations
    const totalPrice = basketItems.reduce((sum, item) => sum + (item.price ?? 0), 0)
    const averagePrice = basketItems.length > 0 ? Math.round(totalPrice / basketItems.length) : 0
    const totalMileage = basketItems.reduce((sum, item) => sum + (item.mileage ?? 0), 0)
    const averageMileage = basketItems.length > 0 ? Math.round(totalMileage / basketItems.length) : 0

    const handleCheckout = async () => {
        if (isCheckingOut) return
        setIsCheckingOut(true)
        
        // Clear basket items on the backend
        try {
            for (const item of basketItems) {
                await removeFromBasket(item.vin)
            }
            setCheckoutSuccess(true)
        } catch (err) {
            console.error("Failed to checkout basket items:", err)
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (checkoutSuccess) {
        return (
            <div className="BasketPage BasketPage--success">
                <div className="success-state">
                    <span className="success-state__icon"><CheckCircleIcon sx={{ fontSize: 64, color: 'var(--success-500)' }} /></span>
                    <h2>Order Confirmed!</h2>
                    <p>Thank you for your purchase. We have received your order request.</p>
                    <button
                        type="button"
                        className="button"
                        onClick={() => {
                            setCheckoutSuccess(false)
                            setCurrentTab('catalog')
                        }}
                    >
                        Return to Catalog
                    </button>
                </div>
            </div>
        )
    }

    const handleClearBasket = async () => {
        if (window.confirm("Are you sure you want to clear your basket?")) {
            for (const item of basketItems) {
                try {
                    await removeFromBasket(item.vin)
                } catch (err) {
                    console.error("Failed to delete item from basket:", err)
                }
            }
        }
    }

    return (
        <div className="BasketPage">
            <div className="BasketPage__header">
                <h2>Shopping Basket</h2>
                <button
                    type="button"
                    className="BasketPage__clearBtn"
                    onClick={handleClearBasket}
                >
                    Clear Basket
                </button>
            </div>

            <div className="BasketPage__content">
                <div className="BasketPage__list">
                    {basketItems.map((item) => (
                        <div key={item.vin} className="BasketItem">
                            <div className="BasketItem__imageContainer">
                                <img src={`${IMG_BASE_URL}/${item.image}`} className="BasketItem__image" alt={`${item.manufacturer} ${item.model ?? ''}`} />
                            </div>
                            <div className="BasketItem__details">
                                <h3 className="BasketItem__title">{item.manufacturer} {item.model ?? ''}</h3>
                                <div className="BasketItem__specs">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarTodayIcon fontSize="small" /> {item.constructionYear ?? 'N/A'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><SpeedIcon fontSize="small" /> {item.mileage !== undefined && item.mileage !== null ? item.mileage.toLocaleString() : '0'} km</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><SettingsIcon fontSize="small" /> {item.gearbox ?? 'N/A'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><LocalGasStationIcon fontSize="small" /> {item.fuelType ?? 'N/A'}</span>
                                </div>
                                <div className="BasketItem__price">{item.price !== undefined && item.price !== null ? item.price.toLocaleString() : '0'} EUR</div>
                            </div>
                            <button
                                type="button"
                                className="BasketItem__remove"
                                onClick={() => removeFromBasket(item.vin)}
                                title="Remove item"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="BasketPage__summary">
                    <div className="SummaryCard">
                        <h3 className="SummaryCard__title">Order Summary</h3>
                        <div className="SummaryCard__row">
                            <span>Vehicles in Basket</span>
                            <span>{basketItems.length}</span>
                        </div>
                        <div className="SummaryCard__row">
                            <span>Average Price</span>
                            <span>{averagePrice.toLocaleString()} EUR</span>
                        </div>
                        <div className="SummaryCard__row">
                            <span>Average Mileage</span>
                            <span>{averageMileage.toLocaleString()} km</span>
                        </div>
                        <hr className="SummaryCard__divider" />
                        <div className="SummaryCard__row SummaryCard__row--total">
                            <span>Total Price</span>
                            <span>{totalPrice.toLocaleString()} EUR</span>
                        </div>
                        <button
                            type="button"
                            className="SummaryCard__checkout"
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

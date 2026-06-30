import type { Car } from "../../models/car"
import "./CarItem.css"
import { useFavorites } from "../../hooks/useFavorites"
import { IMG_BASE_URL } from "../../data/constants"
import { useBasket } from "../../hooks/useBasket"
import { useState } from "react"
import { createPortal } from "react-dom"
import ZoomInIcon from '@mui/icons-material/ZoomIn'
type Props = {
    car: Car
}

export function CarItem({ car }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const equipments = car.equipment.split(",")
    const { toggleFavorite, isFavorite } = useFavorites()
    const { addToBasket, removeFromBasket, isItemInBasket } = useBasket()
    const inBasket = isItemInBasket(car.vin)

    return (
        <div className="carItem">
            <div className="imageContainer" onClick={() => setIsModalOpen(true)} title="Click to open Quick View">
                <img src={`${IMG_BASE_URL}/${car.image}`} className="carImage" />
                <div className="zoomOverlay">
                    <ZoomInIcon fontSize="large" />
                </div>
            </div>
            <div className="details">
                <div className="row"><div className="label">Manufacturer: </div> {car.manufacturer}</div>
                <div className="row"><div className="label">Model: </div>{car.model}</div>
                <div className="row"><div className="label">Construction Year: </div>{car.constructionYear}</div>
                <div className="row"><div className="label">Fuel type: </div>{car.fuelType}</div>
            </div>
            <div className="price">Price: {car.price} EUR</div>
            <div className="row">
                <button className="button" onClick={() => toggleFavorite(car)}>
                    {isFavorite(car) ? "Remove from favorites" : "Add to favorites"}
                </button>
                {inBasket ? (
                    <button className="button button--basket-remove" onClick={() => removeFromBasket(car.vin)}>
                        Remove from basket
                    </button>
                ) : (
                    <button className="button button--basket-add" onClick={() => addToBasket(car)}>
                        Add to basket
                    </button>
                )}
            </div>

            {isModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        <h2 className="modal-title">{car.manufacturer} {car.model}</h2>
                        <div className="modal-body">
                            <div className="modal-image-container">
                                <img src={`${IMG_BASE_URL}/${car.image}`} className="modal-car-image" />
                            </div>
                            <div className="modal-info">
                                <div className="row"><div className="label">Construction Year: </div>{car.constructionYear}</div>
                                <div className="row"><div className="label">Fuel type: </div>{car.fuelType}</div>
                                <div className="row"><div className="label">Mileage: </div>{car.mileage} km</div>
                                <div className="row"><div className="label">Engine size: </div>{car.engineSize} cm3</div>
                                <div className="row"><div className="label">Power: </div>{car.power} CP</div>
                                <div className="row"><div className="label">Price: </div><div className="price-tag">{car.price} EUR</div></div>
                                <br />
                                <div className="row">
                                    <div className="label">Equipments:</div>
                                </div>
                                <div className="row">
                                    <ul className="list full-list">
                                        {equipments.map((equipment, index) => {
                                            return <li key={index}>{equipment}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
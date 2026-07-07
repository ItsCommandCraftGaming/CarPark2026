import { useState, useEffect } from 'react'
import './PromoBanner.css'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ElectricCarIcon from '@mui/icons-material/ElectricCar'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const PROMOTIONS = [
    {
        id: 1,
        title: "Ofertă Electrizantă de Vară! ⚡",
        description: "Obține reduceri substanțiale de până la 2.000 EUR la achiziția oricărui model Electric sau Hibrid din stoc.",
        tag: "Ofertă Limitată",
        icon: <ElectricCarIcon fontSize="large" />,
        bgColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    },
    {
        id: 2,
        title: "Finanțare Auto cu Dobândă 0% 💸",
        description: "Cumpără mașina preferată în rate cu dobândă 0% în primele 12 luni prin partenerii noștri de leasing.",
        tag: "Finanțare",
        icon: <LocalOfferIcon fontSize="large" />,
        bgColor: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
    },
    {
        id: 3,
        title: "Livrare Gratuită la Ușa Ta! 🚚",
        description: "Livrare gratuită în toată țara și garanție inclusă timp de 12 luni pentru orice mașină achiziționată online.",
        tag: "Serviciu VIP",
        icon: <LocalShippingIcon fontSize="large" />,
        bgColor: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
    }
]

export function PromoBanner() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % PROMOTIONS.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const promo = PROMOTIONS[currentSlide]

    return (
        <div className="promo-banner" style={{ background: promo.bgColor }}>
            <div className="promo-badge">{promo.tag}</div>
            <div className="promo-content">
                <div className="promo-icon-wrapper">
                    {promo.icon}
                </div>
                <div className="promo-text">
                    <h3>{promo.title}</h3>
                    <p>{promo.description}</p>
                </div>
            </div>
            <div className="promo-dots">
                {PROMOTIONS.map((_, index) => (
                    <button
                        key={index}
                        className={`promo-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

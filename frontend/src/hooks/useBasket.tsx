import { useContext } from "react";
import { BasketContext } from "../contexts/BasketContext";

export function useBasket() {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error("useBasket must be used within a BasketProvider");
    }
    return context;
}

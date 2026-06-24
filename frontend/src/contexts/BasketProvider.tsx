import { useState, useEffect, type PropsWithChildren } from "react";
import type { Car } from "../models/car";
import { BasketContext, type BasketContextType } from "./BasketContext";
import { getBasket, createBasket, deleteBasket } from "../data/basket";

export function BasketProvider({ children }: PropsWithChildren) {
    const [basketItems, setBasketItems] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchBasket = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const items = await getBasket();
                setBasketItems(items);
            } catch (err) {
                console.error("Error fetching basket:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBasket();
    }, []);

    const addToBasket = async (car: Car) => {
        setIsError(false);
        try {
            // Check if it's already in the basket to avoid duplicate POST
            if (basketItems.some(item => item.vin === car.vin)) {
                return;
            }
            const newItem = await createBasket(car);
            setBasketItems(prev => [...prev, newItem]);
        } catch (err) {
            console.error("Error adding to basket:", err);
            setIsError(true);
            throw err;
        }
    };

    const removeFromBasket = async (vin: string) => {
        setIsError(false);
        try {
            await deleteBasket(vin);
            setBasketItems(prev => prev.filter(item => item.vin !== vin));
        } catch (err) {
            console.error("Error removing from basket:", err);
            setIsError(true);
            throw err;
        }
    };

    const isItemInBasket = (vin: string) => {
        return basketItems.some(item => item.vin === vin);
    };

    const context: BasketContextType = {
        basketItems,
        isLoading,
        isError,
        addToBasket,
        removeFromBasket,
        isItemInBasket
    };

    return (
        <BasketContext.Provider value={context}>
            {children}
        </BasketContext.Provider>
    );
}

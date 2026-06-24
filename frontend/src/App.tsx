import { useState } from 'react'
import './App.css'
import { Content } from './components/Content/Content'
import { FiltersProvider } from './contexts/FiltersProvider'
import { CarListProvider } from './contexts/CarListProvider'
import { BasketProvider } from './contexts/BasketProvider'
import { FavoritesProvider } from './contexts/FavoritesProvider'
import { Navbar } from './components/Navbar/Navbar'
import { BasketPage } from './components/BasketPage/BasketPage'

export function App() {
    const [currentTab, setCurrentTab] = useState<'catalog' | 'basket'>('catalog')

    return (
        <FiltersProvider>
            <FavoritesProvider>
                <BasketProvider>
                    <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    {currentTab === 'catalog' ? (
                        <CarListProvider>
                            <Content />
                        </CarListProvider>
                    ) : (
                        <BasketPage setCurrentTab={setCurrentTab} />
                    )}
                </BasketProvider>
            </FavoritesProvider>
        </FiltersProvider>
    )
}


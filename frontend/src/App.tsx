import { useState } from 'react'
import './App.css'
import { Content } from './components/Content/Content'
import { FiltersProvider } from './contexts/FiltersProvider'
import { CarListProvider } from './contexts/CarListProvider'
import { BasketProvider } from './contexts/BasketProvider'
import { FavoritesProvider } from './contexts/FavoritesProvider'
import { Navbar } from './components/Navbar/Navbar'
import { BasketPage } from './components/BasketPage/BasketPage'
import { AdminPage } from './components/AdminPage/AdminPage'

export function App() {
    const [currentTab, setCurrentTab] = useState<'catalog' | 'basket' | 'favorites' | 'admin'>('catalog')

    return (
        <FiltersProvider>
            <FavoritesProvider>
                <BasketProvider>
                    <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    {currentTab === 'catalog' ? (
                        <CarListProvider>
                            <Content />
                        </CarListProvider>
                    ) : currentTab === 'favorites' ? (
                        <CarListProvider forceFavoritesOnly={true}>
                            <Content isFavoritesTab={true} onGoToCatalog={() => setCurrentTab('catalog')} />
                        </CarListProvider>
                    ) : currentTab === 'admin' ? (
                        <AdminPage />
                    ) : (
                        <BasketPage setCurrentTab={setCurrentTab} />
                    )}
                </BasketProvider>
            </FavoritesProvider>
        </FiltersProvider>
    )
}
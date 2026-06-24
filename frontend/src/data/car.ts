import type { Car } from "../models/car"
import { apiHandle, HEADERS } from "./helper"
import { API_BASE_URL } from "./constants"


export type SortOrder = 'asc' | 'desc'

export type GetCarsParams = {
    sort?: keyof Car
    order?: SortOrder
    page?: number
    limit?: number
    // filters can include string matches or range fields like 'constructionYearFrom', 'priceTo', etc.
    filters?: Record<string, string>
    showFavoritesOnly?: boolean
    favorites?: string[]
}

export type Paginated<T> = {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

/**
 * Gets cars with optional partial-match filtering, sorting and pagination
 * (json-server `<field>_like`, `_sort`/`_order`, `_page`/`_limit`).
 * @param params - filtering, sorting and pagination options
 * @returns A page of cars plus pagination metadata
 */
export async function getCars(params: GetCarsParams = {}): Promise<Paginated<Car>> {
    const { sort, order = 'asc', page = 1, limit = 25, filters = {}, showFavoritesOnly = false, favorites = [] } = params

    const query = new URLSearchParams()

    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === '') continue

        // Multi-field search: `search` applies `_like` to several text fields
        if (key === 'search') {
            const words = value.toLowerCase().trim().split(/\s+/)
            const otherWords: string[] = []
            
            words.forEach(word => {
                if (word === 'electric') {
                    query.set('fuelType_like', 'Electric')
                } else if (word === 'diesel') {
                    query.set('fuelType_like', 'Diesel')
                } else if (word === 'petrol') {
                    query.set('fuelType_like', 'Petrol')
                } else if (word === 'manual') {
                    query.set('gearbox_like', 'Manual')
                } else if (word === 'automatic') {
                    query.set('gearbox_like', 'Automatic')
                } else {
                    otherWords.push(word)
                }
            })
            
            if (otherWords.length > 0) {
                // Use json-server full-text search `q` for other query words
                query.set('q', otherWords.join(' '))
            }
            continue
        }

        // Support range queries: keys ending with From/To -> _gte/_lte
        if (key.endsWith('From')) {
            const field = key.replace(/From$/, '')
            query.set(`${field}_gte`, value)
            continue
        }

        if (key.endsWith('To')) {
            const field = key.replace(/To$/, '')
            query.set(`${field}_lte`, value)
            continue
        }

        // Default: partial match
        query.set(`${key}_like`, value)
    }

    if (sort) {
        query.set('_sort', sort)
        query.set('_order', order)
    }
    
    const res = await fetch(`${API_BASE_URL}/cars?${query.toString()}`)
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }

    const items = (await res.json()) as Car[]

    let filteredItems = items
    if (showFavoritesOnly) {
        filteredItems = filteredItems.filter(car => favorites.includes(car.vin))
    }

    const searchVal = filters.search
    if (searchVal) {
        const term = searchVal.toLowerCase().trim()
        filteredItems = filteredItems.filter(car => {
            return car.manufacturer.toLowerCase().includes(term) ||
                   car.model.toLowerCase().includes(term) ||
                   (car.fuelType && car.fuelType.toLowerCase().includes(term)) ||
                   (car.gearbox && car.gearbox.toLowerCase().includes(term))
        })
    }

    const total = filteredItems.length
    const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1
    
    const startIndex = (page - 1) * limit
    const paginatedItems = filteredItems.slice(startIndex, startIndex + limit)

    return { items: paginatedItems, total, page, limit, totalPages }
}

/**
 * Creates a new car
 * @param car - New car data
 * @returns The created car
 */

export async function createCar(car: Car): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(car),
    })
    return apiHandle<Car>(res)
}

/**
 * Updates a car partially
 * @param car - Partial car data to update
 * @returns The updated car
 */
export async function updateCar(car: Partial<Car>): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars/${car.vin}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify(car),
    })
    return apiHandle<Car>(res)
}

/**
 * Replaces a car completely
 * @param car - New car data
 * @returns The updated car
 */
export async function replaceCar(car: Car): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars/${car.vin}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(car),
    })
    return apiHandle<Car>(res)
}

/**
 * Deletes a car by VIN
 * @param vin - Vehicle Identification Number of the car to delete
 */
export async function deleteCar(vin: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cars/${vin}`, { method: 'DELETE', headers: HEADERS })
    if (!res.ok) {
        throw new Error(`Delete failed: ${res.status} ${res.statusText}`)
    }
}

import { useState, useEffect } from 'react'
import type { Car } from '../../models/car'
import { getCars, deleteCar, createCar, updateCar } from '../../data/car'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import './AdminPage.css'

export function AdminPage() {
    const [cars, setCars] = useState<Car[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null)

    const fetchCars = async () => {
        setIsLoading(true)
        try {
            // Fetch a large number to show all in admin
            const res = await getCars({ limit: 1000 })
            setCars(res.items)
        } catch (e) {
            console.error("Failed to load cars", e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCars()
    }, [])

    const handleDelete = async (vin: string) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return
        try {
            await deleteCar(vin)
            setCars(cars.filter(c => c.vin !== vin))
        } catch (e) {
            alert("Failed to delete car")
            console.error(e)
        }
    }

    const openAddForm = () => {
        setEditingCar({
            vin: '',
            manufacturer: '',
            model: '',
            fuelType: '',
            gearbox: '',
            price: 0,
            constructionYear: 2024,
            mileage: 0,
            engineSize: 0,
            power: 0,
            image: '',
            equipment: ''
        })
        setIsFormOpen(true)
    }

    const openEditForm = (car: Car) => {
        setEditingCar(car)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCar) return

        try {
            if (cars.some(c => c.vin === editingCar.vin) && editingCar.vin !== (editingCar as any)._originalVin) {
                // Simplistic check: If editing an existing car, it uses updateCar.
                // If it's a new car, we use createCar.
                // Actually let's check if the car exists in the list to decide create vs update
                const exists = cars.find(c => c.vin === editingCar.vin)
                if (exists && !editingCar.hasOwnProperty('_isNew')) {
                    const updated = await updateCar(editingCar)
                    setCars(cars.map(c => c.vin === updated.vin ? updated : c))
                } else {
                    const created = await createCar(editingCar as Car)
                    setCars([created, ...cars])
                }
            } else {
                const created = await createCar(editingCar as Car)
                setCars([created, ...cars])
            }
            setIsFormOpen(false)
            setEditingCar(null)
            fetchCars() // Refresh list just to be safe
        } catch (error) {
            alert("Failed to save car. Check console for details.")
            console.error(error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any
        setEditingCar(prev => prev ? {
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        } : null)
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Manage Cars</h2>
                <button className="button button-add" onClick={openAddForm}>
                    <AddIcon fontSize="small" /> Add New Car
                </button>
            </div>

            {isLoading ? (
                <p>Loading cars...</p>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>VIN</th>
                                <th>Manufacturer</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>Price (EUR)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.vin}>
                                    <td>{car.vin}</td>
                                    <td>{car.manufacturer}</td>
                                    <td>{car.model}</td>
                                    <td>{car.constructionYear}</td>
                                    <td>{car.price}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" onClick={() => openEditForm(car)} title="Edit">
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(car.vin)} title="Delete">
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cars.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No cars found in the database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isFormOpen && editingCar && (
                <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
                    <div className="modal-content admin-form" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsFormOpen(false)}>&times;</button>
                        <h2 className="modal-title">{cars.some(c => c.vin === editingCar.vin) ? 'Edit Car' : 'Add New Car'}</h2>
                        
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>VIN</label>
                                    <input required type="text" name="vin" value={editingCar.vin} onChange={handleInputChange} disabled={cars.some(c => c.vin === editingCar.vin)} />
                                </div>
                                <div className="form-group">
                                    <label>Manufacturer</label>
                                    <input required type="text" name="manufacturer" value={editingCar.manufacturer} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Model</label>
                                    <input required type="text" name="model" value={editingCar.model} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Fuel Type</label>
                                    <select name="fuelType" value={editingCar.fuelType} onChange={handleInputChange}>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Gearbox</label>
                                    <select name="gearbox" value={editingCar.gearbox} onChange={handleInputChange}>
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Automatic</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Year</label>
                                    <input required type="number" name="constructionYear" value={editingCar.constructionYear} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Price (EUR)</label>
                                    <input required type="number" name="price" value={editingCar.price} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Mileage</label>
                                    <input required type="number" name="mileage" value={editingCar.mileage} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Engine Size (cm3)</label>
                                    <input required type="number" name="engineSize" value={editingCar.engineSize} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Power (CP)</label>
                                    <input required type="number" name="power" value={editingCar.power} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Image Name</label>
                                    <input type="text" name="image" value={editingCar.image} onChange={handleInputChange} placeholder="e.g. car1.jpg" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Equipment (comma separated)</label>
                                    <input type="text" name="equipment" value={editingCar.equipment} onChange={handleInputChange} />
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" className="button button-cancel" onClick={() => setIsFormOpen(false)}>Cancel</button>
                                <button type="submit" className="button button-save">Save Car</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

import { useState, useEffect } from 'react'
import type { Car } from '../../models/car'
import { getCars, deleteCar, createCar, updateCar } from '../../data/car'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { AdminFormModal } from './AdminFormModal'
import './AdminPage.css'

export function AdminPage() {
    // Aici ținem minte lista de mașini
    const [cars, setCars] = useState<Car[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // Stări pentru a controla dacă fereastra modală (formularul) este deschisă
    const [isFormOpen, setIsFormOpen] = useState(false)
    // Aici ținem datele mașinii pe care o edităm momentan (sau creăm una nouă)
    const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null)

    // Funcție care cere mașinile de la backend
    const fetchCars = async () => {
        setIsLoading(true)
        try {
            // Cerem 1000 de mașini ca să le vedem pe toate în pagina de Admin
            const res = await getCars({ limit: 1000 })
            setCars(res.items)
        } catch (e) {
            console.error("Failed to load cars", e)
        } finally {
            setIsLoading(false)
        }
    }

    // Se apelează o singură dată când se încarcă pagina
    useEffect(() => {
        fetchCars()
    }, [])

    // Funcție pentru a șterge o mașină
    const handleDelete = async (vin: string) => {
        if (!window.confirm("Ești sigur că vrei să ștergi această mașină?")) return
        try {
            await deleteCar(vin) // O ștergem din baza de date (JSON)
            setCars(cars.filter(c => c.vin !== vin)) // O ștergem și de pe ecran
        } catch (e) {
            alert("Nu s-a putut șterge mașina")
            console.error(e)
        }
    }

    // Deschide formularul complet gol pentru o mașină NOUĂ
    const openAddForm = () => {
        setEditingCar({
            vin: '', manufacturer: '', model: '', fuelType: 'Petrol', gearbox: 'Manual',
            price: 0, constructionYear: 2024, mileage: 0, engineSize: 0, power: 0, image: '', equipment: ''
        })
        setIsFormOpen(true)
    }

    // Deschide formularul pre-completat cu datele unei mașini EXISTENTE
    const openEditForm = (car: Car) => {
        setEditingCar(car)
        setIsFormOpen(true)
    }

    // Funcție care primește datele din <AdminFormModal /> și le salvează pe server
    const handleSaveCar = async (carToSave: Partial<Car>) => {
        try {
            // Verificăm dacă mașina există deja în lista noastră
            const exists = cars.find(c => c.vin === carToSave.vin)
            
            if (exists) {
                // Dacă există, o ACTUALIZĂM (PATCH)
                const updated = await updateCar(carToSave)
                setCars(cars.map(c => c.vin === updated.vin ? updated : c))
            } else {
                // Dacă nu există, o CREĂM (POST)
                const created = await createCar(carToSave as Car)
                setCars([created, ...cars]) // O adăugăm la începutul listei pe ecran
            }
            
            // Închidem fereastra după salvare
            setIsFormOpen(false)
            setEditingCar(null)
        } catch (error) {
            alert("A apărut o eroare la salvare. Verifică în consolă.")
            console.error(error)
        }
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

            {/* 3. Dacă butonul a fost apăsat, afișăm Componenta de Formular Modal */}
            {isFormOpen && editingCar && (
                <AdminFormModal 
                    carToEdit={editingCar}
                    isExistingCar={cars.some(c => c.vin === editingCar.vin)}
                    onSave={handleSaveCar}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    )
}

import { useState } from 'react'
import type { Car } from '../../models/car'
import { uploadImage } from '../../data/images'
import './AdminFormModal.css'

type Props = {
    carToEdit: Partial<Car>
    isExistingCar: boolean
    onSave: (car: Partial<Car>) => void
    onClose: () => void
}

export function AdminFormModal({ carToEdit, isExistingCar, onSave, onClose }: Props) {
    // Ținem o copie locală a mașinii pentru a o edita fără a afecta tabelul înainte de salvare
    const [localCar, setLocalCar] = useState<Partial<Car>>(carToEdit)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadError(null)

        try {
            const uploaded = await uploadImage(file)
            setLocalCar(prev => ({
                ...prev,
                image: uploaded.fileName
            }))
        } catch (error: any) {
            console.error("Failed to upload image:", error)
            setUploadError("Încărcarea imaginii a eșuat.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setLocalCar(prev => ({
            ...prev,
            image: ''
        }))
    }

    // Funcție care se ocupă de actualizarea valorilor din formular
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any
        setLocalCar(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }))
    }

    // Funcție apelată când se apasă butonul "Save Car"
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(localCar)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content admin-form" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}>&times;</button>
                <h2 className="modal-title">{isExistingCar ? 'Edit Car' : 'Add New Car'}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>VIN</label>
                            <input required type="text" name="vin" value={localCar.vin} onChange={handleInputChange} disabled={isExistingCar} />
                        </div>
                        <div className="form-group">
                            <label>Manufacturer</label>
                            <input required type="text" name="manufacturer" value={localCar.manufacturer} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <input required type="text" name="model" value={localCar.model} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Fuel Type</label>
                            <select name="fuelType" value={localCar.fuelType} onChange={handleInputChange}>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Gearbox</label>
                            <select name="gearbox" value={localCar.gearbox} onChange={handleInputChange}>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <input required type="number" name="constructionYear" value={localCar.constructionYear} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Price (EUR)</label>
                            <input required type="number" name="price" value={localCar.price} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Mileage</label>
                            <input required type="number" name="mileage" value={localCar.mileage} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Engine Size (cm3)</label>
                            <input required type="number" name="engineSize" value={localCar.engineSize} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Power (CP)</label>
                            <input required type="number" name="power" value={localCar.power} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Imagine Masina</label>
                            <div className="simple-upload-container">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="simple-upload-input"
                                    id="car-image-upload"
                                />
                                <label
                                    htmlFor="car-image-upload" 
                                    className="button simple-upload-btn"
                                >
                                    {isUploading ? 'Se încarcă...' : 'Alege imagine'}
                                </label>
                                
                                {localCar.image && (
                                    <div className="simple-upload-info">
                                        <span className="simple-upload-filename" title={localCar.image}>
                                            {localCar.image}
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={handleRemoveImage}
                                            className="simple-upload-delete"
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                )}
                            </div>
                            {uploadError && (
                                <div className="simple-upload-error">
                                    {uploadError}
                                </div>
                            )}
                        </div>
                        <div className="form-group full-width">
                            <label>Equipment (comma separated)</label>
                            <input type="text" name="equipment" value={localCar.equipment} onChange={handleInputChange} />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="button button-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="button button-save">Save Car</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

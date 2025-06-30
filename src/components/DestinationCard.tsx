import React, { useState } from 'react'
import { FiPlus, FiTrash2, FiImage, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface Destination {
  id: number;
  name: string;
  country: string;
}

interface DestinationCardProps {
  destination: Destination;
  onAddImages: (destinationId: number, imageUrls: string[]) => Promise<void>;
  onDeleteImages: (destinationId: number, imageUrls: string[]) => Promise<void>;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onAddImages, onDeleteImages }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [images, setImages] = useState([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

const fetchImages = async () => {
  if (!destination?.id) return console.warn('No destination ID')
  console.debug('Fetching images for destination:', destination.id)
  try {
    setIsLoading(true)

    const res = await fetch(`https://offtoholidays.com/api/packages/list-state-images/?state_id=${destination.id}`, {
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    })

    const data = await res.json()
    console.debug('Fetched images:', data)
    
    // Handle both possible response formats
    const imageUrls = Array.isArray(data.images) ? data.images : 
                    (Array.isArray(data.image_urls) ? data.image_urls : [])
    
    // Filter out any non-string URLs (like the toast.error example in your response)
    const validImages = imageUrls.filter((url: string) => typeof url === 'string' && url.startsWith('http'))
    
    setImages(validImages)
    setError(null)
    
    // Log if we filtered anything out
    if (imageUrls.length !== validImages.length) {
      console.warn('Filtered out invalid image URLs:', 
        imageUrls.filter((url: any) => !validImages.includes(url)))
    }
  } catch (err) {
    console.error('Failed to fetch images:', err)
    setImages([])
    setError('Failed to fetch images')
  } finally {
    setIsLoading(false)
  }
}


  const toggleExpand = () => {
    if (!isExpanded) {
      fetchImages()
    }
    setIsExpanded(!isExpanded)
  }

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return
    
    try {
      setIsLoading(true)
      await onAddImages(destination.id, [newImageUrl.trim()])
      setNewImageUrl('')
      await fetchImages()
    } catch (err) {
      setError('Failed to add image')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (url: any) => {
    try {
      setIsLoading(true)
      await onDeleteImages(destination.id, [url])
      await fetchImages()
    } catch (err) {
      setError('Failed to delete image')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="destination-card">
      <div 
        className="card-header"
        onClick={toggleExpand}
      >
        <div className="destination-info">
          <h3 className="destination-name">{destination.name}</h3>
          <p className="destination-country">{destination.country}</p>
        </div>
        <div className="card-controls">
          <span className="image-count">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </span>
          {isExpanded ? <FiChevronUp className="chevron-icon" /> : <FiChevronDown className="chevron-icon" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="card-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="add-image-form">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="image-input"
            />
            <button
              onClick={handleAddImage}
              disabled={isLoading}
              className="add-button"
            >
              <FiPlus className="button-icon" /> Add
            </button>
          </div>
          
          {isLoading && !images.length ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : images.length > 0 ? (
            <div className="image-grid">
              {images.map((url, index) => (
                <div key={index} className="image-container">
                  <img
                    src={url}
                    alt={`${destination.name} ${index + 1}`}
                    className="destination-image"
                    onError={(e: any) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'
                    }}
                  />
                  <div className="image-overlay">
                    <button
                      onClick={() => handleDeleteImage(url)}
                      disabled={isLoading}
                      className="delete-button"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiImage className="empty-icon" />
              <p>No images added yet</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default DestinationCard
import { useState, useEffect } from 'react'
import DestinationCard from '../src/components/DestinationCard'
import ImageModal from '../src/components/ImageModal'
import Navbar from '../src/components/Navbar'
import { toast } from 'sonner'

type Destination = {
  id: number
  name: string
  country: string
  [key: string]: any
}

const App = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('https://offtoholidays.com/api/packages/all-states/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        const data = await response.json()
        console.debug('Fetched destinations:', data)
        setDestinations(data)
        setIsLoading(false)
      } catch (error) {
        console.error('❌ Error fetching destinations:', error)
        setError('Failed to fetch destinations')
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const handleAddImages = async (stateId: { toString: () => any }, imageUrls: any) => {
    console.debug('Adding images:', { stateId, imageUrls })
    try {
      await fetch('https://offtoholidays.com/api/packages/add-state-images/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          state_id: stateId.toString(),
          image_urls: imageUrls
        })
      })
      console.debug('Images added:', imageUrls)
      console.debug('Images added successfully')
      toast.success('Images added successfully!')

    } catch (err) {
      console.error('Failed to add images:', err)
      toast.error('Something went wrong!')

    }
  }

  const handleDeleteImages = async (stateId: { toString: () => string }, imageUrls: string[]) => {
    console.debug('🗑 Deleting images for state:', stateId, 'Images:', imageUrls)

    try {
      const response = await fetch('https://offtoholidays.com/api/packages/delete-state-images/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          state_id: stateId.toString(),
          image_urls: imageUrls,
        }),
      })

      const contentType = response.headers.get('content-type') || ''

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Server responded with error:', response.status, errorText)
        throw new Error(`Failed with status ${response.status}`)
      }

      if (contentType.includes('application/json')) {
        const result = await response.json()
        console.debug('✅ Delete response:', result)
      } else {
        toast.success('✅ Images deleted successfully (no JSON returned)')
      }

    } catch (err) {
      console.error('❌ Failed to delete images:', err)
      throw new Error('Failed to delete images')
    }
  }

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="content-wrapper">
          <h1 className="page-title">Manage Destination Images</h1>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="destinations-grid">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination?.id}
                  destination={destination}
                  onAddImages={handleAddImages}
                  onDeleteImages={handleDeleteImages}
                />
              ))}
            </div>
          )}
        </div>

        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>

     
    </>
  )
}

export default App
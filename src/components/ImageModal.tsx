import { FiX } from 'react-icons/fi'

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
  return (
    <div className="image-modal">
      <div className="modal-content">
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close image modal"
        >
          <FiX className="close-icon" />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="modal-image"
        />
      </div>

     
    </div>
  )
}

export default ImageModal
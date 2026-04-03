import { useRef, useCallback, memo } from 'react'
import { FiCamera } from 'react-icons/fi'

function AvatarUpload({ currentAvatar, onUpload, isUploading }) {
  const fileInputRef = useRef(null)

  const handleBoxClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) {
        onUpload(file)
      }
    },
    [onUpload]
  )

  return (
    <div className="profile-section avatar-section">
      <div 
        className={`avatar-wrapper ${isUploading ? 'uploading' : ''}`} 
        onClick={handleBoxClick}
        title="Nhấn để thay đổi avatar"
      >
        {currentAvatar ? (
          <img src={currentAvatar} alt="Profile Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">
            <FiCamera size={32} />
          </div>
        )}
        <div className="avatar-overlay">
          <FiCamera size={24} />
          <span>Đổi ảnh</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default memo(AvatarUpload)

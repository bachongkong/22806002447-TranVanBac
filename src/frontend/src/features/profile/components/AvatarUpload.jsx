import { useRef, useCallback, memo } from 'react'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function AvatarUpload({ currentAvatar, onUpload, isUploading }) {
  const fileInputRef = useRef(null)

  const handleBoxClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          toast.error('Vui lòng chỉ tải lên file hình ảnh (JPEG, PNG, WebP)')
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error('Kích thước ảnh vượt quá giới hạn 5MB')
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }

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
            
          </div>
        )}
        <div className="avatar-overlay">
          
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

import { useState, useDeferredValue, useRef } from 'react'
import { FiUploadCloud, FiFileText, FiCheck, FiSave } from 'react-icons/fi'
import { useParseOcrCv, useUploadCv, useCreateOnlineCv } from '../hooks/useCv'
import { LoadingSpinner } from '@shared/components'
import './UploadCvOcr.css'

export default function UploadCvOcr() {
  const [selectedFile, setSelectedFile] = useState(null)
  
  // States of the editor
  const [draftText, setDraftText] = useState('')
  const [cvTitle, setCvTitle] = useState('')

  // Mutations
  const parseOcr = useParseOcrCv()
  const uploadStaticCv = useUploadCv()
  const createOnlineCv = useCreateOnlineCv()
  
  const fileInputRef = useRef(null)

  // Tránh delay trên textarea khi gõ mạnh (văn bản lớn 3k kí tự), tách biệt chuỗi hiển thị High Priority UI vs chuỗi preview Data
  const deferredText = useDeferredValue(draftText)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setCvTitle(file.name.split('.')[0] || 'My CV')
    setDraftText('')

    // Bắt đầu quá trình parse OCR
    parseOcr.mutate(file, {
      onSuccess: (res) => {
        // res.data.data.text dựa theo server format (ApiResponse.success -> data -> text)
        const extractedText = res.data?.data?.text || res.data?.text || 'Không trích xuất được text. Vui lòng kiểm tra lại file.'
        setDraftText(extractedText)
      }
    })
  }

  const handleTextChange = (e) => {
    setDraftText(e.target.value)
  }

  const handleSaveStatic = () => {
    if (!selectedFile) return
    uploadStaticCv.mutate(
      { file: selectedFile, title: cvTitle },
      { onSuccess: () => setSelectedFile(null) }
    )
  }

  const handleSaveAsOnline = () => {
    if (!deferredText) return
    // Ở đây ta có thể dùng AI để cấu trúc lại (parse JSON array) đối với advanced requirement. 
    // Trong giới hạn bài này, ta lưu rawtext vào field summary hoặc skills tạm:
    const data = {
      title: cvTitle || 'Online CV',
      parsedData: {
        summary: deferredText,
        skills: [],
        education: [],
        experience: [],
        projects: []
      }
    }
    createOnlineCv.mutate(data, { onSuccess: () => setSelectedFile(null) })
  }

  return (
    <div className="upload-ocr-container">
      <div className="upload-section">
        <h3 className="section-title">Upload & AI OCR Scan</h3>
        <p className="section-subtitle">
          Kéo thả hoặc chọn file PDF để hệ thống quét thông tin (OCR Parsing) ở luồng ẩn.
        </p>
        
        <div 
          className={`upload-dropzone ${parseOcr.isPending ? 'parsing' : ''}`}
          onClick={() => !parseOcr.isPending && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            hidden
            disabled={parseOcr.isPending}
          />
          
          {parseOcr.isPending ? (
            <div className="parsing-state">
              <LoadingSpinner />
              <p>Hệ thống AI đang bóc tách phân tích PDF của bạn...</p>
              <span className="parsing-note">Tiến trình này chạy nền (Worker Thread), không làm đứng hệ thống.</span>
            </div>
          ) : (
            <div className="idle-state">
              <FiUploadCloud className="upload-icon" />
              <p><strong>Bấm vào đây</strong> để chọn file PDF/Word</p>
              <span>Giới hạn 5MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor & Previewer */}
      {selectedFile && !parseOcr.isPending && (
        <div className="review-section fade-in">
          <div className="review-header">
            <h4><FiFileText /> Review Text bóc tách</h4>
            <div className="cv-title-input">
              <label>Tên CV (Dùng gọi nhớ):</label>
              <input 
                value={cvTitle} 
                onChange={(e) => setCvTitle(e.target.value)} 
                maxLength={40}
              />
            </div>
          </div>
          
          <div className="editor-wrapper">
            {/* Sử dụng draftText trực tiếp cho Value của input (không dùng deferred ở value HTML để tránh conflict con trỏ) */}
            <textarea
              className="ocr-textarea"
              value={draftText}
              onChange={handleTextChange}
              placeholder="Text chưa được bóc tách hoặc bạn cần điền lại nội dung tại đây..."
            />
            {/* Vùng Data Rendering dựa trên useDeferredValue: Giả định có preview HTML realtime bự nặng ở đây */}
            <div className="deferred-preview-box">
              <h5>Bản Preview Render Engine (Deferred)</h5>
              <div className="deferred-content">{deferredText}</div>
              <p className="deferred-note">
                (State render màn hình này có ưu tiên thấp hơn tốc độ gõ Textarea, chống lag UI khi chuỗi đạt &gt;5000 chars)
              </p>
            </div>
          </div>

          <div className="save-actions">
            <button 
              className="btn-outline" 
              onClick={handleSaveStatic}
              disabled={uploadStaticCv.isPending}
            >
              Lưu bản cứng kèm Text
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSaveAsOnline}
              disabled={createOnlineCv.isPending}
            >
              <FiSave /> Convert thành CV Trực Tuyến
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useCallback } from 'react'
import {
  useGetProfile,
  useUpdateProfile,
  useUploadAvatar,
  useChangePassword,
  AvatarUpload,
  BasicInfoForm,
  CandidateInfoForm,
  ChangePasswordForm,
} from '@features/profile'
import { LoadingSpinner } from '@shared/components'
import './MyProfilePage.css'

export default function MyProfilePage() {
  const { data: profile, isLoading } = useGetProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()

  const handleAvatarUpload = useCallback(
    (file) => {
      uploadAvatar(file)
    },
    [uploadAvatar]
  )

  const handleBasicInfoSubmit = useCallback(
    (data) => {
      updateProfile(data)
    },
    [updateProfile]
  )

  const handleCandidateInfoSubmit = useCallback(
    (data) => {
      updateProfile(data)
    },
    [updateProfile]
  )

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!profile) {
    return <div className="profile-page">Không thể tải thông tin cá nhân.</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1>Cài đặt cá nhân</h1>
        <p>Quản lý thông tin hồ sơ và bảo mật của bạn</p>
      </div>

      <div className="profile-container">
        <AvatarUpload
          currentAvatar={profile.avatar}
          onUpload={handleAvatarUpload}
          isUploading={isUploading}
        />

        <BasicInfoForm
          initialData={profile}
          onSubmit={handleBasicInfoSubmit}
          isPending={isUpdating}
        />

        <CandidateInfoForm
          initialData={profile}
          onSubmit={handleCandidateInfoSubmit}
          isPending={isUpdating}
        />

        <ChangePasswordForm
          onSubmit={changePassword}
          isPending={isChangingPassword}
        />
      </div>
    </div>
  )
}

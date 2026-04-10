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
  HrInfoForm,
  ProfileCompletionProgress,
} from '@features/profile'
import { LoadingSpinner } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import { ROLES } from '@shared/constants'
import './MyProfilePage.css'

export default function MyProfilePage() {
  const user = useAuthStore((state) => state.user)
  const { data: profile, isLoading } = useGetProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()

  const isCandidate = user?.role === ROLES.CANDIDATE
  const pageTitle = isCandidate ? 'Cai dat ca nhan' : 'Ho so nhan su'
  const pageSubtitle = isCandidate
    ? 'Quan ly thong tin ho so va bao mat cua ban'
    : 'Cap nhat thong tin ca nhan va vai tro tuyen dung cua ban'

  const handleAvatarUpload = useCallback(
    (file) => {
      uploadAvatar(file)
    },
    [uploadAvatar]
  )

  const handleProfileSubmit = useCallback(
    (data) => {
      updateProfile(data)
    },
    [updateProfile]
  )

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!profile) {
    return <div className="profile-page">Khong the tai thong tin ca nhan.</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
      </div>

      <div className="profile-container">
        <ProfileCompletionProgress profile={profile?.profile} role={user?.role} />

        <AvatarUpload
          currentAvatar={profile?.profile?.avatar}
          onUpload={handleAvatarUpload}
          isUploading={isUploading}
        />

        <BasicInfoForm
          initialData={profile?.profile}
          onSubmit={handleProfileSubmit}
          isPending={isUpdating}
        />

        {isCandidate ? (
          <CandidateInfoForm
            initialData={profile?.profile}
            onSubmit={handleProfileSubmit}
            isPending={isUpdating}
          />
        ) : (
          <HrInfoForm
            initialData={profile?.profile}
            onSubmit={handleProfileSubmit}
            isPending={isUpdating}
          />
        )}

        <ChangePasswordForm
          onSubmit={changePassword}
          isPending={isChangingPassword}
        />
      </div>
    </div>
  )
}

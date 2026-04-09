
import './CompanyStaffManager.css'

export default function CompanyStaffManager({ company }) {
  const addMember = useAddHrMember()
  const removeMember = useRemoveHrMember()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(hrMemberSchema),
    defaultValues: { email: '' },
  })

  // Nếu công ty chưa có ID (chưa được tạo) không cho thêm thành viên
  if (!company?._id) return null

  const onSubmit = (data) => {
    addMember.mutate(
      { id: company._id, email: data.email },
      {
        onSuccess: () => reset(), // Xóa form khi thành công
      }
    )
  }

  const handleRemove = (memberId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      removeMember.mutate({ id: company._id, memberId })
    }
  }

  const members = company.hrMembers || []
  const ownerId = company.createdBy?._id || company.createdBy

  return (
    <div className="staff-manager-container">
      <h2 className="section-title">Thành viên nhân sự (HR)</h2>
      <p className="section-subtitle">Chỉ những tài khoản có quyền HR mới có thể được thêm vào danh sách này.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="add-staff-form">
        <div className="add-input-wrapper">
          <input 
            type="email" 
            {...register('email')} 
            placeholder="Nhập email của người dùng HR..."
            className={errors.email ? 'input-error' : ''}
          />
          <button 
            type="submit" 
            className="btn btn--outline" 
            disabled={isSubmitting || addMember.isPending}
          >
            {addMember.isPending ? 'Đang thêm...' : <> Thêm</>}
          </button>
        </div>
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </form>

      <div className="staff-list">
        {members.length === 0 ? (
          <div className="empty-state">Chưa có thành viên nào.</div>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const isOwner = member._id === ownerId
                return (
                  <tr key={member._id}>
                    <td>
                      <div className="staff-info">
                        <img 
                          src={member.profile?.avatar || 'https://via.placeholder.com/40'} 
                          alt="avatar" 
                          className="staff-avatar"
                        />
                        <span>{member.profile?.fullName || 'Chưa cập nhật'}</span>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`role-badge ${isOwner ? 'owner' : 'member'}`}>
                        {isOwner ? 'Owner' : 'Member'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {!isOwner && (
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleRemove(member._id)}
                          disabled={removeMember.isPending}
                          title="Xóa thành viên"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

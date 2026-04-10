import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  const roleColors = {
    passenger: 'bg-blue-100 text-blue-800 border-blue-200',
    staff: 'bg-green-100 text-green-800 border-green-200',
    inspector: 'bg-orange-100 text-orange-800 border-orange-200',
    admin: 'bg-red-100 text-red-800 border-red-200'
  }

  const roleDescriptions = {
    passenger: 'Hành khách - Sử dụng hệ thống metro',
    staff: 'Nhân viên - Quản lý vé tại cổng',
    inspector: 'Kiểm soát viên - Kiểm tra vé thủ công',
    admin: 'Quản trị viên - Quản lý hệ thống'
  }

  const roleFeatures = {
    passenger: [
      'Xem thông tin tài khoản',
      'Mua vé metro',
      'Lịch sử giao dịch'
    ],
    staff: [
      'Kiểm tra vé tại cổng vào',
      'Xác nhận hợp lệ vé',
      'Báo cáo sự cố'
    ],
    inspector: [
      'Kiểm tra thủ công',
      'Lập biên bản vi phạm',
      'Xem lịch sử kiểm tra'
    ],
    admin: [
      'Quản lý người dùng',
      'Quản lý vé',
      'Xem báo cáo thống kê',
      'Cấu hình hệ thống'
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Metro Ticket Management System</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className={`inline-flex px-3 py-1 mt-2 text-sm font-medium rounded-full border ${roleColors[user?.role] || 'bg-gray-100'}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Role Description */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Vai trò của bạn</h3>
        <p className="text-gray-600">{roleDescriptions[user?.role]}</p>
      </div>

      {/* Features by Role */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chức năng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleFeatures[user?.role]?.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'staff' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="flex gap-4">
            <a
              href="/metro/validate"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Validate Vé
            </a>
          </div>
        </div>
      )}

      {user?.role === 'inspector' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="flex gap-4">
            <a
              href="/metro/inspection"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Kiểm tra thủ công
            </a>
          </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="flex gap-4">
            <a
              href="/admin/users"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Quản lý Users
            </a>
            <a
              href="/metro/validate"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Validate Vé
            </a>
            <a
              href="/metro/inspection"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Kiểm tra thủ công
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

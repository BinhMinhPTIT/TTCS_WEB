import React from 'react';
import { Package, Heart, Clock, Settings, LogOut, ShoppingBag } from 'lucide-react';

const Profile = () => {
  // Dữ liệu mẫu
  const userData = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123 456 789',
    address: '123 Đường ABC, Quận 1, TP. HCM',
    memberSince: '10/2023',
    avatar: '/api/placeholder/150/150',
    orders: [
      { id: '#12345', date: '15/03/2024', status: 'Đã giao', total: '890.000₫' },
      { id: '#12344', date: '10/03/2024', status: 'Đang giao', total: '450.000₫' },
    ],
    wishlist: [
      { name: 'Áo khoác jean nam', price: '599.000₫' },
      { name: 'Quần kaki nam', price: '399.000₫' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-gray-100 shadow mb-4"
                />
                <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Thành viên từ {userData.memberSince}</p>
              </div>
              
              <nav className="mt-6 space-y-2">
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 text-blue-600">
                  <ShoppingBag size={20} />
                  <span>Đơn hàng của tôi</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Heart size={20} />
                  <span>Danh sách yêu thích</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Settings size={20} />
                  <span>Cài đặt tài khoản</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-red-500">
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Email</label>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Số điện thoại</label>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600">Địa chỉ giao hàng</label>
                    <p className="font-medium">{userData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Đơn hàng gần đây */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3">Mã đơn hàng</th>
                        <th className="pb-3">Ngày đặt</th>
                        <th className="pb-3">Trạng thái</th>
                        <th className="pb-3">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.orders.map(order => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-4">{order.id}</td>
                          <td className="py-4">{order.date}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4">{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Danh sách yêu thích */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Danh sách yêu thích</h3>
                <div className="space-y-4">
                  {userData.wishlist.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-blue-600">{item.price}</p>
                      </div>
                      <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                        Thêm vào giỏ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
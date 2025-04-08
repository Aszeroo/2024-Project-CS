import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons'; // เพิ่มไอคอน UserOutlined

const Header = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | 'GUEST'>('GUEST');
  const [userName, setUserName] = useState<string>(''); // เพิ่มการเก็บชื่อผู้ใช้

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user?.role || 'GUEST');
    setUserName(user?.username || ''); // เก็บชื่อผู้ใช้
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // สร้างเมนูสำหรับ dropdown
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout} className="text-red-600 hover:text-red-800">
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-lg border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Building2 className="h-8 w-8 text-purple-600" />
            <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              หอพักมิตรสหาย
            </h1>
          </div>

          <nav className="flex space-x-6 items-center">
            <a href="/rooms" className="text-gray-700 hover:text-purple-600 font-medium">ห้องพัก</a>
            {userRole === 'USER' && (
              <a href="/my-bookings" className="text-gray-700 hover:text-purple-600 font-medium">การจองของฉัน</a>
            )}

            {userRole === 'ADMIN' && (
              <>
                <button onClick={() => navigate('/admin/editrooms')} className="text-gray-700 hover:text-purple-600 font-medium">จัดการห้อง</button>
                <button onClick={() => navigate('/admin/bookings')} className="text-gray-700 hover:text-purple-600 font-medium">จัดการการจอง</button>
                <button onClick={() => navigate('/admin/dashboard')} className="text-gray-700 hover:text-purple-600 font-medium">Dashboard</button>
              </>
            )}

            {/* แสดงชื่อผู้ใช้ใน header พร้อม Dropdown และไอคอนผู้ใช้ */}
            {userRole !== 'GUEST' && (
              <Dropdown overlay={menu} trigger={['click']}>
                <span className="text-gray-700 font-medium cursor-pointer flex items-center">
                  <UserOutlined className="mr-2" /> {/* ไอคอนผู้ใช้ */}
                  {userName} <DownOutlined />
                </span>
              </Dropdown>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

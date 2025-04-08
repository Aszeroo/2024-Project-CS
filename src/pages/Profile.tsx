import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // หากผู้ใช้ยังไม่ได้เข้าสู่ระบบ จะทำการนำไปยังหน้าล็อกอิน
  if (!user) {
    navigate('/login'); // ไปยังหน้า login
    return null; // ไม่แสดงอะไรจนกว่าจะโหลดข้อมูล
  }

  return (
    <div className="profile-container p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ข้อมูลผู้ใช้</h2>
      <p><strong>ชื่อผู้ใช้:</strong> {user.username}</p>
      <p><strong>รหัสผู้ใช้ (ID):</strong> {user.id}</p>
      <p><strong>บทบาทผู้ใช้:</strong> {user.role}</p>
    </div>
  );
}

export default Profile;

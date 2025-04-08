import React from 'react';

function Profile() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return <p>กรุณาเข้าสู่ระบบก่อน</p>;

  return (
    <div>
      <h2>ข้อมูลผู้ใช้</h2>
      <p><strong>ชื่อผู้ใช้:</strong> {user.username}</p>
      <p><strong>รหัสผู้ใช้ (ID):</strong> {user.id}</p>
    </div>
  );
}

export default Profile;

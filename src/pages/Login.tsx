import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // เริ่ม loading
    try {
      const res = await axios.post<{ user: { username: string; role: 'user' | 'admin'; userId: string, token: string } }>('/api/login', {
        username,
        password,
      });

      const user = res.data.user;
      // เก็บข้อมูลผู้ใช้และ token ลงใน localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('token', user.token); // เก็บ token เพื่อใช้งานใน API requests ต่อไป

      message.success('เข้าสู่ระบบสำเร็จ');

      setTimeout(() => {
        navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Home หรือหน้า Dashboard
      }, 1000);
    } catch (err: any) {
      message.error(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false); // หยุด loading
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow relative">
      <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
      <Spin spinning={loading} tip="กำลังเข้าสู่ระบบ..." size="large">
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ชื่อผู้ใช้"
            className="w-full p-3 border rounded-xl"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            className="w-full p-3 border rounded-xl"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-300 text-white py-3 rounded-xl hover:bg-green-500"
            disabled={loading}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            className="w-full bg-orange-300 text-white py-3 rounded-xl hover:bg-orange-500"
            disabled={loading}
            onClick={() => navigate('/register')} // เพิ่มการไปยังหน้า Register
          >
            สมัครสมาชิก
          </button>
        </form>
      </Spin>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';

interface Props {
  onSignUp?: (username: string, password: string) => void;
}

const Register: React.FC<Props> = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 🔐 ตรวจสอบความปลอดภัยของรหัสผ่าน
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      message.error('รหัสผ่านต้องมีอย่างน้อย 8 ตัว รวมพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ');
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post<{ message: string }>('/api/register', {
        username,
        password,
      });
  
      message.success('สมัครสมาชิกสำเร็จ');
      onSignUp?.(username, password);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      message.error(err.response?.data?.error || 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow relative">
      <h2 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h2>
      <Spin spinning={loading} tip="กำลังสมัครสมาชิก..." size="large">
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="ชื่อผู้ใช้"
            className="w-full p-3 border rounded-xl"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            className="w-full p-3 border rounded-xl"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-300 text-white py-3 rounded-xl hover:bg-green-500"
            disabled={loading}
          >
            สมัครสมาชิก
          </button>
          <button
            type="button"
            className="w-full bg-orange-300 text-white py-3 rounded-xl hover:bg-orange-500"
            disabled={loading}
            onClick={() => navigate('/login')} // เพิ่มการไปยังหน้า Register
          >
            กลับสู่เข้าสู่ระบบ
          </button>
        </form>
      </Spin>
    </div>
  );
};

export default Register;

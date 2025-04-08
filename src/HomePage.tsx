import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, BedDouble, Calendar, Wallet } from 'lucide-react';
import axios from 'axios';
import Header from './components/Header';

export interface Room {
  id: number;
  number: string;
  price: number;
  type: string;
  status: 'available' | 'occupied';
  size: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      navigate('/login'); // ✅ ถ้ายังไม่ได้ login
      return;
    }

    const fetchRooms = async () => {
      try {
        const res = await axios.get<Room[]>('/api/rooms');
        setRooms(res.data);
      } catch (error) {
        console.error('❌ ดึงห้องล้มเหลว:', error);
      }
    };

    fetchRooms();
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Hero */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          alt="หอพัก"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h2 className="text-5xl font-bold mb-6 leading-tight">ยินดีต้อนรับสู่หอพักมิตรสหาย</h2>
            <p className="text-xl text-purple-100">ห้องพักสะอาด สะดวก ปลอดภัย ใกล้มหาวิทยาลัย</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <BedDouble className="h-10 w-10 text-purple-600 mb-6" />,
              title: "ห้องพักสะอาด",
              desc: "ห้องพักสะอาด เฟอร์นิเจอร์ครบครัน พร้อมเข้าอยู่",
            },
            {
              icon: <Calendar className="h-10 w-10 text-purple-600 mb-6" />,
              title: "จองง่าย",
              desc: "ระบบจองห้องพักออนไลน์ สะดวก รวดเร็ว",
            },
            {
              icon: <Wallet className="h-10 w-10 text-purple-600 mb-6" />,
              title: "ราคาเป็นกันเอง",
              desc: "ราคาเริ่มต้นเพียง 3,500 บาท/เดือน",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
     

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-200">© 2025 หอพักมิตรสหาย. สงวนลิขสิทธิ์</p>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;

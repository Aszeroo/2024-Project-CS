import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export interface Room {
  id: number;
  number: string;
  price: number;
  type: string;
  status: 'available' | 'occupied';
  size: string;
}

function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get<Room[]>('/api/rooms');
        setRooms(res.data); // ไม่ต้องทำการ decode อีกต่อไป
      } catch (err) {
        console.error('❌ ไม่สามารถโหลดห้องพักได้:', err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            รายการห้องว่าง
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
                <img
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"
                  alt={`ห้อง ${room.number}`}
                  className="w-full h-56 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">ห้อง {room.number}</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><span className="font-medium">ประเภท:</span> {room.type}</p>
                    <p><span className="font-medium">ขนาด:</span> {room.size}</p>
                    <p><span className="font-medium">ราคา:</span> {room.price.toLocaleString()} บาท/เดือน</p>
                    <p className={`font-semibold ${room.status === 'available' ? 'text-emerald-600' : 'text-red-600'}`}>
                      <span className="font-medium">สถานะ:</span> {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                    </p>
                  </div>
                  {room.status === 'available' && (
                    <button
                      onClick={() => navigate(`/booking/${room.id}`)}
                      className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300"
                    >
                      จองห้องพัก
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;

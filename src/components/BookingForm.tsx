import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import Header from './Header';
import { encode, decode } from 'base-64';  // ใช้ base-64

const BookingForm = () => {
  const { roomId } = useParams();
  const [formData, setFormData] = useState({ name: '', phone: '', date: '' });
  const [roomNumber, setRoomNumber] = useState<string>('');
  const navigate = useNavigate();

  interface Room {
    id: number;
    number: string;
    price: number;
    type: string;
    status: 'available' | 'occupied';
    size: string;
  }

  // ตรวจสอบการล็อกอินก่อน
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      message.error('คุณต้องเข้าสู่ระบบก่อน');
      navigate('/login'); // รีไดเร็กต์ไปยังหน้าล็อกอิน
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get<Room>(`http://localhost:5173/api/rooms/${roomId}`);
        setRoomNumber(res.data.number);
      } catch (err) {
        console.error('❌ ไม่สามารถดึงข้อมูลห้องได้:', err);
        message.error('❌ ไม่พบห้องนี้ในระบบ');
      }
    };

    if (roomId) fetchRoom();
  }, [roomId]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');  // ดึงข้อมูลผู้ใช้จาก localStorage
  
    if (!user.id) {
      message.error('คุณต้องเข้าสู่ระบบก่อน');
      return;
    }
  
    const encodedData = {
      name: encode(formData.name),
      phone: encode(formData.phone),
      date: encode(formData.date),
      roomNumber: encode(roomNumber),
      userId: user.id,
    };
    
    try {
      // ส่งข้อมูลไปที่ API เพื่อจองห้อง
      await axios.post('http://localhost:5000/api/bookings', encodedData); // Ensure using the correct backend URL
      message.success('✅ จองห้องสำเร็จแล้ว');
    } catch (err) {
      console.error(err);
      message.error('❌ เกิดข้อผิดพลาดในการจอง');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">จองห้องพักหมายเลข {roomNumber || 'ไม่พบข้อมูลห้อง'}</h2>
        <input
          name="name"
          onChange={handleChange}
          value={formData.name}
          placeholder="ชื่อผู้จอง"
          required
          className="mb-4 w-full border p-2 rounded"
        />
        <input
          name="phone"
          onChange={handleChange}
          value={formData.phone}
          placeholder="เบอร์โทร"
          required
          className="mb-4 w-full border p-2 rounded"
        />
        <input
          name="date"
          onChange={handleChange}
          value={formData.date}
          type="date"
          required
          className="mb-4 w-full border p-2 rounded"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">จองเลย</button>
      </form>
    </div>
  );
};

export default BookingForm;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Table, Button, Popconfirm } from 'antd';
import Header from '../components/Header';

interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  roomNumber: number;
  userId: number;
}

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]); // ประกาศ useState สำหรับ bookings

  const fetchMyBookings = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  // ดึงข้อมูล user จาก localStorage
    
    if (!user || !user.token) {
      message.error('กรุณาล็อกอิน');
      return;
    }

    try {
      const res = await axios.get<Booking[]>('/api/bookings/my', {
        headers: {
          'Authorization': `Bearer ${user.token}`,  // ส่ง token ใน headers
        },
      });
      setBookings(res.data);  // ตั้งค่า bookings จากข้อมูลที่ได้
    } catch (err) {
      console.error('❌ ไม่สามารถโหลดข้อมูลการจองของฉัน:', err);
      message.error('ไม่สามารถโหลดการจองของคุณได้');
    }
  };

  useEffect(() => {
    fetchMyBookings(); // เรียก fetchMyBookings เมื่อหน้าโหลด
  }, []);

  const cancelBooking = async (id: number) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      message.success('✅ ยกเลิกการจองสำเร็จ');
      fetchMyBookings(); // โหลดข้อมูลการจองใหม่หลังจากยกเลิก
    } catch (err) {
      console.error('❌ ยกเลิกการจองล้มเหลว:', err);
      message.error('เกิดข้อผิดพลาดในการยกเลิกการจอง');
    }
  };

  const columns = [
    {
      title: 'ห้อง',
      dataIndex: 'roomNumber',
    },
    {
      title: 'ชื่อผู้จอง',
      dataIndex: 'name',
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
    },
    {
      title: 'วันที่จอง',
      dataIndex: 'date',
      render: (text: string) => new Date(text).toLocaleDateString('th-TH'),
    },
    {
      title: 'ยกเลิก',
      render: (_: any, record: Booking) => (
        <Popconfirm
          title="ยืนยันยกเลิกการจอง?"
          onConfirm={() => cancelBooking(record.id)}
          okText="ใช่"
          cancelText="ไม่"
        >
          <Button danger>ยกเลิก</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🛏 การจองของฉัน</h2>
        <Table
          columns={columns}
          dataSource={bookings}  // ใช้ bookings ที่ประกาศไว้
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}

export default MyBookings;

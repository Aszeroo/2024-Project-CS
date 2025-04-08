import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Popconfirm, Button } from 'antd';
import Header from '../components/Header';

interface Booking {
  id: number;
  name: string;
  phone: string;
  roomNumber: number;
  date: string;
}

function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get<Booking[]>('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (err) {
      message.error('โหลดข้อมูลการจองไม่สำเร็จ');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/api/bookings/${id}`);
      if (response.status === 200) {
        message.success('ลบห้องสำเร็จ');
        fetchBookings();  // รีเฟรชข้อมูลการจอง
      }
    } catch (err) {
      console.error(err);
      message.error('ลบห้องไม่สำเร็จ');
    }
  };
  

  const columns = [
    {
      title: 'เลขห้อง',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: 'ชื่อผู้จอง',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'วันที่จอง',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'การจัดการ',
      key: 'action',
      render: (_: any, record: Booking) => (
        <Popconfirm
          title="ยืนยันการลบการจองนี้?"
          onConfirm={() => handleDelete(record.id)}
          okText="ใช่"
          cancelText="ไม่"
        >
          <Button danger>ลบ</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <Header />
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">📋 รายการจองห้องพัก</h2>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
    </div>
  );
}

export default AdminBookingPage;

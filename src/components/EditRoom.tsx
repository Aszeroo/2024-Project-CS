import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, message } from 'antd';
import Header from './Header';

interface Room {
  id: number;
  number: string;
  price: number;
  type: string;
  status: 'available' | 'occupied';
  size: string;
}

function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [formRoom, setFormRoom] = useState<Omit<Room, 'id'>>({
    number: '',
    price: 0,
    type: 'แอร์',
    status: 'available',
    size: '4x5',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get<Room[]>('/api/rooms');
      setRooms(res.data); // ดึงข้อมูลห้องที่ไม่ต้อง decode
    } catch (err) {
      message.error('โหลดข้อมูลห้องไม่สำเร็จ');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormRoom({ number: '', price: 0, type: 'แอร์', status: 'available', size: '4x5' });
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setIsEditing(true);
    setSelectedRoomId(room.id);
    setFormRoom({
      number: room.number,
      price: room.price,
      type: room.type,
      status: room.status,
      size: room.size,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formRoom,
      price: Number(formRoom.price),
    };

    try {
      if (isEditing && selectedRoomId !== null) {
        await axios.put(`/api/rooms/${selectedRoomId}`, payload);
        message.success('แก้ไขห้องสำเร็จ');
      } else {
        await axios.post('/api/rooms', payload);
        message.success('เพิ่มห้องสำเร็จ');
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      message.error(isEditing ? 'แก้ไขห้องไม่สำเร็จ' : 'เพิ่มห้องไม่สำเร็จ');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('ต้องการลบห้องนี้ใช่ไหม')) {
      try {
        await axios.delete(`/api/rooms/${id}`);
        message.success('ลบห้องสำเร็จ');
        fetchRooms();
      } catch (err) {
        message.error('ลบห้องไม่สำเร็จ');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <div className="p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">จัดการห้องพัก</h2>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ เพิ่มห้อง
          </button>
        </div>

        <table className="w-full border-collapse border">
          <thead className="bg-purple-100">
            <tr>
              <th className="p-2 border">เลขห้อง</th>
              <th className="p-2 border">ประเภท</th>
              <th className="p-2 border">ขนาด</th>
              <th className="p-2 border">ราคา</th>
              <th className="p-2 border">สถานะ</th>
              <th className="p-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="text-center border">
                <td className="p-2 border">{room.number}</td>
                <td className="p-2 border">{room.type}</td>
                <td className="p-2 border">{room.size}</td>
                <td className="p-2 border">{room.price.toLocaleString()}</td>
                <td className="p-2 border">{room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => openEditModal(room)}
                    className="bg-yellow-400 px-4 py-1 rounded mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          title={isEditing ? 'แก้ไขห้อง' : 'เพิ่มห้องใหม่'}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          okText="บันทึก"
          cancelText="ยกเลิก"
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="เลขห้อง"
              value={formRoom.number}
              onChange={(e) => setFormRoom({ ...formRoom, number: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <select
              value={formRoom.type}
              onChange={(e) => setFormRoom({ ...formRoom, type: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="แอร์">แอร์</option>
              <option value="พัดลม">พัดลม</option>
            </select>
            <select
              value={formRoom.size}
              onChange={(e) => setFormRoom({ ...formRoom, size: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="4x5">4x5</option>
              <option value="4x3">4x3</option>
              <option value="5x5">5x5</option>
            </select>
            <input
              type="number"
              placeholder="ราคา"
              value={formRoom.price}
              onChange={(e) => setFormRoom({ ...formRoom, price: Number(e.target.value) })}
              className="w-full border p-2 rounded"
            />
            <select
              value={formRoom.status}
              onChange={(e) =>
                setFormRoom({ ...formRoom, status: e.target.value as 'available' | 'occupied' })
              }
              className="w-full border p-2 rounded"
            >
              <option value="available">ว่าง</option>
              <option value="occupied">ไม่ว่าง</option>
            </select>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AdminPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, Tooltip, Title } from 'chart.js';
import Header from '../components/Header';

ChartJS.register(CategoryScale, BarElement, LinearScale, Tooltip, Title);

interface Stats {
    totalBookings: number;
    occupiedRooms: number;
    availableRooms: number;
  }
  
  interface DailyStat {
    day: string;
    count: number;
  }
  
  interface MonthlyStat {
    month: string;
    count: number;
  }

function DashboardPage() {


    
    const [stats, setStats] = useState<Stats>({
        totalBookings: 0,
        occupiedRooms: 0,
        availableRooms: 0,
      });
      
      const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
      const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);

      useEffect(() => {
        axios.get<Stats>('/api/bookings/stats')
          .then((res) => setStats(res.data))
          .catch((err) => console.error('❌ ดึงสถิติล้มเหลว', err));
      }, []);
      
      useEffect(() => {
        axios.get<DailyStat[]>('/api/bookings/statistics/daily')
          .then((res) => setDailyStats(res.data));
        axios.get<MonthlyStat[]>('/api/bookings/statistics/monthly')
          .then((res) => setMonthlyStats(res.data));
      }, []);

  const dailyChartData = {
    labels: dailyStats.map((s: any) => s.day),
    datasets: [
      {
        label: 'การจองต่อวัน',
        data: dailyStats.map((s: any) => Number(s.count)),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyStats.map((s: any) => s.month),
    datasets: [
      {
        label: 'การจองต่อเดือน',
        data: monthlyStats.map((s: any) => Number(s.count)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (

<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <Header />
    
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">📊 สถิติการจอง</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-bold text-purple-600">ยอดจองทั้งหมด</h3>
          <p className="text-4xl">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-bold text-green-600">ห้องที่ไม่ว่าง</h3>
          <p className="text-4xl">{stats.occupiedRooms}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-bold text-blue-600">ห้องที่ว่างอยู่</h3>
          <p className="text-4xl">{stats.availableRooms}</p>
        </div>
      </div>

      <Card className="mb-6">
        <Bar data={dailyChartData} options={{ responsive: true }} />
      </Card>
      <Card>
        <Bar data={monthlyChartData} options={{ responsive: true }} />
      </Card>
    </div>
    </div>
  );
}

export default DashboardPage;

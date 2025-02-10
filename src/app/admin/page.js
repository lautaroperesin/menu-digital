'use client'

import { useEffect, useState } from "react";
import { fetchDashboardData } from "@/utils/api";
import { LuShoppingCart, LuPackage2, LuTrendingUp   } from "react-icons/lu";
import { FaDollarSign } from "react-icons/fa";
import SalesChart from "@/components/SalesChart";
import TopProductsTable from "@/components/TopProductsTable";
import Link from "next/link";

export default function AdminPanel() {
  const [dashboardData, setDashboardData] = useState({
    pendingOrders: 0,
    totalProducts: 0,
    dailyIncome: 0,
    weeklySales: [],
    weeklyTotal: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData()
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);
  
  return (
    <div className="space-y-12">
      <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/pedidos">
          <StatCard 
            title="Pedidos Pendientes" 
            value={dashboardData.pendingOrders}
            icon={<LuShoppingCart className="h-10 w-10 text-blue-600" />} 
            className="bg-white shadow-xl p-8 rounded-xl hover:shadow-2xl transition-all duration-300 ease-out hover:bg-blue-50"
          />
        </Link>
        <Link href="/admin/productos">
          <StatCard 
            title="Total Productos" 
            value={dashboardData.totalProducts}
            icon={<LuPackage2 className="h-10 w-10 text-green-600" />} 
            className="bg-white shadow-xl p-8 rounded-xl hover:shadow-2xl transition-all duration-300 ease-out hover:bg-green-50"
          />
        </Link>

        <StatCard 
          title="Ingresos del Día" 
          value={`$${dashboardData.dailyIncome}`} 
          icon={<FaDollarSign className="h-10 w-10 text-yellow-600" />} 
          className="bg-white shadow-xl p-8 rounded-xl hover:shadow-2xl transition-all duration-300 ease-out hover:bg-yellow-50"
        />
        <Link href="/admin/reserva">
          <StatCard 
            title="Reservas" 
            icon={<LuShoppingCart className="h-10 w-10 text-blue-600" />} 
            className="bg-white shadow-xl p-8 rounded-xl hover:shadow-2xl transition-all duration-300 ease-out hover:bg-blue-50"
          />
        </Link>
      </div>
  
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow-xl p-10 rounded-xl">
          <header className="border-b border-gray-300 pb-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800">Ventas de la Semana</h3>
          </header>
          <div>
            <SalesChart weeklySales={dashboardData.weeklySales} weeklyTotal={dashboardData.weeklyTotal} />
          </div>
        </div>
        <div className="bg-white shadow-xl p-10 rounded-xl">
          <header className="border-b border-gray-300 pb-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800">Productos Más Vendidos de la Semana</h3>
          </header>
          <div>
            <TopProductsTable />
          </div>
        </div>
      </div>
    </div>
  );
  
  function StatCard({ title, value, icon, className }) {
    return (
      <div className={`hover:bg-gray-100 transition-all duration-300 ease-in-out ${className}`}>
        <header className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          {icon}
        </header>
        <div className="text-4xl font-bold text-gray-900">{value}</div>
      </div>
    );
  }
   }
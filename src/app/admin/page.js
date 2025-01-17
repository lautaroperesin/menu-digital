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
    dailyIncome: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        console.log('data:', data);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    console.log('dashboardData actualizado:', dashboardData);
  }, [dashboardData]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/pedidos">
        <StatCard 
          title="Pedidos Pendientes" 
          value={dashboardData.pendingOrders}
          icon={<LuShoppingCart className="h-8 w-8" />} 
        />
        </Link>
        <Link href="/admin/productos">
        <StatCard 
          title="Total Productos" 
          value={dashboardData.totalProducts}
          icon={<LuPackage2 className="h-8 w-8" />} 
        />
        </Link>
        <StatCard 
          title="Ingresos del Día" 
          value={`$${dashboardData.dailyIncome}`} 
          icon={<FaDollarSign className="h-8 w-8" />} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-yellow-100 text-black">
          <header>
            <h3>Ventas de la Semana</h3>
          </header>
          <div>
            <SalesChart />
          </div>
        </div>
        <div className="bg-yellow-100 text-black">
          <header>
            <h3>Productos Más Vendidos</h3>
          </header>
          <div>
            <TopProductsTable />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="hover:bg-yellow-200 transition duration-300">
      <header className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </header>
      <div className="flex flex-row items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  )
  }
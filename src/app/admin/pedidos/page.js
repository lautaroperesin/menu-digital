import OrderManagement from "@/components/OrderManagement/OrderManagement";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-bold text-center bg-yellow-500 mb-1">Gestión de pedidos</h1>
      <OrderManagement />
    </div>
  );
}
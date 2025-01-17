export async function fetchDashboardData() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/pedidos'),
        fetch('/api/productos')
      ]);
  
      const orders = await ordersRes.json();
      const products = await productsRes.json();
  
      // Obtener pedidos pendientes
      const pendingOrders = orders.filter(order => order.estado === 'pendiente').length;
  
      // Total de productos
      const totalProducts = products.length;
  
      // Ingresos del día
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailyIncome = orders
        .filter(order => {
            // Asegurarse de que fecha_hora existe y convertirlo a fecha
            if (!order.fecha_hora) return false;
            const orderDate = new Date(order.fecha_hora);
            return orderDate >= today;  
        })
        .reduce((total, order) => {
            return total + parseFloat(order.total || 0)
        }, 0);

        return {
        pendingOrders,
        totalProducts,
        dailyIncome
        };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
  
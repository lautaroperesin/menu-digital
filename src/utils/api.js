export async function fetchDashboardData() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/pedidos'),
        fetch('/api/productos')
      ]);
  
      const orders = await ordersRes.json();
      const products = await productsRes.json();

      // Función auxiliar para formatear fechas
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      // Obtener fechas de la semana actual
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calcular el inicio de la semana (Lunes)
      const weekStart = new Date(today);
      const currentDay = today.getDay();
      const diff = currentDay === 0 ? -6 : 1; // Si es domingo, retrocede 6 días, si no, avanza 1
      weekStart.setDate(today.getDate() - currentDay + diff);

      // Crear array con los días de lunes a domingo
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return formatDate(date);
      });

      // Calcular ventas por día
      const weeklySales = weekDays.map(date => {
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.fecha_hora);
          return formatDate(orderDate) === date;
        });

        const dayTotal = dayOrders.reduce((total, order) => {
          return total + parseFloat(order.total || 0)
        }, 0);

        return {
          date,
          dayName: new Date(date).toLocaleDateString('es', { 
            weekday: 'long',
            timeZone: 'UTC'
          }),
          total: dayTotal
        };
      });
  
      // Obtener pedidos pendientes
      const pendingOrders = orders.filter(order => order.estado === 'pendiente').length;
  
      // Total de productos
      const totalProducts = products.length;

      const dailyIncome = orders
        .filter(order => {
            // Asegurarse de que fecha_hora existe y convertirlo a fecha
            if (!order.fecha_hora) return false;
            const orderDate = new Date(order.fecha_hora);
            return formatDate(orderDate) === formatDate(today);
        })
        .reduce((total, order) => {
            return total + parseFloat(order.total || 0)
        }, 0);

        const weeklyTotal = weeklySales.reduce((total, day) => total + day.total, 0);

        return {
        pendingOrders,
        totalProducts,
        dailyIncome,
        weeklySales,
        weeklyTotal
        };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
  
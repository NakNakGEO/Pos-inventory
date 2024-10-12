import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          dashboard: 'Dashboard',
          products: 'Products',
          categories: 'Categories',
          suppliers: 'Suppliers',
          customers: 'Customers',
          pos: 'Point of Sale',
          reports: 'Reports',
          settings: 'Settings',
          logout: 'Logout',
          search: 'Search',
          add: 'Add',
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          cancel: 'Cancel',
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          addCustomer: 'Add Customer',
          updateCustomer: 'Update Customer',
          actions: 'Actions',
          searchProducts: 'Search products...',
          stock: 'Stock',
          addToCart: 'Add to Cart',
          cart: 'Cart',
          subtotal: 'Subtotal',
          discount: 'Discount',
          total: 'Total',
          cash: 'Cash',
          card: 'Card',
          mobilePay: 'Mobile Payment',
          selectCustomer: 'Select Customer',
          completeSale: 'Complete Sale',
          startDate: 'Start Date',
          endDate: 'End Date',
          allCategories: 'All Categories',
          salesReport: 'Sales Report',
          date: 'Date',
          product: 'Product',
          category: 'Category',
          quantity: 'Quantity',
          paymentMethod: 'Payment Method',
          noSalesData: 'No sales data found for the selected criteria.',
          salesByCategory: 'Sales by Category',
          topSellingProducts: 'Top Selling Products',
          inventoryForecast: 'Inventory Forecast',
        },
      },
      es: {
        translation: {
          dashboard: 'Tablero',
          products: 'Productos',
          categories: 'Categorías',
          suppliers: 'Proveedores',
          customers: 'Clientes',
          pos: 'Punto de Venta',
          reports: 'Informes',
          settings: 'Configuración',
          logout: 'Cerrar sesión',
          search: 'Buscar',
          add: 'Agregar',
          edit: 'Editar',
          delete: 'Eliminar',
          save: 'Guardar',
          cancel: 'Cancelar',
          name: 'Nombre',
          email: 'Correo electrónico',
          phone: 'Teléfono',
          addCustomer: 'Agregar Cliente',
          updateCustomer: 'Actualizar Cliente',
          actions: 'Acciones',
          searchProducts: 'Buscar productos...',
          stock: 'Existencias',
          addToCart: 'Agregar al Carrito',
          cart: 'Carrito',
          subtotal: 'Subtotal',
          discount: 'Descuento',
          total: 'Total',
          cash: 'Efectivo',
          card: 'Tarjeta',
          mobilePay: 'Pago Móvil',
          selectCustomer: 'Seleccionar Cliente',
          completeSale: 'Completar Venta',
          startDate: 'Fecha de Inicio',
          endDate: 'Fecha de Fin',
          allCategories: 'Todas las Categorías',
          salesReport: 'Informe de Ventas',
          date: 'Fecha',
          product: 'Producto',
          category: 'Categoría',
          quantity: 'Cantidad',
          paymentMethod: 'Método de Pago',
          noSalesData: 'No se encontraron datos de ventas para los criterios seleccionados.',
          salesByCategory: 'Ventas por Categoría',
          topSellingProducts: 'Productos Más Vendidos',
          inventoryForecast: 'Pronóstico de Inventario',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
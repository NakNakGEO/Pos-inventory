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
          // Add your English translations here
          products: {
            title: 'Products',
            addProduct: 'Add Product',
            name: 'Name',
            category: 'Category',
            supplier: 'Supplier',
            price: 'Price',
            stock: 'Stock',
            actions: 'Actions',
          },
          pos: {
            title: 'Point of Sale',
            cart: 'Cart',
            checkout: 'Checkout',
            total: 'Total',
          },
          errorBoundary: {
            title: 'Oops! Something went wrong.',
            message: 'We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.',
            refresh: 'Refresh Page'
          },
          // Add more translations as needed
        },
      },
      // Add other languages as needed
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

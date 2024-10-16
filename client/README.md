# Pos-inventory

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/NakNakGEO/Pos-inventory)

A comprehensive Point of Sale (POS) and Inventory Management System built with React, TypeScript, and Node.js.

## Features

- User Authentication and Authorization
- Product Management
- Category Management
- Supplier Management
- Customer Management
- Point of Sale (POS) Interface
- Purchase Order Management
- Reporting and Analytics
- Multi-language Support
- Dark Mode

## Project Structure

The project is divided into two main parts: client (frontend) and server (backend).

### Client

The client-side is built with React and TypeScript, using Vite as the build tool.

Key files and directories:

- `src/`
  - `components/`: Reusable React components
  - `contexts/`: React context providers
  - `pages/`: Main page components
  - `services/`: API service functions
  - `utils/`: Utility functions
  - `App.tsx`: Main application component
  - `main.tsx`: Entry point of the application
  - `i18n.ts`: Internationalization configuration

### Server

The server-side is built with Node.js, Express, and TypeScript.

Key files and directories:

- `src/`
  - `routes/`: API route definitions
  - `scripts/`: Utility scripts
  - `auth.ts`: Authentication middleware
  - `supabase.ts`: Supabase client configuration
  - `index.ts`: Main server file

## Algorithms

The Pos-inventory system employs several algorithms to enhance its functionality and performance:

1. **Search Algorithm**: Implements a fuzzy search algorithm for product and customer lookups, allowing for partial matches and typo tolerance.

2. **Inventory Forecasting**: Uses time series analysis and exponential smoothing to predict future inventory needs based on historical sales data.

3. **Price Optimization**: Employs a dynamic pricing algorithm that considers factors such as demand, competition, and inventory levels to suggest optimal pricing strategies.

4. **Customer Segmentation**: Utilizes K-means clustering to group customers based on their purchasing behavior, enabling targeted marketing and personalized offers.

5. **Reorder Point Calculation**: Implements the Economic Order Quantity (EOQ) model to determine the optimal reorder point and quantity for each product.

6. **Sales Trend Analysis**: Uses linear regression and moving averages to identify and visualize sales trends over time.

7. **Recommendation Engine**: Employs collaborative filtering to suggest related products based on customer purchase history and product associations.

8. **Route Optimization**: For delivery services, uses the Nearest Neighbor algorithm to optimize delivery routes and improve efficiency.

9. **Fraud Detection**: Implements anomaly detection algorithms to identify unusual transaction patterns and potential fraudulent activities.

10. **Inventory ABC Analysis**: Applies the Pareto principle to categorize inventory items based on their value and importance.

These algorithms work together to provide intelligent insights, optimize operations, and enhance decision-making within the Pos-inventory system.

## Setup and Installation

1. Clone the repository
2. Install dependencies for both client and server:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add necessary environment variables (SUPABASE_URL, SUPABASE_API_KEY, JWT_SECRET_KEY, etc.)
4. Start the development servers:
   - For client: `cd client && npm run dev`
   - For server: `cd server && npm run dev`

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Node.js, Express, TypeScript, Supabase
- Database: Supabase
- Authentication: JWT
- Internationalization: i18next
- State Management: React Context API
- API Requests: Axios
- PDF Generation: jsPDF
- Excel Export: xlsx

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Author

[Suon Ratanak](https://github.com/NakNakGEO)

import React from 'react';
import { Table, Button } from 'antd';
import { PurchaseOrder } from '../types'; // Import PurchaseOrder type

const PurchaseOrderList: React.FC<{ purchaseOrders: PurchaseOrder[] }> = ({ purchaseOrders }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      render: (totalCost: number) => `$${totalCost.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: PurchaseOrder) => (
        <Button onClick={() => handleAddProduct(record.id)}>
          Add Product
        </Button>
      ),
    },
  ];

  const handleAddProduct = (purchaseOrderId: number) => {
    // Implement the logic to add a product to the specific purchase order
    console.log(`Adding product to purchase order ${purchaseOrderId}`);
  };

  return (
    <Table
      dataSource={purchaseOrders}
      columns={columns}
      rowKey="id"
    />
  );
};

export default PurchaseOrderList;

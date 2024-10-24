import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Typography, Space } from 'antd';
import styled from 'styled-components';
import { Supplier, Product } from '../types';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import moment from 'moment';
import { Package, DollarSign, Calendar, Truck, FileText } from 'lucide-react';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const StyledForm = styled(Form)`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

const StyledSpace = styled(Space)`
  width: 100%;
  margin-bottom: 16px;
`;

const TotalCost = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: #f0f2f5;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
`;

interface PurchaseOrderFormProps {
  onSubmit: (values: any) => void;
  suppliers: Supplier[];
  products: Product[];
  initialData?: any;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ 
  onSubmit, 
  suppliers = [], 
  products = [], 
  initialData 
}) => {
  const [form] = Form.useForm();
  const [totalCost, setTotalCost] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        date: initialData.date ? moment(initialData.date) : null,
        expected_delivery_date: initialData.expected_delivery_date 
          ? moment(initialData.expected_delivery_date) 
          : null,
      });
    }
  }, [initialData, form]);

  const updateTotalCost = () => {
    const quantity = form.getFieldValue('quantity') || 0;
    const price = form.getFieldValue('price') || 0;
    setTotalCost(quantity * price);
  };

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : null,
      expected_delivery_date: values.expected_delivery_date 
        ? values.expected_delivery_date.format('YYYY-MM-DD') 
        : null,
      total_cost: totalCost
    };
    onSubmit(formattedValues);
  };

  return (
    <StyledForm 
      form={form} 
      onFinish={onFinish} 
      layout="vertical" 
      onValuesChange={updateTotalCost}
    >
      <Title level={3}>{initialData ? t('purchaseOrders.editOrder') : t('purchaseOrders.createOrder')}</Title>

      <StyledFormItem
        name="supplier_id"
        label={
          <span>
            <IconWrapper><Truck size={16} /></IconWrapper>
            {t('purchaseOrders.supplier')}
          </span>
        }
        rules={[{ required: true, message: t('purchaseOrders.supplierRequired') }]}
      >
        <Select placeholder={t('purchaseOrders.selectSupplier')}>
          {suppliers.map((supplier) => (
            <Select.Option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </Select.Option>
          ))}
        </Select>
      </StyledFormItem>

      <StyledSpace>
        <StyledFormItem
          name="date"
          label={
            <span>
              <IconWrapper><Calendar size={16} /></IconWrapper>
              {t('purchaseOrders.date')}
            </span>
          }
          rules={[{ required: true, message: t('purchaseOrders.dateRequired') }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </StyledFormItem>

        <StyledFormItem
          name="expected_delivery_date"
          label={
            <span>
              <IconWrapper><Truck size={16} /></IconWrapper>
              {t('purchaseOrders.expectedDelivery')}
            </span>
          }
          rules={[{ required: true, message: t('purchaseOrders.expectedDeliveryRequired') }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </StyledFormItem>
      </StyledSpace>

      <StyledFormItem
        name="status"
        label={
          <span>
            <IconWrapper><FileText size={16} /></IconWrapper>
            {t('purchaseOrders.status')}
          </span>
        }
        rules={[{ required: true, message: t('purchaseOrders.statusRequired') }]}
      >
        <Select>
          <Option value="pending">{t('purchaseOrders.pending')}</Option>
          <Option value="completed">{t('purchaseOrders.completed')}</Option>
        </Select>
      </StyledFormItem>

      <StyledFormItem
        name="remarks"
        label={
          <span>
            <IconWrapper><FileText size={16} /></IconWrapper>
            {t('purchaseOrders.remarks')}
          </span>
        }
      >
        <TextArea rows={4} />
      </StyledFormItem>

      <StyledFormItem
        name="product_id"
        label={
          <span>
            <IconWrapper><Package size={16} /></IconWrapper>
            {t('purchaseOrders.product')}
          </span>
        }
        rules={[{ required: true, message: t('purchaseOrders.productRequired') }]}
      >
        <Select placeholder={t('purchaseOrders.selectProduct')}>
          {products.map((product) => (
            <Select.Option key={product.id} value={product.id}>
              {product.name}
            </Select.Option>
          ))}
        </Select>
      </StyledFormItem>

      <StyledSpace>
        <StyledFormItem
          name="quantity"
          label={t('purchaseOrders.quantity')}
          rules={[{ required: true, message: t('purchaseOrders.quantityRequired') }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </StyledFormItem>

        <StyledFormItem
          name="price"
          label={t('purchaseOrders.price')}
          rules={[{ required: true, message: t('purchaseOrders.priceRequired') }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value: string) => {
              const parsed = parseFloat(value.replace(/\$\s?|(,*)/g, ''));
              return isNaN(parsed) ? 0 : parsed;
            }}
          />
        </StyledFormItem>
      </StyledSpace>

      <TotalCost>
        <span>{t('purchaseOrders.totalCost')}:</span>
        <span><IconWrapper><DollarSign size={20} /></IconWrapper>${totalCost.toFixed(2)}</span>
      </TotalCost>

      <Button type="primary" htmlType="submit" size="large" block>
        {initialData ? t('purchaseOrders.updateOrder') : t('purchaseOrders.createOrder')}
      </Button>
    </StyledForm>
  );
};

export default PurchaseOrderForm;

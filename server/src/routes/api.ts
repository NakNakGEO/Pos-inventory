import express, { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../auth';
import { ParamsDictionary } from 'express-serve-static-core';
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  console.log('Received login request');
  console.log('Request body:', { ...req.body, password: '****' });

  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Missing username or password');
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    console.log('Querying Supabase for user:', username);
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    console.log('Supabase query result:', { user: user ? 'found' : 'not found', error});

    if (error || !user) {
      console.log('User not found or Supabase error');
      res.status(400).json({ error: 'User not found' });
      return;
    }

    console.log('Comparing passwords');
    const passwordMatch = password === user.password;
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('Invalid password');
      res.status(400).json({ error: 'Invalid password' });
      return;
    }

    console.log('Generating JWT');
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    
    console.log('Sending successful response');
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Products routes
router.get('/products', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
});

router.post('/products', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, category_id, supplier_id, price, stock, barcode, description, image_url } = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        category_id,
        supplier_id,
        price,
        stock,
        barcode,
        description,
        image_url
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'An error occurred while adding the product' });
  }
});

router.put('/products/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log('Updating product:', id, 'with data:', updateData);

  supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase error:', error);
        return next(error);
      }

      if (!data) {
        console.log('Product not found:', id);
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log('Product updated successfully:', data);
      res.json(data);
    });
});

router.delete('/products/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
});

// Categories routes
router.get('/categories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
});

router.post('/categories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(req.body);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'An error occurred while adding the category' });
  }
});

router.put('/categories/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'An error occurred while updating the category' });
  }
});

router.delete('/categories/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'An error occurred while deleting the category' });
  }
});

// Suppliers routes
router.get('/suppliers', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'An error occurred while fetching suppliers' });
  }
});

router.post('/suppliers', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(req.body);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ error: 'An error occurred while adding the supplier' });
  }
});

router.put('/suppliers/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('suppliers')
      .update(req.body)
      .eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'An error occurred while updating the supplier' });
  }
});

router.delete('/suppliers/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'An error occurred while deleting the supplier' });
  }
});

// Sales routes
router.get('/sales', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*, customer:customers(*), sale_items:sale_items(*, product:products(*))')
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'An error occurred while fetching sales' });
  }
});

// Create a new sale
router.post('/sales', authenticateToken, async (req: Request, res: Response) => {
  const { customer_id, total, payment_method, status, notes, items } = req.body;

  try {
    // Start a Supabase transaction
    const { data, error } = await supabase.rpc('create_sale', {
      p_customer_id: customer_id,
      p_total: total,
      p_payment_method: payment_method,
      p_status: status,
      p_notes: notes,
      p_items: items
    });

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'An error occurred while creating the sale' });
  }
});

// Get a specific sale
router.get('/sales/:id', authenticateToken, (async (req: Request<ParamsDictionary, any, any, any>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*, customer:customers(*), sale_items:sale_items(*, product:products(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching sale:', error);
    next(error);
  }
}) as express.RequestHandler);

router.put('/sales/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('sales')
      .update(req.body)
      .eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'An error occurred while updating the sale' });
  }
});

router.delete('/sales/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'An error occurred while deleting the sale' });
  }
});

// Customers routes
router.get('/customers', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'An error occurred while fetching customers' });
  }
});

router.post('/customers', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, loyalty_points } = req.body;
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name,
        email,
        phone: phone || null,
        address: address || null,
        loyalty_points: loyalty_points || 0,
        // created_at will be set automatically by the database
      });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'An error occurred while adding the customer' });
  }
});

router.put('/customers/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, loyalty_points } = req.body;
    const { data, error } = await supabase
      .from('customers')
      .update({
        name,
        email,
        phone: phone || null,
        address: address || null,
        loyalty_points: loyalty_points || 0,
      })
      .eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'An error occurred while updating the customer' });
  }
});

router.delete('/customers/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'An error occurred while deleting the customer' });
  }
});

// Purchase Orders routes
router.get('/purchase-orders', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(name),
        purchase_order_items(
          quantity,
          product:products(name, image_url)
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'An error occurred while fetching purchase orders' });
  }
});

// Create a new purchase order
router.post('/purchase-orders', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { supplier_id, date, expected_delivery_date, status, remarks, items, total_cost } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Invalid or empty items array' });
    return;
  }

  try {
    const { data: newOrder, error: orderError } = await supabase
      .from('purchase_orders')
      .insert({
        supplier_id,
        date,
        expected_delivery_date,
        status,
        remarks,
        total_cost
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      purchase_order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('purchase_order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'An error occurred while creating the purchase order' });
  }
});

// Update purchase order status and handle stock updates
router.patch('/purchase-orders/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update purchase order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('purchase_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (status === 'completed') {
      // Fetch purchase order items
      const { data: items, error: itemsError } = await supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', id);

      if (itemsError) throw itemsError;

      // Update product stock and purchase order item status
      for (const item of items) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity
        });

        if (stockError) throw stockError;

        const { error: itemStatusError } = await supabase
          .from('purchase_order_items')
          .update({ status: 'received', received_quantity: item.quantity })
          .eq('id', item.id);

        if (itemStatusError) throw itemStatusError;
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'An error occurred while updating the purchase order' });
  }
});

router.get('/purchase-orders/:id/items', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('purchase_order_items')
      .select('*')
      .eq('purchase_order_id', id);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching purchase order items:', error);
    res.status(500).json({ error: 'An error occurred while fetching the purchase order items' });
  }
});

router.put('/purchase-orders/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { supplier_id, date, status, remarks, expected_delivery_date, total_cost } = req.body;
    const { data, error } = await supabase
      .from('purchase_orders')
      .update({ supplier_id, date, status, remarks, expected_delivery_date, total_cost })
      .eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'An error occurred while updating the purchase order' });
  }
});

router.delete('/purchase-orders/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Purchase order and associated items deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({ error: 'An error occurred while deleting the purchase order' });
  }
});

router.patch('/products/:id/stock', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const { data, error } = await supabase.rpc('update_product_stock', { 
      p_product_id: id, 
      p_quantity: quantity 
    });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating product stock:', error);
    next(error);
  }
});

export default router;

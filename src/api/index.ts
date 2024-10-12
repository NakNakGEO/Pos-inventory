// This file is kept for future use when we implement the backend
// For now, we'll use mock data in our hooks

export const getProducts = () => Promise.resolve({ data: [] });
export const createProduct = (product: any) => Promise.resolve({ data: product });
export const updateProduct = (id: number, product: any) => Promise.resolve({ data: product });
export const deleteProduct = (id: number) => Promise.resolve({ data: id });

export const getCategories = () => Promise.resolve({ data: [] });
export const createCategory = (category: any) => Promise.resolve({ data: category });
export const updateCategory = (id: number, category: any) => Promise.resolve({ data: category });
export const deleteCategory = (id: number) => Promise.resolve({ data: id });

export const getSuppliers = () => Promise.resolve({ data: [] });
export const createSupplier = (supplier: any) => Promise.resolve({ data: supplier });
export const updateSupplier = (id: number, supplier: any) => Promise.resolve({ data: supplier });
export const deleteSupplier = (id: number) => Promise.resolve({ data: id });
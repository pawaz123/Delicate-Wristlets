import { Product, Order, DEFAULT_CATEGORIES } from '../types';

const PRODUCTS_KEY = 'delicate_wristlets_products';
const CATEGORIES_KEY = 'delicate_wristlets_categories';
const ORDERS_KEY = 'delicate_wristlets_orders';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Eternal Gold Cuff',
    price: 1299,
    description: 'A timeless 24k gold plated cuff with a minimalist design.',
    image: 'https://picsum.photos/400/400?random=1',
    category: 'Gold'
  },
  {
    id: '2',
    name: 'Silver Moon Bangle',
    price: 899,
    description: 'Sterling silver bangle featuring delicate lunar engravings.',
    image: 'https://picsum.photos/400/400?random=2',
    category: 'Silver'
  },
  {
    id: '3',
    name: 'Rose Blush Bracelet',
    price: 1050,
    description: 'Soft rose gold interwoven with small crystal accents.',
    image: 'https://picsum.photos/400/400?random=3',
    category: 'Rose Gold'
  },
  {
    id: '4',
    name: 'Diamond Dust Wristlet',
    price: 2499,
    description: 'Embedded with ethically sourced diamond dust for a subtle sparkle.',
    image: 'https://picsum.photos/400/400?random=4',
    category: 'Diamond'
  }
];

// --- Products ---

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProduct = (product: Product): Product[] => {
  const current = getProducts();
  const updated = [...current, product];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateProduct = (updatedProduct: Product): Product[] => {
  const current = getProducts();
  const updated = current.map(p => String(p.id) === String(updatedProduct.id) ? updatedProduct : p);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteProduct = (id: string): Product[] => {
  const current = getProducts();
  // Ensure strict string comparison to prevent type mismatch issues
  const updated = current.filter(p => String(p.id) !== String(id));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
};

// --- Categories ---

export const getCategories = (): string[] => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const addCategory = (category: string): string[] => {
  const current = getCategories();
  if (current.includes(category)) return current;
  const updated = [...current, category];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteCategory = (category: string): string[] => {
  const current = getCategories();
  const updated = current.filter(c => c !== category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

// --- Orders ---

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOrder = (order: Order): Order[] => {
  const current = getOrders();
  const updated = [order, ...current]; // Newest first
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return updated;
};
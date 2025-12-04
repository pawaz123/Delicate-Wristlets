import React, { useEffect, useState } from 'react';
import {
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  deleteCategory,
  getOrders,
} from '../services/storage';
import { Product, Order } from '../types';
import {
  Trash2,
  Plus,
  Image as ImageIcon,
  Edit2,
  LayoutDashboard,
  ShoppingBag,
  List,
  Package,
} from 'lucide-react';

type Tab = 'dashboard' | 'products' | 'categories' | 'orders';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: 'Gold',
  });

  // Image State (stores data URLs)
  const [images, setImages] = useState<string[]>([]);

  // Category Form State
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

  const refreshData = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setOrders(getOrders());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  // Helper: read File -> DataURL (promise)
  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // --- Image Upload / Drag & Drop ---

  const handleImageUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    try {
      const files = Array.from(fileList);
      const promises = files.map((f) => readFileAsDataURL(f));
      const results = await Promise.all(promises);
      setImages((prev) => [...prev, ...results]);
    } catch (err) {
      console.error('Image read error', err);
      alert('Failed to read one or more images.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Product Logic ---

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || productForm.name.toString().trim() === '') {
      alert('Please provide product name');
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      alert('Please provide a valid price');
      return;
    }
    if (!productForm.description || productForm.description.toString().trim() === '') {
      alert('Please provide a description');
      return;
    }
    if (!productForm.category || productForm.category.toString().trim() === '') {
      alert('Please select a category');
      return;
    }

    if (editingId) {
      // Update existing
      const existing = products.find((p) => p.id === editingId);
      const updated: Product = {
        id: editingId,
        name: productForm.name as string,
        price: Number(productForm.price),
        description: productForm.description as string,
        category: productForm.category as string,
        // prefer newly uploaded images; otherwise keep existing images (handle both string and string[])
        image:
          images.length > 0
            ? images
            : existing
            ? existing.image
            : `https://picsum.photos/400/400?random=${Date.now()}`,
      };
      updateProduct(updated);
      setEditingId(null);
    } else {
      // Create new
      const newProd: Product = {
        id: Date.now().toString(),
        name: productForm.name as string,
        price: Number(productForm.price),
        description: productForm.description as string,
        category: productForm.category as string,
        image: images.length > 0 ? images : `https://picsum.photos/400/400?random=${Date.now()}`,
      };
      saveProduct(newProd);
    }

    // Reset form + images
    setProductForm({
      name: '',
      price: 0,
      description: '',
      category: categories[0] || 'Gold',
    });
    setImages([]);
    refreshData();
    // scroll to top so admin sees confirmation / updated list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    // set product form fields
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
    // normalize image field into images array (backwards compatible)
    if (Array.isArray(product.image)) {
      setImages(product.image);
    } else if (typeof product.image === 'string' && product.image) {
      setImages([product.image]);
    } else {
      setImages([]);
    }
    setActiveTab('products'); // Ensure we are on the tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Deleting product:', id);
    if (window.confirm('Delete this product?')) {
      deleteProduct(id);
      refreshData();
    }
  };

  // --- Category Logic ---

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      refreshData();
    }
  };

  const handleDeleteCategory = (e: React.MouseEvent, cat: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete category "${cat}"?`)) {
      deleteCategory(cat);
      refreshData();
    }
  };

  // --- Render Helpers ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 pt-20">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
          <h2 className="text-2xl font-serif font-bold text-center mb-6 text-stone-800">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded focus:ring-2 focus:ring-gold-500 focus:outline-none"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-2 rounded hover:bg-stone-800 transition-colors"
            >
              Login
            </button>
            <p className="text-xs text-center text-stone-400 mt-4">Hint: admin123</p>
          </form>
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((sum, order) => sum + order.price, 0);

  return (
    <div className="min-h-screen bg-stone-50 pt-20 flex">
      {/* Sidebar / Top Navigation for Mobile */}
      <div className="w-64 bg-white border-r border-stone-200 hidden md:block fixed h-full pt-6">
        <div className="px-6 mb-8">
          <h1 className="font-serif text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        <nav className="space-y-1 px-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package size={18} /> Inventory
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'categories' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <List size={18} /> Categories
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag size={18} /> Sales & Orders
          </button>
        </nav>
        <div className="absolute bottom-24 left-0 w-full px-8">
          <button onClick={() => setIsAuthenticated(false)} className="text-stone-500 hover:text-red-600 text-sm font-medium transition-colors">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8">
        {/* Mobile Tab Nav */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>Overview</button>
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'products' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>Products</button>
          <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'categories' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>Categories</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'orders' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>Orders</button>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium uppercase">Total Sales</h3>
                  <span className="p-2 bg-green-50 text-green-600 rounded-full"><ShoppingBag size={20} /></span>
                </div>
                <p className="text-3xl font-bold text-stone-900">${totalSales.toLocaleString()}</p>
                <p className="text-xs text-stone-400 mt-1">Lifetime Revenue</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium uppercase">Total Orders</h3>
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-full"><List size={20} /></span>
                </div>
                <p className="text-3xl font-bold text-stone-900">{orders.length}</p>
                <p className="text-xs text-stone-400 mt-1">Orders Processed</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium uppercase">Active Products</h3>
                  <span className="p-2 bg-purple-50 text-purple-600 rounded-full"><Package size={20} /></span>
                </div>
                <p className="text-3xl font-bold text-stone-900">{products.length}</p>
                <p className="text-xs text-stone-400 mt-1">In Inventory</p>
              </div>
            </div>

            {/* Recent Orders Mini Table */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-semibold text-stone-800">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-sm text-gold-600 hover:text-gold-700">View All</button>
              </div>
              <div className="p-6">
                {orders.length === 0 ? (
                  <p className="text-stone-400 text-sm">No orders yet.</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-stone-500">
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Product</th>
                        <th className="pb-3 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-t border-stone-50">
                          <td className="py-3 text-stone-900">{order.customerName}</td>
                          <td className="py-3 text-stone-600">{order.productName}</td>
                          <td className="py-3 text-right font-medium text-stone-900">${order.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products View */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit border border-stone-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit2 size={20} /> Edit Product
                  </>
                ) : (
                  <>
                    <Plus size={20} /> Add Product
                  </>
                )}
              </h2>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Name</label>
                  <input
                    type="text"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-white text-stone-900 border border-stone-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Price ($)</label>
                  <input
                    type="number"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 bg-white text-stone-900 border border-stone-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-white text-stone-900 border border-stone-300 rounded focus:border-gold-500 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Description</label>
                  <textarea
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 bg-white text-stone-900 border border-stone-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {/* Drag & Drop Upload */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Product Images</label>
                  <div
                    className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleImageUpload(e.dataTransfer.files);
                    }}
                    onClick={() => (document.getElementById('imageInput') as HTMLInputElement | null)?.click()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ImageIcon />
                      <span className="text-stone-500 text-sm">Drag & drop images here or click to upload (multiple allowed)</span>
                    </div>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleImageUpload(e.target.files);
                        // reset input so same file can be re-selected if needed
                        (e.target as HTMLInputElement).value = '';
                      }}
                    />
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group rounded overflow-hidden">
                          <img src={img} alt={`preview-${index}`} className="w-full h-24 object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white p-1 rounded-full shadow text-red-600 opacity-0 group-hover:opacity-100 transition"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-gold-600 text-white py-3 rounded hover:bg-gold-700 transition-colors font-semibold">
                    {editingId ? 'Update Item' : 'Add to Catalog'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setProductForm({ name: '', price: 0, description: '', category: categories[0] });
                        setImages([]);
                      }}
                      className="px-4 py-3 bg-stone-200 text-stone-600 rounded hover:bg-stone-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-stone-100">
              <h2 className="text-xl font-semibold mb-4">Inventory ({products.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {products.map((product) => {
                      // normalize image for display
                      const imageField = product.image;
                      const firstImage =
                        Array.isArray(imageField) && imageField.length > 0
                          ? imageField[0]
                          : typeof imageField === 'string'
                          ? imageField
                          : undefined;
                      const imageCount = Array.isArray(imageField) ? imageField.length : typeof imageField === 'string' && imageField ? 1 : 0;

                      return (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="relative">
                                <img className="h-10 w-10 rounded-full object-cover" src={firstImage} alt={product.name} />
                                {imageCount > 1 && (
                                  <span className="absolute -bottom-1 -right-1 bg-stone-900 text-white text-xs px-1 rounded-full">{imageCount}</span>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-stone-900">{product.name}</div>
                                <div className="text-xs text-stone-500">{product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">${product.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleEditClick(product)}
                              className="text-stone-500 hover:text-gold-600 p-2 rounded-full hover:bg-stone-100 transition-colors mr-2"
                              title="Edit"
                            >
                              <Edit2 size={18} className="pointer-events-none" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteProduct(e, product.id)}
                              className="text-stone-400 hover:text-red-600 p-2 rounded-full hover:bg-stone-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} className="pointer-events-none" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 mb-8">
              <h2 className="text-xl font-bold font-serif mb-6 text-stone-900">Manage Categories</h2>
              <div className="flex gap-4 mb-8">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category Name (e.g. Platinum)"
                  className="flex-1 px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
                <button onClick={handleAddCategory} className="bg-stone-900 text-white px-6 py-2 rounded hover:bg-stone-800 transition-colors">
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-4 bg-stone-50 rounded border border-stone-100 group">
                    <span className="font-medium text-stone-700">{cat}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCategory(e, cat)}
                      className="text-stone-400 hover:text-red-600 p-2 rounded-full hover:bg-stone-100 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={18} className="pointer-events-none" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders View */}
        {activeTab === 'orders' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 animate-fade-in">
            <h2 className="text-2xl font-bold font-serif mb-6 text-stone-900">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-stone-500">No orders have been placed yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-stone-900">{order.customerName}</div>
                          <div className="text-xs text-stone-500">{order.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{order.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-900">${order.price.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

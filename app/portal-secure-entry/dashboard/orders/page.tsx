'use client';

import { useState } from 'react';
import { Search, FileSpreadsheet, Package, CheckCircle2, Truck, PackageCheck, XCircle, Clock, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { INDIA_POST_CONFIG, INDIA_POST_COLUMNS } from '@/lib/india-post-config';

type OrderStatus = 'ALL' | 'NEW' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  phone: string;
  itemsCount: number;
  itemsList: string[];
  total: number;
  weight: number;
  status: OrderStatus;
  date: string;
  createdAtIso: string;
  canCancel: boolean;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  cancellationReason?: string | null;
}

import { useEffect } from 'react';

const STATUS_CONFIG = {
  ALL: { label: 'All', icon: Package, color: 'text-gray-500', bg: 'bg-gray-100 text-gray-700' },
  NEW: { label: 'New', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100 text-blue-700' },
  PACKED: { label: 'Packed', icon: CheckCircle2, color: 'text-yellow-500', bg: 'bg-yellow-100 text-yellow-700' },
  SHIPPED: { label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Delivered', icon: PackageCheck, color: 'text-green-500', bg: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        // Support both paginated { orders: [...] } and legacy array responses
        setOrders(Array.isArray(data) ? data : data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'ALL' || o.status === activeTab;
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || 
                          o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                          o.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedOrders(newSelected);
  };

  const selectAll = () => {
    const packableNewOrders = filteredOrders.filter(o => {
      const isPackable = new Date().getTime() - new Date(o.createdAtIso).getTime() >= 4 * 60 * 60 * 1000;
      return o.status === 'NEW' && isPackable;
    });
    
    if (selectedOrders.size === packableNewOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(packableNewOrders.map(o => o.id)));
    }
  };

  const markAsPacked = async () => {
    for (const id of Array.from(selectedOrders)) {
      await updateStatus(id, 'PACKED');
    }
    setSelectedOrders(new Set());
  };

  const exportToExcel = async () => {
    const packedOrders = orders.filter(o => o.status === 'PACKED');
    if (packedOrders.length === 0) {
      alert('No packed orders to export. Mark orders as PACKED first.');
      return;
    }
    
    // Format for India Post Bulk Booking
    const exportData = packedOrders.map((o, index) => {
      const row: Record<string, string | number | boolean> = {};
      
      // Initialize all columns in exact order
      INDIA_POST_COLUMNS.forEach(col => { row[col] = ''; });

      row['SERIAL NUMBER'] = index + 1;
      row['BARCODE NO'] = INDIA_POST_CONFIG.barcodeNo;
      row['PHYSICAL WEIGHT'] = o.weight;
      row['REG'] = INDIA_POST_CONFIG.reg;
      row['P'] = false;
      row['RECEIVER CITY'] = o.shippingCity || 'Not Provided';
      row['RECEIVER PINCODE'] = o.shippingPincode || 'Not Provided';
      row['RECEIVER NAME'] = o.shippingName || o.customer;
      row['RECEIVER ADD LINE 1'] = o.shippingAddress1 || 'Not Provided';
      row['RECEIVER ADD LINE 2'] = o.shippingAddress2 || '';
      row['RECEIVER ADD LINE 3'] = '';
      row['ACK'] = INDIA_POST_CONFIG.ack;
      row['SENDER MOBILE NO'] = INDIA_POST_CONFIG.sender.mobileNo;
      row['RECEIVER MOBILE NO'] = o.shippingPhone || o.phone;
      row['PREPAYMENT CODE'] = INDIA_POST_CONFIG.prepaymentCode;
      row['VALUE OF PREPAYMENT'] = INDIA_POST_CONFIG.valueOfPrepayment;
      row['CODR/COD'] = INDIA_POST_CONFIG.codrCod;
      row['VALUE FOR CODR/COD'] = INDIA_POST_CONFIG.valueForCodrCod;
      row['INSURANCE TYPE'] = INDIA_POST_CONFIG.insuranceType;
      row['VALUE OF INSURANCE'] = INDIA_POST_CONFIG.valueOfInsurance;
      row['SHAPE OF ARTICLE'] = INDIA_POST_CONFIG.shapeOfArticle;
      row['LENGTH'] = INDIA_POST_CONFIG.dimensions.length;
      row['BREADTH/DIAMETER'] = INDIA_POST_CONFIG.dimensions.breadthDiameter;
      row['HEIGHT'] = INDIA_POST_CONFIG.dimensions.height;
      row['PRIORITY FLAG'] = INDIA_POST_CONFIG.priorityFlag;
      row['DELIVERY INSTRUCTION'] = INDIA_POST_CONFIG.deliveryInstruction;
      row['DELIVERY SLOT'] = INDIA_POST_CONFIG.deliverySlot;
      row['INSTRUCTION RTS'] = INDIA_POST_CONFIG.instructionRTS;
      row['SENDER NAME'] = INDIA_POST_CONFIG.sender.name;
      row['SENDER COMPANY NAME'] = INDIA_POST_CONFIG.sender.companyName;
      row['SENDER CITY'] = INDIA_POST_CONFIG.sender.city;
      row['SENDER STATE/UT'] = INDIA_POST_CONFIG.sender.stateUT;
      row['SENDER PINCODE'] = INDIA_POST_CONFIG.sender.pincode;
      row['SENDER EMAILID'] = INDIA_POST_CONFIG.sender.emailId;
      row['SENDER ALT CONTACT'] = INDIA_POST_CONFIG.sender.altContact;
      row['SENDER KYC'] = INDIA_POST_CONFIG.sender.kyc;
      row['SENDER TAX'] = INDIA_POST_CONFIG.sender.tax;
      row['RECEIVER COMPANY NAME'] = '';
      row['RECEIVER STATE'] = o.shippingState || 'Not Provided';
      row['RECEIVER EMAILID'] = '';
      row['RECEIVER ALT CONTACT'] = '';
      row['RECEIVER KYC'] = '';
      row['RECEIVER TAX REF'] = '';
      row['ALT ADDRESS FLAG'] = INDIA_POST_CONFIG.altAddressFlag;
      row['BULK REFERENCE'] = INDIA_POST_CONFIG.bulkReference;
      row['SENDER ADD LINE 1'] = INDIA_POST_CONFIG.sender.addressLine1;
      row['SENDER ADD LINE 2'] = INDIA_POST_CONFIG.sender.addressLine2;
      row['SENDER ADD LINE 3'] = INDIA_POST_CONFIG.sender.addressLine3;

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packed Orders");
    
    // Download the Excel file
    XLSX.writeFile(workbook, `Shoe Place_Dispatch_${new Date().toISOString().split('T')[0]}.xlsx`);

    for (const order of packedOrders) {
      await updateStatus(order.id, 'SHIPPED');
    }
    
    alert(`Successfully exported ${packedOrders.length} orders to Excel and marked them as SHIPPED.`);
  };

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const packedCount = orders.filter(o => o.status === 'PACKED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedOrders.size > 0 && (
            <button
              onClick={markAsPacked}
              className="flex items-center gap-2 bg-yellow-500 text-white font-bold px-4 py-2.5 rounded-none hover:bg-yellow-600 transition-colors text-sm"
            >
              <CheckCircle2 size={16} />
              Mark as Packed ({selectedOrders.size})
            </button>
          )}
          <button
            onClick={exportToExcel}
            disabled={packedCount === 0}
            className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-none hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={16} />
            Export Excel ({packedCount})
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => {
          const config = STATUS_CONFIG[status];
          const count = status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-none text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === status
                  ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <config.icon size={16} className={activeTab === status ? config.color : ''} />
              {config.label}
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 w-10" />
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Weight</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-100 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-8" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-12" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                    <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-6 bg-gray-100 rounded w-20 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" onChange={selectAll} className="rounded border-gray-300" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Weight</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const isPackable = new Date().getTime() - new Date(order.createdAtIso).getTime() >= 4 * 60 * 60 * 1000;
                return (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {order.status === 'NEW' && isPackable && (
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-gray-300"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-700">{order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}</span>
                    <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                      {order.itemsList.map((itemStr, i) => (
                        <li key={i} className="max-w-[250px] leading-tight" title={itemStr}>• {itemStr}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.weight}g</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.bg}`}>
                        {order.status}
                      </span>
                      {order.status === 'CANCELLED' && order.cancellationReason && (
                        <span className="text-[10px] text-red-500 italic max-w-[120px] truncate" title={order.cancellationReason}>
                          &quot;{order.cancellationReason}&quot;
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{order.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      <a
                        href={`/invoice/${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-none transition-colors flex items-center gap-1"
                      >
                        <FileText size={14} />
                        Invoice
                      </a>
                      {order.status === 'NEW' && isPackable && (
                        <button
                          onClick={() => updateStatus(order.id, 'PACKED')}
                          className="text-xs font-medium text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-none transition-colors"
                        >
                          Mark Packed
                        </button>
                      )}
                      {order.status === 'NEW' && !isPackable && (
                        <span className="text-xs font-medium text-orange-500 px-2 py-1 bg-orange-50 rounded-none">Hold 4hr</span>
                      )}
                      {order.status === 'PACKED' && (
                        <button
                          onClick={() => updateStatus(order.id, 'NEW')}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-none transition-colors"
                        >
                          Revert to New
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <>
                          <button
                            onClick={() => updateStatus(order.id, 'PACKED')}
                            className="text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-none transition-colors"
                          >
                            Revert to Packed
                          </button>
                          <button
                            onClick={() => updateStatus(order.id, 'DELIVERED')}
                            className="text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-none transition-colors"
                          >
                            Mark Delivered
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No orders found</p>
          </div>
        )}
      </div>
      )}

      {/* Cancel Policy Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-none px-5 py-3 text-sm text-amber-700">
        <strong>Cancel Policy:</strong> Customers can cancel orders within 4 hours of placing. After that, cancellation is not allowed.
      </div>
    </div>
  );
}

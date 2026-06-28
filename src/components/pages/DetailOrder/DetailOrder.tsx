import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../../service/orders.service";
import type { IOrders } from "../../../types/orders";
import Button from "../../ui/Button";

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrders | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrders(true);
      try {
        // const result = await getOrderById(`${id}`); // ini kalau mau tambah/kurang slash, tapi harus sesuai sama API
        const result = await getOrderById(id as string);
        
        setOrder(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrder();

    // [] kosong — hanya jalan SEKALI saat komponen pertama kali muncul
    // [id] — jalan setiap kali nilai `id` berubah
  }, [id]);

  if (loadingOrders) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-400 mb-6 hover:text-gray-600"
      >
        ← Kembali ke daftar order
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-medium">Detail order</h1>
          <p className="text-sm text-gray-400 mt-1">
            {order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleString("id-ID")}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === "COMPLETED"
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {order.status === "COMPLETED" ? "Completed" : "Processing"}
        </span>
      </div>

      {/* Info customer */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Customer</p>
          <p className="text-lg font-medium">{order.customer_name}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Nomor meja</p>
          <p className="text-lg font-medium">Meja {order.table_number}</p>
        </div>
      </div>

      {/* Item pesanan */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-gray-100 text-sm font-medium">
          Item pesanan
        </div>
        {order.cart.map((item, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0">
            <img
              src={item.menuItem?.image_url}
              alt={item.menuItem?.name}
              className="w-14 h-14 rounded-lg object-cover bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.menuItem?.name}</p>
              <p className="text-xs text-gray-400">{item.menuItem?.category}</p>
              <p className="text-xs text-gray-400 truncate">{item.menuItem?.description}</p>
              {item.notes && (
                <p className="text-xs text-gray-500 mt-1">Catatan: {item.notes}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium">${item.menuItem?.price.toFixed(2)}</p>
              <p className="text-xs text-gray-400">x{item.quantity}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
          <span className="text-sm font-medium">Total</span>
          <span className="text-lg font-medium">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {order.status === "PROCESSING" && (
          <Button className="px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
            ✓ Selesaikan order
          </Button>
        )}
        {order.status === "COMPLETED" && (
          <Button className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
            Hapus order
          </Button>
        )}
      </div>
    </main>
  );
};

export default DetailOrder;
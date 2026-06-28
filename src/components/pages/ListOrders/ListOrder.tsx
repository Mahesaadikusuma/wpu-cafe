import { useEffect, useState } from "react";
import {
  deleteOrderById,
  getOrders,
  updateOrder,
} from "../../../service/orders.service";
import type { IOrders } from "../../../types/orders";
import Button from "../../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { removeLocalStorage } from "../../../utils/storage";

const ListOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [refetchOrder, setRefetchOrder] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);

  useEffect(() => {
    if (refetchOrder) {
      const fetchOrder = async () => {
        setLoadingOrders(true);
        try {
          const result = await getOrders({ page: 1, pageSize: 50 });
          setOrders(result?.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingOrders(false); // selesai loading, baik sukses maupun error
          setRefetchOrder(false);
        }
      };
      fetchOrder();
    }
  }, [refetchOrder]);

  const handleComplatedOrder = async (id: string) => {
    try {
      await updateOrder(id, { status: "COMPLETED" });
      setRefetchOrder(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrderById(id);
      setRefetchOrder(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await removeLocalStorage("auth");
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Data order</h1>
          <div className="flex items-center justify-end gap-5">
            <Link to={"/create"}>
              <Button color="primary">+ Tambah order</Button>
            </Link>
            <Button
              color="outline"
              onClick={handleLogout}
              disabled={loadingLogout}
            >
              {loadingLogout ? "Loading..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari nama customer..."
            className="input flex-1"
          />
          <select className="select w-40">
            <option value="">Semua status</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 py-3 text-left font-medium w-12">No</th>
                <th className="px-3 py-3 text-left font-medium">
                  Customer name
                </th>
                <th className="px-3 py-3 text-left font-medium w-20">Table</th>
                <th className="px-3 py-3 text-left font-medium w-32">Total</th>
                <th className="px-3 py-3 text-left font-medium w-32">Status</th>
                <th className="px-3 py-3 text-left font-medium w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-3">{index + 1}</td>
                    <td className="px-3 py-3">{order.customer_name}</td>
                    <td className="px-3 py-3">{order.table_number}</td>
                    <td className="px-3 py-3">
                      Rp {order.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status === "COMPLETED"
                          ? "Completed"
                          : "Processing"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <Link to={`/order/${order.id}`}>
                          <Button className="p-1.5 border rounded-md text-gray-500 hover:bg-gray-100">
                            Detail
                          </Button>
                        </Link>
                        {order.status === "PROCESSING" && (
                          <Button
                            onClick={() => {
                              handleComplatedOrder(order.id);
                            }}
                            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
                          >
                            Selesaikan
                          </Button>
                        )}

                        {order.status === "COMPLETED" && (
                          <Button
                            onClick={() => {
                              handleDeleteOrder(order.id);
                            }}
                            className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          >
                            Hapus
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ListOrder;

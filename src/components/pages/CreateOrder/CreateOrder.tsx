import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CartItem, ICart, OrderCreate } from "../../../types/orders";
import { createOrder, getMenus } from "../../../service/orders.service";
import { filters, tables } from "./CreateOrder.constants";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";

const CreateOrder = () => {
  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [carts, setCarts] = useState<CartItem[]>([]);

  const navigate = useNavigate();
  const category = searchParams.get("category") ?? undefined;
  const searchQuery = searchParams.get("search") ?? undefined;
  const sortBy =
    (searchParams.get("sortBy") as "name" | "price" | "category" | undefined) ??
    undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc" | undefined) ?? undefined;

  // ini untuk Page keberapa
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //  Total Page
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   try {
  //     setLoadingMenu(true);
  //     const fetchMenu = async () => {
  //       const result = await getMenus({
  //         category,
  //         search: searchQuery,
  //         sortBy,
  //         sortOrder,
  //       });

  //       setMenu(result.data);
  //     };
  //     fetchMenu();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoadingMenu(false);
  //   }
  // }, [category, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true);
      try {
        const result = await getMenus({
          category,
          search: searchQuery,
          sortBy,
          sortOrder,
          page,
          pageSize,
        });
        setMenu(result.data);
        setTotalPages(result.metadata.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [category, searchQuery, sortBy, sortOrder, page, pageSize]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setSearchDebounce(search);
  //   }, 500); // tunggu 500ms setelah berhenti ketik

  //   return () => clearTimeout(timeout);
  // }, [search]);

  // fungsi debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((prev) => {
        if (search) {
          prev.set("search", search);
        } else {
          prev.delete("search"); // hapus dari URL kalau kosong
        }
        return prev;
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // fungsi untuk mereset page ke 1 ketika category, search, sortby, sortorder berubah
  useEffect(() => {
    setPage(1);
  }, [category, searchQuery, sortBy, sortOrder, pageSize]);

  const handleAddToCart = (
    type: string,
    id: string,
    name: string,
    price: number,
  ) => {
    const ItemIsInCart = carts.find((item: CartItem) => item.id === id);

    // Kode ini dari WPU COURSE
    // if (type === 'increment') {
    //   if (itemIsInCart) {
    //     setCarts(
    //       carts.map((item: CartItem) =>
    //         item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    //       ),
    //     );
    //   } else {
    //     setCarts([...carts, { id, name, quantity: 1 }]);
    //   }
    // }

    // Increment
    if (type === "increment") {
      if (ItemIsInCart) {
        // Menggunakan "Functional Update" (memberikan fungsi ke dalam setter).
        // React akan mengisi 'prevCarts' dengan array keranjang yang paling mutakhir.
        setCarts((prevCarts: CartItem[]) =>
          prevCarts.map((item: CartItem) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );
      } else {
        setCarts((prevCarts: CartItem[]) => [
          ...prevCarts,
          { id, name, price: Number(price), quantity: 1 },
        ]);
      }
    }

    // Decrement
    else if (type === "decrement") {
      if (ItemIsInCart && ItemIsInCart.quantity <= 1) {
        setCarts((prevCarts: CartItem[]) =>
          prevCarts.filter((item: CartItem) => item.id !== id),
        );
      } else {
        setCarts((prevCarts: CartItem[]) =>
          prevCarts.map((item: CartItem) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        );
      }
    }
  };

  const totalHarga = carts.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleCreateOrder = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const payload: OrderCreate = {
      customerName: form.customerName.value,
      tableNumber: Number(form.tableNumber.value),
      cart: carts.map((item: CartItem) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        notes: "",
      })),
    };
    await createOrder(payload);
    navigate("/orders");
  };

  return (
    <main className="container p-5">
      <div className="">
        <h1>Explore Best Menu</h1>
        <div className="filter">
          {filters.map((filter) => (
            <Button
              key={filter}
              className={`px-4 py-2 rounded-lg font-medium
                ${
                  searchParams.get("category") === filter ||
                  (!searchParams.get("category") && filter === "All")
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => {
                // if (filter === "All") {
                //     searchParams.delete("category");
                // } else {
                //     searchParams.set("category", filter);
                // }

                setSearchParams(filter === "All" ? {} : { category: filter });
                // setSearchParams(searchParams);
              }}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="flex gap-4 mt-5">
          {/* Kiri — daftar menu */}
          <div className="flex-1">
            {/* Filter row */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Cari menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <select
                value={searchParams.get("category") ?? ""}
                onChange={(e) =>
                  setSearchParams((prev) => {
                    if (e.target.value) prev.set("category", e.target.value);
                    else prev.delete("category");
                    return prev;
                  })
                }
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Semua kategori</option>
                <option value="Coffee">Coffee</option>
                <option value="Non-Coffee">Non-Coffee</option>
                <option value="Food">Food</option>
              </select>
              <select
                onChange={(e) => {
                  const [by, order] = e.target.value.split("-") as [
                    "name" | "price" | "category",
                    "asc" | "desc",
                  ];
                  setSearchParams((prev) => {
                    if (by) {
                      prev.set("sortBy", by);
                      prev.set("sortOrder", order);
                    } else {
                      prev.delete("sortBy");
                      prev.delete("sortOrder");
                    }
                    return prev;
                  });
                }}
              >
                <option value="">Urutkan</option>
                <option value="name-asc">Nama A-Z</option>
                <option value="name-desc">Nama Z-A</option>
                <option value="price-asc">Harga terendah</option>
                <option value="price-desc">Harga tertinggi</option>
              </select>
            </div>

            {/* Grid menu */}
            <div className="grid grid-cols-3 gap-3">
              {loadingMenu ? (
                <p className="text-center text-gray-400 col-span-3">
                  Loading...
                </p>
              ) : (
                menu.map((item: any) => (
                  <div
                    key={item.id}
                    className="border rounded-xl overflow-hidden cursor-pointer hover:border-gray-300"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        {item.category}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        <Button
                          onClick={() =>
                            handleAddToCart(
                              "increment",
                              item.id,
                              item.name,
                              item.price,
                            )
                          }
                          type="button"
                          color="primary"
                        >
                          + Tambah
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value={10}>10 / halaman</option>
                <option value={20}>20 / halaman</option>
                <option value={50}>50 / halaman</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 border rounded-lg text-sm ${page === p ? "bg-black text-white" : "hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Kanan — cart */}
          <div className="w-1/3 border rounded-xl p-4 self-start">
            {/* <p className="font-bold text-xl mb-3">Pesanan</p> */}

            {/* Kosong */}
            {/* <p className="text-sm text-gray-400 text-center py-6">
              Belum ada item ditambahkan
            </p> */}

            <form onSubmit={handleCreateOrder} className="mb-6">
              <div className="mb-3">
                <h2 className="text-xl font-medium">Customer Information</h2>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <Input
                  id="name"
                  type="text"
                  name="customerName"
                  placeholder="Masukkan nama customer"
                  label="Customer Name"
                  required
                />
                <Select
                  options={tables}
                  id="tableNumber"
                  label="Table Number"
                  name="tableNumber"
                  required
                />
              </div>
              <div className="mb-3">
                <h2 className="text-lg font-medium">Current Order</h2>
              </div>

              {/* Contoh item (nanti dari state) */}
              {carts.length > 0 ? (
                <div className="">
                  <div className="flex flex-col gap-2">
                    {carts.map((item: CartItem) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 py-2 border-b"
                      >
                        <span className="flex-1 text-sm truncate">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              handleAddToCart(
                                "decrement",
                                item.id,
                                item.name,
                                item.price,
                              )
                            }
                            type="button"
                            className="w-5 h-5 rounded-full border text-sm"
                          >
                            −
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button
                            onClick={() =>
                              handleAddToCart(
                                "increment",
                                item.id,
                                item.name,
                                item.price,
                              )
                            }
                            type="button"
                            className="w-5 h-5 rounded-full border text-sm"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>
                      Rp{" "}
                      {totalHarga.toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-3 bg-[#252422] hover:bg-[#3d3b38] text-white py-2"
                  >
                    Buat order
                  </Button>
                </div>
              ) : (
                <div className="">
                  <p className="text-sm text-gray-400 text-center py-6">
                    Belum ada item ditambahkan
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateOrder;

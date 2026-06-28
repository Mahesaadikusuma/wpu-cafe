interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "PROCESSING" | "COMPLETED";
  sortBy?: "created_at" | "customerName" | "tableNumber" | "total" | "status";
  sortOrder?: "asc" | "desc";
}

interface GetMenuParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'category';
  sortOrder?: 'asc' | 'desc';
}

interface OrderCreate {
  customerName: string;
  tableNumber: number;
  cart: ICart[];
  notes?:string;
}

interface ICart {
  menuItemId: string;
  quantity: number;
  notes: string;
  menuItem?: ImenuItem
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}


interface ImenuItem {
  id: string
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  created_at: string;
}

interface IOrders {
  id: string;
  customer_name: string;
  table_number: number;
  total: number;
  status: "PROCESSING" | "COMPLETED";
  cart: ICart[];
  created_at: string;
  updated_at: string;
}

export type { GetOrdersParams, IOrders, ICart, CartItem, OrderCreate, GetMenuParams}
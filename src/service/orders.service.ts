import { environment } from "../constants/environment";
import type { IAuthData } from "../types/auth";
import type { GetMenuParams, GetOrdersParams, OrderCreate } from "../types/orders";
import fetchAPI from "../utils/fetch";
import { getLocalStorage } from "../utils/storage";

export const getOrders = async (params: GetOrdersParams = {}) => {
    const {
        page = 1,
        pageSize = 10,
        search = null,
        status = null,
        sortBy = null,
        sortOrder = null,
    } = params;

    // let Url = `${environment.API_URL}/orders?page=${page}&pageSize=${pageSize}`
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(search && { search }),
        ...(status && { status }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
    });
    let Url = `${environment.API_URL}/orders?${query}`
    const auth = getLocalStorage<IAuthData | null>("auth", null);
    const token = auth?.token;

    const result = await fetchAPI(Url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(data => data)

    return result;
}


export const getOrderById = async (id: string) => {
    const auth = getLocalStorage<IAuthData | null>("auth", null);
    const token = auth?.token;
    let Url = `${environment.API_URL}/orders/${id}`

    const result = await fetchAPI(Url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    

    return result
}

export const updateOrder = async (id: string, payload: {status: string}) => {
    let Url = `${environment.API_URL}/orders/${id}`
    const auth = getLocalStorage<IAuthData | null>("auth", null);
    const token = auth?.token;

    const result = await fetchAPI(Url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
    return result
}

export const getMenus = async (params: GetMenuParams = {}) => {
    const {
    page = 1,
    pageSize = 10,
    search = null,
    category = null,
    sortBy = null,
    sortOrder = null,
  } = params;

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(search && { search }),
    ...(category && { category }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });
//   let url = `${environment.API_URL}/menu?page=1&pageSize=10`;
//   if (category) {
//     url += `&category=${category}`;
//   }
//   const result = await fetchAPI(url, {
//     method: 'GET',
//   });

const result = await fetchAPI(`${environment.API_URL}/menu?${query}`, {
    method: "GET",
  });


  return result;
};

export const createOrder = async (payload: OrderCreate) => {
    const auth = getLocalStorage<IAuthData | null>("auth", null);
    const token = auth?.token;
    const result = await fetchAPI(`${environment.API_URL}/orders`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

  return result;
};
import axios, { AxiosResponse } from 'axios';
import { MinimalProduct, Product, ResponseArray } from '../types';
import axiosInstance from '../utils/AxiosInstance';

export function getProducts(page: number, size: number): Promise<ResponseArray<Product>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/products?page=${page}&size=${size}`);
}

export function getProductsbyShop(shopId: string, page: number, size: number): Promise<ResponseArray<Product>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/products?shopId=${shopId}&page=${page}&size=${size}`);
}

export function getProductsbyShopAndCategory(
    shopId: string,
    categoryId: number,
    page: number,
    size: number,
): Promise<ResponseArray<Product>> {
    return axiosInstance.get(
        `${process.env.REACT_APP_API}/products?shopId=${shopId}&categoryId=${categoryId}&page=${page}&size=${size}`,
    );
}

export function getProduct(id: string): Promise<AxiosResponse<Product>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/products/${id}`);
}

export function createProduct(product: MinimalProduct): Promise<AxiosResponse<Product>> {
    return axiosInstance.post(`${process.env.REACT_APP_API}/products`, product);
}

export function editProduct(product: MinimalProduct): Promise<AxiosResponse<Product>> {
    return axiosInstance.put(`${process.env.REACT_APP_API}/products`, product);
}

export function deleteProduct(id: string): Promise<AxiosResponse<Product>> {
    return axiosInstance.delete(`${process.env.REACT_APP_API}/products/${id}`);
}

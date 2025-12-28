import { MinimalShop } from './../types/shop';
import axios, { AxiosResponse } from 'axios';
import { Shop } from '../types';
import { ResponseArray } from '../types/response';
import axiosInstance from '../utils/AxiosInstance';

export function getShops(page: number, size: number): Promise<ResponseArray<Shop>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}`);
}

export function getShopsSorted(page: number, size: number, sort: string): Promise<ResponseArray<Shop>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}&sortBy=${sort}`);
}

export function getShopsFiltered(page: number, size: number, urlFilters: string): Promise<ResponseArray<Shop>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}${urlFilters}`);
}

export function getShop(id: string): Promise<AxiosResponse<Shop>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/shops/${id}`);
}

export function createShop(shop: MinimalShop): Promise<AxiosResponse<Shop>> {
    return axiosInstance.post(`${process.env.REACT_APP_API}/shops`, shop);
}

export function editShop(shop: MinimalShop): Promise<AxiosResponse<Shop>> {
    return axiosInstance.put(`${process.env.REACT_APP_API}/shops`, shop);
}

export function deleteShop(id: string): Promise<AxiosResponse<Shop>> {
    return axiosInstance.delete(`${process.env.REACT_APP_API}/shops/${id}`);
}
export function getShopsCombined(queryString: string): Promise<AxiosResponse<ResponseArray<Shop>>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/shops?${queryString}`);
}

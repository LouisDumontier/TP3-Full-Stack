import { AxiosResponse } from 'axios';
import { Category, MinimalCategory, ResponseArray } from '../types';
import axiosInstance from '../utils/AxiosInstance';

export function getCategories(page: number, size: number): Promise<ResponseArray<Category>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/categories?page=${page}&size=${size}`);
}

export function getCategory(id: string): Promise<AxiosResponse<Category>> {
    return axiosInstance.get(`${process.env.REACT_APP_API}/categories/${id}`);
}

export function createCategory(category: MinimalCategory): Promise<AxiosResponse<Category>> {
    return axiosInstance.post(`${process.env.REACT_APP_API}/categories`, category);
}

export function editCategory(category: MinimalCategory): Promise<AxiosResponse<Category>> {
    return axiosInstance.put(`${process.env.REACT_APP_API}/categories`, category);
}

export function deleteCategory(id: string): Promise<AxiosResponse<Category>> {
    return axiosInstance.delete(`${process.env.REACT_APP_API}/categories/${id}`);
}

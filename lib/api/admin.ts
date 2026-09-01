import { apiFetch, ApiResponse } from "./fetcher";
import { Booking } from "./bookings";
import { Role } from "./auth";

export type UserStatus = "ACTIVE" | "BANNED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

/**
 * Get all users
 */
export function getAllUsers() {
  return apiFetch<ApiResponse<AdminUser[]>>("/admin/users");
}

/**
 * Update user status
 */
export function updateUserStatus(
  id: string,
  status: UserStatus
) {
  return apiFetch<ApiResponse<AdminUser>>(`/admin/users/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

/**
 * Get all bookings
 */
export function getAllBookingsAdmin() {
  return apiFetch<ApiResponse<Booking[]>>("/admin/bookings");
}

/**
 * Get all categories
 */
export function getCategories() {
  return apiFetch<ApiResponse<Category[]>>("/admin/categories");
}

/**
 * Create category
 */
export function createCategory(name: string) {
  return apiFetch<ApiResponse<Category>>("/admin/categories", {
    method: "POST",
    body: { name },
  });
}

/**
 * Update category
 */
export function updateCategory(
  id: string,
  name: string
) {
  return apiFetch<ApiResponse<Category>>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: { name },
  });
}

/**
 * Delete category
 */
export function deleteCategory(id: string) {
  return apiFetch<ApiResponse<null>>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}

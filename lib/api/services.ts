
import { apiFetch, ApiResponse } from "./fetcher";

export interface Category {
  id: string;
  name: string;
}




export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



export interface CreateServicePayload {
  title: string;
  description: string;
  price: number;
  duration: number;
  location?: string;
  categoryId: string;
}

export interface ServiceFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  location?: string;
  categoryId: string;

  technicianProfileId: string;

  images?: string[];

  category?: Category;

  technicianProfile?: {
    id: string;
    user: {
      name: string;
      email: string;
      avatar?: string;
      location?: string;
    };
  };
}

export function createService(data: CreateServicePayload) {
  return apiFetch<ApiResponse<Service>>("/services", {
    method: "POST",
    body: data,
  });
}

export function getMyServices() {
  return apiFetch<ApiResponse<Service[]>>("/services/my-services", {
    auth: true,
  });
}

export function updateService(
  id: string,
  data: Partial<CreateServicePayload>
) {
  return apiFetch<ApiResponse<Service>>(`/services/${id}`, {
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export function deleteService(id: string) {
  return apiFetch<ApiResponse<null>>(`/services/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

function buildQuery(filters: ServiceFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();

  return qs ? `?${qs}` : "";
}



export function getServices(filters: ServiceFilters = {}) {
  return apiFetch<ApiResponse<Service[], PaginationMeta>>(
    `/services${buildQuery(filters)}`,
    {
      auth: false,
    }
  );
}

export function getServiceById(id: string) {
  return apiFetch<ApiResponse<Service>>(
    `/services/${id}`,
    {
      auth: false,
    }
  );
}

export function getCategories() {
  return apiFetch<ApiResponse<Category[]>>(
    "/categories",
    {
      auth: false,
    }
  );
}

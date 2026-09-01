import { ApiResponse, apiFetch } from "./fetcher";

export interface TechnicianAvailability {
  id: string;
  technicianProfileId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Technician {
  id: string;

  bio?: string;
  experienceYears?: number;
  skills?: string[];

  hourlyRate?: number;
  ratingAvg?: number;
  totalReviews?: number;
  isVerified?: boolean;

  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    avatar?: string;
    createdAt?: string;
  };

  services?: [];
  availabilities?: TechnicianAvailability[];
  reviews?: [];
}

// export interface Technician {
//   id: string;

//   bio?: string;
//   experienceYears?: number;
//   skills?: string[];

//   hourlyRate?: number;
//   ratingAvg?: number;
//   totalReviews?: number;
//   isVerified?: boolean;

//   user: {
//     id: string;
//     name: string;
//     email: string;
//     phone?: string;
//     location?: string;
//     avatar?: string;
//     createdAt?: string;
//   };
// }

export interface TimeSlot {
  time: string;      
  isBooked: boolean;
}

export interface AvailabilityDay {
  date: string;        
  slots: TimeSlot[];
}




export function getTechnicianAvailability(technicianId: string) {
  return apiFetch<ApiResponse<AvailabilityDay[]>>(
    `/technicians/${technicianId}/availability`,
    { auth: false }
  );
}

export function getTechnicianById(id: string) {
  return apiFetch<ApiResponse<Technician>>(
    `/technicians/${id}`,
    { auth: false }
  );
}
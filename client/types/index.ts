export type UserRole = "student" | "college_admin" | "railway_admin";

export interface User {
  id: string;
  phone: string;
  email?: string;
  role: UserRole;
  fullName: string;
  collegeName?: string;
  department?: string;
  year?: string;
  prn?: string;
  profileComplete: boolean;
  createdAt: string;
}

export type ApplicationStatus =
  | "submitted"
  | "college_approved"
  | "railway_approved"
  | "rejected";

export type TravelClass = "1st" | "2nd";
export type Duration = "monthly" | "quarterly";

export interface ConcessionApplication {
  id: string;
  userId: string;
  studentName: string;
  collegeName: string;
  department: string;
  year: string;
  prn: string;
  sourceStation: string;
  destinationStation: string;
  travelClass: TravelClass;
  duration: Duration;
  reason: string;
  collegeIdUri?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  collegeRemarks?: string;
  railwayRemarks?: string;
  collegeApprovedAt?: string;
  railwayApprovedAt?: string;
  qrCode?: string;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  code: string;
  name: string;
  city: string;
}

export const INDIAN_RAILWAY_STATIONS: Station[] = [
  { code: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", city: "Mumbai" },
  { code: "BCT", name: "Mumbai Central", city: "Mumbai" },
  { code: "LTT", name: "Lokmanya Tilak Terminus", city: "Mumbai" },
  { code: "DR", name: "Dadar", city: "Mumbai" },
  { code: "BVI", name: "Borivali", city: "Mumbai" },
  { code: "TNA", name: "Thane", city: "Thane" },
  { code: "KYN", name: "Kalyan Junction", city: "Kalyan" },
  { code: "PNVL", name: "Panvel", city: "Panvel" },
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "DLI", name: "Old Delhi Junction", city: "Delhi" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
  { code: "SDAH", name: "Sealdah", city: "Kolkata" },
  { code: "MAS", name: "Chennai Central", city: "Chennai" },
  { code: "MS", name: "Chennai Egmore", city: "Chennai" },
  { code: "SBC", name: "Bengaluru City Junction", city: "Bengaluru" },
  { code: "PUNE", name: "Pune Junction", city: "Pune" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad" },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad" },
  { code: "SC", name: "Secunderabad Junction", city: "Secunderabad" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow" },
  { code: "CNB", name: "Kanpur Central", city: "Kanpur" },
  { code: "PRYJ", name: "Prayagraj Junction", city: "Prayagraj" },
  { code: "BSB", name: "Varanasi Junction", city: "Varanasi" },
  { code: "PNBE", name: "Patna Junction", city: "Patna" },
  { code: "GHY", name: "Guwahati", city: "Guwahati" },
  { code: "BPL", name: "Bhopal Junction", city: "Bhopal" },
  { code: "NGP", name: "Nagpur Junction", city: "Nagpur" },
  { code: "SUR", name: "Solapur Junction", city: "Solapur" },
  { code: "KOP", name: "Kolhapur", city: "Kolhapur" },
];

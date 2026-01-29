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
  line?: string;
}

export const INDIAN_RAILWAY_STATIONS: Station[] = [
  // Western Line Stations
  { code: "CCG", name: "Churchgate", city: "Mumbai", line: "Western" },
  { code: "MRNE", name: "Marine Lines", city: "Mumbai", line: "Western" },
  { code: "CHRR", name: "Charni Road", city: "Mumbai", line: "Western" },
  { code: "GNRD", name: "Grant Road", city: "Mumbai", line: "Western" },
  { code: "BCT", name: "Mumbai Central", city: "Mumbai", line: "Western" },
  { code: "MMRD", name: "Mahalaxmi", city: "Mumbai", line: "Western" },
  { code: "LRD", name: "Lower Parel", city: "Mumbai", line: "Western" },
  { code: "PREL", name: "Prabhadevi", city: "Mumbai", line: "Western" },
  { code: "DDR", name: "Dadar", city: "Mumbai", line: "Western" },
  { code: "MTNL", name: "Matunga Road", city: "Mumbai", line: "Western" },
  { code: "MMRDA", name: "Mahim Junction", city: "Mumbai", line: "Western" },
  { code: "BA", name: "Bandra", city: "Mumbai", line: "Western" },
  { code: "KHRD", name: "Khar Road", city: "Mumbai", line: "Western" },
  { code: "STNC", name: "Santacruz", city: "Mumbai", line: "Western" },
  { code: "VLPE", name: "Vile Parle", city: "Mumbai", line: "Western" },
  { code: "ADH", name: "Andheri", city: "Mumbai", line: "Western" },
  { code: "JOG", name: "Jogeshwari", city: "Mumbai", line: "Western" },
  { code: "RAM", name: "Ram Mandir", city: "Mumbai", line: "Western" },
  { code: "GRD", name: "Goregaon", city: "Mumbai", line: "Western" },
  { code: "MRVD", name: "Malad", city: "Mumbai", line: "Western" },
  { code: "KNVD", name: "Kandivali", city: "Mumbai", line: "Western" },
  { code: "BVI", name: "Borivali", city: "Mumbai", line: "Western" },
  { code: "DAHN", name: "Dahisar", city: "Mumbai", line: "Western" },
  { code: "MIRA", name: "Mira Road", city: "Thane", line: "Western" },
  { code: "BYNR", name: "Bhayandar", city: "Thane", line: "Western" },
  { code: "NSP", name: "Naigaon", city: "Palghar", line: "Western" },
  { code: "VR", name: "Vasai Road", city: "Palghar", line: "Western" },
  { code: "NLI", name: "Nalla Sopara", city: "Palghar", line: "Western" },
  { code: "VRD", name: "Virar", city: "Palghar", line: "Western" },
  { code: "VTNL", name: "Vaitarna", city: "Palghar", line: "Western" },
  { code: "SFRN", name: "Saphale", city: "Palghar", line: "Western" },
  { code: "KELI", name: "Kelve Road", city: "Palghar", line: "Western" },
  { code: "PGR", name: "Palghar", city: "Palghar", line: "Western" },
  { code: "UMR", name: "Umroli", city: "Palghar", line: "Western" },
  { code: "BOR", name: "Boisar", city: "Palghar", line: "Western" },
  { code: "DHRM", name: "Dahanu Road", city: "Palghar", line: "Western" },

  // Central Line Stations
  { code: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", city: "Mumbai", line: "Central" },
  { code: "MSD", name: "Masjid Bunder", city: "Mumbai", line: "Central" },
  { code: "SNT", name: "Sandhurst Road", city: "Mumbai", line: "Central" },
  { code: "BCL", name: "Byculla", city: "Mumbai", line: "Central" },
  { code: "CHNI", name: "Chinchpokli", city: "Mumbai", line: "Central" },
  { code: "CRD", name: "Currey Road", city: "Mumbai", line: "Central" },
  { code: "DR", name: "Dadar", city: "Mumbai", line: "Central" },
  { code: "MTN", name: "Matunga", city: "Mumbai", line: "Central" },
  { code: "SIN", name: "Sion", city: "Mumbai", line: "Central" },
  { code: "KLA", name: "Kurla", city: "Mumbai", line: "Central" },
  { code: "VKR", name: "Vidyavihar", city: "Mumbai", line: "Central" },
  { code: "GCN", name: "Ghatkopar", city: "Mumbai", line: "Central" },
  { code: "VKD", name: "Vikhroli", city: "Mumbai", line: "Central" },
  { code: "KNO", name: "Kanjurmarg", city: "Mumbai", line: "Central" },
  { code: "BNS", name: "Bhandup", city: "Mumbai", line: "Central" },
  { code: "NHV", name: "Nahur", city: "Mumbai", line: "Central" },
  { code: "MNK", name: "Mulund", city: "Mumbai", line: "Central" },
  { code: "TNA", name: "Thane", city: "Thane", line: "Central" },
  { code: "KPR", name: "Kalwa", city: "Thane", line: "Central" },
  { code: "MNBR", name: "Mumbra", city: "Thane", line: "Central" },
  { code: "DI", name: "Diva Junction", city: "Thane", line: "Central" },
  { code: "KOPR", name: "Kopar", city: "Thane", line: "Central" },
  { code: "DRD", name: "Dombivli", city: "Thane", line: "Central" },
  { code: "TKL", name: "Thakurli", city: "Thane", line: "Central" },
  { code: "KYN", name: "Kalyan Junction", city: "Thane", line: "Central" },
  { code: "VGI", name: "Vithalwadi", city: "Thane", line: "Central" },
  { code: "UBR", name: "Ulhasnagar", city: "Thane", line: "Central" },
  { code: "ABH", name: "Ambernath", city: "Thane", line: "Central" },
  { code: "BDR", name: "Badlapur", city: "Thane", line: "Central" },
  { code: "VAS", name: "Vangani", city: "Thane", line: "Central" },
  { code: "SKRD", name: "Shelu", city: "Thane", line: "Central" },
  { code: "NRL", name: "Neral", city: "Raigad", line: "Central" },
  { code: "BHVN", name: "Bhivpuri Road", city: "Raigad", line: "Central" },
  { code: "KJT", name: "Karjat", city: "Raigad", line: "Central" },
  { code: "PLYN", name: "Palasdhari", city: "Raigad", line: "Central" },
  { code: "KPSI", name: "Kelavli", city: "Raigad", line: "Central" },
  { code: "DOI", name: "Dolavli", city: "Raigad", line: "Central" },
  { code: "LNL", name: "Lowjee", city: "Raigad", line: "Central" },
  { code: "KMAY", name: "Khopoli", city: "Raigad", line: "Central" },

  // Harbour Line Stations
  { code: "CSMT", name: "CSMT", city: "Mumbai", line: "Harbour" },
  { code: "MSBR", name: "Masjid Bunder", city: "Mumbai", line: "Harbour" },
  { code: "SNRD", name: "Sandhurst Road", city: "Mumbai", line: "Harbour" },
  { code: "DCRD", name: "Dockyard Road", city: "Mumbai", line: "Harbour" },
  { code: "RLG", name: "Reay Road", city: "Mumbai", line: "Harbour" },
  { code: "CTNG", name: "Cotton Green", city: "Mumbai", line: "Harbour" },
  { code: "SGR", name: "Sewri", city: "Mumbai", line: "Harbour" },
  { code: "WDLA", name: "Wadala Road", city: "Mumbai", line: "Harbour" },
  { code: "GTR", name: "GTB Nagar", city: "Mumbai", line: "Harbour" },
  { code: "CLBG", name: "Chunabhatti", city: "Mumbai", line: "Harbour" },
  { code: "KURL", name: "Kurla", city: "Mumbai", line: "Harbour" },
  { code: "TLPD", name: "Tilak Nagar", city: "Mumbai", line: "Harbour" },
  { code: "CNN", name: "Chembur", city: "Mumbai", line: "Harbour" },
  { code: "GCV", name: "Govandi", city: "Mumbai", line: "Harbour" },
  { code: "MNKD", name: "Mankhurd", city: "Mumbai", line: "Harbour" },
  { code: "VKP", name: "Vashi", city: "Navi Mumbai", line: "Harbour" },
  { code: "SNPD", name: "Sanpada", city: "Navi Mumbai", line: "Harbour" },
  { code: "JUI", name: "Juinagar", city: "Navi Mumbai", line: "Harbour" },
  { code: "NRI", name: "Nerul", city: "Navi Mumbai", line: "Harbour" },
  { code: "SWD", name: "Seawoods Darave", city: "Navi Mumbai", line: "Harbour" },
  { code: "BEPR", name: "Belapur CBD", city: "Navi Mumbai", line: "Harbour" },
  { code: "KHKP", name: "Kharghar", city: "Navi Mumbai", line: "Harbour" },
  { code: "MNSR", name: "Mansarovar", city: "Navi Mumbai", line: "Harbour" },
  { code: "KLMB", name: "Khandeshwar", city: "Navi Mumbai", line: "Harbour" },
  { code: "PNVL", name: "Panvel", city: "Navi Mumbai", line: "Harbour" },

  // Trans-Harbour Line
  { code: "TNA", name: "Thane", city: "Thane", line: "Trans-Harbour" },
  { code: "ARBS", name: "Airoli", city: "Navi Mumbai", line: "Trans-Harbour" },
  { code: "RBVR", name: "Rabale", city: "Navi Mumbai", line: "Trans-Harbour" },
  { code: "GHNS", name: "Ghansoli", city: "Navi Mumbai", line: "Trans-Harbour" },
  { code: "KPR", name: "Kopar Khairane", city: "Navi Mumbai", line: "Trans-Harbour" },
  { code: "TBE", name: "Turbhe", city: "Navi Mumbai", line: "Trans-Harbour" },
  { code: "VKP", name: "Vashi", city: "Navi Mumbai", line: "Trans-Harbour" },

  // Major Terminus and Junction Stations
  { code: "LTT", name: "Lokmanya Tilak Terminus", city: "Mumbai", line: "Terminus" },
  { code: "BDTS", name: "Bandra Terminus", city: "Mumbai", line: "Terminus" },
  
  // Pune Suburban
  { code: "PUNE", name: "Pune Junction", city: "Pune", line: "Pune" },
  { code: "SVJR", name: "Shivajinagar", city: "Pune", line: "Pune" },
  { code: "KK", name: "Khadki", city: "Pune", line: "Pune" },
  { code: "DPR", name: "Dapodi", city: "Pune", line: "Pune" },
  { code: "KSW", name: "Kasarwadi", city: "Pune", line: "Pune" },
  { code: "PCMT", name: "Pimpri Chinchwad", city: "Pune", line: "Pune" },
  { code: "CKNN", name: "Chinchwad", city: "Pune", line: "Pune" },
  { code: "AKD", name: "Akurdi", city: "Pune", line: "Pune" },
  { code: "DEU", name: "Dehu Road", city: "Pune", line: "Pune" },
  { code: "BGM", name: "Begdewadi", city: "Pune", line: "Pune" },
  { code: "TVS", name: "Talegaon", city: "Pune", line: "Pune" },
  { code: "VDGN", name: "Vadgaon", city: "Pune", line: "Pune" },
  { code: "KNH", name: "Kanhe", city: "Pune", line: "Pune" },
  { code: "KMSHT", name: "Kamshet", city: "Pune", line: "Pune" },
  { code: "MLV", name: "Malavli", city: "Pune", line: "Pune" },
  { code: "LNL", name: "Lonavala", city: "Pune", line: "Pune" },

  // Other Maharashtra Cities
  { code: "NGP", name: "Nagpur Junction", city: "Nagpur", line: "Other" },
  { code: "SUR", name: "Solapur Junction", city: "Solapur", line: "Other" },
  { code: "KOP", name: "Kolhapur", city: "Kolhapur", line: "Other" },
  { code: "NSK", name: "Nashik Road", city: "Nashik", line: "Other" },
  { code: "AWB", name: "Aurangabad", city: "Aurangabad", line: "Other" },
  { code: "AK", name: "Akola Junction", city: "Akola", line: "Other" },
  { code: "NED", name: "Nanded", city: "Nanded", line: "Other" },
  { code: "J", name: "Jalgaon Junction", city: "Jalgaon", line: "Other" },
  { code: "BSL", name: "Bhusaval Junction", city: "Bhusaval", line: "Other" },
  { code: "MMR", name: "Manmad Junction", city: "Manmad", line: "Other" },
  { code: "IGP", name: "Igatpuri", city: "Igatpuri", line: "Other" },
  { code: "KSR", name: "Kasara", city: "Thane", line: "Other" },
  { code: "ASG", name: "Asangaon", city: "Thane", line: "Other" },
  { code: "AO", name: "Atgaon", city: "Thane", line: "Other" },
  { code: "TLJ", name: "Titwala", city: "Thane", line: "Other" },
  { code: "KDH", name: "Khadavli", city: "Thane", line: "Other" },
  { code: "VSD", name: "Vasind", city: "Thane", line: "Other" },
  { code: "ABY", name: "Ambivli", city: "Thane", line: "Other" },
  { code: "SGO", name: "Shahad", city: "Thane", line: "Other" },
];

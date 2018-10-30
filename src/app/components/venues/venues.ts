export interface VenuesDetail {
  detail: string[];
  title: string;
}

export interface VenuesInfo {
  detail: string[];
  title: string;
}

export interface VenuesLocation {
  addr: string;
  gpid: string;
  lat: number;
  lng: number;
  name: string;
  postcode: string;
  rating: number;
  region: string;
}

export interface VenuesPackageItemProduct {
  days_available: number[];
  end_date: string;
  price: string;
  start_date: string;
}

export interface VenuesPackageItem {
  end_date: string;
  flag_ending: boolean;
  flag_new: boolean;
  id: string;
  number_of_nights: number;
  number_of_people: number;
  package_description: string;
  package_name: string;
  price_day: any[];
  price_from: string;
  products: VenuesPackageItemProduct[];
  venue_id: number;
}

export interface VenuesDoc {
  id: string;
  venue_detail: VenuesDetail[];
  venue_id: number;
  venue_image: string;
  venue_images: string[];
  venue_info: VenuesInfo[];
  venue_location: VenuesLocation;
  venue_name: string;
  venue_package_items: VenuesPackageItem[];
  venue_packages: number;
  venue_packages_break: number;
  venue_packages_day: number;
  venue_packages_ending: number;
  venue_packages_new: number;
  venue_price_from: string;
}

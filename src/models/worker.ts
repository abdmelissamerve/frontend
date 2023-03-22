export interface Provider {
  id: string;
  name: string;
  login_link: string;
  site: string;
  affiliate_link: string;
}

export interface ProviderLocation {
  id: string;
  continent: string;
  country: string;
  city: string;
  data_center: string;
  provider: Provider;
}

export interface Worker {
  id: string;
  ipv4: string;
  private_ipv4: string;
  ipv6: string;
  asn: string;
  bidatacloud: object;
  maxmind: object;
  currency: string;
  disabled: boolean;
  latitude: number;
  longitude: number;
  location: ProviderLocation;
  payment_date: string;
  payment_recurrence: string;
  port: number;
  price: number;
}

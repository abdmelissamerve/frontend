interface Worker {
  id: string;
  ipv4: string;
  ipv6: string;
  port: number;
  latitude: string;
  longitude: string;
  city: string;
  continent: string;
  country: string;
  dataCenter: string;
  provider: string;
  paymentDate: string;
  paymentRecurrence: string;
  currency: string;
  price: string;
  asn: string;
  disabled: boolean;
}

export type { Worker };

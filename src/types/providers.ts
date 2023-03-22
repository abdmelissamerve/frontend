interface Provider {
  id: string;
  name: string;
  site: string;
  loginLink: string;
  affiliateLink: string;
  workerCount?: number;
  locationCount?: number;
}

export type { Provider };

import type { Provider } from 'src/types/providers';

class ProvidersApi {
  getProviders(): Promise<Provider[]> {
    const providers: Provider[] = [
      {
        id: '1',
        name: 'Virtono',
        site: 'https://virtono.com',
        loginLink: 'https://virtono.com/index.php?rp=/login',
        workers: '1',
        uptime: '98,6',
        recurringPaymemnts: '354',
        paid: '968'
      }
    ];
    return Promise.resolve(providers);
  }

  getProvider(): Promise<Provider> {
    const provider: Provider = {
      id: '1',
      name: 'Virtono',
      site: 'https://virtono.com',
      loginLink: 'https://virtono.com/index.php?rp=/login',
      workers: '1',
      uptime: '98,6',
      recurringPaymemnts: '354',
      paid: '968',
      status: 'X'
    };
    return Promise.resolve(provider);
  }
}
export const providersApi = new ProvidersApi();

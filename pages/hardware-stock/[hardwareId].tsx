import PageTitleWrapper from '@/components/PageTitleWrapper';
import Head from 'next/head';
import PageHeader from 'src/content/HardwareStock/HardwarePage/PageHeader';
import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { useRouter } from 'next/router';
import HardwareContent from '@/content/HardwareStock/HardwarePage/PageContent';
import { useFetchData } from '@/hooks/useFetch';
import { getHardware } from '@/services/hardware-stock';
import { useCallback, useEffect } from 'react';
import { useRefMounted } from '@/hooks/useRefMounted';

function HardwarePage() {
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { data, loading, error, fetchData } = useFetchData(getHardware);

  const getHardwareData = useCallback(
    (hardware_id: number) => {
      fetchData(hardware_id);
    },
    [isMountedRef]
  );

  useEffect(() => {
    getHardwareData(parseInt(router.query.hardwareId));
  }, [getHardwareData]);

  return (
    <>
      <Head>
        <title>Hardware-Stock {router.query.hardwareId}</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <HardwareContent data={data} handleEditSuccess={getHardwareData} />
    </>
  );
}

HardwarePage.getLayout = (page) => {
  return (
    <ExtendedSidebarLayout>
      <Authenticated>{page}</Authenticated>;
    </ExtendedSidebarLayout>
  );
};

export default HardwarePage;

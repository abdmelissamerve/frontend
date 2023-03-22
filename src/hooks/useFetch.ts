import { useState, useCallback } from 'react';

function useFetchData(serviceFunction: Function) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        const response = await serviceFunction(payload);
        setData(response);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    },
    [serviceFunction]
  );

  return { fetchData, data, loading, error };
}

export { useFetchData };

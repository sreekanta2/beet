import { useEffect, useState } from "react";

type Option = {
  value: string;
  label: string;
  id: string;
};

export function useFetchOptions<T extends { id: string; name: string }>(
  url: string
) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const data = await res.json();

        if (isMounted) {
          const mapped = (data?.data?.data || []).map((item: T) => ({
            value: item.name.toLowerCase(),
            label: item.name,
            id: item?.id,
          }));
          setOptions(mapped);
        }
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { options, loading, error };
}

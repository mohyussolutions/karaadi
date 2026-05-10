import useSWR from "swr";

const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60_000,
  errorRetryCount: 2,
};

export function useListingData<T>(key: string, fetcher: () => Promise<T[] | null>) {
  const { data, error, isLoading } = useSWR<T[]>(
    key,
    () => fetcher().then((r) => r ?? []),
    SWR_CONFIG,
  );
  return { items: data ?? [], isLoading, isError: !!error };
}

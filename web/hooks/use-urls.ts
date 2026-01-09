import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { urlApi } from "@/lib/api/url";
import { CreateUrlDto, UrlQueryParams } from "@/types";

const URL_KEYS = {
  all: ["urls"] as const,
  list: (params?: UrlQueryParams) => ["urls", "list", params] as const,
  stats: (id: string) => ["urls", "stats", id] as const,
};

export const useUrls = (params?: UrlQueryParams) => {
  return useQuery({
    queryKey: URL_KEYS.list(params),
    queryFn: () => urlApi.getMyUrls(params),
  });
};

export const useShortenUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUrlDto) => urlApi.shortenUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: URL_KEYS.all });
    },
  });
};

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => urlApi.deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: URL_KEYS.all });
    },
  });
};

export const useUrlStats = (id: string) => {
  return useQuery({
    queryKey: URL_KEYS.stats(id),
    queryFn: () => urlApi.getUrlStats(id),
    enabled: !!id,
  });
};

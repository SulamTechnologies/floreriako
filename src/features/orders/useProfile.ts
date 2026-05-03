import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { ProfileDTO } from "@/types/api";

export const PROFILE_KEY = ["profile"] as const;

export function useProfile() {
  return useQuery<ProfileDTO>({
    queryKey: PROFILE_KEY,
    queryFn: () => api.get<ProfileDTO>("/api/account/profile"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { full_name: string }) =>
      api.patch<ProfileDTO>("/api/account/profile", data),
    onSuccess: (data) => qc.setQueryData(PROFILE_KEY, data),
  });
}

import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

type MapSummary = {
  MapName: string;
};

export function useMaps() {
  return useQuery({
    queryKey: ["maps"],
    queryFn: async () =>
      (await fetch(config.api.mapsUrl).then((res) => res.json())) as MapSummary[],
  });
}

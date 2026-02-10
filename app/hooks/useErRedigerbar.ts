import { useRedigeringsContext } from "~/contexts/RedigeringsContext";

export function useErRedigerbar() {
  const { erRedigerbar } = useRedigeringsContext();

  return erRedigerbar;
}

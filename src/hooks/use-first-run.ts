import { useSQLKey } from './use-sql-key';

interface Setting {
  key: string;
  value: string;
}

export function useHasSetup() {
  const [hasSetup, updateHasSetup] = useSQLKey("hasSetup");
  console.log(hasSetup)

  return [hasSetup == 'true', () => updateHasSetup('true')] as const;
}

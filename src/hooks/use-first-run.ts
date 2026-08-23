import { useSQLKey } from './use-sql-key';

export function useHasSetup() {
  const [hasSetup, updateHasSetup] = useSQLKey("hasSetup");

  return [hasSetup == 'true', () => updateHasSetup('true')] as const;
}

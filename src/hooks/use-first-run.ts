import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

interface Setting {
  key: string;
  value: string;
}

export function useHasSetup() {
  const db = useSQLiteContext();
  const [hasSetup, setHasSetup] = useState(false);

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<Setting>("SELECT * FROM app WHERE key = 'firstRun'");
      if (!result || result.value == 'true') {
        setHasSetup(false);
      } else {
        setHasSetup(true);
      }
    }
    setup();
  }, []);

  const completeSetup = async () => {
    setHasSetup(true);
    await db.execAsync("REPLACE INTO app (key, value) VALUES ('firstRun', 'false')");
  }

  return [hasSetup, completeSetup] as const;
}

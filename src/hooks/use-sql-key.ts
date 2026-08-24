import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

import { syncIfUnlocked, useSync } from '@/hooks/use-sync-context';

interface Setting {
  key: string;
  value: string;
}

export function useSQLKey(key: string) {
  const db = useSQLiteContext();
  const { keyphrase } = useSync();
  const [value, setValue] = useState<null | string>(null);
  const keyphraseRef = useRef(keyphrase);
  keyphraseRef.current = keyphrase;

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<Setting>('SELECT * FROM app WHERE key = ?', [key]);
      if (result) {
        setValue(result.value);
      }
    }
    setup();
  }, [db, key]);

  const updateValue = useCallback(
    async (newValue: string) => {
      setValue(newValue);
      await db.runAsync('REPLACE INTO app (key, value) VALUES (?, ?)', key, newValue);
      try {
        await syncIfUnlocked(db, keyphraseRef.current);
      } catch {
        // Sync failures should not block local saves.
      }
    },
    [db, key],
  );

  return [value, updateValue] as const;
}

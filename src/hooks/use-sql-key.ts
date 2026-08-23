import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

interface Setting {
  key: string;
  value: string;
}

export function useSQLKey(key: string) {
  const db = useSQLiteContext();
  const [value, setValue] = useState<null | string>(null);

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<Setting>("SELECT * FROM app WHERE key = ?", [key]);
      if (result) {
        setValue(result.value)
      }
    }
    setup();
  }, []);

  const updateValue = async (newValue: string) => {
    setValue(newValue);
    await db.runAsync("REPLACE INTO app (key, value) VALUES (?, ?)", key, newValue);
  }

  return [value, updateValue] as const;
}

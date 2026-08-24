import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHasSetup } from '@/hooks/use-first-run';
import { SyncProvider } from '@/hooks/use-sync-context';
import { CurrentProvider } from '@/contexts/current';
import SetupPage from '@/components/setup-page';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="findependence.db" onInit={migrateDbIfNeeded}>
        <SyncProvider>
          <CurrentProvider>
            <QueryClientProvider client={queryClient}>
              <MainPage />
            </QueryClientProvider>
          </CurrentProvider>
        </SyncProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}

function MainPage() {
  const [hasSetup, completeSetup] = useHasSetup();
  return (
    <>
      <AnimatedSplashOverlay />
      {(hasSetup ?
        <AppTabs />
        :
        <SetupPage completeSetup={completeSetup} />)
      }
    </>
  )
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE app (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
`);
    await db.runAsync('INSERT INTO app (key, value) VALUES (?, ?)', 'hasSetup', 'false');
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

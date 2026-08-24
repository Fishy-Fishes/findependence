import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const SYNC_STORE_PATH = path.join(__dirname, 'sync-store.json');

interface SyncRecord {
  salt: string;
  iv: string;
  ciphertext: string;
  updatedAt: string;
}

type SyncStore = Record<string, SyncRecord>;

function readStore(): SyncStore {
  try {
    if (fs.existsSync(SYNC_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(SYNC_STORE_PATH, 'utf-8'));
    }
  } catch {
    // Fall through to empty store on read/parse errors.
  }
  return {};
}

function writeStore(store: SyncStore): void {
  fs.writeFileSync(SYNC_STORE_PATH, JSON.stringify(store, null, 2));
}

app.use(express.json());

app.get('/resources', (_req: Request, res: Response) => {
  res.send([
    {
      id: '1',
      title: 'Title2',
      description: 'Description',
      short_description: 'Short Description',
      image: 'iamge',
      worth: 'worth',
      link: 'https://www.google.com',
    },
    {
      id: '2',
      title: 'Title4',
      description: 'Description',
      short_description: 'Short Description',
      image: 'iamge',
      worth: 'worth',
      link: 'https://google.com',
    },
  ]);
});

app.put('/sync/:syncId', (req: Request, res: Response) => {
  const syncId = req.params.syncId;
  const { salt, iv, ciphertext } = req.body;

  if (!syncId || Array.isArray(syncId) || !salt || !iv || !ciphertext) {
    res.status(400).json({ error: 'Missing sync payload fields' });
    return;
  }

  const store = readStore();
  store[syncId] = {
    salt,
    iv,
    ciphertext,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  res.json({ ok: true, updatedAt: store[syncId].updatedAt });
});

app.get('/sync/:syncId', (req: Request, res: Response) => {
  const syncId = req.params.syncId;
  if (!syncId || Array.isArray(syncId)) {
    res.status(400).json({ error: 'Invalid sync id' });
    return;
  }
  const store = readStore();
  const record = store[syncId];

  if (!record) {
    res.status(404).json({ error: 'Backup not found' });
    return;
  }

  res.json({
    salt: record.salt,
    iv: record.iv,
    ciphertext: record.ciphertext,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

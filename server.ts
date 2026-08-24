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
      title: 'Budget and Save',
      description:
        'Learn how to create a budget, manage your income and expenses, and build savings. Victorian Youth Central provides practical guidance designed to help young people develop money skills and work towards financial independence.',
      short_description: 'Learn how to budget, save and manage your money.',
      image: 'budget',
      worth: 'Free',
      link: 'https://www.youthcentral.vic.gov.au/money/how-budget-and-save',
    },
    {
      id: '2',
      title: 'Money Management and Budgeting',
      description:
        'Explore Victorian Government resources for managing your finances, including budgeting, saving, cost-of-living support and financial counselling.',
      short_description: 'Practical Victorian Government money management resources.',
      image: 'money',
      worth: 'Free',
      link: 'https://www.service.vic.gov.au/find-services/personal',
    },
    {
      id: '3',
      title: 'Cost of Living Support',
      description:
        'Find Victorian Government services and support that can help reduce financial pressure, manage living costs and access assistance when you need it.',
      short_description: 'Find support for managing everyday living costs.',
      image: 'cost-of-living',
      worth: 'Free',
      link: 'https://www.service.vic.gov.au/find-services/personal',
    },
    {
      id: '4',
      title: 'Financial Counselling',
      description:
        'Access free, confidential and independent financial counselling for help with debts, bills, budgeting and managing financial difficulties.',
      short_description: 'Get free help with debt, bills and financial problems.',
      image: 'financial-counselling',
      worth: 'Free',
      link: 'https://www.consumer.vic.gov.au/clubs-and-fundraising/funded-services-and-grants/financial-counselling-program-2021-26/financial-counselling-program',
    },
    {
      id: '5',
      title: 'Financial Help',
      description:
        'Find Victorian Government information about financial assistance, financial counselling and other support services available to Victorians experiencing financial hardship.',
      short_description: 'Find financial assistance and support services.',
      image: 'financial-help',
      worth: 'Free',
      link: 'https://www.vic.gov.au/financial-help',
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

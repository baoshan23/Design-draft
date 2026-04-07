export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const DEMO_URLS = {
  adminPanel: 'https://demo-admin.gcss.cloud',
  merchantPanel: 'https://demo-merchant.gcss.cloud',
  h5Web: 'https://demo-h5.gcss.cloud',
};

export const DEMO_CREDENTIALS = {
  admin: { username: 'admin', password: '123456' },
  merchant: { username: 'test_merchant', password: '123456' },
};

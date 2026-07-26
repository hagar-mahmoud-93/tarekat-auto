import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const env = {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  apiURL: process.env.API_URL ?? 'http://localhost:3000/api',
  ci: !!process.env.CI,
  nafath: {
    username: process.env.NAFATH_USERNAME ?? '1059608891',
    password: process.env.NAFATH_PASSWORD ?? '1059608891',
  },
  admin: {
    apiURL: process.env.ADMIN_API_URL ?? 'https://ops-merath.api.azm-dev.com/admin/',
    username: process.env.ADMIN_USERNAME ?? 'root',
    password: process.env.ADMIN_PASSWORD ?? 'root@001',
  },
  inheritanceSeeder: {
    apiURL: process.env.InheritanceSeeder_API_URL ?? '/inheritance_seeder/inheritanceseeder/seed/',
  },
  divisionAdmin: {
    apiURL: process.env.DIVISION_ADMIN_API_URL ?? '/division_v2/division/',
  },
  tawtheeq: {
    baseURL: process.env.TAWTHEEQ_BASE_URL ?? 'https://preprod-mocks.azm-dev.com',
    accessToken: process.env.TAWTHEEQ_ACCESS_TOKEN ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg0NDQ2NDAwLCJpYXQiOjE3ODQ0NDU1MDAsImp0aSI6ImVkZTUxM2EwNDg2MzRkNTNiODk4MzM2OWRkZDAwYjY4IiwidXNlcl9pZCI6IjExMDgifQ.gPLGTr52eJUwdeAb09t3LSA9DiBBy1o8-e5rDUvlpoU',
    refreshToken: process.env.TAWTHEEQ_REFRESH_TOKEN ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4NDQ1MDkwMCwiaWF0IjoxNzg0NDQ1NTAwLCJqdGkiOiI0NmFjYTc3MjRlYTM0YTM2OGE1NGE4NDdjZDMzYzYyYiIsInVzZXJfaWQiOiIxMTA4In0.nI7-YOquqIDbkov7arCQY4s0T3KwaxBaOQ7K9dn55-c',
  },
};

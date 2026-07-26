# AEM Enersol Dashboard

Angular 14 application with authentication, responsive dashboard, and offline support via PouchDB.

## Features

- Token-based sign-in authentication
- Interactive dashboard with charts and user table
- Offline login and data caching with PouchDB
- Bootstrap 4 responsive design
- Electron desktop app packaging for Windows

## Quick Start

Install dependencies:
```bash
npm install
```

Run locally:
```bash
npm start
```

Build for production:
```bash
npm run build
```

Build Electron desktop app:
```bash
npm run electron:build
```

## Tech Stack

Angular 14, Bootstrap 4, Chart.js, ng2-charts, PouchDB, RxJS, Electron, TypeScript

## API Endpoints

- Sign In: `POST http://test-demo.aemenersol.com/api/account/login`
- Dashboard: `GET http://test-demo.aemenersol.com/api/dashboard`

## Offline Support

- Credentials stored locally in PouchDB for offline login
- Dashboard data cached for offline viewing
- Automatic fallback to cached data when API unavailable

## Configuration

API URLs: `src/app/utils/constants/api-constant.ts`

## Scripts

- `npm start` - Dev server (http://localhost:4200)
- `npm run build` - Production build
- `npm run electron:serve` - Electron dev mode
- `npm run electron:build` - Electron Windows packaging

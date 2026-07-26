# AEM Enersol Dashboard Application

A modern Angular 14 application with sign-in authentication, responsive dashboard, and offline support using PouchDB local persistence.

## Features

- User authentication with API integration
- Dashboard with interactive charts and data tables
- Offline login using locally stored credentials
- Dashboard data caching for offline access
- Responsive Bootstrap 4 UI
- Electron desktop application packaging

## Technology Stack

- Angular 14
- Bootstrap 4
- Chart.js with ng2-charts
- PouchDB for local data persistence
- RxJS for reactive programming
- Electron for desktop packaging
- TypeScript

## Prerequisites

- Node.js 16 or higher
- npm 8 or higher

## Installation

1. Navigate to the project directory:

```bash
cd "c:/Users/ADY/Documents/Work/Job Hunt/Applications/AEM/Test/Angular"
```

2. Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm start
```

The application will open automatically at http://localhost:4200

## Building

Build for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Electron Desktop Application

Build the Electron desktop app for Windows:

```bash
npm run electron:build
```

This command:
1. Builds the Angular application
2. Packages it with Electron
3. Creates a Windows x64 executable

The packaged app will be in `dist-electron/AEMEnersolDashboard-win32-x64/`

To run the Electron app in development mode:

```bash
npm run electron:serve
```

## Project Structure

```
src/
  app/
    components/
      dashboard/          - Dashboard with charts and data tables
      sign-in/           - Sign-in form with authentication
    utils/
      services/
        auth.service.ts           - Authentication and token management
        pouchdb.service.ts        - Local data persistence
      guards/
        auth.guard.ts             - Route protection for authenticated routes
      interceptors/
        auth.interceptor.ts       - Automatic auth header injection
      constants/
        api-constant.ts           - API endpoint configuration
        route-constant.ts         - Route paths
    app-routing.module.ts  - Application routing configuration
  styles/                  - Global SCSS styles
  main.ts                  - Application bootstrap
main.js                    - Electron entry point
scripts/
  prepare-electron-build.js - Builds assets for Electron packaging
```

## Authentication

The application uses token-based authentication with the following flow:

1. User enters credentials on the sign-in page
2. Credentials are sent to the API for validation
3. Upon success, the token is stored in localStorage
4. Credentials are saved locally in PouchDB for offline access
5. Authenticated requests include the Bearer token in headers

## Offline Features

The application supports two offline scenarios:

### Offline Login

When the API is unavailable during sign-in:
1. The app attempts API authentication
2. If the API fails, it validates credentials against locally stored data in PouchDB
3. A local session token is generated
4. User can access the dashboard

### Dashboard Data Caching

Dashboard data is cached in PouchDB:
1. When the dashboard loads successfully, data is saved to local storage
2. If the API is unavailable on subsequent visits, cached data is displayed
3. Users can view the dashboard with the last known data

## API Endpoints

The application expects the following API endpoints:

- Sign In: `POST http://test-demo.aemenersol.com/api/account/login`
- Dashboard: `GET http://test-demo.aemenersol.com/api/dashboard`

## Local Storage

- Authentication token stored in localStorage under `aem_token`
- User credentials and dashboard data stored in IndexedDB via PouchDB

## Configuration

API URLs are configured in:
- `src/app/utils/constants/api-constant.ts`

Modify this file to connect to different API endpoints.

## Troubleshooting

### PouchDB Testing in Console

Access PouchDB from the browser console:

```javascript
const db = new PouchDB('aem-auth-db');
db.get('user').then(doc => console.log(doc));
db.get('dashboard').then(doc => console.log(doc));
```

### Clear Local Data

To clear all PouchDB data:

```javascript
new PouchDB('aem-auth-db').destroy()
```

### Build Issues

If you encounter build errors, try:

```bash
npm install
npm run build
```

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Watch mode for development
- `npm run electron:serve` - Serve with Electron for development
- `npm run electron:build` - Build Electron package for Windows

## License

This project is part of the AEM Enersol interview assessment.

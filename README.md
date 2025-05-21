
# WifiZen - Smart Router Management Dashboard

WifiZen is a Next.js application designed to provide a user-friendly interface for managing and monitoring your Huawei XPON router and connected network devices. It offers insights into network performance, device activity, and helps you keep track of related subscriptions.

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (App Router)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/) (Component Library)
    *   [Lucide React](https://lucide.dev/) (Icons)
    *   [Recharts](https://recharts.org/) (Charting Library)
*   **AI Features:**
    *   [Genkit (Firebase AI)](https://firebase.google.com/docs/genkit)
*   **State Management & Data Fetching:**
    *   React Context API (for Auth)
    *   `fetch` API (for client-side data fetching from Next.js API routes)
    *   (Includes `React Query` as a dependency, available for more advanced data fetching patterns)
*   **Development:**
    *   ESLint & Prettier (configured via Next.js defaults)

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:9002`.

### Running Genkit for AI Features

If you are working on or testing AI features that use Genkit flows locally:

1.  **Start the Genkit development server:**
    In a separate terminal, run:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes:
    npm run genkit:watch
    ```
    This will start the Genkit development environment, typically on `http://localhost:4000`.

## Key Features

*   **Dashboard:** Overview of internet status, connected devices, total data usage, recent device activity, and device type distribution.
*   **Device Management:**
    *   View all connected devices in grid or list layout.
    *   Filter devices by status (Online/Offline) and search by various attributes.
    *   Sort devices by name, status, or connection time.
    *   Rename devices (with AI-powered name suggestions).
    *   "Forget" devices from the list.
*   **AI-Powered Device Name Suggestions:** Uses Genkit and a language model to suggest user-friendly names for your connected devices.
*   **Network Metrics:** Monitor historical network performance including latency, packet loss, and total download/upload usage over different time ranges.
*   **Subscription Tracker:** Manage recurring payments and subscriptions, with reminders for due dates. Data is stored in `localStorage`.
*   **Settings:** Customize application preferences, including theme (Light/Dark/System).
*   **Responsive Design:** Adapts to various screen sizes.
*   **Theming:** Light and Dark mode support, easily customizable via CSS variables in `src/app/globals.css`.

## Project Structure

A brief overview of important directories:

*   `src/app/`: Contains the application's pages and layouts, following the Next.js App Router structure.
    *   `src/app/(app)/`: Authenticated/main application routes.
    *   `src/app/(auth)/`: Authentication-related pages (currently bypassed for development).
    *   `src/app/api/`: API route handlers for backend logic and data fetching.
*   `src/components/`: Reusable React components.
    *   `src/components/ui/`: ShadCN UI components.
*   `src/ai/`: Genkit related code for AI features.
    *   `src/ai/flows/`: Genkit flow definitions.
*   `src/contexts/`: React Context providers (e.g., `AuthContext`).
*   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useMobile`).
*   `src/lib/`: Utility functions and mock data.
*   `src/types/`: TypeScript type definitions for the application.
*   `public/`: Static assets.

## Backend Integration (Router Data Collection)

The application is structured to fetch data from API routes located in `src/app/api/`. Currently, these API routes return **mock data** (see `src/lib/mock-data.ts`).

To connect WifiZen to your actual Huawei XPON router, you will need to:

1.  **Determine how your router exposes data:** This could be via an official API, SNMP, SSH, web scraping, or other methods. This step requires research specific to your router model and firmware.
2.  **Implement data fetching logic:** Inside the API route handlers (e.g., `src/app/api/devices/route.ts`, `src/app/api/internet-status/route.ts`), replace the mock data logic with code that communicates with your router, fetches the necessary information, and parses it.
3.  **Format the data:** Ensure the data fetched from your router is transformed into the TypeScript types defined in `src/types/index.ts` before being sent as a response from the API route.

Detailed **`// TODO:`** comments have been added to each API route file in `src/app/api/` to guide you on where to implement your router-specific communication code.

## Future Enhancements (Potential Ideas)

*   Real-time updates for device status and metrics using WebSockets or polling.
*   Advanced router configuration options (if supported by the router).
*   Parental control features.
*   More detailed traffic analysis per device.
*   User accounts and multi-router support.

---

This README provides a solid overview for anyone working on or looking to understand the WifiZen project.

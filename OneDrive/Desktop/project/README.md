# JobTrack - Job Application Tracker

A comprehensive job application tracking system built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication:** Login and signup with email/password (mock implementation)
- **Dashboard:** Visual metrics, calendar, notifications, and kanban board
- **Kanban Board:** Drag and drop applications between status columns
- **Visual Metrics:** Charts showing application status and daily performance
- **Calendar:** Track interview dates and view daily events
- **Notifications:** System alerts for interviews and application updates
- **Profile & Settings:** User profile management and application preferences
- **Dark Mode:** Full support for light and dark themes

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Recharts (for data visualization)
- React Beautiful DnD (for drag and drop)
- React Day Picker (for calendar)
- Lucide React (for icons)

## Setup and Running

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open your browser to the URL shown in your terminal (typically http://localhost:5173)

## Login Credentials

For the demo, any email and password combination will work:

- Email: any email
- Password: any password

## Project Structure

```
src/
  ├── components/       # Reusable components
  │   ├── auth/         # Authentication components
  │   ├── dashboard/    # Dashboard components
  │   └── layout/       # Layout components
  ├── contexts/         # React contexts
  ├── data/             # Mock data
  ├── hooks/            # Custom hooks
  ├── pages/            # Page components
  ├── types/            # TypeScript types
  ├── utils/            # Utility functions
  ├── App.tsx           # Main application component
  └── main.tsx          # Application entry point
```

## Mock Data

The application uses mock data for demonstration purposes. In a real-world scenario, this would be connected to a backend API.

## License

MIT
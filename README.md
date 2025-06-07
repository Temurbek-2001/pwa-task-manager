# Task Manager PWA

## Overview
Task Manager PWA is a Progressive Web Application built for managing tasks with a Kanban board interface. It allows users to create, edit, delete, and move tasks across "To Do," "In Progress," and "Done" statuses. The app is installable, works offline, and syncs data when reconnected (mock syncs now), providing a seamless experience across devices.

## Purpose
The application addresses the need for a user-friendly, offline-capable task management tool that works across mobile and desktop devices, solving issues with accessibility and data persistence in environments with unreliable internet.

## Features

- **Task Management**: Create, edit, delete, and mark tasks as complete.
- **Kanban Board**: Organize tasks in "To Do," "In Progress," and "Done" columns.
- **Offline Support**: Persist tasks using IndexedDB and access the app offline.
- **Data Sync**: Simulate synchronization of tasks when the internet connection is restored.
- **Responsive Design**: Fully responsive UI for mobile, tablet, and desktop.
- **Accessibility**: Includes ARIA attributes, high-contrast colors, and keyboard navigation.
- **Installable PWA**: Add to home screen for a native app-like experience.

## Technologies

- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **Tailwind CSS**: For responsive and modern styling.
- **IndexedDB (idb package)**: For offline data persistence.
- **Vite PWA Plugin**: For Service Worker and PWA capabilities.
- **React Router**: For client-side routing.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Temurbek-2001/pwa-task-manager
   cd pwa-task-manager
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Build**:
   ```bash
   npm run preview
   ```

## Usage

- **Access the App**: Open in a browser or install as a PWA via "Add to Home Screen."
- **Create a Task**: Click "Create Task" to open the modal and enter task details.
- **Manage Tasks**: Edit, delete, or move tasks between columns using drag-and-drop or buttons.
- **Offline Mode**: Use the app offline; tasks are saved to IndexedDB and synced when online.
- **Mobile Navigation**: On mobile, use the bottom navbar to switch between task statuses.

## Deployment

The app is deployed on [Vercel](https://task-manager-eight-red.vercel.app/). To deploy:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify or Vercel via their CLI or drag-and-drop interface.

## Testing

- **Manual Testing**: Tested on Chrome, Firefox, and Safari (desktop and mobile).
- **Lighthouse Audit**: Achieved high PWA scores for performance, accessibility, and best practices.
- **Offline Testing**: Verified task persistence and sync using browser DevTools.

## Development Notes

- **Accessibility**: ARIA roles, high-contrast colors, and keyboard navigation ensure WCAG 2.1 compliance.
- **Challenges**: Implementing offline sync with minimal code required custom Service Worker logic.
- **Future Improvements**: Add real backend integration, push notifications, and advanced task filtering.

## Repository

GitHub: [https://github.com/Temurbek-2001/pwa-task-manager](https://github.com/Temurbek-2001/pwa-task-manager)

## License

MIT License
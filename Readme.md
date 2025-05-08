# TaskFlow

TaskFlow is a collaborative task management website designed to help teams efficiently assign, track, and manage tasks. Streamline your workflow and enhance productivity with seamless task delegation and progress monitoring.

![s1](https://github.com/AkramExp/task-manager/blob/main/frontend/public/screenshot.png)

#### Live Site : https://task-manager-akramexp.vercel.app

## Features

- Account registration and login functionality for authenticated access
- Ability to create tasks with a title, description, due date, priority, status, and assign them to other users
- Edit and delete existing tasks with appropriate access control
- Assigned users can update the status of tasks they are responsible for
- Profile management allowing users to update their personal information
- Search functionality to locate tasks by title or description
- Advanced filtering options for tasks based on priority, status, due date, creator, or assignee
- View of tasks assigned by others for better task tracking and accountability
- Sorting of tasks by status, priority, creation date, or due date for organized viewing
- Notifications for task creation, updates, deletions, and status changes
- Paginated task listings to support large datasets efficiently
- Fully responsive UI optimized for desktop, tablet, and mobile devices

## Approach

### 1. Problem Statement

Effective task management is crucial for teams to track, assign, and collaborate on tasks with full transparency. However, many existing task management tools tend to be overly complex or lack real-time updates, which can create productivity bottlenecks and hinder team efficiency.

### 2. Solution Overview

TaskFlow addresses these challenges by offering a minimalist yet powerful task management system that emphasizes simplicity, accountability, and collaboration. Key features include:

- **Role-Based Actions**: Clear separation of roles (creator vs. assignee) to ensure proper task management and ownership.
- **Notifications**: Standard notifications to alert users when tasks are created, updated, or have their status changed.
- **Smart Filtering & Sorting**: Intuitive options to filter and sort tasks by priority, status, due date, and more, streamlining task management and improving productivity.

### 3. Technical Implementation

#### Frontend:

- Developed using **Next.js** and **React.js**, providing a dynamic, server-side rendered (SSR) application for fast loading and better SEO.
- **Tailwind CSS** was used for styling, allowing for a highly customizable, utility-first approach to responsive design.
- **React Query** handled all data fetching and caching, ensuring that the application can efficiently manage data and optimize API calls.

#### Backend:

- Built with **Node.js** and **Express**, serving as a robust REST API backend.
- **JWT Authentication** for secure and scalable user authentication.
- **MongoDB** utilized for managing dynamic task and user data, offering flexibility for various query operations.

#### Key Challenges & Solutions:

- **Task Management**: Simplified task creation, updates, and status changes, ensuring clear and intuitive processes for task owners and assignees.
- **Complex Queries**: Leveraged MongoDB Aggregations for efficient filtering, sorting, and searching, allowing users to customize their task views.
- **Performance**: Integrated Pagination to handle large task lists efficiently, ensuring smooth user experience even with extensive data.

### 4. Design Philosophy

- **Simplified User Interface**: Focused on delivering a clean, intuitive design that minimizes clutter and maximizes task visibility and accessibility.
- **Modular**: Built reusable React components for maintainable and scalable frontend architecture.
- **Scalable**: Designed API endpoints with flexibility in mind, allowing for easy addition of future features as the application evolves.

## Installation

### Start the frontend server

Add these env variables to your .env file in the root directory of frontend

```
NEXT_PUBLIC_BACKEND_URL = ""
```

Install Dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

### Start the backend server

Add these env variables to your .env file in the root directory of backend

```
MONGODB_URL = ""
JWT_SECRET = ""
FRONTEND_URL = ""

```

Install Dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

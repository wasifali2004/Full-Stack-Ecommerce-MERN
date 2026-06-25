Technologies Used
Frontend
React.js: Used for building the user interface and managing component-based architecture.

Redux: Employed for efficient and centralized state management across the application.

React Bootstrap: Provided pre-built UI components to ensure responsive and visually appealing design.

Axios: Handled HTTP requests and communication with the backend API.

Backend
Node.js: Served as the runtime environment for executing server-side JavaScript.

Express.js: Used to create robust API endpoints and manage server-side routing.

MongoDB: A NoSQL database used for storing application data, integrated using Mongoose ODM.

JSON Web Tokens (JWT): Implemented for secure user authentication and authorization.

Stripe API: Integrated to enable secure and efficient payment processing.

Development Tools
Nodemon: Used for automatically restarting the server during development.

Concurrently: Allowed simultaneous running of the frontend and backend servers.

Postman: Utilized for testing and validating backend API endpoints.

## Environment Variables Setup

### Backend (.env)
Create a `.env` file in the Backend directory with the following variables:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
CLOUDINARY_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password

```

### Frontend (.env)
Create a `.env` file in the Frontend directory with:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Admin Dashboard (.env)
Create a `.env` file in the Admin Dashboard directory with:

```env
VITE_BACKEND_URL=http://localhost:4000
```





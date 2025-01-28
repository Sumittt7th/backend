Video Streaming Backend
# Video Streaming Backend
This is the backend server for a video streaming application built with Node.js, Express, MongoDB, and Swagger for API
documentation.
## Features
- **User Management**: Handle user registration, login, and subscription status.
- **Video Management**: Upload, view, and manage videos.
- **Analytics**: Track views for each video and gather analytics.
- **Security**: API is secured with JWT-based authentication.
- **Admin Panel**: Role-based access control for users and videos.
## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- Swagger for API Documentation
- JWT Authentication
- Multer for video uploads
## Setup and Installation
### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/your-username/video-streaming-backend.git
```
### 2. Install Dependencies
Navigate to the project folder and install dependencies using npm:
```bash
cd video-streaming-backend
npm install
```
### 3. Set Up Environment Variables
Create a `.env` file in the root directory and define the following environment variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/video_streaming
JWT_SECRET=your_jwt_secret
```
### 4. Run the Application
After setting up the environment variables, you can start the server:
```bash
npm start
```
The server will run on `http://localhost:5000`.
### 5. API Documentation (Swagger UI)
Once the server is running, you can view the Swagger UI for API documentation at:
```
http://localhost:5000/api-docs
```
The API documentation will allow you to interact with the endpoints and test them directly from the browser.
## API Endpoints
### User Routes
- `GET /users`: Get all users (Admin only)
- `GET /users/:id`: Get a user by ID
- `POST /users`: Create a new user
- `PUT /users/:id`: Update a user by ID
- `POST /users/login`: Login and get a JWT
- `GET /users/subs/:id`: Get user subscription status
- `POST /users/logout`: Logout a user
- `GET /users/reftoken`: Refresh Token
### Video Routes
- `GET /videos`: Get all videos
- `GET /videos/:id`: Get a video by ID
- `POST /videos`: Upload a new video (Admin only)
- `PUT /videos/:id`: Update a video (Admin only)
- `POST /videos/:id/view`: Increment view count for a video
- `GET /videos/play/:id/:userId`: Get video playback details
- `DELETE /videos/:id`:Delete a video
### Analytics Routes
- `POST /analytics/:videoId/view`: Increment view count for a video
- `GET /analytics/:videoId`: Get analytics for a specific video
## Security
This API is protected with JWT-based authentication. After logging in, you will receive a token that must be included in
the `Authorization` header for accessing protected routes:
```
Authorization: Bearer <your-token>
```
## Contribution
Feel free to contribute to this project. You can fork the repository, create a new branch, make changes, and submit a pull
request.
### Steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
## Contact
For questions or suggestions, feel free to contact me at:
- **Email**: sukumar.75way@gmail.com
- **GitHub**: [Sumit](https://github.com/Sumittt7th)
## ER-Diagram

![ERDiagram](https://github.com/user-attachments/assets/eaa4bc62-6c28-45bf-baea-c9af7e0f31ef)



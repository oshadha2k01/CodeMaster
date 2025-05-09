# CodeMaster - Full Stack Project

## Project Overview
CodeMaster is a full-stack web application built with modern technologies. The project consists of a React-based frontend and a Spring Boot backend, providing a robust and scalable solution.

## Technology Stack

### Frontend
- **Framework**: React.js
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Styling**: Emotion
- **Additional Libraries**:
  - React Toastify for notifications
  - Swiper for carousel/slider components
  - JWT Decode for authentication

### Backend
- **Framework**: Spring Boot 3.4.4
- **Language**: Java 17
- **Database**: 
  - MySQL 
- **Security**: 
  - Spring Security
  - JWT Authentication
  - OAuth2 Client
- **API Documentation**: Spring Boot Starter Web
- **Testing**: Spring Boot Starter Test

## Project Structure
```
CodeMastersql/
├── FullProject/
│   ├── frontend/          # React frontend application
│   │   ├── src/          # Source code
│   │   ├── public/       # Static files
│   │   └── package.json  # Frontend dependencies
│   │
│   └── backend/          # Spring Boot backend application
│       ├── src/          # Source code
│       └── pom.xml       # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Java 17 (for backend)
- Maven
- MongoDB
- MySQL (optional)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd CodeMastersql/FullProject/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd CodeMastersql/FullProject/backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Features
- Modern, responsive UI with Material Design
- Secure authentication and authorization
- RESTful API architecture
- Database integration with MongoDB and MySQL
- Real-time notifications
- Smooth animations and transitions

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any queries or support, please reach out to the project maintainers.
# TaskTracker

A full-stack task management application built with .NET 9 Web API backend and React TypeScript frontend. This application provides comprehensive task management capabilities with team collaboration features, user authentication, and real-time dashboard analytics.

## 🏗️ Project Architecture

### Backend (.NET 9 Web API)
The backend follows **Clean Architecture** principles with the following layers:

```
TaskTrackerAPI/
├── TaskTracker.API/          # 🎯 Presentation Layer
├── TaskTracker.Application/  # 🧠 Application Layer  
├── TaskTracker.Domain/       # 🏛️ Domain Layer
└── TaskTracker.Infrastructure/ # 🔧 Infrastructure Layer
```

### Frontend (React + TypeScript)
Modern React application with state management and responsive UI:

```
TaskTrackerUI/task_tracker_ui/
├── src/
│   ├── components/           # 🧩 Reusable UI Components
│   ├── pages/               # 📄 Application Pages
│   ├── redux/               # 🔄 State Management
│   ├── services/            # 🌐 API Services
│   ├── hooks/               # 🪝 Custom React Hooks
│   ├── types/               # 📝 TypeScript Definitions
│   └── config/              # ⚙️ Configuration Files
```

## 🎯 Features

### Core Functionality
- ✅ **User Authentication & Authorization** (JWT-based)
- ✅ **Task Management** (CRUD operations)
- ✅ **Team Collaboration** (Create teams, assign members)
- ✅ **Priority System** (High, Medium, Low)
- ✅ **Task Assignment** (Individual or team tasks)
- ✅ **Dashboard Analytics** (Statistics and charts)
- ✅ **Archive System** (Completed task management)

### Technical Features
- 🔐 **JWT Authentication** with refresh tokens
- 🗄️ **Entity Framework Core** with SQL Server
- 🎨 **Modern UI** with TailwindCSS and DaisyUI
- 📱 **Responsive Design** for all devices
- 🔄 **Real-time State Management** with Redux Toolkit
- 📊 **Data Visualization** with Chart.js
- 🛡️ **CORS Configuration** for cross-origin requests

## 📁 Detailed Project Structure

### Backend Structure

#### 🎯 TaskTracker.API (Presentation Layer)
```
TaskTracker.API/
├── Controllers/
│   ├── AuthController.cs      # Authentication endpoints
│   ├── TodosController.cs     # Task management endpoints
│   ├── TeamsController.cs     # Team management endpoints
│   └── WeatherForecastController.cs # Sample controller
├── Program.cs                 # Application entry point & configuration
├── appsettings.json          # Application configuration
└── Properties/
    └── launchSettings.json   # Development launch settings
```

**Key Configurations in Program.cs:**
- JWT Bearer Authentication
- CORS policy for frontend integration
- OpenAPI/Swagger with Scalar UI
- Dependency injection setup
- Entity Framework integration

#### 🧠 TaskTracker.Application (Application Layer)
```
TaskTracker.Application/
├── DTOs/                     # Data Transfer Objects
│   ├── Auth/                # Authentication DTOs
│   ├── Teams/               # Team-related DTOs
│   ├── Todos/               # Task-related DTOs
│   └── Users/               # User-related DTOs
├── Features/                # CQRS Commands & Queries
│   ├── Auth/                # Authentication features
│   │   ├── LoginQuery.cs
│   │   ├── RegisterCommand.cs
│   │   └── RefreshTokenCommand.cs
│   ├── Teams/               # Team management features
│   ├── Todos/               # Task management features
│   └── Users/               # User management features
├── Services/
│   └── JwtService.cs        # JWT token generation & validation
├── Interfaces/
│   └── IJwtService.cs       # Service contracts
└── Extensions/
    ├── DependencyInjection.cs # Service registration
    └── AutoMapper/           # Object mapping profiles
```

#### 🏛️ TaskTracker.Domain (Domain Layer)
```
TaskTracker.Domain/
├── Entities/                 # Domain entities
│   ├── User.cs              # User entity with authentication
│   ├── Todo.cs              # Task entity with priority system
│   └── Team.cs              # Team entity for collaboration
├── Enums/
│   └── Priority.cs          # Task priority levels (High, Medium, Low)
├── Interfaces/              # Repository contracts
│   ├── IUserRepository.cs
│   ├── ITodoRepository.cs
│   └── ITeamRepository.cs
└── Commons/
    └── BaseClass.cs         # Base entity with common properties
```

**Entity Relationships:**
- **User** ↔ **Team**: Many-to-Many (team membership)
- **User** → **Team**: One-to-Many (team ownership)
- **User** → **Todo**: One-to-Many (task creation)
- **User** ↔ **Todo**: One-to-Many (task assignment)
- **Team** → **Todo**: One-to-Many (team tasks)

#### 🔧 TaskTracker.Infrastructure (Infrastructure Layer)
```
TaskTracker.Infrastructure/
├── Context/
│   ├── ApplicationDbContext.cs    # EF Core DbContext
│   └── ApplicationDbContextFactory.cs # Design-time factory
├── Repositories/              # Repository implementations
│   ├── UserRepository.cs
│   ├── TodoRepository.cs
│   └── TeamRepository.cs
├── Migrations/               # EF Core database migrations
└── Extensions/
    └── DependencyInjection.cs # Infrastructure service registration
```

**Database Configuration:**
- **SQL Server** as the primary database
- **Entity Framework Core** for ORM
- **Code-First** approach with migrations
- **Connection String**: Local SQL Server with integrated security

### Frontend Structure

#### 📄 Pages
```
src/pages/
├── Login.tsx           # User authentication page
├── Register.tsx        # User registration page
├── Dashboard.tsx       # Main application dashboard
└── Archive.tsx         # Completed tasks archive
```

#### 🧩 Components
```
src/components/
├── Router.tsx          # Application routing configuration
├── dashboard/          # Dashboard-specific components
│   ├── DashboardHeader.tsx
│   ├── DashboardTabs.tsx
│   ├── DashboardModals.tsx
│   ├── OverviewTab.tsx
│   ├── TasksTab.tsx
│   └── TeamsTab.tsx
└── Stats.tsx          # Statistics and analytics components
```

#### 🔄 State Management (Redux)
```
src/redux/
├── store.ts           # Redux store configuration
├── authSlice.ts       # Authentication state management
└── authSelectors.ts   # State selectors for auth
```

#### 🌐 API Services
```
src/services/
├── todosService.ts    # Task-related API calls
└── teamsService.ts    # Team-related API calls
```

#### ⚙️ Configuration
```
src/config/
└── api.ts            # API endpoints and base URL configuration
```

**API Configuration:**
- Base URL: `http://localhost:5038/api`
- Environment-based configuration with Vite
- Centralized endpoint management

## 🚀 Getting Started

### Prerequisites
- **.NET 9 SDK**
- **Node.js** (v18 or higher)
- **SQL Server** (LocalDB or SQL Server Express)
- **Visual Studio** or **Visual Studio Code**

### Backend Setup

1. **Navigate to the API project:**
   ```powershell
   cd TaskTrackerAPI\TaskTracker.API
   ```

2. **Restore NuGet packages:**
   ```powershell
   dotnet restore
   ```

3. **Update database connection string in `appsettings.json`:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.;Database=TaskTrackerDB;Integrated Security=True;TrustServerCertificate=True;"
     }
   }
   ```

4. **Run Entity Framework migrations:**
   ```powershell
   dotnet ef database update
   ```

5. **Run the API:**
   ```powershell
   dotnet run
   ```

   The API will be available at: `https://localhost:7038` or `http://localhost:5038`

### Frontend Setup

1. **Navigate to the UI project:**
   ```powershell
   cd TaskTrackerUI\task_tracker_ui
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:5038/api
   ```

4. **Start the development server:**
   ```powershell
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: .NET 9 Web API
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT Bearer tokens with refresh token support
- **Architecture**: Clean Architecture with CQRS pattern
- **ORM**: Entity Framework Core
- **Documentation**: OpenAPI/Swagger with Scalar UI
- **Validation**: Data Annotations
- **Security**: BCrypt password hashing

### Frontend Technologies
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + DaisyUI
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Chart.js with React-ChartJS-2
- **Icons**: React Icons

### Key NuGet Packages
```xml
<!-- Authentication & Security -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.6" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.12.1" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />

<!-- Object Mapping -->
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.0" />

<!-- API Documentation -->
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.6" />
<PackageReference Include="Scalar.AspNetCore" Version="2.5.3" />
```

### Key NPM Packages
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.8.2",
    "axios": "^1.10.0",
    "chart.js": "^4.5.0",
    "daisyui": "^5.0.43",
    "react": "^19.1.0",
    "react-chartjs-2": "^5.3.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.6.3",
    "tailwindcss": "^4.1.11"
  }
}
```

## 🔧 Development Workflow

### API Development
1. **Domain-First Approach**: Define entities in the Domain layer
2. **Repository Pattern**: Implement data access in Infrastructure layer
3. **CQRS Pattern**: Use MediatR for commands and queries in Application layer
4. **Controller Actions**: Expose endpoints in the API layer
5. **JWT Integration**: Secure endpoints with authentication middleware

### Frontend Development
1. **Component-Based Architecture**: Reusable React components
2. **State Management**: Redux for global state, local state for component-specific data
3. **API Integration**: Axios services for backend communication
4. **Responsive Design**: TailwindCSS for mobile-first design
5. **Type Safety**: TypeScript for compile-time error checking

## 📊 Database Schema

### Users Table
- **Id** (GUID, Primary Key)
- **FirstName** (String, 50 chars, Required)
- **LastName** (String, 50 chars, Required)
- **Email** (String, Unique, Required)
- **Password** (String, Hashed, Required)
- **RefreshToken** (String, Nullable)
- **RefreshTokenExpiryTime** (DateTime, Nullable)
- **CreatedAt** (DateTime)
- **UpdatedAt** (DateTime)

### Teams Table
- **Id** (GUID, Primary Key)
- **Name** (String, 100 chars, Required)
- **Owner** (GUID, Foreign Key to Users)
- **CreatedAt** (DateTime)
- **UpdatedAt** (DateTime)

### Todos Table
- **Id** (GUID, Primary Key)
- **Title** (String, 150 chars, Required)
- **Description** (String, 1000 chars, Optional)
- **Priority** (Enum: High, Medium, Low)
- **CreatedBy** (GUID, Foreign Key to Users)
- **AssignTo** (GUID, Foreign Key to Users, Optional)
- **TeamID** (GUID, Foreign Key to Teams, Optional)
- **DueDate** (DateTime, Required)
- **CreatedAt** (DateTime)
- **UpdatedAt** (DateTime)

### TeamMembers Table (Join Table)
- **TeamsId** (GUID, Foreign Key)
- **MembersId** (GUID, Foreign Key)

## 🔐 Authentication Flow

1. **Registration**: User creates account with email/password
2. **Password Hashing**: BCrypt hashes password before storage
3. **Login**: User provides credentials
4. **JWT Generation**: Server generates access token (60 min) and refresh token (7 days)
5. **Token Storage**: Frontend stores tokens securely
6. **API Requests**: Include Bearer token in Authorization header
7. **Token Refresh**: Automatic refresh using refresh token
8. **Logout**: Clear tokens and invalidate session

## 🎨 UI/UX Features

### Dashboard Components
- **📊 Statistics Overview**: Task counts, completion rates, team metrics
- **📝 Task Management**: Create, edit, delete, and assign tasks
- **👥 Team Management**: Create teams, manage members
- **📈 Data Visualization**: Charts showing task distribution and progress
- **🔍 Filtering & Sorting**: Filter by priority, status, team, or assignee
- **📱 Responsive Design**: Works on desktop, tablet, and mobile

### Design System
- **Color Scheme**: Modern, professional color palette
- **Typography**: Clean, readable fonts
- **Components**: Consistent button styles, form elements, modals
- **Icons**: Intuitive iconography for actions and status
- **Animations**: Smooth transitions and loading states

## 🧪 API Endpoints

### Authentication Endpoints
```
POST /api/Auth/register    # User registration
POST /api/Auth/login       # User login
POST /api/Auth/refresh     # Token refresh
POST /api/Auth/logout      # User logout
```

### Todo Endpoints
```
GET    /api/Todos          # Get all todos
POST   /api/Todos          # Create new todo
GET    /api/Todos/{id}     # Get todo by ID
PUT    /api/Todos/{id}     # Update todo
DELETE /api/Todos/{id}     # Delete todo
```

### Team Endpoints
```
GET    /api/Teams          # Get all teams
POST   /api/Teams          # Create new team
GET    /api/Teams/{id}     # Get team by ID
PUT    /api/Teams/{id}     # Update team
DELETE /api/Teams/{id}     # Delete team
```

## 🔄 Development Scripts

### Backend Commands
```powershell
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run API
dotnet run

# Run with hot reload
dotnet watch run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update
```

### Frontend Commands
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Task Tracking! 🚀**

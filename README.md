# Project Lantern: Technical Architecture Documentation

## 1. Directory Structure
The application follows a Feature-Driven architecture. This vertical slicing ensures that the system remains scalable and maintainable by grouping related logic, state, and UI components by domain rather than by technical type.



### 1.1 Core Module (`src/app/core/`)
* **Purpose**: Houses singleton services and global configurations that are instantiated once during the application lifecycle.
* **Contents**: Authentication services, global HTTP interceptors, route guards, and base models.

### 1.2 Shared Module (`src/app/shared/`)
* **Purpose**: A library of reusable UI assets and structural utilities accessible by any feature module.
* **Contents**: 
    * `components/`: Pure components such as custom buttons, status indicators, and navigation fragments.
    * `layouts/`: Structural shell components that define the application's visual frame.
    * `directives/` & `pipes/`: Shared logic for DOM manipulation and data transformation.

### 1.3 Features Module (`src/app/features/`)
* **Purpose**: Contains the primary business logic and domain-specific pages.
* **Contents**: 
    * `admin/`: Administrative dashboards and system analytics.
    * `applications/`: Workflows for application registration, listing, and monitoring.
    * `catalogue/`: Service discovery and web service documentation.

### 1.4 Environments (`src/environments/`)
* **Purpose**: External configuration manifests for different deployment stages.

---

## 2. Environment Management
Configuration is managed via the Angular CLI build system using file replacements. This ensures that the application code remains consistent across different stages of the deployment pipeline.

### 2.1 Configuration Switching
The Angular CLI executes file replacements during the build process based on the specified configuration flag.

| Environment | Command | Active Manifest File |
| :--- | :--- | :--- |
| **Local / Development** | `ng serve` | `src/environments/environment.ts` |
| **UAT** | `ng serve --configuration=uat` | `src/environments/environment.uat.ts` |
| **Production** | `ng build --configuration=production` | `src/environments/environment.prod.ts` |

---

## 3. Development Operations

### 3.1 Initial Setup
To install all project dependencies defined in the package.json manifest, execute the following command:

```
npm install
```

### 3.2 Development Server
Launch the local development server. The application will automatically reload upon any source code modifications.

```
ng serve
```
*The default interface is accessible at http://localhost:4200/*

### 3.3 Code Generation
Utilize the Angular CLI to generate standardized schematics. Ensure new items are placed within the appropriate architectural directories:

```
# Example: Generate a component within a specific feature domain
ng generate component features/applications/pages/app-list

# Example: Generate a singleton service within the core module
ng generate service core/auth/auth
```

### 3.4 Production Build
To compile and optimize the application for a production environment, use the following command. The output will be generated in the dist/ directory.

```
ng build --configuration=production
```

### 3.5 Quality Assurance
Maintain code integrity and standards by executing the testing and linting suites:

```
# Execute unit tests
ng test

# Perform static code analysis
ng lint
```
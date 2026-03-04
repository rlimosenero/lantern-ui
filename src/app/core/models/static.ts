import { AppStatus, WebServicesStatus, HTTPMethod } from "./enum";
import { Application } from "./interface";

export const applicationData: Application[] = [
    {
        applicationId: "app-1",
        uuid:'550e8400-e29b-41d4-a716-446655440000',
        basicInfo: [
            {
                name: "Customer Portal",
                description: "Self-service portal for customer account management",
                version: "3.2.1",
                status: AppStatus.ACTIVE,
                ownerName: "Jennifer Smith",
                ownerDept: "Customer Experience",
                bauSuppDept: "Customer Service",
                bauSuppName: "Cutomer Support Tech Team",
            }
        ],
        linkAndResources: [
            {
                gitRepoLink: "https://github.com/company/customer-portal",
                swaggerLink: "https://api.company.com/customer-portal/docs",
                sharepointLink: "https://company.sharepoint.com/sites/docs/customer-portal",
            }
        ],
        techStack: [
            {
                platform: ['KUBERNETES', 'CONTAINERIZED'],
                appTech: ['React', 'Typescript', 'Node.js (Express)'],
                storageAndData: ['PostgreSQL', 'Redis (cache)'],
                security: ['Keycloak', 'TLS', 'Vault']
            }
        ]
    },
    {
        applicationId: "app-2",
        uuid:'550e8400-e29b-41d4-a716-446655440001',
        basicInfo: [
            {
                name: "Analytics Dashboard",
                description: "Real-time business intelligence and reporting platform",
                version: "2.5.0",
                status: AppStatus.ACTIVE,
                ownerName: "Daniel Park",
                ownerDept: "Data & Analytics",
                bauSuppDept: "Data & Analytics",
                bauSuppName: "BI Support Team",
            }
        ],
        linkAndResources: [
            {
                gitRepoLink: "https://github.com/company/analytics-dashboard",
                swaggerLink: "https://api.company.com/analytics-dashboard/docs",
                sharepointLink: "https://company.sharepoint.com/sites/docs/analytics-dashboard",
            }
        ],
        techStack: [
            {
                platform: ['KUBERNETES', 'CONTAINERIZED'],
                appTech: ['Angular', 'Typescript', 'Python (Django)'],
                storageAndData: ['PostgreSQL', 'Mongo DB', 'Redis (cache)'],
                security: ['Keycloak', 'TLS', 'Vault']
            }
        ]
    },
    {
        applicationId: "app-3",
        uuid:'550e8400-e29b-41d4-a716-446655440002',
        basicInfo: [
            {
                name: "Inventory Manager",
                description: "Track and manage product inventory across warehouses",
                version: "4.1.3",
                status: AppStatus.ACTIVE,
                ownerName: "Rachel Green",
                ownerDept: "Operations Technology",
                bauSuppDept: "Operations",
                bauSuppName: "Operations Support",
            }
        ],
        linkAndResources: [
            {
                gitRepoLink: "https://github.com/company/inventory-manager",
                swaggerLink: "https://api.company.com/inventory/docs",
                sharepointLink: "https://company.sharepoint.com/sites/docs/inventory-manager",
            }
        ],
        techStack: [
            {
                platform: ['KUBERNETES', 'CONTAINERIZED'],
                appTech: ['Vue.js', 'Javascript', 'Java (Spring Boot)'],
                storageAndData: ['MySQL', 's3 (object storage)', 'Redis (cache)'],
                security: ['Keycloak', 'TLS', 'Vault']
            }
        ]
    },
    {
        applicationId: "app-4",
        uuid:'550e8400-e29b-41d4-a716-446655440003',
        basicInfo: [
            {
                name: "Employee Directory",
                description: "Company-wide employee information and org chart",
                version: "1.8.2",
                status: AppStatus.FOR_DEPRECATION,
                ownerName: "Monica Geller",
                ownerDept: "Human Resources Technology",
                bauSuppDept: "Human Resources",
                bauSuppName: "HR Tech Support",
            }
        ],
        linkAndResources: [
            {
                gitRepoLink: "https://github.com/company/employee-directory",
                swaggerLink: "https://api.company.com/employee-directory/docs",
                sharepointLink: "https://company.sharepoint.com/sites/docs/employee-directory",
            }
        ],
        techStack: [
            {
                platform: ['VM', 'ONPREM_APPSERVER'],
                appTech: ['.NET (C# ASP.NET Core)', 'HTML 5', 'CSS3'],
                storageAndData: ['SQL Server'],
                security: ['AD', 'TLS']
            }
        ]
    },
]

export const webServicesData = [
    {
        id: "1",
        uuid:'550e8400-e29b-41d4-a716-446655440000',
        serviceConfig: [
            {
                description: "OAuth 2.0 authentication and authorization service",
                method: HTTPMethod.POST,
                version: "1.5.0",
                status: WebServicesStatus.ACTIVE,
                name: "User Authentication API",
                application: [
                    {
                        name: "Customer Portal",
                        applicationId: "app-1"
                    }
                ],
                type: "REST",
            }
        ],
        securityAndAuth: [
            {
                authMethod: "BEARER TOKEN",
                authorization: "ROLE_MHUB_INBOUND"
            }
        ],
        enviURL: [
            {
                prodURL: "https://api.company.com/auth/v1/token",
                drURL: "https://dr.api.company.com/auth/v1/token",
                uatURL: "https://uat.api.company.com/auth/v1/token",
                sitURL: "https://sit.api.company.com/auth/v1/token"
            }
        ],
        urlPathParameters: [
            {
                parameterName: "grant_type",
                typeAndFormat: "String (Enum)",
                isRequired: "Yes",
                sampleValue: "password",
                description: "The OAuth grant type (authorization_code, client_credentials, etc.)"
            },
            {
                parameterName: "client_id",
                typeAndFormat: "String (UUID)",
                isRequired: "Yes",
                sampleValue: "portal-app",
                description: "The client application identifier"
            }
        ],
        requestHeaders: [
            {
                parameterName: "Authorization",
                typeAndFormat: "String (Bearer Token)",
                isRequired: "Yes",
                sampleValue: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                description: "Bearer token for authentication"
            },
            {
                parameterName: "Content-Type",
                typeAndFormat: "String (MIME type)",
                isRequired: "Yes",
                sampleValue: "application/json",
                description: "Request body format (application/json)"
            },
            {
                parameterName: "X-Correlation-ID",
                typeAndFormat: "String (UUID)",
                isRequired: "Yes",
                sampleValue: "550e8400-e29b-41d4-a716-446655440000",
                description: "Unique identifier attached to a request or message and propagated across all involved systems so that related operations can be traced, monitored, and debugged as a single end-to-end flow"
            }
        ],
        requestDataFormat: "application/json",
        dataSensitiveType: "Restricted: Personally Identifiable Information (PII)",
        requestBodySampleString: {
            "username": "user@example.com",
            "password": "********",
            "grant_type": "password",
            "client_id": "portal-app",
            "scope": "read write"
        },
        requestBodyFields: [
            {
                fieldName: "username",
                typeAndFormat: "String (Email format)",
                description: "User's email address for authentication",
                isRequired: "Yes",
                sampleValue: "user@example.com",
                validationRules: "Must be valid email format",
                transformationLogic: "Convert to lowercase before validation",
                defaultValue: "N/A"
            },
            {
                fieldName: "password",
                typeAndFormat: "String (8-128 chars)",
                description: "User's password for authentication",
                isRequired: "Yes",
                sampleValue: "********",
                validationRules: "Min 8 characters, must contain uppercase, lowercase, number, special char",
                transformationLogic: "Hashed using bcrypt before storage",
                defaultValue: "N/A"
            },
            {
                fieldName: "grant_type",
                typeAndFormat: "String (Enum)",
                description: "OAuth grant type",
                isRequired: "Yes",
                sampleValue: "password",
                validationRules: "Must be one of: password, authorization_code, client_credentials",
                transformationLogic: "N/A",
                defaultValue: "password"
            },
            {
                fieldName: "client_id",
                typeAndFormat: "String (UUID format)",
                description: "Client application identifier",
                isRequired: "Yes",
                sampleValue: "portal-app",
                validationRules: "Must be valid UUID or registered client ID",
                transformationLogic: "N/A",
                defaultValue: "N/A"
            },
            {
                fieldName: "scope",
                typeAndFormat: "String (Space-separated)",
                description: "Requested OAuth scopes",
                isRequired: "No",
                sampleValue: "read write",
                validationRules: "Must be valid scope values",
                transformationLogic: "Split by space and validate each scope",
                defaultValue: "read"
            }
        ],
        dataInTransitEncryption: "TLS 1.3",
        aveReqSize: "2 KB",
        maxReqSize: "10 KB",
        reqDataLog: "No",
        reqDuplicateAllowed: "No",
        reqDataCached: "Yes",
        reqThrottlingSupported: "Yes",
        responseHeaders: [
            {
                headerName: "Content-Type",
                typeAndFormat: "String (MIME type)",
                isRequired: "Yes",
                sampleValue: "application/json",
                description: "Response body format"
            },
            {
                headerName: "X-Correlation-ID",
                typeAndFormat: "String (UUID)",
                isRequired: "Yes",
                sampleValue: "550e8400-e29b-41d4-a716-446655440000",
                description: "Echo of correlation trace identifier"
            },
            {
                headerName: "X-RateLimit-Remaining",
                typeAndFormat: "Integer",
                isRequired: "Yes",
                sampleValue: "95",
                description: "Number of requests remaining in current window"
            },
        ],
        responseDataFormat: "application/json",
        responseDataSensitivityType: "Restricted: Personally Identifiable Information (PII)",
        responseBodySample: {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA3MDQyMDAwLCJleHAiOjE3MDcwNDU2MDB9.xyz123",
            "token_type": "Bearer",
            "expires_in": 3600,
            "refresh_token": "def502003e8f2b7c4d5a6789abcdef0123456789",
            "scope": "read write"
        },
        responseBodyFields: [
            {
                fieldName: "access_token",
                typeAndFormat: "String (JWT)",
                description: "OAuth access token used for authentication",
                isRequired: "Yes",
                sampleValue: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                validationRules: "Must be valid JWT format",
                transformationLogic: "Base64 encoded JWT token",
                defaultValue: "N/A",
                sourceOrDomainApplication: "User Directory",
                sourceOrDomainFieldName: "user_token"
            },
            {
                fieldName: "token_type",
                typeAndFormat: "String (Enum)",
                description: "Type of token issued",
                isRequired: "Yes",
                sampleValue: "Bearer",
                validationRules: "Must be 'Bearer'",
                transformationLogic: "N/A",
                defaultValue: "Bearer",
                sourceOrDomainApplication: "SAA",
                sourceOrDomainFieldName: "token_classification"
            },
            {
                fieldName: "expires_in",
                typeAndFormat: "Integer (seconds)",
                description: "Token expiration time in seconds",
                isRequired: "Yes",
                sampleValue: "3600",
                validationRules: "Must be positive integer",
                transformationLogic: "N/A",
                defaultValue: "3600",
                sourceOrDomainApplication: "SAA",
                sourceOrDomainFieldName: "ttl_seconds"
            },
            {
                fieldName: "refresh_token",
                typeAndFormat: "String (Opaque)",
                description: "Token used to refresh access token",
                isRequired: "Yes",
                sampleValue: "def502003e8f2b7c4d5a6789abcdef0123456789",
                validationRules: "Must be alphanumeric",
                transformationLogic: "Generated using secure random",
                defaultValue: "N/A",
                sourceOrDomainApplication: "User Directory",
                sourceOrDomainFieldName: "refresh_token_hash"
            },
            {
                fieldName: "scope",
                typeAndFormat: "String (Space-separated)",
                description: "Granted OAuth scopes",
                isRequired: "Yes",
                sampleValue: "read write",
                validationRules: "Must match requested scopes",
                transformationLogic: "Join array with spaces",
                defaultValue: "N/A",
                sourceOrDomainApplication: "SAA",
                sourceOrDomainFieldName: "granted_scopes"
            }
        ],
        responseStatusCodes: [
            {
                HTTPCode: "200",
                businessCode: "AUTH-200",
                message: "Authentication successful",
                type: "Success",
                suggestedAction: "N/A"
            },
            {
                HTTPCode: "400",
                businessCode: "VAL-001",
                message: "Invalid request body",
                type: "Client Error",
                suggestedAction: "Check request parameters"
            }
        ],
        responseDataInTransitEncryption: "TLS 1.3",
        averageResponseSize: "1 KB",
        maxResponseSize: "5 KB",
        requestDataLogged: "No",
        responseDataCached: "Yes",
        rateLimitInfo: "1000 requests/min per client",
        exposure: "Internal-Only",
        consumers: [
            {
                appName: 'WMX',
                appOwner: 'Customer Service Department',
                dateOnboarded: '2023-01-15',
                status: 'Active',
                trigger: 'User-Initiated Actions',
                appType: 'Web Based Application',
                techOwner: 'John Smith',
                tokenExpiryDate: '2025-01-15',
                networkMode: 'Intra-Cluster Networking'
            },
            {
                appName: 'NOSTRO',
                appOwner: 'Finance Department',
                dateOnboarded: '2023-03-22',
                status: 'Active',
                trigger: 'System-Initiated Events',
                appType: 'Backend Application',
                techOwner: 'Sarah Johnson',
                tokenExpiryDate: '2025-03-22',
                networkMode: 'East-West Traffic'
            },
            {
                appName: 'Portal App',
                appOwner: 'Customer Experience',
                dateOnboarded: '2024-05-10',
                status: 'Active',
                trigger: 'User-Initiated Actions',
                appType: 'Mobile Application (Native)',
                techOwner: 'Michael Chen',
                tokenExpiryDate: '2026-05-10',
                networkMode: 'Intra-Cluster Networking'
            }
        ],
        upstreamApp: [
            {
                appName: 'SAA',
                appOwner: 'Security Department',
                tokenExpiryDate: '2025-12-31',
                techOwner: 'Richard Cooper'
            },
            {
                appName: 'User Directory',
                appOwner: 'IT Department',
                tokenExpiryDate: '2026-06-30',
                techOwner: 'Patricia Murphy'
            }
        ],
        swaggerURL: 'https://api.company.com/auth/docs',
        documentsURL: 'https://company.sharepoint.com/sites/docs/auth-api'
    },
        {
        id: "2",
        uuid:'550e8400-e29b-41d4-a716-446655440001',
        serviceConfig: [
            {
                description: "Payment processing and transaction management",
                method: HTTPMethod.POST,
                version: "1.5.0",
                status: WebServicesStatus.ACTIVE,
                name: "Payment Gateway",
                application: [
                    {
                        name: "Customer Portal",
                        applicationId: "app-1"
                    }
                ],
                type: "REST",
            }
        ],
        securityAndAuth: [
            {
                authMethod: "BEARER TOKEN",
                authorization: "ROLE_MHUB_INBOUND"
            }
        ],
        enviURL: [
            {
                prodURL: "https://api.company.com/auth/v1/token",
                drURL: "https://dr.api.company.com/auth/v1/token",
                uatURL: "https://uat.api.company.com/auth/v1/token",
                sitURL: "https://sit.api.company.com/auth/v1/token"
            }
        ],
        urlPathParameters: [
            {
                parameterName: "grant_type",
                typeAndFormat: "String (Enum)",
                isRequired: "Yes",
                sampleValue: "password",
                description: "The OAuth grant type (authorization_code, client_credentials, etc.)"
            },
            {
                parameterName: "client_id",
                typeAndFormat: "String (UUID)",
                isRequired: "Yes",
                sampleValue: "portal-app",
                description: "The client application identifier"
            }
        ],
        requestHeaders: [
            {
                parameterName: "Authorization",
                typeAndFormat: "String (Bearer Token)",
                isRequired: "Yes",
                sampleValue: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                description: "Bearer token for authentication"
            },
            {
                parameterName: "Content-Type",
                typeAndFormat: "String (MIME type)",
                isRequired: "Yes",
                sampleValue: "application/json",
                description: "Request body format (application/json)"
            },
            {
                parameterName: "X-Correlation-ID",
                typeAndFormat: "String (UUID)",
                isRequired: "Yes",
                sampleValue: "550e8400-e29b-41d4-a716-446655440000",
                description: "Unique identifier attached to a request or message and propagated across all involved systems so that related operations can be traced, monitored, and debugged as a single end-to-end flow"
            }
        ],
        requestDataFormat: "application/json",
        dataSensitiveType: "Restricted: Personally Identifiable Information (PII)",
        requestBodySampleString: {
            "username": "user@example.com",
            "password": "********",
            "grant_type": "password",
            "client_id": "portal-app",
            "scope": "read write"
        },
        requestBodyFields: [
            {
                fieldName: "username",
                typeAndFormat: "String (Email format)",
                description: "User's email address for authentication",
                isRequired: "Yes",
                sampleValue: "user@example.com",
                validationRules: "Must be valid email format",
                transformationLogic: "Convert to lowercase before validation",
                defaultValue: "N/A"
            },
            {
                fieldName: "password",
                typeAndFormat: "String (8-128 chars)",
                description: "User's password for authentication",
                isRequired: "Yes",
                sampleValue: "********",
                validationRules: "Min 8 characters, must contain uppercase, lowercase, number, special char",
                transformationLogic: "Hashed using bcrypt before storage",
                defaultValue: "N/A"
            },
            {
                fieldName: "grant_type",
                typeAndFormat: "String (Enum)",
                description: "OAuth grant type",
                isRequired: "Yes",
                sampleValue: "password",
                validationRules: "Must be one of: password, authorization_code, client_credentials",
                transformationLogic: "N/A",
                defaultValue: "password"
            },
            {
                fieldName: "client_id",
                typeAndFormat: "String (UUID format)",
                description: "Client application identifier",
                isRequired: "Yes",
                sampleValue: "portal-app",
                validationRules: "Must be valid UUID or registered client ID",
                transformationLogic: "N/A",
                defaultValue: "N/A"
            },
            {
                fieldName: "scope",
                typeAndFormat: "String (Space-separated)",
                description: "Requested OAuth scopes",
                isRequired: "No",
                sampleValue: "read write",
                validationRules: "Must be valid scope values",
                transformationLogic: "Split by space and validate each scope",
                defaultValue: "read"
            }
        ],
        dataInTransitEncryption: "TLS 1.3",
        aveReqSize: "2 KB",
        maxReqSize: "10 KB",
        reqDataLog: "No",
        reqDuplicateAllowed: "No",
        reqDataCached: "Yes",
        reqThrottlingSupported: "Yes",
        responseHeaders: [
            {
                headerName: "Content-Type",
                typeAndFormat: "String (MIME type)",
                isRequired: "Yes",
                sampleValue: "application/json",
                description: "Response body format"
            },
            {
                headerName: "X-Correlation-ID",
                typeAndFormat: "String (UUID)",
                isRequired: "Yes",
                sampleValue: "550e8400-e29b-41d4-a716-446655440000",
                description: "Echo of correlation trace identifier"
            },
            {
                headerName: "X-RateLimit-Remaining",
                typeAndFormat: "Integer",
                isRequired: "Yes",
                sampleValue: "95",
                description: "Number of requests remaining in current window"
            },
        ],
        responseDataFormat: "application/json",
        responseDataSensitivityType: "Restricted: Personally Identifiable Information (PII)",
        responseBodySample: {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA3MDQyMDAwLCJleHAiOjE3MDcwNDU2MDB9.xyz123",
            "token_type": "Bearer",
            "expires_in": 3600,
            "refresh_token": "def502003e8f2b7c4d5a6789abcdef0123456789",
            "scope": "read write"
        },
        responseBodyFields: [
            {
                fieldName: "access_token",
                typeAndFormat: "String (JWT)",
                description: "OAuth access token used for authentication",
                isRequired: "Yes",
                sampleValue: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                validationRules: "Must be valid JWT format",
                transformationLogic: "Base64 encoded JWT token",
                defaultValue: "N/A",
                sourceOrDomainApplication: "User Directory",
                sourceOrDomainFieldName: "user_token"
            },
            {
                fieldName: "token_type",
                typeAndFormat: "String (Enum)",
                description: "Type of token issued",
                isRequired: "Yes",
                sampleValue: "Bearer",
                validationRules: "Must be 'Bearer'",
                transformationLogic: "N/A",
                defaultValue: "Bearer",
                sourceOrDomainApplication: "SAA",
                sourceOrDomainFieldName: "token_classification"
            },
            {
                fieldName: "expires_in",
                typeAndFormat: "Integer (seconds)",
                description: "Token expiration time in seconds",
                isRequired: "Yes",
                sampleValue: "3600",
                validationRules: "Must be positive integer",
                transformationLogic: "N/A",
                defaultValue: "3600",
                sourceOrDomainApplication: "SAA",
                sourceOrDomainFieldName: "ttl_seconds"
            },
            {
                fieldName: "refresh_token",
                typeAndFormat: "String (Opaque)",
                description: "Token used to refresh access token",
                isRequired: "Yes",
                sampleValue: "def502003e8f2b7c4d5a6789abcdef0123456789",
                validationRules: "Must be alphanumeric",
                transformationLogic: "Generated using secure random",
                defaultValue: "N/A",
                sourceOrDomainApplication: "User Directory",
                sourceOrDomainFieldName: "refresh_token_hash"
            },
            {
                fieldName: "scope",
                typeAndFormat: "String (Space-separated)",
                description: "Granted OAuth scopes",
                isRequired: "Yes",
                sampleValue: "read write",
                validationRules: "Must match requested scopes",
                transformationLogic: "Join array with spaces",
                defaultValue: "N/A",
                sourceOrDomainApplication: "SAA",
                sourceOrDomainFieldName: "granted_scopes"
            }
        ],
        responseStatusCodes: [
            {
                HTTPCode: "200",
                businessCode: "AUTH-200",
                message: "Authentication successful",
                type: "Success",
                suggestedAction: "N/A"
            },
            {
                HTTPCode: "400",
                businessCode: "VAL-001",
                message: "Invalid request body",
                type: "Client Error",
                suggestedAction: "Check request parameters"
            }
        ],
        responseDataInTransitEncryption: "TLS 1.3",
        averageResponseSize: "1 KB",
        maxResponseSize: "5 KB",
        requestDataLogged: "No",
        responseDataCached: "Yes",
        rateLimitInfo: "1000 requests/min per client",
        exposure: "Internal-Only",
        consumers: [
            {
                appName: 'WMX',
                appOwner: 'Customer Service Department',
                dateOnboarded: '2023-01-15',
                status: 'Active',
                trigger: 'User-Initiated Actions',
                appType: 'Web Based Application',
                techOwner: 'John Smith',
                tokenExpiryDate: '2025-01-15',
                networkMode: 'Intra-Cluster Networking'
            },
            {
                appName: 'NOSTRO',
                appOwner: 'Finance Department',
                dateOnboarded: '2023-03-22',
                status: 'Active',
                trigger: 'System-Initiated Events',
                appType: 'Backend Application',
                techOwner: 'Sarah Johnson',
                tokenExpiryDate: '2025-03-22',
                networkMode: 'East-West Traffic'
            },
            {
                appName: 'Portal App',
                appOwner: 'Customer Experience',
                dateOnboarded: '2024-05-10',
                status: 'Active',
                trigger: 'User-Initiated Actions',
                appType: 'Mobile Application (Native)',
                techOwner: 'Michael Chen',
                tokenExpiryDate: '2026-05-10',
                networkMode: 'Intra-Cluster Networking'
            }
        ],
        upstreamApp: [
            {
                appName: 'SAA',
                appOwner: 'Security Department',
                tokenExpiryDate: '2025-12-31',
                techOwner: 'Richard Cooper'
            },
            {
                appName: 'User Directory',
                appOwner: 'IT Department',
                tokenExpiryDate: '2026-06-30',
                techOwner: 'Patricia Murphy'
            }
        ],
        swaggerURL: 'https://api.company.com/auth/docs',
        documentsURL: 'https://company.sharepoint.com/sites/docs/auth-api'
    }
]

export const appListTable = [
    {
        "data": {
            "hasNextPage": false,
            "totalElements": 4,
            "results": [
                {
                    "id": 5,
                    "appUuid": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "Customer Portal",
                    "description": "Self-service portal for customer account management",
                    "status": "ACTIVE",
                    "stableVersion": "3.2.1",
                    "betaVersion": "3.2.1"
                },
                {
                    "id": 6,
                    "appUuid": "550e8400-e29b-41d4-a716-446655440001",
                    "name": "Analytics Dashboard",
                    "description": "Real-time business intelligence and reporting platform",
                    "status": "ACTIVE",
                    "stableVersion": "2.5.0",
                    "betaVersion": "2.5.0"
                },
                {
                    "id": 7,
                    "appUuid": "550e8400-e29b-41d4-a716-446655440002",
                    "name": "Inventory Manager",
                    "description": "Track and manage product inventory across warehouses",
                    "status": "ACTIVE",
                    "stableVersion": "4.1.3",
                    "betaVersion": "4.1.3"
                },
                {
                    "id": 8,
                    "appUuid": "550e8400-e29b-41d4-a716-446655440003",
                    "name": "Employee Directory",
                    "description": "Company-wide employee information and org chart",
                    "status": "FOR DEPRECATION",
                    "stableVersion": "1.8.2",
                    "betaVersion": "1.8.2"
                },
                // {
                //     "id": 9,
                //     "appUuid": "550e8400-e29b-41d4-a716-446655440004",
                //     "name": "Project Tracker",
                //     "description": "Collaborative project management and task tracking",
                //     "status": "ACTIVE",
                //     "stableVersion": "5.0.0",
                //     "betaVersion": "5.0.0"
                // },
                // {
                //     "id": 10,
                //     "appUuid": "550e8400-e29b-41d4-a716-446655440005",
                //     "name": "Legacy CRM",
                //     "description": "Customer relationship management system",
                //     "status": "DEPRECATED",
                //     "stableVersion": "5.0.0",
                //     "betaVersion": "5.0.0"
                // },
                // {
                //     "id": 11,
                //     "appUuid": "550e8400-e29b-41d4-a716-446655440006",
                //     "name": "Sales Dashboard",
                //     "description": "Sales performance tracking and forecasting",
                //     "status": "ACTIVE",
                //     "stableVersion": "3.4.2",
                //     "betaVersion": "5.0.1"
                // },
                // {
                //     "id": 12,
                //     "appUuid": "550e8400-e29b-41d4-a716-446655440007",
                //     "name": "Time Tracker",
                //     "description": "Employee time and attendance management",
                //     "status": "DEPRECATED",
                //     "stableVersion": "2.0.1",
                //     "betaVersion": "2.0.1"
                // }

            ],
            "currentPage": 0,
            "pageSize": 10
        },
        "flag": "S",
        "message": "Transaction successful.",
        "tranRefNo": "d2ba3fd00d2843eaafa4e12fa4da9ae2"
    }
]

export const webServicesListTable = [
    {
        "data": {
            "hasNextPage": false,
            "totalElements": 4,
            "results": [
                {
                    "id": 5,
                    "appUuid": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "User Authentication API",
                    "description": "OAuth 2.0 authentication and authorization service",
                    "status": "ACTIVE",
                    "stableVersion": "1.5.0",
                    "betaVersion": "1.5.0"
                },
                {
                    "id": 6,
                    "appUuid": "550e8400-e29b-41d4-a716-446655440001",
                    "name": "Payment Gateway",
                    "description": "Payment processing and transaction management",
                    "status": "FOR RETIREMENT",
                    "stableVersion": "2.5.0",
                    "betaVersion": "2.5.0"
                },
                // {
                //     "id": 7,
                //     "appUuid": "550e8400-e29b-41d4-a716-446655440002",
                //     "name": "Email Service",
                //     "description": "Transactional email delivery and template management",
                //     "status": "ACTIVE",
                //     "stableVersion": "4.1.3",
                //     "betaVersion": "4.1.3"
                // },
                // {
                //     "id": 8,
                //     "appUuid": "550e8400-e29b-41d4-a716-446655440003",
                //     "name": "File Storage API",
                //     "description": "Scalable cloud file storage and retrieval",
                //     "status": "FOR RETIREMENT",
                //     "stableVersion": "1.8.2",
                //     "betaVersion": "1.8.2"
                // }
            ],
            "currentPage": 0,
            "pageSize": 10
        },
        "flag": "S",
        "message": "Transaction successful.",
        "tranRefNo": "d2ba3fd00d2843eaafa4e12fa4da9ae2"
    }
]

export const resultListTable = [
    {
        "data": {
            "hasNextPage": false,
            "totalElements": 4,
            "results": [
                {
                    "type": "Web Service",
                    "appUuid": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "User Authentication API",
                    "match": [
                        { "authentication method": "bearer token" },
                        { "sample value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        { "description": "Bearer token for authentication" }
                    ],
                },
                {
                    "type": "Web Service",
                    "appUuid": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "Payment Gateway",
                    "match": [
                        { "sample value": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    ],
                },
                {
                    "type": "Application",
                    "appUuid": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "Customer Portal",
                    "match": [
                        { "owner name": "Bearer Grills" },
                    ],
                },
            ],
            "currentPage": 0,
            "pageSize": 10
        },
        "flag": "S",
        "message": "Transaction successful.",
        "tranRefNo": "d2ba3fd00d2843eaafa4e12fa4da9ae2"
    }
]

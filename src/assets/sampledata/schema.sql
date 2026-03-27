-- WORKING
BEGIN;

-- ==========================================
-- 1. CLEAN SLATE
-- ==========================================
DROP TABLE IF EXISTS tbl_application_versions_audit CASCADE;
DROP TABLE IF EXISTS tbl_upstream_applications CASCADE;
DROP TABLE IF EXISTS tbl_consumer_applications CASCADE;
DROP TABLE IF EXISTS tbl_response_codes CASCADE;
DROP TABLE IF EXISTS tbl_data_fields CASCADE;
DROP TABLE IF EXISTS tbl_http_apis_versions CASCADE;
DROP TABLE IF EXISTS tbl_application_http_apis CASCADE;
DROP TABLE IF EXISTS tbl_application_versions CASCADE;
DROP TABLE IF EXISTS tbl_applications CASCADE;

-- ==========================================
-- 2. SCHEMA
-- ==========================================

CREATE TABLE tbl_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    app_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    app_name TEXT NOT NULL,
    app_desc TEXT NOT NULL,
    service_type TEXT NOT NULL,
    lifecycle_status TEXT NOT NULL DEFAULT 'ACTIVE',
    owner_name TEXT,
    owner_dept TEXT,
    bau_support_name TEXT,
    bau_support_dept TEXT,
    repo_url TEXT,
    swagger_url TEXT,
    docs_url TEXT,
    techstack_platform TEXT,
    techstack_app TEXT,
    techstack_storage TEXT,
    techstack_security TEXT,
    techstack_message TEXT
);

CREATE TABLE tbl_application_versions (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    app_version_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_uuid UUID NOT NULL REFERENCES tbl_applications(app_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    release_stage TEXT NOT NULL,
    environment TEXT,
    app_version TEXT NOT NULL,
    build_version TEXT,
    features TEXT NOT NULL,
    developers TEXT,
    dev_squad TEXT,
    docs_url TEXT
);

CREATE TABLE tbl_application_http_apis (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    app_api_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_uuid UUID NOT NULL REFERENCES tbl_applications(app_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    category TEXT,
    api_name TEXT NOT NULL,
    description TEXT NOT NULL,
    webservice_type TEXT NOT NULL,
    http_method TEXT NOT NULL,
    accessed_via_gateway BOOLEAN NOT NULL DEFAULT true,
    authentication_method TEXT NOT NULL,
    authorization_name TEXT,
    lifecycle_status TEXT NOT NULL DEFAULT 'ACTIVE',
    swagger_url TEXT,
    docs_url TEXT,
    api_version TEXT,
    url_prod TEXT,
    url_dr TEXT,
    url_uat TEXT,
    url_sit TEXT,
    request_body_sample TEXT,
    request_data_format TEXT,
    request_data_sensitivity_type TEXT,
    request_data_in_transit_enc TEXT,
    request_ave_size TEXT,
    request_max_size TEXT,
    request_data_logged BOOLEAN,
    request_data_cached BOOLEAN,
    request_duplicate_allowed BOOLEAN,
    request_throttling_supported BOOLEAN,
    response_body_sample TEXT,
    response_data_format TEXT,
    response_data_sensitivity_type TEXT,
    response_data_in_transit_enc TEXT,
    response_ave_size TEXT,
    response_max_size TEXT,
    response_data_logged BOOLEAN,
    response_data_cached BOOLEAN,
    rate_limit_info TEXT,
    exposure TEXT
);

CREATE TABLE tbl_http_apis_versions (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    api_version_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_version_uuid UUID NOT NULL,
    app_api_uuid UUID NOT NULL REFERENCES tbl_application_http_apis(app_api_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    release_stage TEXT NOT NULL,
    environment TEXT,
    app_version TEXT NOT NULL,
    build_version TEXT,
    features TEXT NOT NULL,
    developers TEXT,
    dev_squad TEXT,
    docs_url TEXT
);

CREATE TABLE tbl_data_fields (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    data_field_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_api_uuid UUID NOT NULL REFERENCES tbl_application_http_apis(app_api_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    payload_type TEXT NOT NULL,
    field_name TEXT,
    data_type_format TEXT,
    description TEXT,
    is_required BOOLEAN,
    sample_value TEXT,
    validation TEXT,
    transformation_logic TEXT,
    default_value TEXT,
    source_application_name TEXT,
    source_field_name TEXT,
    endpoint TEXT
);

CREATE TABLE tbl_response_codes (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    res_code_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_api_uuid UUID NOT NULL REFERENCES tbl_application_http_apis(app_api_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    business_code TEXT,
    http_code TEXT,
    message TEXT,
    type TEXT,
    suggested_action TEXT
);

CREATE TABLE tbl_consumer_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    consumer_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_api_uuid UUID NOT NULL REFERENCES tbl_application_http_apis(app_api_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    app_name TEXT NOT NULL,
    description TEXT,
    relationship TEXT,
    business_owner TEXT,
    technical_owner TEXT,
    trigger TEXT,
    app_type TEXT,
    network_mode TEXT,
    date_onboarded DATE,
    status TEXT,
    token_expiry DATE
);

CREATE TABLE tbl_upstream_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    upstream_app_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_api_uuid UUID NOT NULL REFERENCES tbl_application_http_apis(app_api_uuid),
    app_uuid UUID NOT NULL REFERENCES tbl_applications(app_uuid),
    is_deleted VARCHAR(1) NOT NULL DEFAULT 'N',
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    row_version INTEGER NOT NULL DEFAULT 1,
    app_name TEXT NOT NULL,
    description TEXT,
    relationship TEXT,
    business_owner TEXT,
    technical_owner TEXT,
    network_mode TEXT,
    token_expiry DATE
);

CREATE TABLE tbl_application_versions_audit (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    version_audit_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_version_uuid UUID NOT NULL REFERENCES tbl_application_versions(app_version_uuid),
    event_datetime TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor TEXT NOT NULL,
    events TEXT NOT NULL,
    data TEXT NOT NULL
);

BEGIN;

-- ==========================================
-- 3. DATA INJECTION (Production Variety)
-- ==========================================

DO $$
DECLARE
    v_app_uuid UUID;
    v_api_uuid UUID;
    v_app_version_uuid UUID;
    app_idx INT;
    api_idx INT;
    ver_idx INT;
    num_apis INT;
    num_versions INT;

    -- realistic arrays
    v_app_names TEXT[] := ARRAY[
        'Payment Gateway','Customer Portal','Analytics Engine','Mobile Banking','Loyalty Platform',
        'Inventory System','Fraud Detection','HR Management','Document Storage','Notification Service'
    ];
    v_app_desc TEXT[] := ARRAY[
        'Handles online payments securely','Customer self-service portal','Data analytics for business insights',
        'Mobile app for banking','Platform for customer loyalty programs',
        'Tracks and manages inventory','Detects fraudulent transactions','Manages human resources processes',
        'Stores and organizes documents','Centralized notification delivery system'
    ];
    v_owner_names TEXT[] := ARRAY[
        'Alice Wong','Bob Smith','Charlie Johnson','Diana Prince','Ethan Hunt','Fiona Li','George King'
    ];
    v_owner_depts TEXT[] := ARRAY[
        'Finance','IT','Operations','Customer Success','R&D','HR','Security'
    ];
    v_bau_support TEXT[] := ARRAY['John Doe','Jane Roe','Mike Lee','Sara Kim','Tom Hardy'];
    v_bau_depts TEXT[] := ARRAY['Operations','Support','Finance','IT','Customer Service'];
    v_lifecycle_status TEXT[] := ARRAY['ACTIVE','FOR_DEPRECATION','DEPRECATED','FOR_RETIREMENT'];
    v_api_names TEXT[] := ARRAY[
        'Create Payment','Get Account Info','Update Profile','Fetch Transactions','Validate Token','Send Notification',
        'Generate Report','Upload Document','Check Balance','Authorize Transaction'
    ];
    v_features TEXT[] := ARRAY[
        'User authentication','Transaction logging','Multi-currency support','Reporting module','Third-party API integration',
        'Real-time alerts','Document versioning','Data analytics','Fraud detection','Automated notifications'
    ];
    v_http_method TEXT[] := ARRAY['GET','POST','PUT','PATCH','DELETE'];
    v_auth_method TEXT[] := ARRAY['API_KEY','BASIC_AUTH','BEARER_TOKEN','JWT','OAUTH2','OIDC','MTLS','HMAC','SESSION_COOKIES','CUSTOM_TOKENS'];
    v_payload_format TEXT[] := ARRAY['APPLICATION_JSON','APPLICATION_XML','TEXT_XML','TEXT_PLAIN','MULTIPART_FORM_DATA'];
    v_sensitivity TEXT[] := ARRAY['PUBLIC','INTERNAL','CONFIDENTIAL','FINANCIAL_DATA','PII','SPI','PHI','PCI','SECURITY_SENSITIVE','CUSTOMER_DATA_NON_PII'];
    v_release_stage TEXT[] := ARRAY['PRE_ALPHA','ALPHA','BETA','RC','STABLE','PATCH','MINOR','MAJOR'];
    v_env TEXT[] := ARRAY['DEV','SIT','UAT','PROD','DR'];
BEGIN
    FOR app_idx IN 1..10 LOOP
        -- Insert Application
        INSERT INTO tbl_applications (
            app_name, app_desc, service_type, lifecycle_status, owner_name, owner_dept,
            bau_support_name, bau_support_dept, repo_url, swagger_url, docs_url,
            techstack_platform, techstack_app, techstack_storage, techstack_security, techstack_message,
            created_by, updated_by, is_deleted, row_version
        ) VALUES (
            v_app_names[ floor(random()*array_length(v_app_names,1)+1) ],
            v_app_desc[ floor(random()*array_length(v_app_desc,1)+1) ],
            'MICROSERVICE',
            v_lifecycle_status[ floor(random()*array_length(v_lifecycle_status,1)+1) ],
            v_owner_names[ floor(random()*array_length(v_owner_names,1)+1) ],
            v_owner_depts[ floor(random()*array_length(v_owner_depts,1)+1) ],
            v_bau_support[ floor(random()*array_length(v_bau_support,1)+1) ],
            v_bau_depts[ floor(random()*array_length(v_bau_depts,1)+1) ],
            'https://repo.company.com/' || app_idx,
            'https://swagger.company.com/' || app_idx,
            'https://docs.company.com/' || app_idx,
            'Kubernetes','SpringBoot','PostgreSQL','OAuth2','Kafka messaging',
            'system','system','N',1
        ) RETURNING app_uuid INTO v_app_uuid;

        -- Random APIs per app
        num_apis := floor(random()*4 + 2); -- 2–5 APIs
        FOR api_idx IN 1..num_apis LOOP
            INSERT INTO tbl_application_http_apis (
                app_uuid, category, api_name, description, webservice_type, http_method, accessed_via_gateway,
                authentication_method, authorization_name, lifecycle_status, swagger_url, docs_url, api_version,
                url_prod, url_dr, url_uat, url_sit, request_body_sample, request_data_format, request_data_sensitivity_type,
                request_data_in_transit_enc, request_ave_size, request_max_size, request_data_logged, request_data_cached,
                request_duplicate_allowed, request_throttling_supported, response_body_sample, response_data_format,
                response_data_sensitivity_type, response_data_in_transit_enc, response_ave_size, response_max_size,
                response_data_logged, response_data_cached, rate_limit_info, exposure, created_by, updated_by, is_deleted, row_version
            ) VALUES (
                v_app_uuid,'TRANSACTIONAL',
                v_api_names[ floor(random()*array_length(v_api_names,1)+1) ],
                'Handles operations related to ' || v_api_names[ floor(random()*array_length(v_api_names,1)+1) ],
                'REST',
                v_http_method[ floor(random()*array_length(v_http_method,1)+1) ],
                true,
                v_auth_method[ floor(random()*array_length(v_auth_method,1)+1) ],
                'Role_Admin',
                'ACTIVE',
                'https://swagger.company.com/api/' || app_idx || '/' || api_idx,
                'https://docs.company.com/api/' || app_idx || '/' || api_idx,
                'v1',
                'https://prod.company.com/api/' || app_idx || '/' || api_idx,
                'https://dr.company.com/api/' || app_idx || '/' || api_idx,
                'https://uat.company.com/api/' || app_idx || '/' || api_idx,
                'https://sit.company.com/api/' || app_idx || '/' || api_idx,
                '{"sample":"data"}',
                v_payload_format[ floor(random()*array_length(v_payload_format,1)+1) ],
                v_sensitivity[ floor(random()*array_length(v_sensitivity,1)+1) ],
                'TLS_1_3','5KB','15KB',true,false,false,true,
                '{"status":"success"}','APPLICATION_JSON',
                v_sensitivity[ floor(random()*array_length(v_sensitivity,1)+1) ],
                'TLS_1_3','2KB','10KB',true,true,
                '5000rpm','INTERNAL',
                'system','system','N',1
            ) RETURNING app_api_uuid INTO v_api_uuid;

            -- Insert Data Fields
            INSERT INTO tbl_data_fields (app_api_uuid, payload_type, field_name, data_type_format, description, is_required, sample_value, created_by, updated_by, is_deleted, row_version)
            VALUES
                (v_api_uuid,'Request','accountNo','STRING','Primary account identifier',true,'1234567890','system','system','N',1),
                (v_api_uuid,'Response','transactionId','UUID','Unique transaction ref',true,'abc-123-xyz','system','system','N',1),
                (v_api_uuid,'Request-Header','X-Correlation-ID','STRING','Tracing ID',true,'req-001','system','system','N',1),
                (v_api_uuid,'Response-Header','X-Rate-Limit','INTEGER','Remaining quota',false,'4999','system','system','N',1),
                (v_api_uuid,'URL-Path-Parameter','id','LONG','Resource ID',true,'100','system','system','N',1);

            -- Insert Response Codes
            INSERT INTO tbl_response_codes (app_api_uuid, business_code, http_code, message, type, suggested_action, created_by, updated_by, is_deleted, row_version)
            VALUES (v_api_uuid,'ERR-000','200','Operation Successful','SUCCESS','None','system','system','N',1);

            -- Insert Consumer Applications
            INSERT INTO tbl_consumer_applications (app_api_uuid, app_name, description, relationship, business_owner, technical_owner, trigger, app_type, network_mode, date_onboarded, status, created_by, updated_by, is_deleted, row_version)
            VALUES (v_api_uuid,'MobileBanking','Consumer mobile frontend','CONSUMER','Jane Doe','John Smith','USER_ACTION','MOBILE','INTERNET',CURRENT_DATE,'ACTIVE','system','system','N',1);

            -- Insert Upstream Applications
            INSERT INTO tbl_upstream_applications (app_api_uuid, app_uuid, app_name, description, relationship, business_owner, technical_owner, network_mode, created_by, updated_by, is_deleted, row_version)
            VALUES (v_api_uuid,v_app_uuid,'LegacySystem','Core banking system','UPSTREAM','Finance Dept','Ops Team','INTRANET','system','system','N',1);

            -- Insert Versions
            num_versions := floor(random()*3 + 1); -- 1–3 versions per API
            FOR ver_idx IN 1..num_versions LOOP
                INSERT INTO tbl_application_versions (
                    app_uuid, release_stage, environment, app_version, build_version, features, developers, dev_squad, docs_url,
                    created_by, updated_by, is_deleted, row_version
                ) VALUES (
                    v_app_uuid,
                    v_release_stage[ floor(random()*array_length(v_release_stage,1)+1) ],
                    v_env[ floor(random()*array_length(v_env,1)+1) ],
                    'v' || ver_idx || '.0.' || api_idx,
                    'build-' || ver_idx || '-' || api_idx,
                    v_features[ floor(random()*array_length(v_features,1)+1) ],
                    'Dev Team ' || ver_idx,
                    'Squad ' || ver_idx,
                    'https://docs.company.com/version/' || app_idx || '/' || api_idx || '/' || ver_idx,
                    'system','system','N',1
                ) RETURNING app_version_uuid INTO v_app_version_uuid;

                -- Also insert HTTP API version mapping
                INSERT INTO tbl_http_apis_versions (
                    app_version_uuid, app_api_uuid, release_stage, environment, app_version, build_version, features, developers, dev_squad, docs_url,
                    created_by, updated_by, is_deleted, row_version
                ) VALUES (
                    v_app_version_uuid, v_api_uuid,
                    v_release_stage[ floor(random()*array_length(v_release_stage,1)+1) ],
                    v_env[ floor(random()*array_length(v_env,1)+1) ],
                    'v' || ver_idx || '.0.' || api_idx,
                    'build-' || ver_idx || '-' || api_idx,
                    v_features[ floor(random()*array_length(v_features,1)+1) ],
                    'Dev Team ' || ver_idx,
                    'Squad ' || ver_idx,
                    'https://docs.company.com/api-version/' || app_idx || '/' || api_idx || '/' || ver_idx,
                    'system','system','N',1
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

COMMIT;



-- ALTER TABLE tbl_application_http_apis 
-- ADD COLUMN api_layer INT CHECK (api_layer IN (0,1,2));
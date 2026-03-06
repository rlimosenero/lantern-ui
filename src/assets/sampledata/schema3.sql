DO $$ 
DECLARE 
    v_app_uuid UUID;
    v_app_ver_uuid UUID;
    v_api_uuid UUID;
    i INTEGER;
    -- Arrays for variety
    v_platforms TEXT[] := ARRAY['KUBERNETES', 'OPENSHIFT', 'AWS_EKS', 'AZURE_AKS'];
    v_stacks TEXT[] := ARRAY['Java/Spring', 'Node/Express', 'Python/FastAPI', 'Go/Gin'];
    v_storage TEXT[] := ARRAY['PostgreSQL', 'MongoDB', 'Redis', 'Oracle'];
    v_auth TEXT[] := ARRAY['OAUTH2', 'API_KEY', 'MTLS', 'JWT'];
BEGIN
    FOR i IN 1..20 LOOP
        -- 1. Insert Detailed Applications
        INSERT INTO tbl_applications (
            app_name, app_desc, service_type, created_by, updated_by, 
            lifecycle_status, owner_name, owner_dept, bau_support_name, bau_support_dept,
            repo_url, swagger_url, docs_url, 
            techstack_platform, techstack_app, techstack_storage, techstack_security, techstack_message
        )
        VALUES (
            'Lantern-' || CASE WHEN i % 2 = 0 THEN 'Core' ELSE 'Edge' END || '-' || i, 
            'Enterprise system managing ' || i || ' specialized business logic modules.', 
            CASE WHEN i % 2 = 0 THEN 'MICROSERVICE' ELSE 'WEB_APP' END, 
            'system_gen', 'system_gen', 
            'ACTIVE', 'Owner-' || i, 'IT-DEPT-' || (i % 3), 'Support-Team-' || i, 'OPS-' || (i % 2),
            'https://github.com/lantern/repo-' || i, 'https://api.lantern.com/swagger-' || i, 'https://wiki.lantern.com/docs-' || i,
            v_platforms[(i % 4) + 1], v_stacks[(i % 4) + 1], v_storage[(i % 4) + 1], 'Vault/TLS', 'RabbitMQ'
        ) RETURNING app_uuid INTO v_app_uuid;

        -- 2. Insert App Versions (Detailed)
        INSERT INTO tbl_application_versions (
            app_uuid, release_stage, environment, app_version, build_version, 
            features, developers, dev_squad, docs_url, created_by, updated_by
        )
        VALUES (
            v_app_uuid, 
            CASE WHEN i % 5 = 0 THEN 'UAT' ELSE 'PROD' END,
            CASE WHEN i % 5 = 0 THEN 'User Acceptance' ELSE 'Production' END,
            'v2.' || i || '.0', 'build-rel-' || (i * 100),
            'Feature-' || i || ': Enhanced security and optimized DB indexing.',
            'Dev-' || i || ', Lead-' || (i+1), 'Squad-Alpha-' || (i % 4),
            'https://docs.internal/v/' || i, 'admin', 'admin'
        ) RETURNING app_version_uuid INTO v_app_ver_uuid;

        -- 3. Insert HTTP APIs (The core of your Catalog)
        INSERT INTO tbl_application_http_apis (
            app_uuid, category, api_name, description, webservice_type, http_method, 
            accessed_via_gateway, authentication_method, authorization_name, 
            lifecycle_status, swagger_url, docs_url, api_version,
            url_prod, url_uat, url_sit,
            request_data_format, response_data_format, exposure
        )
        VALUES (
            v_app_uuid, 
            CASE WHEN i % 3 = 0 THEN 'Internal' ELSE 'External' END,
            'Service-API-' || i, 'Endpoint for ' || i || ' data processing.',
            'REST', CASE WHEN i % 2 = 0 THEN 'GET' ELSE 'POST' END,
            true, v_auth[(i % 4) + 1], 'Role_Admin_' || i,
            'Active', 'https://api.internal/swagger', 'https://api.internal/docs', 'v1',
            'https://api.prod.com/v1/' || i, 'https://api.uat.com/v1/' || i, 'https://api.sit.com/v1/' || i,
            'JSON', 'JSON', CASE WHEN i % 2 = 0 THEN 'Public' ELSE 'Private' END
        ) RETURNING app_api_uuid INTO v_api_uuid;

        -- 4. Link API Versions
        INSERT INTO tbl_http_apis_versions (
            app_api_uuid, app_version_uuid, release_stage, environment, app_version, features, created_by, updated_by
        )
        VALUES (v_api_uuid, v_app_ver_uuid, 'PROD', 'Production', '1.0.' || i, 'Full saturation test', 'admin', 'admin');

        -- 5. Response Codes
        INSERT INTO tbl_response_codes (app_api_uuid, business_code, http_code, message, type, suggested_action, created_by, updated_by)
        VALUES (v_api_uuid, 'ERR-' || i, '200', 'Operation Successful', 'SUCCESS', 'None required', 'admin', 'admin');

        -- 6. Consumer/Upstream Links
        INSERT INTO tbl_consumer_applications (app_api_uuid, app_name, relationship, status, created_by, updated_by)
        VALUES (v_api_uuid, 'Consumer-App-' || i, 'DEPENDENT', 'ACTIVE', 'admin', 'admin');

    END LOOP;
END $$;
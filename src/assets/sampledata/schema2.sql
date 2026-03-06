DO $$ 
DECLARE 
    v_app_uuid UUID;
    v_app_ver_uuid UUID;
    v_api_uuid UUID;
    i INTEGER;
BEGIN
    FOR i IN 1..15 LOOP
        -- Insert 15 Apps
        INSERT INTO tbl_applications (app_name, app_desc, service_type, created_by, updated_by, techstack_platform, techstack_app, lifecycle_status)
        VALUES (
            'Enterprise-Service-' || i, 
            'Core processing engine for module ' || i, 
            CASE WHEN i % 2 = 0 THEN 'MICROSERVICE' ELSE 'WEB_APP' END, 
            'admin', 'admin', 'KUBERNETES', 'Java/Spring', 'ACTIVE'
        ) RETURNING app_uuid INTO v_app_uuid;

        -- Insert App Version
        INSERT INTO tbl_application_versions (app_uuid, release_stage, app_version, features, created_by, updated_by, environment)
        VALUES (v_app_uuid, 'PROD', '3.' || i || '.1', 'Auth, Logging, Data Sync ' || i, 'admin', 'admin', 'Production')
        RETURNING app_version_uuid INTO v_app_ver_uuid;

        -- Insert API (1 per app, plus 5 extras later to make 20)
        INSERT INTO tbl_application_http_apis (app_uuid, api_name, description, webservice_type, http_method, accessed_via_gateway, authentication_method, created_by, updated_by, url_prod, lifecycle_status)
        VALUES (v_app_uuid, 'Get-Data-' || i, 'Read access for ' || i, 'REST', 'GET', true, 'OAUTH2', 'admin', 'admin', 'https://api.internal.com/v1/data/' || i, 'ACTIVE')
        RETURNING app_api_uuid INTO v_api_uuid;

        -- Link API Version
        INSERT INTO tbl_http_apis_versions (app_api_uuid, app_version_uuid, release_stage, environment, app_version, features, created_by, updated_by)
        VALUES (v_api_uuid, v_app_ver_uuid, 'PROD', 'Production', '1.0.0', 'Stable', 'admin', 'admin');

        -- Response codes and fields
        INSERT INTO tbl_data_fields (app_api_uuid, payload_type, field_name, data_type_format, description, is_required, created_by, updated_by)
        VALUES (v_api_uuid, 'RESPONSE', 'status', 'STRING', 'Result status', true, 'admin', 'admin');

        INSERT INTO tbl_response_codes (app_api_uuid, http_code, message, type, created_by, updated_by)
        VALUES (v_api_uuid, '200', 'Success', 'SUCCESS', 'admin', 'admin');

        -- Extra APIs for the first 5 apps to hit the "20 APIs" total
        IF i <= 5 THEN
            INSERT INTO tbl_application_http_apis (app_uuid, api_name, description, webservice_type, http_method, accessed_via_gateway, authentication_method, created_by, updated_by, url_prod, lifecycle_status)
            VALUES (v_app_uuid, 'Post-Update-' || i, 'Write access for ' || i, 'REST', 'POST', true, 'OAUTH2', 'admin', 'admin', 'https://api.internal.com/v1/update/' || i, 'ACTIVE')
            RETURNING app_api_uuid INTO v_api_uuid;

            INSERT INTO tbl_http_apis_versions (app_api_uuid, app_version_uuid, release_stage, environment, app_version, features, created_by, updated_by)
            VALUES (v_api_uuid, v_app_ver_uuid, 'PROD', 'Production', '1.0.0', 'Stable', 'admin', 'admin');
        END IF;

    END LOOP;
END $$;


-- ALTER TABLE tbl_application_http_apis
-- ALTER COLUMN is_deleted TYPE VARCHAR(1)
-- USING CASE
--         WHEN is_deleted = true THEN 'Y'
--         ELSE 'N'
--       END;
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

-- ==========================================
-- 3. DATA INJECTION (Production Variety)
-- ==========================================
DO $$ 
DECLARE 
    v_app_uuid UUID;
    v_api_uuid UUID;
    a_idx INTEGER;
    w_idx INTEGER;
    v_formats TEXT[] := ARRAY['APPLICATION_JSON', 'APPLICATION_XML', 'TEXT_PLAIN'];
    v_sensitivity TEXT[] := ARRAY['INTERNAL', 'CONFIDENTIAL', 'PII', 'PCI', 'PUBLIC'];
BEGIN
    FOR a_idx IN 1..20 LOOP
        -- Generate 20 Core Applications
        INSERT INTO tbl_applications (
            app_name, app_desc, service_type, lifecycle_status, owner_name, techstack_platform
        ) VALUES (
            'Enterprise-Platform-' || a_idx, 'Core business logic platform ' || a_idx, 
            'MICROSERVICE', 'ACTIVE', 'Engineering-Squad-' || a_idx, 'Kubernetes'
        ) RETURNING app_uuid INTO v_app_uuid;

        -- Generate 15 APIs for each Application (300 total)
        FOR w_idx IN 1..15 LOOP
            -- Preservation of your exact manual UUID for testing
            IF a_idx = 1 AND w_idx = 1 THEN v_api_uuid := '37c30f90-ad4d-493d-b4e2-a501834a0c50';
            ELSE v_api_uuid := gen_random_uuid();
            END IF;

            -- Populate the main HTTP APIs table mapping exactly to your DTOs
            INSERT INTO tbl_application_http_apis (
                app_api_uuid, app_uuid, category, api_name, description, webservice_type, 
                http_method, accessed_via_gateway, authentication_method, authorization_name, 
                lifecycle_status, swagger_url, docs_url, api_version, 
                url_prod, url_dr, url_uat, url_sit,
                request_body_sample, request_data_format, request_data_sensitivity_type, 
                request_data_in_transit_enc, request_ave_size, request_max_size, 
                request_data_logged, request_data_cached, request_duplicate_allowed, request_throttling_supported,
                response_body_sample, response_data_format, response_data_sensitivity_type, 
                response_data_in_transit_enc, response_ave_size, response_max_size, 
                response_data_logged, response_data_cached, rate_limit_info, exposure
            ) VALUES (
                v_api_uuid, v_app_uuid, 'TRANSACTIONAL', 'Service-Endpoint-' || w_idx, 'Handles robust operations for module ' || w_idx, 'REST', 
                CASE WHEN w_idx % 2 = 0 THEN 'GET' ELSE 'POST' END, true, 'OAUTH2', 'Role_Admin', 
                'ACTIVE', 'https://api.internal/swagger', 'https://api.internal/docs', 'v1',
                'https://api.prod.com/v1/' || w_idx, 'https://api.dr.com/v1/' || w_idx, 'https://api.uat.com/v1/' || w_idx, 'https://api.sit.com/v1/' || w_idx,
                '{"account": "12345"}', v_formats[(w_idx % 3) + 1], v_sensitivity[(w_idx % 5) + 1], 
                'TLS_1_3', '5KB', '15KB', 
                true, false, false, true,
                '{"status": "success"}', 'APPLICATION_JSON', v_sensitivity[(w_idx % 5) + 1], 
                'TLS_1_3', '2KB', '10KB', 
                true, true, '5000rpm', 'INTERNAL'
            );

            -- Population for DataFields: Fills requestHeaders, requestBodyFields, responseHeaders, responseBodyFields, urlPathParameters
            INSERT INTO tbl_data_fields (app_api_uuid, payload_type, field_name, data_type_format, description, is_required, sample_value)
            VALUES 
            (v_api_uuid, 'REQUEST', 'accountNo', 'STRING', 'Primary account identifier', true, '1234567890'),
            (v_api_uuid, 'RESPONSE', 'transactionId', 'UUID', 'Unique transaction ref', true, 'abc-123-xyz'),
            (v_api_uuid, 'REQUEST_HEADER', 'X-Correlation-ID', 'STRING', 'Tracing ID', true, 'req-001'),
            (v_api_uuid, 'RESPONSE_HEADER', 'X-Rate-Limit', 'INTEGER', 'Remaining quota', false, '4999'),
            (v_api_uuid, 'URL_PATH_PARAMETER', 'id', 'LONG', 'Resource ID', true, '100');

            -- Population for responseStatusCodes
            INSERT INTO tbl_response_codes (app_api_uuid, business_code, http_code, message, type, suggested_action)
            VALUES (v_api_uuid, 'ERR-000', '200', 'Operation Successful', 'SUCCESS', 'None required');

            -- Population for consumerApplications
            INSERT INTO tbl_consumer_applications (app_api_uuid, app_name, description, relationship, business_owner, technical_owner, trigger, app_type, network_mode, status, date_onboarded)
            VALUES (v_api_uuid, 'Mobile-Banking-App', 'Consumer mobile frontend', 'CONSUMER', 'Jane Doe', 'John Smith', 'USER_ACTION', 'MOBILE', 'INTERNET', 'ACTIVE', CURRENT_DATE);

            -- Population for upstreamApplications
            INSERT INTO tbl_upstream_applications (app_api_uuid, app_uuid, app_name, description, relationship, business_owner, technical_owner, network_mode)
            VALUES (v_api_uuid, v_app_uuid, 'Legacy-Mainframe', 'Core banking system', 'UPSTREAM', 'Finance Dept', 'Ops Team', 'INTRANET');

        END LOOP;
    END LOOP;
END $$;

COMMIT;
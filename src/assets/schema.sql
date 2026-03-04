-- 1. DROP EVERYTHING (Using CASCADE to force-clear dependencies)
DROP TABLE IF EXISTS tbl_application_versions_audit CASCADE;
DROP TABLE IF EXISTS tbl_upstream_applications CASCADE;
DROP TABLE IF EXISTS tbl_consumer_applications CASCADE;
DROP TABLE IF EXISTS tbl_response_codes CASCADE;
DROP TABLE IF EXISTS tbl_data_fields CASCADE;
DROP TABLE IF EXISTS tbl_http_apis_versions CASCADE;
DROP TABLE IF EXISTS tbl_application_http_apis CASCADE;
DROP TABLE IF EXISTS tbl_application_versions CASCADE;
DROP TABLE IF EXISTS tbl_applications CASCADE;

-- 2. CREATE TABLES
CREATE TABLE tbl_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
    app_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
    row_version INTEGER NOT NULL DEFAULT 1,
    app_name TEXT NOT NULL,
    app_desc TEXT NOT NULL,
    service_type TEXT NOT NULL,
    lifecycle_status TEXT NOT NULL DEFAULT 'Active',
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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
    row_version INTEGER NOT NULL DEFAULT 1,
    category TEXT,
    api_name TEXT NOT NULL,
    description TEXT NOT NULL,
    webservice_type TEXT NOT NULL,
    http_method TEXT NOT NULL,
    accessed_via_gateway BOOLEAN NOT NULL,
    authentication_method TEXT NOT NULL,
    authorization_name TEXT,
    lifecycle_status TEXT NOT NULL DEFAULT 'Active',
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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
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
    upstream_app_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Fixed: Added UUID type here
    app_api_uuid UUID NOT NULL REFERENCES tbl_application_http_apis(app_api_uuid),
    app_uuid UUID NOT NULL REFERENCES tbl_applications(app_uuid),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT NOT NULL,
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
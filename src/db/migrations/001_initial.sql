-- 001_initial.sql
-- Complete PostgreSQL schema for De Novo NoMo application

-- =============================================================================
-- Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Enum Types
-- =============================================================================
CREATE TYPE user_role AS ENUM ('super_admin', 'editor', 'viewer');
CREATE TYPE location_status AS ENUM ('planning', 'setup', 'active', 'archived');
CREATE TYPE location_type AS ENUM ('de_novo', 'expansion');
CREATE TYPE document_version_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected');
CREATE TYPE document_access_level AS ENUM ('view', 'edit');
CREATE TYPE decision_status AS ENUM ('pending', 'decided', 'skipped', 'not_applicable', 'revisit');
CREATE TYPE decision_option_type AS ENUM ('off_the_shelf', 'open_source', 'build_custom', 'managed_service', 'skip');
CREATE TYPE checklist_status AS ENUM ('backlog', 'todo', 'in_progress', 'blocked', 'review', 'done');
CREATE TYPE checklist_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE cost_type AS ENUM ('one_time', 'monthly', 'annual');

-- =============================================================================
-- 1. users
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    avatar_url VARCHAR(512),
    totp_secret VARCHAR(255),
    totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. sessions (connect-pg-simple)
-- =============================================================================
CREATE TABLE sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_expire ON sessions (expire);

-- =============================================================================
-- 3. organizations
-- =============================================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. locations
-- =============================================================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    status location_status NOT NULL DEFAULT 'planning',
    location_type location_type NOT NULL DEFAULT 'de_novo',
    target_go_live_date DATE,
    estimated_total_cost NUMERIC,
    actual_total_cost NUMERIC,
    estimated_revenue_monthly NUMERIC,
    submitted_billing_monthly NUMERIC,
    transition_start_date DATE,
    transition_end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locations_organization_id ON locations (organization_id);
CREATE INDEX idx_locations_status ON locations (status);

-- =============================================================================
-- 5. documents
-- =============================================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    current_version_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_category ON documents (category);
CREATE INDEX idx_documents_is_published ON documents (is_published);

-- =============================================================================
-- 6. document_versions
-- =============================================================================
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content_md TEXT,
    change_summary TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status document_version_status NOT NULL DEFAULT 'draft',
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    parent_version_id UUID REFERENCES document_versions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_versions_document_id ON document_versions (document_id);
CREATE INDEX idx_document_versions_author_id ON document_versions (author_id);
CREATE INDEX idx_document_versions_status ON document_versions (status);

-- =============================================================================
-- 7. document_shares
-- =============================================================================
CREATE TABLE document_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    short_code VARCHAR(8) NOT NULL UNIQUE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    access_level document_access_level NOT NULL DEFAULT 'view',
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_shares_document_id ON document_shares (document_id);
CREATE INDEX idx_document_shares_short_code ON document_shares (short_code);

-- =============================================================================
-- 8. document_user_access
-- =============================================================================
CREATE TABLE document_user_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_level document_access_level NOT NULL DEFAULT 'view',
    granted_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_user_access_document_id ON document_user_access (document_id);
CREATE INDEX idx_document_user_access_user_id ON document_user_access (user_id);

-- =============================================================================
-- 9. decisions
-- =============================================================================
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    item_key VARCHAR(255),
    decision_summary TEXT,
    selected_option TEXT,
    reasoning TEXT,
    estimated_cost_onetime NUMERIC,
    estimated_cost_monthly NUMERIC,
    estimated_cost_annual NUMERIC,
    status decision_status NOT NULL DEFAULT 'pending',
    decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
    decided_at TIMESTAMPTZ,
    vendors JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decisions_location_id ON decisions (location_id);
CREATE INDEX idx_decisions_status ON decisions (status);
CREATE INDEX idx_decisions_category ON decisions (category);

-- =============================================================================
-- 10. decision_options
-- =============================================================================
CREATE TABLE decision_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
    option_name VARCHAR(255) NOT NULL,
    option_type decision_option_type NOT NULL,
    description TEXT,
    benefits TEXT[],
    risks TEXT[],
    estimated_cost_onetime NUMERIC,
    estimated_cost_monthly NUMERIC,
    estimated_cost_annual NUMERIC,
    vendor_name VARCHAR(255),
    vendor_url VARCHAR(512),
    is_selected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decision_options_decision_id ON decision_options (decision_id);

-- =============================================================================
-- 11. checklist_items
-- =============================================================================
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    decision_id UUID REFERENCES decisions(id) ON DELETE SET NULL,
    category VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status checklist_status NOT NULL DEFAULT 'backlog',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    priority checklist_priority NOT NULL DEFAULT 'medium',
    due_date DATE,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    depends_on UUID[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_items_location_id ON checklist_items (location_id);
CREATE INDEX idx_checklist_items_decision_id ON checklist_items (decision_id);
CREATE INDEX idx_checklist_items_status ON checklist_items (status);
CREATE INDEX idx_checklist_items_assigned_to ON checklist_items (assigned_to);
CREATE INDEX idx_checklist_items_priority ON checklist_items (priority);

-- =============================================================================
-- 12. checklist_comments
-- =============================================================================
CREATE TABLE checklist_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_comments_checklist_item_id ON checklist_comments (checklist_item_id);
CREATE INDEX idx_checklist_comments_author_id ON checklist_comments (author_id);

-- =============================================================================
-- 13. cost_entries
-- =============================================================================
CREATE TABLE cost_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    category VARCHAR(255),
    vendor_name VARCHAR(255),
    description TEXT,
    cost_type cost_type NOT NULL,
    amount NUMERIC NOT NULL,
    start_date DATE,
    end_date DATE,
    is_estimated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cost_entries_location_id ON cost_entries (location_id);
CREATE INDEX idx_cost_entries_category ON cost_entries (category);
CREATE INDEX idx_cost_entries_cost_type ON cost_entries (cost_type);

-- =============================================================================
-- 14. audit_log
-- =============================================================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON audit_log (user_id);
CREATE INDEX idx_audit_log_entity_type_entity_id ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_log_action ON audit_log (action);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at);

-- =============================================================================
-- 15. reference_pricing
-- =============================================================================
CREATE TABLE reference_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(255),
    subcategory VARCHAR(255),
    item_key VARCHAR(255) NOT NULL UNIQUE,
    vendor_name VARCHAR(255),
    product_name VARCHAR(255),
    product_url VARCHAR(512),
    cost_onetime_low NUMERIC,
    cost_onetime_high NUMERIC,
    cost_monthly_low NUMERIC,
    cost_monthly_high NUMERIC,
    cost_annual_low NUMERIC,
    cost_annual_high NUMERIC,
    notes TEXT,
    source TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reference_pricing_category ON reference_pricing (category);
CREATE INDEX idx_reference_pricing_is_active ON reference_pricing (is_active);

-- =============================================================================
-- 16. mcp_tokens
-- =============================================================================
CREATE TABLE mcp_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mcp_tokens_token_hash ON mcp_tokens (token_hash);
CREATE INDEX idx_mcp_tokens_created_by ON mcp_tokens (created_by);

-- =============================================================================
-- 17. notifications
-- =============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(512),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_is_read ON notifications (is_read);
CREATE INDEX idx_notifications_user_id_is_read ON notifications (user_id, is_read);

-- =============================================================================
-- Deferred Foreign Key: documents.current_version_id -> document_versions.id
-- =============================================================================
ALTER TABLE documents
    ADD CONSTRAINT fk_documents_current_version_id
    FOREIGN KEY (current_version_id) REFERENCES document_versions(id) ON DELETE SET NULL;

-- =============================================================================
-- Updated_at trigger function
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_document_versions_updated_at BEFORE UPDATE ON document_versions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_document_shares_updated_at BEFORE UPDATE ON document_shares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_document_user_access_updated_at BEFORE UPDATE ON document_user_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_decisions_updated_at BEFORE UPDATE ON decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_decision_options_updated_at BEFORE UPDATE ON decision_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_checklist_items_updated_at BEFORE UPDATE ON checklist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_cost_entries_updated_at BEFORE UPDATE ON cost_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_reference_pricing_updated_at BEFORE UPDATE ON reference_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_mcp_tokens_updated_at BEFORE UPDATE ON mcp_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

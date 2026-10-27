-- Default preserves the local executor until the deployed endpoint is verified.
alter table content_studio.settings add column publisher_location text not null default 'local' check(publisher_location in ('local','cloud'));

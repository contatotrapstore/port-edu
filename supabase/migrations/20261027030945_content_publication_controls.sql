alter table content_studio.settings add column instagram_app_secret text;
alter table content_studio.settings add column publication_mode text not null default 'approved' check(publication_mode in ('approved','automatic'));
alter table content_studio.settings add column publish_time time not null default '12:30';
alter table content_studio.schedules add column asset_fingerprint text;
alter table content_studio.schedules add column approval_mode text not null default 'approved' check(approval_mode in ('approved','automatic'));
create unique index one_schedule_per_revision on content_studio.schedules(revision_id) where state in ('paused','scheduled','completed');

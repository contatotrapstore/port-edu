-- No activation: only diagnostics and safe rebooking after cancellation.
alter table content_studio.settings add column publisher_seen_at timestamptz;
alter table content_studio.settings add column publisher_error text;
alter table content_studio.schedules drop constraint schedules_account_id_local_date_slot_id_key;
create unique index schedule_live_slot on content_studio.schedules(account_id,local_date,slot_id) where state in ('paused','scheduled','completed');

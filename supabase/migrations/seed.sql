insert into public.role_permissions (role, permission)
values
  ('admin', 'channels.delete'),
  ('admin', 'messages.delete'),
  ('moderator', 'messages.delete');
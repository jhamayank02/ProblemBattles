INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions; -- Assuming role_id 1 is 'admin', admin has all permissions
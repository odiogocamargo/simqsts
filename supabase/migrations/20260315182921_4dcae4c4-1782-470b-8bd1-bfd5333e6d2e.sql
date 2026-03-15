-- Disable email confirmations: set all unconfirmed users as confirmed
UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;
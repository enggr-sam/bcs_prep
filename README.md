# BCS Prep

Laravel + React (Inertia) study routine app. SQLite now; switch `DB_*` in `.env` when you move to MySQL.

## Accounts

| Role | Mobile | Password |
| --- | --- | --- |
| Admin | 01700000000 | iamadmin |
| Student | 01800000000 | iamstudent |

Students can also register with mobile + password only. After login they only see the routine table. Admin can add, edit, and delete days.

## Run

```bash
cd web
./bin/php artisan migrate --seed
npm install
npm run dev
```

In another terminal:

```bash
cd web
./bin/php artisan serve
```

Open http://127.0.0.1:8000

`./bin/php` loads a local SQLite PHP extension so the app works even if `php8.3-sqlite3` is not installed on the system.
# bcs_prep

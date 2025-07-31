## Development Setup for Paraiso360 Frontend and Backend

This document explains how to run both the Django backend and Next.js frontend together in development.

---

### Prerequisites

- **Git** installed
- **Python 3.9+** and **pip**
- **Node.js 16+** and **npm** or **yarn**
- **PostgreSQL** database running locally

---

### 1. Clone the Repository

```bash
git clone https://github.com/rik-create/paraiso360.git
cd paraiso360
```

---

### 2. Setup Django Backend

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS / Linux
   venv\\Scripts\\activate  # Windows
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend folder (same level as `manage.py`). Add your settings:

   ```ini
   # .env
   DEBUG=True
   SECRET_KEY=secret-key
   DB_NAME=paraiso360-db
   DB_USER=postgres
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. Run database migrations:

   ```bash
   python manage.py migrate
   ```

5. (Optional) Load initial data or create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django server:

   ```bash
   python manage.py runserver 8000
   ```

   The backend API will be available at `http://localhost:8000/`.

---

### 3. Setup Next.js Frontend

1. Change to the frontend folder:

   ```bash
   cd paraiso360_frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file at the root of `paraiso360_frontend`:

   ```ini
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. Start the Next.js dev server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000/`.

---

### 4. Verify the Setup

1. Open your browser at `http://localhost:3000`.
2. Use the login form to authenticate. This will call the backend at `http://localhost:8000/api/v1/token/`.
3. Test fetching protected data at `http://localhost:8000/api/v1/protected/` from the Dashboard page.

If you see data or a welcome message, the setup is working.

---

### 5. Common Issues

- **CORS errors**: Ensure `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` include `http://localhost:3000` in your Django `settings.py`.
- **Database errors**: Check your `.env` values and that PostgreSQL is running.
- **Port conflicts**: Make sure no other services use ports 8000 or 3000.

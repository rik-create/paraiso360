## 🔐 JWT Authentication Guide

### ✅ 1. Login (Issue Tokens)

**POST** `/api/v1/users/login/`

```json
{
  "username": "markdev",
  "password": "YourPassword123!"
}
```

**Response:**

```json
{
  "access": "access.token.here",
  "refresh": "refresh.token.here"
}
```

---

### 🔄 2. Refresh Access Token

**POST** `/api/v1/users/refresh/`

```json
{
  "refresh": "your_refresh_token"
}
```

**Response:**

```json
{
  "access": "new.access.token"
}
```

---

### 🚫 3. Logout (Revoke Token)

**POST** `/api/v1/users/logout/`
Header: `Authorization: Bearer <access_token>`

```json
{
  "refresh": "your_refresh_token"
}
```

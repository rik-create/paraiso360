**Branch Flow**

---

### 🔁 Branches Used

- `main`: Production (live version)
- `test`: Preview and staging
- `dev`: Active development
- `feature/*`: Individual features or tasks

---

### 🚀 Flow Steps

1. **Create a feature branch**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/some-feature
```

2. **Work and push commits**

```bash
git commit -m "Your changes"
git push origin feature/some-feature
```

3. **Merge to dev** (via pull request or command)

```bash
git checkout dev
git merge feature/some-feature
git push origin dev
```

4. **Merge dev to test**

```bash
git checkout test
git pull origin test
git merge dev
git push origin test
```

5. **Final merge to main** (when ready for production)

```bash
git checkout main
git pull origin main
git merge test
git push origin main
```

---

---

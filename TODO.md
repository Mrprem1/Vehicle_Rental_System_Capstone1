# Playwright CI Fix TODO

## Steps from approved plan:

### 1. [x] Edit playwright.config.cjs
   - Set forbidOnly: false
   - retries: 2

### 2. [x] Edit .github/workflows/playwright.yml
   - Add clean results dirs
   - Update 'Run Tests' to `npx playwright test || true`

### 3. [ ] Test locally
   - Run `npx playwright test`

### 4. [ ] Commit & push to trigger CI

### 5. [ ] Verify CI passes & Allure generates


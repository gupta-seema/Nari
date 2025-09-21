# Nari — Women Empowerment Platform (Login)

This repository contains the login page for `Nari`, a platform providing mentorship, resume-building assistance, and empowerment resources for women.

There are two ways to run the UI locally.

1) Static file (quick): open `index.html` in a browser.

```bash
# from the project folder
open index.html
```

2) Local server (recommended): the project includes a minimal Express server that serves files and exposes `/api/login`.

```bash
# install dependencies once
npm install

# start the server
npm start

# open http://localhost:3000 in your browser
```

Initialize local JSON DB and create accounts:

```bash
# initialize the local JSON database
npm run init-db

# then start the server
npm start

# open http://localhost:3000
```

Behavior:
- Validates required fields and minimum password length.
- Uses the local `/api/login` endpoint for authentication. The endpoint requires the password to include at least one digit.
- Provides guest flow and password show/hide toggle.

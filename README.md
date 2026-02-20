# Deploying Kodbank

Here are two ways to deploy your application to Vercel.

## Option 1: Direct Deployment (Fastest)
This method uploads your code directly from your computer to Vercel using the command line.

1.  **Open Terminal**:
    Open a terminal in your project folder: `C:\Users\Admin\KodBank`.

2.  **Run Vercel CLI**:
    Execute the following command:
    ```bash
    npx vercel
    ```

3.  **Follow the Prompts**:
    - **Log in**: It will ask you to log in via browser.
    - **Set up and deploy?**: Type `y`.
    - **Which scope?**: Press Enter (select your account).
    - **Link to existing project?**: Type `n`.
    - **Project name?**: Press Enter (default `kodbank`).
    - **Directory?**: Press Enter (default `./`).

4.  **Add Environment Variables**:
    After the first deployment (which might fail due to missing DB credentials), go to the Vercel Dashboard URL provided in the terminal.
    - Go to **Settings** -> **Environment Variables**.
    - Add all variables from your local `.env` file:
        - `DB_HOST`
        - `DB_PORT`
        - `DB_USER`
        - `DB_PASSWORD`
        - `DB_NAME`
        - `JWT_SECRET`

5.  **Redeploy**:
    Run the command again to apply the environment variables:
    ```bash
    npx vercel --prod
    ```

---

## Option 2: Deploy via GitHub (Recommended for Updates)
This method connects your GitHub repository to Vercel, so updates are deployed automatically when you push code.

1.  **Push to GitHub**:
    *(If you haven't already)*
    ```bash
    git remote add origin https://github.com/Supriya-GR-13/KodBank.git
    git branch -M main
    git push -u origin main
    ```

2.  **Import to Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Import your `kodbank` repository.

3.  **Configure**:
    - Add your Environment Variables during the import step.
    - Click **Deploy**.

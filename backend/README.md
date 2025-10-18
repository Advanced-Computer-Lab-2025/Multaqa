# Multaqa

## How to run backend server

- You need to make a .env file first and give it the key PORT={anyValidPortNumber} (without the curly brackets ofc) and MONGO_URI={yourMongoDBAtlasClusterLink} we will discuss this later bs ghaleban i think we should all connect to the same cluster

- Inside /backend directory, run `npm install`

- Next, in the same directory run `nodemon app.ts`

- Open up `localhost:4000` on your browser, and you should see an empty HTML page with the text "Backend Initialized!"

- Mabrook, now we can finally get to work


## env file structure (till now)
```env
MONGO_URI=
FRONTEND_PORT=3000
BACKEND_PORT=4000
PORT=4000
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
VERIFICATION_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
VERIFICATION_TOKEN_EXPIRES=1d
REDIS_URL=redis://localhost:6379
EMAIL_USER=
EMAIL_PASS=
NODE_ENV=development
APP_URL= # dynamically set at runtime
```

## Setup

Redis is now required — see below for Docker setup instructions.

> ⚠️ **Note:**  
> All commands should be executed inside your **Linux environment**:
> - **Windows users:** Run them in your **WSL terminal** (e.g., Ubuntu on WSL).  
> - **Mac users:** Run them directly in the **macOS Terminal** — Docker Desktop must be installed and running.  
>
> Do **not** use Windows CMD or PowerShell for these commands.
---

### Install Docker
```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker
 ```

### Run Redis in Docker
```bash
docker run --name redis -p 6379:6379 -d redis
```

### Ensure Redis Restarts Automatically
```bash
docker update --restart always redis
```

## Ngrok Setup (For Email Verification Testing) 

Use **Ngrok** to create a public HTTPS URL that tunnels to your local server (`localhost:4000`). This is crucial for testing email verification links, as email providers like Outlook often **block links containing `localhost`**.

---

### Step 1: Create a Free Ngrok Account

1.  Go to [https://ngrok.com](https://ngrok.com) and click **Sign Up** (you can use Google or GitHub).
2.  After signing up, you’ll land on your **Ngrok Dashboard**.
3.  Note your **Auth Token**—you'll need it in Step 3.

### Step 2: Install Ngrok

Choose your operating system:

| Platform | Command / Instructions |
| :--- | :--- |
| **macOS or Linux** | Use a package manager: <br> `brew install ngrok/ngrok/ngrok` <br> **OR** <br> `sudo snap install ngrok` |
| **Windows** | 1. Download the ZIP from your [Ngrok dashboard](https://ngrok.com/download). <br> 2. Unzip it (you’ll get `ngrok.exe`). <br> 3. Move `ngrok.exe` to a permanent folder (e.g., `C:\ngrok`). <br> 4. Add the folder path (e.g., `C:\ngrok`) to your system **PATH** Environment Variables. |

### Step 3: Connect Your Account

Open a **separate terminal window** and run this command. **Replace `YOUR_TOKEN`** with your actual token from Step 1:

```bash
ngrok config add-authtoken YOUR_TOKEN
```
This links your local Ngrok client to your account.

### Step 4: Start the Tunnel

Ensure your backend server is running on **port 4000** and run the following command to start the tunnel:

```bash
ngrok http 4000
```

Ngrok will display the connection status.

```
Session Status                online
Account                       [your-email] (Plan: Free)
...
Forwarding                    https://<RANDOM_ID>.ngrok-free.app -> http://localhost:4000
...
```
> ⚠️ **Important:** Keep this terminal window **open** at all times while developing. Closing it will terminate the Ngrok tunnel and break email verification links.
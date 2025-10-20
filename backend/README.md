# Multaqa

## How to run backend server

- You need to make a .env file first and give it the key PORT={anyValidPortNumber} (without the curly brackets ofc) and MONGO_URI={yourMongoDBAtlasClusterLink} we will discuss this later bs ghaleban i think we should all connect to the same cluster

- Inside /backend directory, run `npm install`

- Next, in the same directory run `nodemon app.ts`

- Open up `localhost:4000` on your browser, and you should see an empty HTML page with the text "Backend Initialized!"

- Mabrook, now we can finally get to work


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
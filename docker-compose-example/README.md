# Compose sample application
## A NodeJS backend and a MongoDB database

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   ...
├── compose.yaml
└── README.md
```

## Getting started
| Command                                                                     | Action                                         |
|:----------------------------------------------------------------------------|:-----------------------------------------------|
| `git clone git@gitlab.asoft-python.com:lam.nguyen/nodejs-training.git`      | Download source code                           |
| `cd docker-compose-example`                                                 | Move to folder                                 |
| `echo "NODE_ENV=development" > .env`                                        | Setup environments                             |
| `docker compose up --build`                                                 | Run application with Docker Compose            |
| `curl http://localhost:3000/api`                                            | Get database from Application                  |

## Notes

### Package Updates
When you update package versions or add new packages in `package.json`, you need to rebuild the Docker containers:

```bash
# Stop running containers
docker compose down

# Rebuild and start containers
docker compose up --build

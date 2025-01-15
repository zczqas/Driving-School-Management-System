## Setup for backend

### Clone the Repo

```bash
git clone https://github.com/savitriya/sfds.git
```

### Moved to current folder

```bash
cd sfds
```

### Pre-commit

```bash
pre-commit install
```

### Create new Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install the requirements

```bash
pip install -r requirements.txt
```

### Run the setup script

#### Make sure you have docker and docker-compose installed in your system

[//]: # ( This will create necessary folders and files)

```bash
sudo make setup
```

### Run the server

[//]: # (There is not much difference between dev and prod,
 but in prod, it will run prune and build)

#### For Local

```bash
sudo make dev
```

#### For Production

```bash
sudo make prod
```

### Run migrations

```bash
sudo make migrate msg='Commit Message'
```

### Check Docker Logs

````bash
sudo make dev-logs
````

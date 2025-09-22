# EC2 FastAPI Starter 🥀

Minimal repo to spin up a FastAPI app on an EC2 instance, then snapshot an AMI later.

## Stack
- Python 3.10+
- FastAPI + Uvicorn
- systemd service (to run on boot)
- (Optional) Nginx reverse proxy to expose on port 80

---

## Run locally

```bash
python -V                 # 3.10+
python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
# open http://127.0.0.1:8000
```

## Deploy later on EC2 (Ubuntu 22.04)
SSH into the instance, then:

```bash
# System deps
sudo apt update -y && sudo apt install -y python3-pip python3-venv nginx

# Create app folder
mkdir -p ~/app && cd ~/app
# Upload files in this repo to ~/app (scp/gh clone/s3, etc.)

# Python env
python3 -m venv ~/venv
source ~/venv/bin/activate
pip install -r backend/requirements.txt

# systemd
sudo cp systemd/fastapi.service /etc/systemd/system/fastapi.service
sudo systemctl daemon-reload
sudo systemctl enable fastapi
sudo systemctl start fastapi
sudo systemctl status fastapi --no-pager
```

### (Optional) Nginx reverse proxy (port 80 → 127.0.0.1:8000)
```bash
sudo cp nginx/fastapi /etc/nginx/sites-available/fastapi
sudo ln -sf /etc/nginx/sites-available/fastapi /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

Now visit `http://EC2_PUBLIC_IP` *(ensure security group allows HTTP 80).*

---

## Create AMI later
- EC2 Console → Instances → select instance → **Actions → Image and templates → Create image**.
- Name: `ami-fastapi-YYYY-MM-DD`. Leave **No reboot** unchecked for safety.
- AWS will create the AMI + EBS snapshot; you can launch identical servers from it.

---

## Repo layout
```
ec2-fastapi-starter/
├─ backend/
│  ├─ app/
│  │  └─ main.py
│  └─ requirements.txt
├─ systemd/
│  └─ fastapi.service
├─ nginx/
│  └─ fastapi
├─ .gitignore
├─ .env.example
└─ README.md
```

---

## Notes
- Edit `backend/app/main.py` to add routers, DB, etc.
- If you use port 8000 directly (no Nginx), open port 8000 in your Security Group.
- Always `shutdown` your machine before flipping physical kill-switches.

AWS user ID: 303846056417

EC2 location: /home/ec2-user/app
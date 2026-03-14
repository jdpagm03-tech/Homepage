# Homepage
## Docker-Compose
```yaml
services:
  web:
    build: .
    container_name: my-webpage
    ports:
      - "1102:80"
    restart: unless-stopped
```

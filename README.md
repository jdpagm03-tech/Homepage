# Homepage
## Docker-Compose
```yaml
services:
  web:
    build: .
    container_name: my-webpage
    ports:
      - "8080:80"
    restart: unless-stopped
```

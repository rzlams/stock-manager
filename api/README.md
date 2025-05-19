## Execute on development

```bash
# -d for dettached mode
docker-compose --env-file .env.local up --remove-orphans

docker-compose --env-file .env.local down
```

## Get Open API Spcec

Got to the following URL in the browser:
`http://localhost:8055/server/specs/oas`

# MIAQP — Web con UX optimizada (v4.1, URL de Sheet hardcode)

- Se hardcodeó la URL del Google Sheet en `lib/sheet.ts` usando `export?format=csv&gid=0`.
- Si tu catálogo no está en la primera hoja, cambia `gid=0` por el GID real.

## Local
```bash
npm install
npm run dev
```

## Cloud Run
```bash
gcloud config set project TU_PROYECTO
gcloud builds submit --tag gcr.io/TU_PROYECTO/miaqp:v4.1
gcloud run deploy miaqp --image gcr.io/TU_PROYECTO/miaqp:v4.1 \
  --region us-central1 --platform managed --allow-unauthenticated
```

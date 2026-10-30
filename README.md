# SAGOR v0 API

v0.app-এর API-র ফুল wrapper — projects, chats, messages, versions, deployments, hooks, mcp-servers, integrations — সবকিছু একটাই endpoint দিয়ে।

## Key বসানো

1. [v0.app/settings/keys](https://v0.app/settings/keys) থেকে তোমার v0 API key নাও
2. `index.js`-এ `V0_API_KEY`-এর জায়গায় key বসাও, অথবা Vercel-এ `V0_API_KEY` env var বসাও
3. Redeploy করো

Key ছাড়া সব call error দেবে।

## ব্যবহার

- `GET /` → সব endpoint-এর লিস্ট
- `POST /sagor/chats` `{"message": "Build a todo app"}` → নতুন অ্যাপ বানানো
- `GET /sagor/chats` → chat লিস্ট
- `POST /sagor/chats/:id/messages` `{"message": "Add dark mode"}` → follow-up মেসেজ
- `POST /sagor/deployments` `{"chatId": "...", "versionId": "..."}` → deploy

v0-র আসল API-র মতোই method, query আর JSON body ব্যবহার করো — শুধু সামনে `/sagor` যোগ হবে। যেমন: `GET https://api.v0.dev/v1/projects` → `GET <এই API>/sagor/projects`।

## নোট

v0 API ব্যবহারে v0-র ক্রেডিট/বিলিং লাগে — wrapper-টা deploy করা ফ্রি, কিন্তু v0-র call-গুলো তোমার v0 অ্যাকাউন্টের খরচে চলবে।

#!/bin/bash

pnpx openapi-zod-client http://127.0.0.1:8002/openapi.json -o ./src/lib/apiClient.ts

---
name: Orval zod-client response/body const naming
description: Why renaming an OpenAPI component schema does not rename the runtime zod const that route code must import, for orval's zod-client generator.
---

Orval's zod-client generator always names the runtime zod const for a request body or response after the **operationId**, as `<operationId>Body` and `<operationId>Response` — regardless of what the referenced `$ref` component schema in `openapi.yaml` is named. The component-schema name only affects the generated TypeScript **type** (under `generated/types/*.ts`), not the zod runtime object in `generated/api.ts`.

**Why:** A component schema in `openapi.yaml` that happens to share a name with orval's auto-derived `<operationId>Response` (e.g. a schema literally called `ListAdminsResponse` for the `listAdmins` operation) causes a genuine `TS2308` ambiguous-export collision between `generated/types` and `generated/api`, because both then export a symbol with that same name (one a type, one a const). Renaming the *schema* (e.g. to `ListAdminsPayload`) fixes that collision cleanly — but only for the type-only export. It does NOT change the actual const consumers must import at runtime to validate/parse — that stays `ListAdminsResponse`/`<operationId>Body`, sourced from `generated/api.ts`.

**How to apply:** When resolving this kind of collision, rename only the OpenAPI schema components (safe, type-only) and leave every route/handler import of the runtime zod const alone (or fix it to the correct `<operationId>Body`/`<operationId>Response` form) — never bulk-rename `*Response`→`*Payload` (or similar) across consuming route files under the assumption the schema rename must be mirrored there. Verify actual exported const names in `generated/api.ts` before touching any import.

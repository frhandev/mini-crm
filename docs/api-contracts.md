# Mini CRM - Preliminary API Contracts

## 1. Document Overview

### 1.1 Purpose

This document defines the preliminary HTTP API contracts between the React frontend and the ASP.NET Core Web API backend of Mini CRM. It establishes shared endpoint paths, responsibilities, authorization requirements, expected HTTP status codes, and initial request and response examples.

The contracts are intended to guide frontend-first development using mock data and to reduce integration inconsistencies when the backend is implemented.

### 1.2 Scope and Status

| Property | Value |
|---|---|
| Version | 1.0 |
| Status | Proposed baseline — pending approval |
| API Style | REST-oriented HTTP API |
| API Base Path | `/api` |
| Data Format | JSON |
| Related Documents | [Project README](../README.md), [Requirements Specification](requirements.md) |

The current scope covers FR-01 through FR-10. Contracts for FR-11 (User Management), FR-12 (Company Settings), FR-13 (Activity History), and FR-14 (PDF Export) are deferred until those features are selected for implementation.

Detailed request and response bodies are specified only for Create Customer and Get Customers in this initial version. The remaining schemas will be defined during feature development.

## 2. API Conventions

### 2.1 HTTP Methods

| Method | Purpose |
|---|---|
| GET | Retrieve a resource or collection. |
| POST | Create a resource or execute an authentication operation. |
| PUT | Replace the editable representation of an existing resource. |
| PATCH | Apply a specific partial update or state change. |

Permanent customer deletion is outside the initial release scope. No DELETE endpoint is defined.

### 2.2 Authentication and Authorization

| Access Level | Description |
|---|---|
| Public | No authentication required. |
| Both | Authenticated users with either the Admin or Sales Employee role. |
| Admin | Authenticated users with the Admin role only. |

- The backend shall validate authentication and enforce the required role for every protected endpoint (FR-01, FR-02, NFR-01).
- Missing, invalid, or expired authentication shall result in `401 Unauthorized`.
- Validly authenticated users without the required permission shall receive `403 Forbidden`.
- Role-based permissions do not override business rules.
- Record-level access restrictions remain open under OD-03 in the Requirements Specification; role authorization alone does not resolve record ownership.
- JWT-based authentication is planned. Bearer authentication is used illustratively in the examples; token transport, storage, refresh, expiration, and logout/revocation behavior remain subject to OD-01.
- Production requests shall use HTTPS.

Illustrative authenticated request header:

```http
Authorization: Bearer <access-token>
```

### 2.3 Data Representation

The following are proposed wire-format conventions for the initial contract examples:

- JSON field names use `camelCase`.
- Resource identifiers are represented as UUID strings.
- Timestamps are represented in ISO 8601 UTC format, such as `2026-11-24T10:00:00Z`.
- Boolean values use JSON `true` and `false`.
- Quotation statuses are represented by the strings `Draft`, `Sent`, `Accepted`, and `Rejected`.
- Request bodies containing JSON use `Content-Type: application/json`.
- Server-generated identifiers, timestamps, quotation references, initial states, and authoritative monetary totals shall not be controlled by the client.
- Customer field requiredness, maximum lengths, nullability, and uniqueness constraints remain subject to OD-02. Financial precision and rounding remain subject to OD-06.

### 2.4 Pagination, Search and Filtering

Customer and quotation list endpoints shall support pagination with a default page size of 20 (NFR-02).

| Parameter | Type | Proposed Meaning |
|---|---|---|
| `page` | Integer | One-based page number; default: 1. |
| `pageSize` | Integer | Number of records per page; default: 20. |

Proposed common behavior:

- Non-positive or invalid pagination parameters return `400 Bad Request`.
- No matching records, including a valid page beyond the available results, return `200 OK` with an empty `items` array.
- `totalCount` represents the number of accessible records matching the filters before pagination.
- `totalPages` represents the number of pages for the matching result set; zero matches yield zero pages.
- Ordering shall be deterministic so that pagination is consistent for an unchanged dataset. Maximum page size and default ordering remain subject to OD-08.
- The query parameter names and paginated response shape are proposed conventions pending approval under OD-08.

### 2.5 Error Handling

The backend shall return appropriate HTTP status codes and standardized error responses without exposing sensitive information (NFR-01, NFR-06).

- Invalid input or malformed parameters: `400 Bad Request`.
- Missing or invalid authentication: `401 Unauthorized`.
- Insufficient permissions: `403 Forbidden`.
- Missing resources: `404 Not Found`.
- Conflicts with current resource state or business rules: `409 Conflict`.
- Unexpected server errors: `500 Internal Server Error`, with internal logging and no sensitive details in the response.

An ASP.NET Core Problem Details-based format is proposed; the exact error body and validation-error structure remain subject to OD-08. A `204 No Content` response shall not include a response body.

## 3. Authentication Endpoints

Related requirements: FR-01, FR-02, NFR-01.

| Method | URL | Description | Authorization | Expected Status Codes |
|---|---|---|---|---|
| POST | `/api/auth/login` | Authenticate a user using valid credentials. | Public | 200, 400, 401, 500 |
| POST | `/api/auth/logout` | Log out the current authenticated user according to the session termination policy. | Both | 204, 401, 403, 500 |
| GET | `/api/auth/me` | Retrieve the current authenticated user's profile and role. | Both | 200, 401, 403, 500 |

### 3.1 Login

- Valid credentials result in successful authentication (`200 OK`).
- Invalid credentials result in `401 Unauthorized`; malformed input results in `400 Bad Request`.
- Failure messages shall not disclose whether a specific account exists.

### 3.2 Logout

- The client shall clear its authenticated state on successful logout.
- The server shall apply the agreed session termination policy.
- Deleting a JWT on the client does not by itself invalidate an already issued token. The server-side termination mechanism must be resolved under OD-01 before implementation.

### 3.3 Current User

The endpoint provides the authenticated user's identity and role for restoring frontend authentication state and rendering authorized features. Frontend role checks do not replace backend authorization.

## 4. Customer Endpoints

Related requirements: FR-02, FR-03, FR-04, FR-05; BR-07, BR-08.

| Method | URL | Description | Authorization | Expected Status Codes |
|---|---|---|---|---|
| GET | `/api/customers` | Retrieve a paginated customer list with search and archival filtering. | Both | 200, 400, 401, 403, 500 |
| GET | `/api/customers/{id}` | Retrieve the details of a specific customer. | Both | 200, 400, 401, 403, 404, 500 |
| POST | `/api/customers` | Create a new customer using validated input. | Both | 201, 400, 401, 403, 500 |
| PUT | `/api/customers/{id}` | Update the editable information of an existing customer. | Both | 200, 400, 401, 403, 404, 500 |
| PATCH | `/api/customers/{id}/archive` | Archive a customer while preserving existing quotations. | Admin | 204, 400, 401, 403, 404, 500 |

### 4.1 Get Customers

Proposed query parameters:

| Parameter | Type | Description |
|---|---|---|
| `search` | String | Search by customer name, company name, or email. |
| `isArchived` | Boolean | `true` selects archived customers; `false` selects active customers. |
| `page` | Integer | Requested page number. |
| `pageSize` | Integer | Number of records per page. |

The behavior when `isArchived` is omitted remains subject to OD-04. Search matching details and default ordering remain subject to OD-08. See Section 7.2 for a detailed example.

### 4.2 Get Customer Details

The endpoint returns the requested customer's information if the resource exists and is accessible. The customer details page shall retrieve the associated quotation history using `GET /api/quotations?customerId={id}` as proposed in the Requirements Specification traceability matrix. A separate history endpoint is not required for the initial release.

### 4.3 Create Customer

The backend shall validate the submitted fields, generate the identifier and creation timestamp, and initialize the new customer as non-archived. Successful creation returns `201 Created` with the created customer representation and a Location header. See Section 7.1.

A uniqueness-related `409 Conflict` is not currently defined because customer uniqueness rules are unresolved (OD-02). Add it if such rules are approved.

### 4.4 Update Customer

The request updates editable customer fields only. The customer identifier, creation timestamp, and archival state are not editable through this endpoint. Missing customers return `404 Not Found`.

Whether archived customers can be edited is unresolved (OD-04). If editing archived records is prohibited, the contract shall include the corresponding `409 Conflict` behavior.

### 4.5 Archive Customer

- Only administrators may archive customers.
- Archiving shall preserve the customer record and its associated quotation history.
- A successful archive returns `204 No Content`.
- A Sales Employee attempting to archive a customer receives `403 Forbidden`.
- Permanent deletion and restoration are not exposed by the current endpoint list.
- Repeated archive requests remain subject to OD-09; the proposed behavior is to return `204 No Content` when the customer is already archived, without creating another state change.

## 5. Quotation Endpoints

Related requirements: FR-02, FR-06, FR-07, FR-08, FR-09; BR-01 through BR-06 and BR-08.

| Method | URL | Description | Authorization | Expected Status Codes |
|---|---|---|---|---|
| GET | `/api/quotations` | Retrieve a paginated quotation list with search and filters. | Both | 200, 400, 401, 403, 500 |
| GET | `/api/quotations/{id}` | Retrieve a quotation and its line items. | Both | 200, 400, 401, 403, 404, 500 |
| POST | `/api/quotations` | Create a draft quotation and its initial line items. | Both | 201, 400, 401, 403, 404, 409, 500 |
| PUT | `/api/quotations/{id}` | Update the editable contents and line items of a draft quotation. | Both | 200, 400, 401, 403, 404, 409, 500 |
| PATCH | `/api/quotations/{id}/status` | Change a quotation status according to the state machine. | Both | 200, 400, 401, 403, 404, 409, 500 |

### 5.1 Get Quotations

Proposed query parameters:

| Parameter | Type | Description |
|---|---|---|
| `search` | String | Search by quotation reference number. |
| `status` | String | Filter by Draft, Sent, Accepted, or Rejected. |
| `customerId` | UUID | Filter by associated customer identifier. |
| `page` | Integer | Requested page number. |
| `pageSize` | Integer | Number of records per page. |

Example:

```http
GET /api/quotations?status=Accepted&page=1&pageSize=20
```

An invalid status or malformed query parameter returns `400 Bad Request`. Valid filters with no matching records return `200 OK` and an empty collection.

### 5.2 Get Quotation Details

Retrieve a quotation, its line items, status, reference number, customer association, and backend-calculated totals. The detailed response schema will be defined during quotation feature development.

### 5.3 Create Quotation

- A quotation may only be created for an existing, non-archived customer (BR-01).
- A missing customer results in `404 Not Found`; an archived customer results in `409 Conflict`.
- A new quotation shall have Draft status and a unique backend-generated reference number.
- An empty draft is permitted. Any submitted line item shall have a quantity greater than zero and a non-negative unit price.
- Invalid item data returns `400 Bad Request`.
- The backend calculates all monetary totals from validated inputs.
- Quotation and line-item persistence shall be atomic (NFR-06).
- Successful creation returns `201 Created` with the created representation and a Location header.

### 5.4 Update Draft Quotation

- Only Draft quotations may have their contents or line items modified.
- Adding, updating, and removing draft line items shall be supported through this endpoint; no separate item endpoints are required for the initial release.
- The backend shall recalculate totals and persist the changes atomically.
- Attempts to modify content in Sent, Accepted, or Rejected status return `409 Conflict`, leaving existing data unchanged.
- Reference number and status cannot be modified through this content update endpoint.
- The detailed line-item update semantics and customer reassignment policy will be finalized with the request schema. Editing existing drafts for archived customers remains subject to OD-04.

### 5.5 Change Quotation Status

Status changes shall follow the state machine in Section 5.1 of the Requirements Specification.

| Current Status | Target Status | Condition | Expected Result |
|---|---|---|---|
| Draft | Sent | At least one valid line item exists. | 200 OK |
| Draft | Sent | No line items exist. | 409 Conflict |
| Sent | Accepted | Authorized user records customer acceptance. | 200 OK |
| Sent | Rejected | Authorized user records customer rejection. | 200 OK |
| Any | Different, disallowed status | Transition is not permitted. | 409 Conflict |

An unrecognized status value returns `400 Bad Request`. Accepted and Rejected are terminal states for state-changing transitions. Repeated requests targeting the current state and concurrency behavior remain subject to OD-09.

Changing a quotation to Sent records its status and locks its content; it does not trigger automatic email delivery. Sending an existing draft associated with a subsequently archived customer remains subject to OD-04.

## 6. Dashboard Endpoints

Related requirements: FR-02, FR-10.

| Method | URL | Description | Authorization | Expected Status Codes |
|---|---|---|---|---|
| GET | `/api/dashboard/summary` | Retrieve aggregated customer and quotation statistics and a sales activity overview. | Both | 200, 401, 403, 500 |

The backend shall aggregate the data required by the dashboard rather than returning all customer and quotation records for client-side calculation.

The response shall support customer counts, quotation counts, quotation status distribution, aggregated quotation values, and a sales activity overview. Empty datasets shall yield appropriate zero-value or empty results. Quotation values shall not be presented as collected revenue.

Metric definitions, inclusion of archived customers and quotation statuses, aggregation periods, and the detailed response schema remain subject to OD-07.

## 7. Request and Response Examples

The examples below define the proposed initial customer payload shapes. All sample data is illustrative. Detailed validation and nullability rules remain subject to OD-02.

### 7.1 Create Customer

**Method:** POST  
**URL:** `/api/customers`  
**Authorization:** Both  
**Related Requirements:** FR-03, NFR-01, NFR-07

#### Request

```http
POST /api/customers
Content-Type: application/json
Authorization: Bearer <access-token>
```

```json
{
  "name": "Ahmet Yılmaz",
  "companyName": "Example Software",
  "email": "ahmet@example.com",
  "phone": "+905551234567"
}
```

| Field | JSON Type | Description |
|---|---|---|
| `name` | String | Customer name. |
| `companyName` | String | Customer company name. |
| `email` | String | Customer email address. |
| `phone` | String | Customer phone number. |

The backend shall validate the submitted data independently of frontend validation. The request does not control `id`, `isArchived`, or `createdAt`.

#### Response — 201 Created

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/customers/e2a3c15d-62e1-4a72-a31d-30ea487d6201
```

```json
{
  "id": "e2a3c15d-62e1-4a72-a31d-30ea487d6201",
  "name": "Ahmet Yılmaz",
  "companyName": "Example Software",
  "email": "ahmet@example.com",
  "phone": "+905551234567",
  "isArchived": false,
  "createdAt": "2026-11-24T10:00:00Z"
}
```

| Field | JSON Type | Description |
|---|---|---|
| `id` | String (UUID) | Backend-generated customer identifier. |
| `name` | String | Customer name. |
| `companyName` | String | Customer company name. |
| `email` | String | Customer email address. |
| `phone` | String | Customer phone number. |
| `isArchived` | Boolean | Customer archival state; initially false. |
| `createdAt` | String (UTC timestamp) | Backend-generated creation timestamp. |

#### Expected Status Codes

| Code | Condition |
|---|---|
| 201 | Customer created successfully. |
| 400 | Request data is invalid. |
| 401 | Authentication is missing or invalid. |
| 403 | The user lacks the required permission. |
| 500 | An unexpected server error occurs. |

### 7.2 Get Customers

**Method:** GET  
**URL:** `/api/customers`  
**Authorization:** Both  
**Related Requirements:** FR-03, FR-04, NFR-02

#### Request

```http
GET /api/customers?search=Ahmet&isArchived=false&page=1&pageSize=20
Authorization: Bearer <access-token>
```

No request body is required.

#### Response — 200 OK

```json
{
  "items": [
    {
      "id": "e2a3c15d-62e1-4a72-a31d-30ea487d6201",
      "name": "Ahmet Yılmaz",
      "companyName": "Example Software",
      "email": "ahmet@example.com",
      "phone": "+905551234567",
      "isArchived": false,
      "createdAt": "2026-11-24T10:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1
}
```

| Field | JSON Type | Description |
|---|---|---|
| `items` | Array | Customer records returned for the requested page. |
| `page` | Integer | Requested page number. |
| `pageSize` | Integer | Page size used for the request. |
| `totalCount` | Integer | Total accessible records matching the search and filters. |
| `totalPages` | Integer | Total pages calculated from totalCount and pageSize. |

#### Response — 200 OK (Empty Result)

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalCount": 0,
  "totalPages": 0
}
```

An empty list is a successful query, not a missing resource error.

#### Expected Status Codes

| Code | Condition |
|---|---|
| 200 | Customer list returned, including empty results. |
| 400 | A query parameter is invalid. |
| 401 | Authentication is missing or invalid. |
| 403 | The user lacks the required permission. |
| 500 | An unexpected server error occurs. |

## 8. HTTP Status Codes

| Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful retrieval, login, content update, or status update. |
| 201 | Created | A customer or quotation was created. |
| 204 | No Content | Successful logout or archiving without a response body. |
| 400 | Bad Request | Invalid input, malformed identifiers, or invalid query parameters. |
| 401 | Unauthorized | Valid authentication is missing. |
| 403 | Forbidden | The authenticated user does not have the required permission. |
| 404 | Not Found | A requested resource or required referenced customer does not exist. |
| 409 | Conflict | The requested operation conflicts with the resource state or a business rule. |
| 500 | Internal Server Error | An unexpected server-side error occurred. |

Malformed UUIDs in ID routes are documented as `400`; ASP.NET Core routing/model-binding configuration must be aligned with this proposed behavior, since a route constraint may otherwise produce `404`.

## 9. Integration and Consistency Review

The frontend may use mock responses conforming to the customer examples while the backend is under development. Detailed contracts shall be agreed before implementing each remaining feature. The backend's OpenAPI description shall be maintained in alignment with the approved contracts once implemented.

| Requirement | Contract Coverage |
|---|---|
| FR-01, FR-02 | Authentication endpoints and authorization conventions. |
| FR-03, FR-04 | Customer endpoints, customer examples, and quotation history filtering. |
| FR-05 | Admin-only archive endpoint; associated quotations preserved. |
| FR-06, FR-07, FR-08 | Quotation list, detail, creation and draft-update endpoints; backend-authoritative calculations. |
| FR-09 | Quotation status endpoint and state-transition rules. |
| FR-10 | Dashboard summary endpoint. |
| FR-11–FR-14 | Deferred or optional; no current endpoint contracts. |

### 9.1 Open Decisions

Unresolved decisions are tracked in Section 8 of [requirements.md](requirements.md). In particular, the affected API contracts must be finalized before implementing authentication/session management (OD-01), customer validation (OD-02), record-level access (OD-03), archival behavior (OD-04), reference numbering (OD-05), financial calculations (OD-06), dashboard metrics (OD-07), API conventions (OD-08), and repeated requests/concurrency (OD-09). Optional feature contracts, performance testing details, and initial account provisioning remain tracked under OD-10 through OD-12.

### 9.2 Review Checklist

- [ ] All 14 required endpoints are documented with method, URL, description, authorization, and expected status codes.
- [ ] Authorization rules match the permission matrix in the Requirements Specification.
- [ ] Quotation state changes and content updates match the defined business rules.
- [ ] Customer archiving preserves quotation history and is restricted to Admin.
- [ ] Customer creation and list examples use consistent field names and types.
- [ ] Pagination matches NFR-02 and empty lists return 200.
- [ ] Deferred features and unresolved decisions are explicitly identified.
- [ ] The proposed API contract is reviewed and approved before implementing affected features.

This document is a preliminary specification. It does not claim that the endpoints are implemented, tested, or deployed.

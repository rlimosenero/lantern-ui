# API CONTRACT

## Fund Transfer API

Transfers funds from a source account to one or more beneficiary accounts.

---

# 1. API OVERVIEW

| Property | Value |
|-----------|-----------|
| API Name | Fund Transfer API |
| Description | Allows a client application to transfer funds from a source account to one or more beneficiary accounts |
| Application Name | digitalBanking |
| API Version | 2.3.1 |
| Web Service Type | REST |
| HTTP Method | POST |
| Lifecycle Status | ACTIVE |
| Exposure | Internal-Only |
| Accessed Via Gateway | YES |

---

# 2. OWNERSHIP & SUPPORT

| Property | Value |
|-----------|-----------|
| Business Owner | Retail Banking |
| Technical Owner | Payments Squad |
| BAU Support Team | Enterprise Middleware Team |

---

# 3. ENDPOINT

## v2/digitalBanking/fund-transfer

---

# 4. SECURITY & ACCESS CONTROL

| Property | Value |
|-----------|-----------|
| Authentication Method | BEARER TOKEN |
| Authorization Role | ROLE_FUND_TRANSFER |
| Request Encryption | TLS 1.3 |
| Response Encryption | TLS 1.3 |
| Data Classification (Request) | Financial Data |
| Data Classification (Response) | Financial Data |

---

# 5. OPERATIONAL CHARACTERISTICS

| Property | Value |
|-----------|-----------|
| Average Request Size | 2 KB |
| Maximum Request Size | 20 KB |
| Average Response Size | 1 KB |
| Maximum Response Size | 5 KB |
| Request Data Logged | YES |
| Response Data Logged | YES |
| Request Data Cached | NO |
| Response Data Cached | NO |
| Duplicate Request Allowed | NO |
| Request Throttling Supported | YES |
| Rate Limit | 500 Requests / Minute / Client |

---

# 6. REQUEST FIELDS

| Field | Type | Required | Description |
|---------|---------|---------|---------|
| transactionReference | String | Yes | Unique transaction reference |
| customerId | String | Yes | Customer Identifier |
| debitAccountNumber | String | Yes | Source account number |
| totalAmount | Decimal | Yes | Total transfer amount |
| currency | String | Yes | Transaction currency |
| creditAccounts | Array<Object> | Yes | Beneficiary list |
| creditAccounts[].sequenceNo | Integer | Yes | Sequence number |
| creditAccounts[].bankCode | String | Yes | Destination bank |
| creditAccounts[].accountNumber | String | Yes | Beneficiary account |
| creditAccounts[].amount | Decimal | Yes | Transfer amount |
| creditAccounts[].remarks | String | No | Remarks |

---

# 7. REQUEST SCENARIO(S)

## Scenario 1 - Internal Transfer

Payload:
```json
{
  "transactionReference": "FT-20260924-001",
  "customerId": "CUST-10001",
  "debitAccountNumber": "1234567890",
  "totalAmount": 1000.00,
  "currency": "PHP",
  "creditAccounts": [
    {
      "sequenceNo": 1,
      "bankCode": "BPI",
      "accountNumber": "1111111111",
      "amount": 1000.00,
      "remarks": "Own Account Transfer"
    }
  ]
}
```

## Scenario 2 - Bulk Payroll Transfer

Payload:
```json
{
  "transactionReference": "FT-20260924-002",
  "customerId": "CORP-10001",
  "debitAccountNumber": "8888888888",
  "totalAmount": 150000.00,
  "currency": "PHP",
  "creditAccounts": [
    {
      "sequenceNo": 1,
      "bankCode": "BPI",
      "accountNumber": "1111111111",
      "amount": 50000.00,
      "remarks": "Employee Payroll"
    },
    {
      "sequenceNo": 2,
      "bankCode": "BPI",
      "accountNumber": "2222222222",
      "amount": 50000.00,
      "remarks": "Employee Payroll"
    },
    {
      "sequenceNo": 3,
      "bankCode": "BPI",
      "accountNumber": "3333333333",
      "amount": 50000.00,
      "remarks": "Employee Payroll"
    }
  ]
}
```

---

# 8. RESPONSE FIELDS

| Field | Type | Required | Description |
|---------|---------|---------|---------|
| responseCode | String | Yes | Business response code |
| responseMessage | String | Yes | Business response message |
| transactionReference | String | Yes | Original transaction reference |
| status | String | Yes | SUCCESS / FAILED / PENDING |
| processedDate | Timestamp | Yes | Processing timestamp |
| referenceNumber | String | No | Bank reference number |

---

# 9. RESPONSE SCENARIO(S)

## Scenario 1 - Success
Payload:
```json
{
  "responseCode": "SUC-001",
  "responseMessage": "Transfer Successful",
  "transactionReference": "FT-20260924-002",
  "status": "SUCCESS",
  "processedDate": "2026-09-24T15:23:45+08:00",
  "referenceNumber": "BPI-8291029192"
}
```

## Scenario 2 - Insufficient Balance
Payload:
```json
{
  "responseCode": "ERR-101",
  "responseMessage": "Insufficient Balance",
  "transactionReference": "FT-20260924-002",
  "status": "FAILED"
}
```

## Scenario 3 - System Error
Payload:
```json
{
  "responseCode": "SYS-001",
  "responseMessage": "System Temporarily Unavailable",
  "status": "FAILED"
}
```

---

# 10. RESPONSE CODES

| HTTP Code | Business Code | Type | Message | Suggested Action |
|------------|------------|------------|------------|------------|
| 200 | SUC-001 | Success | Transfer Successful | None |
| 400 | ERR-101 | Client Error | Insufficient Balance | Verify account balance |
| 404 | ERR-404 | Client Error | Account Not Found | Validate account number |
| 500 | SYS-001 | Server Error | System Temporarily Unavailable | Retry later |

---

# 11. CONSUMER APPLICATIONS

| Application | Relationship | Trigger | Status | Business Owner | Technical Owner
|------------|------------|------------|------------|------------|------------|
| Mobile Banking | Internal Application | User-Initiated Action | Active | BPI | Abdulhamid
| Corporate Banking Portal | Internal Application | User-Initiated Action | Active | BPI | Rey 

---

# 12. UPSTREAM APPLICATIONS

| Application | Description | Business Owner | Technical Owner
|------------|------------|------------|------------|
| Core Banking System | Validate Accounts | BPI | Abdulhamid
| Customer Information System | Customer Validation | BPI | Rey 
| AML Screening Service | Compliance Checking | BPI | Bles

---

# 13. CHANGE HISTORY

| Version | Date | Description |
|-----------|-----------|-----------|
| 2.3.1 | 2026-09-24 | Added bulk transfer support |
| 2.2.0 | 2026-06-15 | Added AML screening |
| 2.0.0 | 2026-01-10 | Initial Production Release |

---

# 14. SUPPORTING DOCUMENTS

| Type | URL |
|--------|--------|
| SharePoint | https://sharepoint.bank.com/fund-transfer |
| Git Repository | https://git.bank.com/fund-transfer |
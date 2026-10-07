# Security Specification: TechJourney AI

## 1. Data Invariants

1. **User Identity Isolation**: A learner can only create, read, update, or delete documents inside their own user tree (`/users/{userId}/**`). Cross-tenant reads and writes are strictly forbidden.
2. **Author Integrity**: In all subcollections, incoming documents must have `userId == request.auth.uid`.
3. **Role & Admin Guard**: Only the designated system administrator (`enginnerboy079@gmail.com`) can read `/systemActivities` or inspect cross-user records.
4. **Denial of Wallet Protection**: All string fields are constrained with bounded length limits (`.size() <= MAX`).
5. **No Blind Blanket Reads**: All read and list rules evaluate `request.auth.uid == userId` or `isAdmin()`.
6. **State Integrity**: Daily plans, problem attempts, and quiz attempts enforce valid schemas and field sets.

---

## 2. The "Dirty Dozen" Threat Payloads (Must be DENIED)

1. **Cross-User Profile Hijack**: Unauthenticated or user `alice` writing to `/users/bob` (Violates Identity Isolation).
2. **Subcollection Spoofing**: User `alice` writing `{ userId: "bob", ... }` inside `/users/alice/problemAttempts/p1` (Violates Author Integrity).
3. **Ghost Fields Injection**: Sending `{ uid: "alice", name: "Alice", isSuperAdmin: true }` (Violates Strict Schema).
4. **Unbounded Payload Injection**: Sending a 500KB string in `preferredLanguage` or `code` over size limit (Denial of Wallet).
5. **Unauthenticated List Extraction**: Anonymous request attempting to list all `/users` (Blanket Read violation).
6. **Malicious Document ID**: Attempting to write with ID containing traversal or injection characters like `../secret` (ID Poisoning).
7. **Direct System Log Tampering**: Regular authenticated user writing fake records into `/systemActivities` (Admin Role Violation).
8. **Negative Study Time**: Writing `{ totalMinutes: -9999 }` in a daily plan (Integrity Violation).
9. **Invalid Classification Tamper**: Writing `{ classification: "Hacked" }` when enum only allows `Correct`, `Almost correct`, `Needs improvement`, `Incorrect`.
10. **Orphaned Sub-Resource**: Attempting to write subcollection items without an authenticated session.
11. **Admin Email Spoof**: Request with email `enginnerboy079@gmail.com` but `email_verified == false`.
12. **Cross-User Memory Snooping**: User `bob` querying `/users/alice/aiMemory` to extract Alice's quiz mistakes and weaknesses.

---

## 3. Rules Verification Plan
The security rules in `firestore.rules` will strictly enforce:
- Helper functions: `isSignedIn()`, `isOwner(userId)`, `isAdmin()`, `isValidId(id)`.
- Rejection of unverified users or mismatched identities.
- Admin escape hatch specifically for the developer email with verification.

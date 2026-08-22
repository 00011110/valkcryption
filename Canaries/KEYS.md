# Canary signing keys

| Name | Fingerprint | Identity | Role |
|------|-------------|----------|------|
| Canary-Old | `3886 F99F 6DDD E700 7E38  3F4F CF32 7F2B 6A03 A323` | valk (00011110) / valkyrie | July 2026 + this transition nest signature. Retired for future monthly canaries. Not declared compromised. |
| Canary-New | `772D 8ED6 12EA 5C88 C4E7  16EA ADBF 17B4 6FB1 D0FF` | valk / valkyrie (00011110) | Current monthly canary signing key after 2026-08-22. Signs the document first. |

Verify: `.asc-new` over the `.md`, then `.nest.asc-old` over the `.nest`.

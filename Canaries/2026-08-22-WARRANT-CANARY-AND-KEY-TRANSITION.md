# Valkcryption Warrant Canary + Canary-Signing Key Transition

**Statement date:** August 21, 2026 (Central Time)  
**Published:** August 22, 2026, no more than two and a half hours after midnight Central Time (late relative to the statement date)  
**Next expected canary update:** On or before September 21, 2026 (Central Time, monthly cadence)  

**Canary status: ALIVE**

This file is actively maintained. Regular updates prove no gag order prevents disclosure. If it goes more than 45 days without update (or disappears), assume the canary is dead — treat all Valkcryption instances with heightened paranoia.

---

## Why there are two keys on this page (plain English)

This is an **operational key transition** for warrant-canary signing going forward.

- The July 2026 canary introduced signing key **Canary-Old** (fingerprint below).
- I am **retiring Canary-Old for future monthly canaries**.
- Successor signing key is **Canary-New** (fingerprint below).
- **Canary-Old is not being declared compromised.** I am not claiming a secret-key breach. This is process hygiene: establish a long-term canary-signing key, document the handoff in public, and keep history verifiable.
- **Continuity:** Canary-New signs this document. Canary-Old then signs a **nest** of (this document + Canary-New's signature), so the old key explicitly endorses the new signature (same operator; continuity of control).
- **History:** July 2026 remains verifiable with Canary-Old. This transition remains verifiable with both. Future monthly canaries will be signed with **Canary-New only**.

---

## Freshness proof

- Date on statement: August 21, 2026 (Central Time)
- Publication note: Published no more than two and a half hours after midnight Central Time on 8/22/2026 (late vs the August 21 statement date).
- **Cryptographic time anchor** (not a price quote): Bitcoin block **963549**, block hash `000000000000000000014a7a8cbe1d7bc7cbc4753e5cf7233fd8d2921e0aba79` (checked ~2026-08-22T07:13:10.745917+00:00; cross-checked via mempool.space + blockchain.info). Anyone can look up that height/hash on a block explorer to confirm this statement was authored after that block existed.
- **Secondary beacon:** drand (League of Entropy) chain `52db9ba7…e971`, round **31526475**, randomness `7f323729eb1e1401cabbd4c6afd5255e8bbc3da5b66cc1e227176fc50ded2d59`.
- Domain ownership note: I control and am the registered owner of www.valkcryption.com

---

## Core canary statement

As of the statement date above, to the best of my knowledge as **creator and maintainer** of Valkcryption (github.com/00011110/valkcryption) and owner of www.valkcryption.com:

- Never received any National Security Letters (NSLs), FISA Court orders, subpoenas, warrants, or other legal process (secret or otherwise) requiring disclosure of user data, decryption assistance, backdoors, source modifications, server access, logs, or user-generated content from Valkcryption instances or associated domains.
- Never been compelled (directly or indirectly) to install, modify, or enable any surveillance software, hardware, backdoors, logging, or weakened encryption in Valkcryption, its infrastructure, or www.valkcryption.com services.
- Never turned over, modified, or provided access to any encryption keys, user pastes, metadata, or communications to any third party (government or private).*
- No physical or digital searches/seizures of hardware, repositories, domains, or infrastructure running Valkcryption have occurred that would compromise user privacy.
- Valkcryption has zero built-in logging of user content/IPs by default (E2E design). No requests to add such capabilities have been received.**
- I have not received any gag orders or process that would prohibit updating this canary.

This canary covers the Valkcryption project, GitHub repository, www.valkcryption.com domain, and my involvement as creator/maintainer/owner. It does not cover third-party forks or independent user instances.

**If the canary dies:** I will be unable to explain why. Self-host aggressively and verify everything.

— valkyrie (00011110), creator, maintainer & domain owner

---

## Asterisks / what is not turned off

\* “Never turned over … metadata … to any third party” does **not** mean Cloudflare is blind. www.valkcryption.com is fronted by a **Cloudflare Tunnel**. I do not operate Cloudflare's infrastructure. Cloudflare also publishes its own transparency / warrant-canary style statements (see [cloudflare.com/transparency](https://www.cloudflare.com/transparency/)). This Valkcryption canary does **not** speak for Cloudflare; if you care about the tunnel path, watch **both** canaries.

**About `#m=` (important):** Valkcryption paste links put the message payload in the URL **fragment**: `/p#m=…`. Browsers **do not send** the `#…` fragment to the server (or to Cloudflare) when requesting the page. That `#m=` value is a base64url encoding of a small JSON object that carries the **message ciphertext** (`c`) and the **sender's public key** (`s`) needed for the recipient's browser to decrypt — i.e. the ciphertext and the public key material bound into that paste link. It does **not** contain private keys or plaintext. Private keys stay in the user's browser (IndexedDB). Prefer `#m=` links; the `?m=` query fallback **does** hit servers/proxies and should be avoided.

\*\* Logging after operator hardening (in effect for this canary): logging under my control that is not needed for basic monthly visitor counts is turned off. **What still gets logged / observed:**
  - **Kept on purpose:** aggregate **monthly site-visitor / traffic analytics** in Cloudflare (zone traffic analytics present; rough volume only — not message content, not paste bodies, not private keys).
  - **Cannot fully turn off while using Cloudflare Tunnel:** Cloudflare's edge still processes connection/request metadata as part of proxying (typically client IP, host, path, query string, timing, standard edge fields). This is inherent to the tunnel/CDN path; it is not an origin app log I retain. Path/query metadata does **not** include `#m=` fragments.
  - **Off under my control (verified where noted):** Cloudflare **Logpush** has **no jobs** on this zone and no jobs on the account (API-verified empty). Origin app access logs of user content/IPs: none by design. I do not leave live tunnel log streams (`cloudflared tail` / dashboard live logs) running as a standing practice. Other optional CF log-export products: not configured.

Analytics and unavoidable edge metadata are not message plaintext and are not a substitute for a warrant canary dying.

---

## Key legend (keep this)

| Name | Fingerprint | Status | What to use it for |
|------|-------------|--------|--------------------|
| **Canary-Old** | `3886 F99F 6DDD E700 7E38  3F4F CF32 7F2B 6A03 A323` | **Retired for future monthly canaries** | Verify the July 2026 canary; verify **this** transition (old signature over the nest). |
| **Canary-New** | `772D 8ED6 12EA 5C88 C4E7  16EA ADBF 17B4 6FB1 D0FF` | **Current canary-signing key** | Verify **this** transition (new signature over the document); verify all canaries after this transition. |

Fingerprints above use normal OpenPGP display grouping (groups of 4 hex digits, with a wider gap in the middle). That wider gap is standard formatting, not missing data.

How to verify (nested handoff — continuity of the same operator):

1. **Canary-New** signs this markdown document.
2. **Canary-Old** signs a nest file that contains **this document plus Canary-New's signature**, so the old key explicitly endorses the new signature (continuity).

```bash
gpg --import 2026-08-22-canary-OLD.asc
gpg --import 2026-08-22-canary-NEW.asc

gpg --verify 2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.md.asc-new \
            2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.md

gpg --verify 2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.nest.asc-old \
            2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.nest
```

Both must be good. Canary-New proves control of the new secret. Canary-Old's signature over the nest is the continuity link: the prior canary key endorsing Canary-New's signature.

---

## Public keys

For clean copy/paste, use the raw files [`2026-08-22-canary-OLD.asc`](2026-08-22-canary-OLD.asc) and [`2026-08-22-canary-NEW.asc`](2026-08-22-canary-NEW.asc) in this folder.


### Canary-Old (July 2026; retired for future monthly canaries)

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: User ID:	valk (00011110) <00011110@valkcryption.com>
Comment: Valid from:	7/22/2026 1:57 PM
Comment: Valid until:	7/22/2042 12:00 PM
Comment: Type:	255-bit EdDSA
Comment: Usage:	Signing, Encryption, Certifying User IDs
Comment: Fingerprint:	3886 F99F 6DDD E700 7E38  3F4F CF32 7F2B 6A03 A323


mDMEamEShhYJKwYBBAHaRw8BAQdAqgLWO1fpJkgfiKtjDKpNu/Ssc1gPMxuQNyET
RSqlgV+0K3ZhbGsgKDAwMDExMTEwKSA8MDAwMTExMTBAdmFsa2NyeXB0aW9uLmNv
bT6ItQQTFgoAXRYhBDiG+Z9t3ecAfjg/T88yfytqA6MjBQJqYRKGGxSAAAAAAAQA
Dm1hbnUyLDIuNSsxLjEyLDIsMQIbAwUJHhhiigULCQgHAgIiAgYVCgkICwIEFgID
AQIeBwIXgAAKCRDPMn8ragOjI/O0AP9yeOi4AqtvuYv6uG0TOcWwzbwtAeh6td/0
VEZP6cjfmQEA5VHqIHEeoW4Gi5deubacr5q2WjQ82u7Wy3Kb3XLC7Qi4OARqYRKG
EgorBgEEAZdVAQUBAQdA3Xlsvn9vxoI8+heOWTqjJ82JRUwb4GWewZ41dcws5jED
AQgHiJoEGBYKAEIWIQQ4hvmfbd3nAH44P0/PMn8ragOjIwUCamEShhsUgAAAAAAE
AA5tYW51MiwyLjUrMS4xMiwyLDECGwwFCR4YYooACgkQzzJ/K2oDoyPJSAD/a+1c
19nGzVftjlwkZutgEttzen4m8xEglExtHmu1N7sBAOmDuVKCDSJBdhp707r4qn9x
PjFtl2SxlUdK3Lbqu98F
=PaEe
-----END PGP PUBLIC KEY BLOCK-----
```

### Canary-New (current going forward) — valk / valkyrie (00011110)

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: User ID: valk (00011110 canary-20260822T071258Z) <00011110@valkcryption.com>
Comment: Also known as / operator: valkyrie (00011110)
Comment: Valid from: 8/22/2026
Comment: Valid until: 8/18/2042
Comment: Type: 255-bit EdDSA
Comment: Usage: Signing, Certifying User IDs
Comment: Fingerprint: 772D 8ED6 12EA 5C88 C4E7  16EA ADBF 17B4 6FB1 D0FF
Comment: Role: Canary-New - current Valkcryption warrant-canary signing key

mDMEaolL+hYJKwYBBAHaRw8BAQdAmVosYiPi/2hp43hrcvrAKrxjj3s7OMK9dtLm
m/kMjX60Q3ZhbGsgKDAwMDExMTEwIGNhbmFyeS0yMDI2MDgyMlQwNzEyNThaKSA8
MDAwMTExMTBAdmFsa2NyeXB0aW9uLmNvbT6IlgQTFgoAPhYhBHctjtYS6lyIxOcW
6q2/F7RvsdD/BQJqiUv6AhsDBQkeEzgABQsJCAcCBhUKCQgLAgQWAgMBAh4BAheA
AAoJEK2/F7RvsdD/i+gBANzDELtw/Fwg6JZzHlXDLmnkjt1PjHkbs755zEIEXsCL
AQDlCwO403z+5mlAzMpx7XYU5hXu1uf+t5YDqSPwA7xMDA==
=sSaK
-----END PGP PUBLIC KEY BLOCK-----
```


# Valkcryption Warrant Canary

**Statement instant:** October 23, 2026, 12:55:45 Central Time (CDT, UTC−05:00) = 2026-10-23 17:55:45 UTC
**Published:** October 23, 2026 (Central Time), the same afternoon, after that instant
**Next expected canary update:** On or before November 22, 2026 (Central Time, monthly cadence)

The September 22, 2026 canary named October 22, 2026 as the expected update date. This statement is dated October 23, 2026, one day after that named date. The canary was not withdrawn. If a canary goes more than 45 days without update (measured from the previous canary's publication), or disappears, assume it is dead.

**Canary status: ALIVE**

This file is actively maintained. Regular updates prove no gag order prevents disclosure. If it goes more than 45 days without update (or disappears), assume the canary is dead — treat all Valkcryption instances with heightened paranoia.

**Signing key:** Canary-New only, fingerprint `772D 8ED6 12EA 5C88 C4E7  16EA ADBF 17B4 6FB1 D0FF`. The August 22, 2026 transition said future monthly canaries are signed with Canary-New alone. Canary-Old does not sign this file.

---

## Freshness proof

Public numbers below are the values current at **2026-10-23 12:55:45 CDT** (unix 1792778145).

- **Cryptographic time anchor** (not a price quote): Bitcoin block **972811**, block hash `00000000000000000001d5fb660c791a6c99a2aed24efd63afa931116170744f`, header timestamp 2026-10-23T17:49:31Z (unix 1792777771). At 2026-10-23T17:55:45Z this block was the chain tip. Cross-checked via mempool.space, blockstream.info, and blockchain.info. Status at that check showed `next_best: null` (no successor yet).
- **Secondary beacon:** drand quicknet (League of Entropy), chain `52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971`, round **33324927**, randomness `38ef841f7daf20e59b9689566369085cd39590cadac549530cc6b724d36892e4`. Round time is genesis `1692803367` + (33324927 − 1) × 3 = unix `1792778145` = 2026-10-23 17:55:45 UTC. The same randomness was returned by `drand.cloudflare.com`, `api.drand.sh`, and `api2.drand.sh`.
- **Spot price notes** (informational only; not the time anchor): near the statement instant, CoinGecko reported Bitcoin about **USD 81,503** and Monero about **USD 595.17** (`last_updated_at` within a few seconds of unix 1792778145). blockchain.info ticker last for BTC-USD was **81,471.86**. These are ordinary market quotes and can move; the block hash and drand round above are the freshness proof.
- Domain ownership note: I control and am the registered owner of www.valkcryption.com

---

## Core canary statement

As of the statement instant above, to the best of my knowledge as **creator and maintainer** of Valkcryption (github.com/00011110/valkcryption) and owner of www.valkcryption.com:

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

\*\* Logging (standing configuration, carried forward from the 2026-08-22 canary; this October statement does not record a new Cloudflare API check): logging under my control that is not needed for basic monthly visitor counts is turned off. **What still gets logged / observed:**
  - **Kept on purpose:** aggregate **monthly site-visitor / traffic analytics** in Cloudflare (zone traffic analytics present; rough volume only — not message content, not paste bodies, not private keys).
  - **Cannot fully turn off while using Cloudflare Tunnel:** Cloudflare's edge still processes connection/request metadata as part of proxying (typically client IP, host, path, query string, timing, standard edge fields). This is inherent to the tunnel/CDN path; it is not an origin app log I retain. Path/query metadata does **not** include `#m=` fragments.
  - **Off under my control (as stated 2026-08-22):** Cloudflare **Logpush** had **no jobs** on this zone and no jobs on the account at that canary (API-verified then). Origin app access logs of user content/IPs: none by design. I do not leave live tunnel log streams (`cloudflared tail` / dashboard live logs) running as a standing practice. Other optional CF log-export products: not configured.

Analytics and unavoidable edge metadata are not message plaintext and are not a substitute for a warrant canary dying.

---

## Verify

Canary-New signs this file. Public key: [`2026-08-22-canary-NEW.asc`](2026-08-22-canary-NEW.asc).

```bash
gpg --import 2026-08-22-canary-NEW.asc
gpg --verify 2026-10-23-WARRANT-CANARY.md.asc \
            2026-10-23-WARRANT-CANARY.md
```

The signature must be good, and the fingerprint must be `772D 8ED6 12EA 5C88 C4E7  16EA ADBF 17B4 6FB1 D0FF`.

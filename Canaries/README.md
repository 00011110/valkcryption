# Warrant canaries

Monthly statements for Valkcryption, with OpenPGP signatures.

## Current (2026-09-22)

See `2026-09-22-WARRANT-CANARY.md` plus `2026-09-22-WARRANT-CANARY.md.asc` (Canary-New only).

```bash
gpg --import 2026-08-22-canary-NEW.asc
gpg --verify 2026-09-22-WARRANT-CANARY.md.asc \
            2026-09-22-WARRANT-CANARY.md
```

## August 2026 transition (nested handoff)

See `2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.md` plus `.asc-new`, `.nest`, and `.nest.asc-old`.

```bash
gpg --import 2026-08-22-canary-OLD.asc 2026-08-22-canary-NEW.asc
gpg --verify 2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.md.asc-new \
            2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.md
gpg --verify 2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.nest.asc-old \
            2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.nest
```

## History

- `2026-09-22-WARRANT-CANARY.md` — September canary (Canary-New)
- `2026-08-22-WARRANT-CANARY-AND-KEY-TRANSITION.md` — August canary and Canary-Old → Canary-New handoff
- `2026-07-22-WARRANT-CANARY.md` — first canary (Canary-Old)

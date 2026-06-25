# Footer ads (humble, silent)

## Rules built into the site

- **No video or audio** — only static images and/or text.
- **Footer only** — not fixed over content; does not block the UI.
- **10 second** slide interval (configurable).
- Hidden when `enabled: false` or `slots` is empty.

## Enable later

Edit `public/ads.json`:

```json
{
  "enabled": true,
  "intervalMs": 10000,
  "label": "Sponsor",
  "slots": [
    {
      "text": "Your product — short line only",
      "href": "https://example.com",
      "image": "/ads/example.png",
      "alt": "Example"
    }
  ]
}
```

Put images in `public/ads/` (e.g. `public/ads/example.png`).

Reload the site — no server restart needed for JSON changes (browsers cache; use hard refresh).

## Privacy

Disclose sponsors in `public/privacy.html` when you turn ads on.
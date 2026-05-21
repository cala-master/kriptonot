# Marker Format

Valid marker shape:

```text
[[masked:fragment-id]]
```

Rules:

- prefix must be `[[masked:`
- identifier must use lowercase letters, digits, or hyphens
- marker must end with `]]`
- malformed markers must be rejected by validation and tests

# Nasaq MCP — 1.3

Requirements: Python 3.10+. No extra dependencies, network, or API key required. Local read-only stdio MCP server. Supports protocol versions 2025-06-18, 2025-03-26, 2024-11-05. It is not a hosted HTTP endpoint.

Unzip nasaq-mcp.zip. Add the absolute server.py path to your MCP client's stdio server configuration. Generic JSON example (some clients use other formats):

```json
{"mcpServers":{"nasaq":{"command":"python3","args":["/ABSOLUTE/PATH/nasaq-mcp/server.py"]}}}
```

Reload your client. Ask it to search Nasaq for switch, get_component(id="switch"), and get_tokens(prefix="component.switch"). The client launches the process and exchanges JSON-RPC on stdin/stdout. Running server.py by itself waits for protocol messages; it does not start a webpage.

Tools: search_nasaq, get_component, get_tokens, get_pattern, get_guidelines, get_asset. Resources: nasaq://tokens, nasaq://catalog, nasaq://skill, nasaq://brand, nasaq://motion. Prompt: apply_nasaq(task). Asset names are allowlisted; no arbitrary file paths are accepted. All tools are read-only. Binary fonts are returned as local metadata/path; SVG and CSS as text.

Source specification: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
Local protocol validation: python3 test_server.py. Full project checks: python3 scripts/verify.py from Nasaq.

Expanded data: 2,130 Lucide SVG assets and metadata, 88 shade tokens, 38 typography composites, motion/interaction tokens and motion/typography/colors guidelines. Get assets by allowlisted name, e.g. lucide/search.svg. Retain assets/lucide/LICENSE when redistributing icons.

Bilingual catalogs: language=en on get_component, get_pattern and search_nasaq retrieves English; Arabic is the default. Resource nasaq://catalog-en exposes the English catalog. type-en.* uses Inter, type.* uses Almarai. Keep both font license notices.

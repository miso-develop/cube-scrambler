```mermaid
---
Runner State
---
stateDiagram-v2

[*] --> Waiting

Waiting --> Running: Web UI
Waiting --> Running: CLI
Waiting --> Running: onbutton

Running --> Waiting: run result = true
Running --> Stopping: onbutton

Stopping --> Waiting: run result = false

```

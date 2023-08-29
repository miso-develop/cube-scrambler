```mermaid
---
Device State
---
stateDiagram-v2

[*] --> connecting: init

connecting --> connected

connected --> disconnect: device off

disconnect --> connecting

```

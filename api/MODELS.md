```mermaid
---
title: Database Structure
---
erDiagram
    NOTE }o--|| TASK : linked_to
    NOTE {
        uuid id PK
        varchar(100) title
        text description
        blob cover
    }
    TASK {
        uuid id PK
        varchar(255) label
        bool completed
    }
```

Will be updated
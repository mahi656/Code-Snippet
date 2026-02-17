```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Server
    participant Database

    User->>Frontend: Create/Edit Snippet
    Frontend->>Server: API Request
    Server->>Database: Save Snippet
    Server->>Database: Store Version
    Database-->>Server: Success
    Server-->>Frontend: Response OK
    Frontend-->>User: Snippet Saved
```
```mermaid
flowchart TD
    User --> Register
    User --> Login
    User --> CreateSnippet
    User --> EditSnippet
    User --> DeleteSnippet
    User --> ViewHistory
    User --> RestoreVersion
    User --> UploadFile
    User --> SearchSnippets

    Admin --> MonitorLogs
```
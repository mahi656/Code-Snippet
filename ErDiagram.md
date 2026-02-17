```mermaid
erDiagram

USER ||--o{ SNIPPET : owns
SNIPPET ||--o{ VERSION : has
SNIPPET ||--o{ FILE : contains

USER {
  string id
  string name
  string email
  string password
}

SNIPPET {
  string id
  string title
  string code
  string language
  date created_at
}

VERSION {
  string id
  string snippet_id
  string content
  date created_at
}

FILE {
  string id
  string snippet_id
  string path
}
```
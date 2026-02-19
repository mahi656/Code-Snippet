classDiagram

class User {
  +ObjectId id
  +String name
  +String email
  +String passwordHash
  +Date createdAt
  +register()
  +login()
  +updateProfile()
}

class Snippet {
  +ObjectId id
  +String title
  +String description
  +String language
  +ObjectId userId
  +ObjectId currentVersionId
  +Date createdAt
  +Date updatedAt
  +createSnippet()
  +updateSnippet()
  +deleteSnippet()
  +getSnippet()
}

class Version {
  +ObjectId id
  +ObjectId snippetId
  +Text codeContent
  +Number versionNumber
  +Date createdAt
  +createVersion()
  +getHistory()
  +restoreVersion()
}

class Attachment {
  +ObjectId id
  +ObjectId snippetId
  +String fileName
  +String fileUrl
  +Date uploadedAt
  +uploadFile()
  +deleteFile()
}

class Tag {
  +ObjectId id
  +String name
}

class SnippetTag {
  +ObjectId snippetId
  +ObjectId tagId
}

User "1" --> "many" Snippet : creates
Snippet "1" --> "many" Version : has
Snippet "1" --> "many" Attachment : contains
Snippet "many" --> "many" Tag : categorized by
Tag "1" --> "many" SnippetTag
Snippet "1" --> "many" SnippetTag
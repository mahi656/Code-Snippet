## Project Title

**Code Snippet Manager with Version Control**

---

## Problem Statement

Developers often save useful code snippets in random places such as notes apps, chat messages, or multiple files. Over time, these snippets become hard to organize, search, and update. When changes are made, previous versions are lost, making it difficult to revert to earlier working code.

---

## Proposed Solution

Build a web-based application that allows users to securely store, organize, and manage code snippets with built-in version control.

The system will automatically save previous versions whenever a snippet is updated, allowing users to view history and restore older versions when needed.

---

## Objectives

* Provide a centralized platform to store code snippets
* Enable version tracking similar to Git
* Allow users to restore previous versions
* Support file/image uploads related to snippets
* Provide fast search and filtering options

---

## Key Features

### 1. Authentication

* User registration and login
* Secure access using JWT authentication

### 2. Snippet Management

* Create, edit, and delete snippets
* Save snippets in multiple programming languages
* Add tags for better organization

### 3. Version Control (Core Feature)

* Each edit creates a new version
* Old versions remain stored
* Users can view version history
* Users can restore previous versions

### 4. File Upload Support

* Upload images or files using Multer
* Attach files to snippets

### 5. Search & Filter

* Search by title or keyword
* Filter by language or tags

### 6. Logging & Monitoring

* Request logging using Morgan
* Error and system logging using Winston

---

## Scope of the Project

This project focuses on backend system design, version control logic, secure authentication, and structured data management, along with a simple and user-friendly frontend interface.

---

## Target Users

* Students learning programming
* Software developers
* Coding enthusiasts

---

## Expected Outcome

A functional web application that helps users manage and version their code snippets efficiently, preventing loss of previous work and improving productivity.

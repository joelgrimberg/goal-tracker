# Bruno: API testing

Welcome to the hands-on API testing challenges! In this session, you'll use
either **curl** or **Bruno** to interact with the API. These challenges focus on
endpoints that do **not** require authentication. Try to complete each challenge
using both tools if possible.

---

## Disclaimer

> 🎵 **Vibe Coding Alert!** 🎵
> 
> This app was built with pure vibes and good intentions. If you find that the API spec doesn't match reality, or the system behaves in mysterious ways that would confuse even a fortune teller, don't panic! 
> 
> **Just add a sticky note to the wall** 📝 and I'll investigate faster than a caffeinated developer on a deadline. 
> 
> Remember: sometimes the best code is the code that works, even if it works in ways we didn't expect! ✨

---

## Demo: Challenge 1: Fetch All Users (GET)

- **Endpoint:** `GET /users`
- **Goal:** Retrieve a list of all users in the system.
- **Try:**
  - In curl: `curl http://localhost:3000/users`
  - In Bruno: Create a GET request to `/users`
- **Question:** When you end the test here, what does that 'prove'?
- **Discuss**: Naming conventions
- **Question**: What assertions could we add?

---

## Challenge 2: Fetch All Goals (GET)

- **Endpoint:** `GET /feed/goals`
- **Goal:** Retrieve a list of all goals.
- **Try:**
  - In curl: `curl http://localhost:3000/feed/goals`
  - In Bruno: Create a GET request to `/feed/goals`
- **Bonus:** Use query parameters like `searchString`, `skip`, or `take` to
  filter or paginate results.(use the Bruno API documentation to understand what
  they do)

---

## Challenge 3: Create a New Goal (POST)

- **Endpoint:** `POST /goal`
- **Goal:** Create a new goal with title, description, and status.
- **Required Fields:**
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "draft" | "in_progress" | "completed"
  }
  ```
- **Try:**
  - In curl:
    ```bash
    curl -X POST http://localhost:3000/goal \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Learn API Testing",
        "description": "Master the fundamentals of API testing with Bruno",
        "status": "draft"
      }'
    ```
  - In Bruno: Create a POST request to `/goal` with the JSON body the error
    response.

---

## Discuss: Naming Conventions

- How do we name our tests
  - casing (camelCase, PascalCase,kebab-case, snake_case)
  - linux: lowercase
- How this reflects on the filesystem
- space vs. hyphen vs. underscore

---

## Challenge 4: Fetch a Specific Goal by ID (GET)

- **Endpoint:** `GET /goal/{goalId}`
- **Goal:** Retrieve the details of a specific goal by its ID.
- **Try:**
  - In curl: `curl http://localhost:3000/goal/1` (replace `1` with a valid goal
    ID)
  - In Bruno: Create a GET request to `/goal/{goalId}`
- **Bonus:** Try with an invalid ID and observe the error response.

---

## Challenge 5: Delete a Goal by ID (DELETE)

- **Endpoint:** `DELETE /goal/{goalId}`
- **Goal:** Delete a specific goal by its ID.
- **Try:**
  - In curl: `curl -X DELETE http://localhost:3000/goal/1` (replace `1` with a
    valid goal ID)
  - In Bruno: Create a DELETE request to `/goal/{goalId}`
- **Bonus:** Try deleting the same goal twice and observe the response. Create a
  test for it.

---

## Challenge 6: Get an Avatar Image (GET)

- **Endpoint:** `GET /uploads/avatars/{filename}`
- **Goal:** Retrieve an uploaded avatar image by filename.
- **Try:**
  - In curl:
    `curl http://localhost:3000/uploads/avatars/example.png --output avatar.png`
  - In Bruno: Create a GET request to `/uploads/avatars/{filename}`
- **Bonus:** Try with a non-existent filename and observe the error response.
  Create a test.

---

## Challenge 7: Delete a User by ID (DELETE)

- **Endpoint:** `DELETE /user/{userId}`
- **Goal:** Delete a user and all associated data by user ID.
- **Try:**
  - In curl: `curl -X DELETE http://localhost:3000/user/{userId}` (replace
    `{userId}` with a valid user ID)
  - In Bruno: Create a DELETE request to `/user/{userId}`
- **Bonus:** Try deleting a user that does not exist and observe the response.
  Create a test for it.

---

## Environments

- When and how to create environments
- now, refactor your tests to use one (or more?) environments

---

## Challenge 8: Dynamic Goal Testing (Advanced)

- **Goal:** Test goal endpoints using dynamic IDs from previous responses.
- **Steps:**
  1. First, create a goal using `POST /goal`
  2. Extract the goal ID from the response
  3. Use that ID to get the goal details with `GET /goal/{goalId}`
  4. Finally, delete the goal with `DELETE /goal/{goalId}`
- **Bruno Script Example:**

  ```js
  // After creating a goal, save the ID
  const goalId = response.body.id;
  bru.setVar("goalId", goalId);

  // Then use {{goalId}} in subsequent requests
  ```

---

## Challenge 9: Update Your Profile (PUT)

- **Endpoint:** `PUT /auth/profile`
- **Goal:** Update your user profile (name and/or email) as the authenticated user.
- **Requires:** Authentication (JWT or OAuth Bearer token)
- **Try:**
  - In curl:
    ```bash
    curl -X PUT http://localhost:3000/auth/profile \
      -H "Authorization: Bearer <your_jwt_token>" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "New Name",
        "email": "newemail@example.com"
      }'
    ```
  - In Bruno: Create a PUT request to `/auth/profile` with a JSON body and set the `Authorization` header to your Bearer token.
- **Bonus:** Try updating only the name or only the email. What happens if you use an email that already exists?

---

> **Note:**
>
> - Some endpoints (like POST /auth/register or POST /auth/login) are not
>   included here, as they are typically covered in authentication sessions.
> - The goal endpoints use `description` field, not `content`.
> - All goal endpoints require the `status` field to be one of: `"draft"`,
>   `"in_progress"`, or `"completed"`.

---

## Tips

- Document your requests and responses in Bruno for future reference.
- Try to break the API and observe how errors are handled.
- Use Bruno's variable system to chain requests together.
- Discuss your findings and any issues with your peers or trainer.

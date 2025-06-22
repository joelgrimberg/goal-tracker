# Bruno: Flow Scripting Challenges

Welcome to the hands-on API testing challenges! In this session, you'll use
either **curl** or **Bruno** to interact with the API. These challenges focus on
endpoints that do **not** require authentication. Try to complete each challenge
using both tools if possible.

---

## Challenge 1: List All Users (GET)

- **Endpoint:** `GET /users`
- **Goal:** Retrieve a list of all users in the system.
- **Try:**
  - In curl: `curl http://localhost:3000/users`
  - In Bruno: Create a GET request to `/users`
- **Bonus:** Filter or inspect the response for specific fields (e.g., email,
  name).

---

## Challenge 2: List All Goals (GET)

- **Endpoint:** `GET /feed/goals`
- **Goal:** Retrieve a list of all goals (the public feed).
- **Try:**
  - In curl: `curl http://localhost:3000/feed/goals`
  - In Bruno: Create a GET request to `/feed/goals`
- **Bonus:** Use query parameters like `searchString`, `skip`, or `take` to
  filter or paginate results.

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
  - In Bruno: Create a POST request to `/goal` with the JSON body
- **Bonus:** Try creating a goal without the required `status` field and observe
  the error response.

---

## Challenge 4: Get a Specific Goal by ID (GET)

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
- **Bonus:** Try deleting the same goal twice and observe the response.

---

## Challenge 6: Get an Avatar Image (GET)

- **Endpoint:** `GET /uploads/avatars/{filename}`
- **Goal:** Retrieve an uploaded avatar image by filename.
- **Try:**
  - In curl:
    `curl http://localhost:3000/uploads/avatars/example.png --output avatar.png`
  - In Bruno: Create a GET request to `/uploads/avatars/{filename}`
- **Bonus:** Try with a non-existent filename and observe the error response.

---

## Challenge 7: Delete a User by ID (DELETE)

- **Endpoint:** `DELETE /user/{userId}`
- **Goal:** Delete a user and all associated data by user ID.
- **Try:**
  - In curl: `curl -X DELETE http://localhost:3000/user/{userId}` (replace
    `{userId}` with a valid user ID)
  - In Bruno: Create a DELETE request to `/user/{userId}`
- **Bonus:** Try deleting a user that does not exist and observe the response.

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
  setVar("goalId", goalId);

  // Then use {{goalId}} in subsequent requests
  ```

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

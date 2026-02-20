# Payment App with Local Storage

A Next.js payment form that prevents duplicates using the browser's storage.

## Features

--- MOCK API SERVICE ---

/\*\*

- Simulates a server response.
- Randomly returns:
- - 200 OK (Success)
- - 503 Service Unavailable (Temporary Failure)
- - Delayed Success (Long loading time)
    \*/

# Duplicate Prevention (LocalStorage)

Instead of asking the server "Did I pay this?", the app remembers your payments in the browser.

1. When you pay successfully, we save `{ email, amount }` to `localStorage`.
2. Next time you try to pay, the code checks this list first.
3. If the email and amount match a previous record, it blocks the request instantly.

## Payment History

Successful payments are listed below the form so the user can easily see what they have already paid.

### Auto-Retry

If the API returns a 503 (Busy) error, the app automatically retries up to 3 times before giving up.

## Setup

1. clone the repo and make sure node and npm are updated
2. `npm install`
3. `npm run dev`

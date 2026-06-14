
# YouTube Bookmarker

A full-stack web app to search YouTube videos, bookmark them, organize bookmarks into collections, and share collections via a public link.

**Tech Stack:** Django + DRF + SQLite (backend) | React (Vite) + Redux Toolkit + Tailwind CSS (frontend)

---

## Setup Instructions

### Backend

```bash
cd Youtube_Backend/yt_project
python -m venv yt_env
yt_env\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in this folder: 

```bash
python manage.py migrate
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000/`

### Frontend

```bash
cd Youtube_Frontend/Youtube_Frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173/`

---

## Features Implemented

**Authentication**
- Sign in with Google OAuth or username/password
- Logout, with session persisting across page refreshes (token stored in localStorage)
- Protected routes for logged-in features

**Search**
- Search YouTube videos via the YouTube Data API
- Results show thumbnail, title, channel, and published date
- Loading and error states handled

**Bookmarks**
- Bookmark videos from search results
- View and remove bookmarks
- Bookmarks persist in the database per user

**Collections**
- Create, list, and delete collections
- Add bookmarked videos to any collection
- Remove videos from a collection
- View all videos inside a collection

**Share Collections**
- Each collection has a unique shareable link (`/shared/<share_id>`)
- Public link is viewable by anyone, no login required
- Anonymous viewers cannot edit or delete anything

**Search Within a Collection**
- Filter videos by title inside a collection (works on both owner and shared views)

**Other**
- Fully responsive UI with a mobile hamburger menu
- Graceful error messages if the backend or YouTube API fails

---

## Assumptions

- Collections store a snapshot of each video's data (title, thumbnail, etc.) rather than linking to a Bookmark, so collections stay intact even if a bookmark is later removed.
- SQLite is used for simplicity; a production deployment would use PostgreSQL.
- API keys and OAuth credentials are kept in `.env` and excluded from version control.

---

## Trade-offs & Limitations

- Errors are shown via simple alerts/inline text, not toast notifications
- No pagination on search results, bookmarks, or collections lists
- No automated test suite (manual testing via Postman/browser was prioritized)
- Search-within-collection is done client-side (fine for small collections)

---

## Features Left Incomplete

- Toast-style notifications
- Automated tests
- Pagination

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login, get auth token |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/user/` | Get current user |
| GET | `/api/search/?q=<query>` | Search YouTube videos |
| GET/POST | `/api/bookmarks/` | List / create bookmarks |
| DELETE | `/api/bookmarks/<id>/` | Delete a bookmark |
| GET/POST | `/api/collections/` | List / create collections |
| GET/DELETE | `/api/collections/<id>/` | Get / delete a collection |
| POST | `/api/collections/<id>/videos/` | Add video to collection |
| DELETE | `/api/collections/<id>/videos/<video_id>/` | Remove video from collection |
| GET | `/api/share/<share_id>/` | Public view of a shared collection |
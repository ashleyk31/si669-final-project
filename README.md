# PantryShare — leftovers sharing prototype

PantryShare helps neighbors share groceries, baking ingredients, and cooked food before they expire. This repository currently contains **my three-page sharing flow** for the group project:

1. **Welcome** (`/`) — introduces PantryShare and links to posting and the dashboard.
2. **Share food** (`/share`) — records a food name, amount, category, expiration date, pickup area, optional notes, and an optional photo.
3. **Leftovers dashboard** (`/leftovers`) — shows all listings together, with category filters and a **Pick for pickup** action. **My picks** collects selected food. A successful post opens this page with a confirmation message.

The broader group's ingredient photo and AI recipe generator are outside this slice and are not presented as implemented here.

## Run locally

This is an Expo / React Native app using Expo Router and TypeScript. With Node.js installed:

```bash
npm install
npm start
```

Open the Expo Go QR code on a phone, or press `w` for the browser. You can also run `npm run ios`, `npm run android`, or `npm run web`. Run `npm run typecheck` for a TypeScript check.

## Demo path

Start on the welcome page → tap **I have leftovers** → enter a name, amount, future expiration date (`YYYY-MM-DD`), and pickup area → optionally choose a photo and add notes → tap **Post to leftovers** → see the new item at the top of the dashboard. Tap **Pick for pickup** on any available listing → open **My picks** to review it → tap the picked button again to remove it. From the welcome page, **Browse leftovers** and the header's **Leftovers** link go straight to the dashboard.

Three sample listings give the dashboard something to show immediately. They are labeled internally as sample data and remain available after a restart. New posts and My picks are saved on the device using AsyncStorage. Photos selected from the library are compressed and saved with the listing as a data URI, so large photos may hit device storage limits; the form reports a save error if that happens. This is a local prototype: listings and picks are **not** synced between users or uploaded to a server. Picking an item does not reserve it for others, and pickup arrangements are not implemented.

## Connections to SI 669 class work

- **`../669-Image-and-Camera-Tour`** informed the system photo-picker flow and handling a canceled selection. This prototype uses photo library selection, without adding a camera screen.
- **`../Week-10-Starter`** informed the Expo Router screen structure and AsyncStorage-backed saved state.
- **`../Week-6-starter`** informed the approach of keeping screen routes small and separating shared state from UI.

The files above are neighboring assignments in the `si669` directory. This project is its own app; it does not import their code at runtime.

# PE2-Holidaze-HenrikLeutscher

- [Description](#description)
- [Features](#features)
- [Venue Manager Features](#venue-manager-features)
- [Installation](#installation)
- [Get your API Key](#get-your-api-key)
- [Tech Stack](#tech-stack)
- [Contact](#contact)

## Description
Holidaze is a modern booking platform built with React and TypeScript. This project allows both guests and users to browse all the venues, meanwhile venue managers can create, edit and manage their own Venues.

This project was developed as the Project Exam 2 submission at Noroff, focusing heavily on functionality, reusable components, REST API integration, authentication, validation, CRUD and responsive user experience.

## Features:
- Browse all venues
- Search for venues
- Sort Venues Date - From newest and oldest.
- View the detail page for each venue
- Book venues with a datepicker and Guest amount.
- Delete their booking
- See their bookings
- Booking overlap validation
- Responsive Design across Devices
- User Authentication alongside Profile Management.

## Venue Manager Features
- Create a new venue filling in Required and Optional fields with form validation.
- Edit existing venues they have made (Prefilled edit form)
- Delete their venues
- Upload multiple images for their venue
- Manage their venue facilities and location data
- See bookings to their venues

## Installation:

1. Clone the Repo:
```
git clone https://github.com/HenrikLeutscher/PE2-Holidaze-HenrikLeutscher.git
```
2. Navigate to the project root folder:
cd PE2-Holidaze-HenrikLeutscher

3. Install Dependencies
```
npm install
```
4. Create a .env file in the root directory and add:
Replace YOUR_API_KEY with your API key, instructions on how to get your key is further down.
```
VITE_API_KEY=YOUR_API_KEY
```
5. Start the Development Server:
```
npm run dev
```
This will make a live version of the website within this URL:
```
http://localhost:YOUR_PORT/
```

## Get your API Key:
1. Create an account on the Live Deployed Link with valid credentials.
2. Once registered, head over to this link: https://docs.noroff.dev/docs/v2/auth/api-key
3. Scroll down until you see ```API Key Tool```
4. Login with the credentials you registered with in the form.
5. Copy the API Key you recieve:
```'X-Noroff-API-Key': 'COPY_YOUR_KEY'```

## Tech Stack

- React 19
- Lucide-React 1.8
- react-Datepicker 9
- Tailwind CSS 4
- eslint 9
- vite 8
- TypeScript 6

## Focus Areas:
- Component-Based architecture
- Type-Safe development with TypeScript
- API handling, error management
- Form Validation and sanitazion.
- Authentication Handling
- Responsive UI and UX.
- State Management with React Hooks and Context API.

## Deployment:
This project is deployed live with Netlify:
Live Link: https://pe2-henrikleutscher-holidaze.netlify.app/

## Contact

[My LinkedIn page](https://www.linkedin.com/in/henrik-leutscher/)

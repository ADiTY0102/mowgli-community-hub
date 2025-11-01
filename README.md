# MOWGLIANS

MOWGLIANS is a community-driven pet adoption and donation platform designed to connect pet lovers with pets in need. The platform offers a range of features including pet adoption, pet donation, fundraising for animal welfare, and photo galleries of rescued pets. The project includes distinct user roles for admins and users with seamless integration to third-party payment gateways for donations.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

MOWGLIANS aims to simplify and streamline the process of pet adoption and donation. It provides users an engaging interface to view pets available for adoption or donation, raise funds, and share their experiences via a gallery. Admins manage users, validate adoption and donation requests, and oversee fundraising activities.

## Features

- **Home Page**
  - Autoplay video on scroll with three interactive cards: Adopt Pet, Donate Pet, and Fund Raise.
  - Displays pets available for adoption and donation in card format.
  - Fundraising section with total funds raised and Razorpay integration for donation payment.
  - Gallery section showing a random grid of top 10 uploaded images with a 'View More' option.
  - Social media integration: Instagram, WhatsApp Community, YouTube.

- **Authentication**
  - User signup and login with admin and user roles.
  - User profile management including personal details and pet donation/adoption requests.

- **User Functionalities**
  - Submit pet donation request with details (name, breed, disease/reason, age).
  - Submit pet adoption request and track status (pending, approved, rejected).
  - View fundraising progress and make fund donations via Razorpay.

- **Admin Functionalities**
  - Manage users and view all registered users.
  - Approve/reject adoption and donation requests.
  - Manage fundraising transactions and gallery uploads.
  - View and manage site metrics such as total funds raised and pets adopted/donated.

## Technology Stack

- Frontend: React Js / Typescript
- Backend: Express JS/ Supabase
- Database: Supabase (PostgreSQL)
- Payment Gateway: Razorpay API
- Hosting: [Versal
- Others: Video playback, Photo grid layout, Real-time metrics display

## Database Schema (Supabase)

- **Users Table:** Stores user profiles linked to Supabase Auth.
- **Pets Table:** Stores details of pets for adoption/donation.
- **Donation Requests Table:** Tracks user-raised pet donation requests.
- **Adoption Requests Table:** Tracks requests for adopting pets.
- **Funds Table:** Stores all Razorpay transactions.
- **Gallery Table:** Stores images for gallery display.
- **Social Links Table:** Centralized platform links management.
- **Site Metrics Table:** Tracks overall fundraising and pet adoption stats.

Refer to the Supabase database schema in the project documentation for detailed field definitions and relationships.

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/ADiTY0102/mowgli-community-hub.git
cd mowgli-community-hub
```

2. Install dependencies:
```bash
npm install
```
3. Configure environment variables for Supabase and Razorpay in `.env` file:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
RAZORPAY_KEY_ID=rzp_test_YourKeyID
RAZORPAY_SECRET=your_secret_key
```

4. Run the development server:
```bash
npm run dev
```


## Usage

- Navigate to the home page to view featured pets, fundraising goals, and gallery highlights.
- Sign up to adopt or donate pets and contribute to fundraisers.
- Admins can log in to manage requests, users, and site metrics.

## API Integration

- **Razorpay API:** Used for processing donations with secured API key and secret.
- **Supabase:** Backend-as-a-Service for authentication, database, and real-time updates.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any bug fixes, features, or improvements.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or support, please contact the project maintainer at adityabinjagermath12@gmail.com.

---

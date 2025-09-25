# Sugarland Theaters - Seat Booking System

A modern, responsive **movie seat booking system** built with **HTML, CSS, and JavaScript**.  
This project demonstrates a **step-by-step booking flow** with seat selection, validation, and booking confirmation.

---

## Features
- Multi-step **booking wizard (stepper)**:
  1. Select Movie
  2. Choose Date & Time
  3. Enter Number of Persons
  4. Select Seats (with seat map)
  5. Confirm Booking
- **Dynamic seat layout** (Rows **A–E**, 8 seats per row, 40 total seats).
- **Seat validation**:
  - Cannot select more seats than persons entered.
  - Must select exactly the same number of seats as persons.
- **Responsive design** (works on desktop & mobile).
- Uses [Lucide Icons](https://lucide.dev/) for modern seat icons.
- Prevents selection of **past dates/times**.
- Clean UI with modern theater-style design.

---

## Project Structure
┣ index.html # Main app (structure + stepper)

┣ style.css # Styling for layout, stepper, and seats

┣ script.js # Core logic (stepper navigation, validation, seat selection)

┗ README.md # Documentation

---

## Installation & Setup
1. Clone this repository:
   
   git clone https://github.com/your-username/seat-booking.git

   
2. Navigate into the project folder:

   cd seat-booking

3. Open index.html in your favorite browser.


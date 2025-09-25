document.addEventListener("DOMContentLoaded", () => {
  /* === Stepper & basic references === */
  const steps = Array.from(document.querySelectorAll(".stepper .step"));
  const stepContents = Array.from(document.querySelectorAll(".step-content"));
  const nextBtns = Array.from(document.querySelectorAll(".next-btn"));
  const backBtns = Array.from(document.querySelectorAll(".back-btn"));
  const form = document.getElementById("bookingForm");

  // inputs
  const movieSelect = document.getElementById("movie");
  const movieWrapper = document.getElementById("movieWrapper");
  const dateInput = document.getElementById("showDate");
  const timeInput = document.getElementById("showTime");
  const personCountInput = document.getElementById("personCount");
  const seatLayout = document.getElementById("seatLayout");
  const selectedSeatsDiv = document.getElementById("selectedSeats");
  const reviewBox = document.getElementById("review");

  let currentStep = 0;
  let selectedSeats = [];
  const rows = ["A", "B", "C", "D", "E"];
  const cols = 8;

  /* === Fix for dropdown not opening on some setups:
     - If browser supports select.showPicker(), call it.
     - Otherwise .focus() the select (native dropdown should open).
     - Also ensure select has high z-index and pointer-events allowed in CSS.
  */
  movieWrapper.addEventListener("click", (e) => {
    // if user clicked directly the native select, let default happen
    if (e.target === movieSelect) return;
    try {
      if (typeof movieSelect.showPicker === "function") {
        movieSelect.showPicker(); // modern browsers (Chrome 86+)
      } else {
        movieSelect.focus(); // fallback
      }
    } catch (err) {
      movieSelect.focus();
    }
  });

  /* === Seats generation === */
  rows.forEach((row) => {
    for (let i = 1; i <= cols; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seat";
      btn.dataset.seat = `${row}${i}`;
      btn.innerHTML = `<i data-lucide="armchair"></i>`;
      btn.addEventListener("click", () => toggleSeat(btn));
      seatLayout.appendChild(btn);
    }
  });
  // render lucide icons
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    lucide.createIcons();
  }

  function toggleSeat(btn) {
    const code = btn.dataset.seat;
    const max = parseInt(personCountInput.value, 10) || 0;
    if (selectedSeats.includes(code)) {
      selectedSeats = selectedSeats.filter((s) => s !== code);
      btn.classList.remove("selected");
    } else {
      if (max > 0 && selectedSeats.length >= max) {
        alert(`You can only select ${max} seats.`);
        return;
      }
      selectedSeats.push(code);
      btn.classList.add("selected");
    }
    renderSelectedSeats();
  }

  function renderSelectedSeats() {
    selectedSeatsDiv.innerHTML = "";
    if (selectedSeats.length === 0) {
      selectedSeatsDiv.innerHTML = `<span style="color:#999">No seats selected</span>`;
      return;
    }
    selectedSeats.forEach((s) => {
      const el = document.createElement("span");
      el.textContent = s;
      selectedSeatsDiv.appendChild(el);
    });
  }

  /* === Stepper navigation === */
  function showStep(index) {
    // clamp
    index = Math.max(0, Math.min(stepContents.length - 1, index));
    stepContents.forEach((c, i) => c.classList.toggle("active", i === index));
    steps.forEach((s, i) => s.classList.toggle("active", i === index));
    currentStep = index;
    // if arriving at review step, update review
    if (currentStep === stepContents.length - 1) updateReview();
  }

  function validateStep(step) {
    if (step === 0) {
      if (!movieSelect.value) {
        alert("Please select a movie.");
        return false;
      }
    }
    if (step === 1) {
      if (!dateInput.value || !timeInput.value) {
        alert("Please choose date and time.");
        return false;
      }
      // block past dates
      const chosen = new Date(`${dateInput.value}T${timeInput.value}`);
      const now = new Date();
      if (chosen < now) {
        alert("Date/time is in the past. Choose a future date/time.");
        return false;
      }
    }
    if (step === 2) {
      const n = parseInt(personCountInput.value, 10);
      if (!n || n < 1) {
        alert("Please enter number of persons.");
        return false;
      }
      // extra: warn if requested seats > available seats
      const available = rows.length * cols;
      if (n > available) {
        if (
          !confirm(
            `You asked for ${n} persons but only ${available} seats exist in this map. Continue?`
          )
        )
          return false;
      }
    }
    if (step === 3) {
      const max = parseInt(personCountInput.value, 10) || 0;
      if (selectedSeats.length !== max) {
        alert(`Please select exactly ${max} seat(s).`);
        return false;
      }
    }
    return true;
  }

  nextBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (!validateStep(currentStep)) return;
      showStep(currentStep + 1);
    })
  );
  backBtns.forEach((btn) =>
    btn.addEventListener("click", () => showStep(currentStep - 1))
  );

  function updateReview() {
    const movie = movieSelect.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const persons = personCountInput.value;
    reviewBox.innerHTML = `
    <strong>${movie}</strong><br>
    Date: <strong>${date}</strong><br>
    Time: <strong>${time}</strong><br>
    Persons: <strong>${persons}</strong><br>
    Seats: <strong>${selectedSeats.join(", ")}</strong>
    `;
  }

  /* === submit === */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateStep(currentStep - 1) || !validateStep(3)) return; // final checks
    // final action (replace with real booking request)
    alert(
      `Booking confirmed!\nMovie: ${movieSelect.value}\nDate: ${
        dateInput.value
      }\nTime: ${timeInput.value}\nSeats: ${selectedSeats.join(", ")}`
    );
    // reset example:
    form.reset();
    selectedSeats = [];
    renderSelectedSeats();
    // clear seat selected styles
    document
      .querySelectorAll(".seat.selected")
      .forEach((s) => s.classList.remove("selected"));
    showStep(0);
  });

  // initial
  renderSelectedSeats();
  showStep(0);
});

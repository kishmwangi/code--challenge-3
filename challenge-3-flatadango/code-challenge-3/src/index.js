document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000";
  
    // Function to fetch and display movie details
    const displayMovieDetails = async (filmId) => {
      try {
        const response = await fetch(`http://localhost:3000/films/${filmId}`);
        if (!response.ok) {
          throw new Error("Failed");
        }
        const movieData = await response.json();
  
        const { title, runtime, capacity, showtime, tickets_sold, poster } = movieData;
        const availableTickets = capacity - tickets_sold;
  
        document.getElementById("poster").src = poster;
        document.getElementById("title").textContent = title;
        document.getElementById("runtime").textContent = `${runtime} minutes`;
        document.getElementById("film-info").textContent = movieData.description;
        document.getElementById("showtime").textContent = showtime;
        document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;
  
        const buyButton = document.getElementById("buy-ticket");
        if (availableTickets === 0) {
          buyButton.textContent = "Sold Out";
          buyButton.disabled = true;
        } else {
          buyButton.textContent = "Buy Ticket";
          buyButton.disabled = false;
          buyButton.onclick = () => {
            if (availableTickets > 0) {
              const updatedTicketsSold = tickets_sold + 1;
              updateTicketsSold(filmId, updatedTicketsSold);
            }
          };
        }
  
        const deleteButton = document.getElementById("delete-movie-button");
       deleteButton.disabled = false;
        deleteButton.onclick = async () => {
          try {
            const deleteResponse = await fetch(`http://localhost:3000/films/${filmId}`, {
              method: "DELETE"
            });
  
            if (!deleteResponse.ok) {
              throw new Error("Failed to delete movie");
            }
  

  
            // Disable buy button after deletion
            buyButton.disabled = true;
            buyButton.textContent = "Sold Out";
          } catch (error) {
            console.error("Error deleting movie:", error.message);
          }
        };
  
      } catch (error) {
        console.error("Error fetching movie details:", error.message);
      }
    };
  
    // Function to update tickets_sold 
    const updateTicketsSold = async (filmId, updatedTicketsSold) => {
      try {
        const response = await fetch(`http://localhost:3000/films/${filmId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold })
        });
  
        if (!response.ok) {
          throw new Error("Failed to update tickets sold");
        }
  
        await displayMovieDetails(filmId); // Refresh movie details after purchase
      } catch (error) {
        console.error("Error updating tickets:", error.message);
      }
    };
  
    // Function to fetch and display all movies in the sidebar
    const displayMoviesList = async () => {
      try {
        const response = await fetch(`${baseUrl}/films`);
        if (!response.ok) {
          throw new Error("Failed");
        }
        const moviesList = await response.json();
  
        const filmsElement = document.getElementById("films");
        filmsElement.innerHTML = ""; 
  
        moviesList.forEach((movie) => {
          const listItem = document.createElement("li");
          listItem.classList.add("film", "item");
          listItem.textContent = movie.title;
          listItem.setAttribute("data-film-id", movie.id);
  
          if (movie.capacity - movie.tickets_sold === 0) {
            listItem.classList.add("sold-out");
          }
  
          listItem.onclick = () => displayMovieDetails(movie.id);
  
          filmsElement.appendChild(listItem);
        });
      } catch (error) {
        console.error("Error fetching movies list:", error.message);
      }
    };
  
    // Initialize movie details and movies list on page load
    displayMoviesList();
    displayMovieDetails(1); // Show details for the first movie by default
  });
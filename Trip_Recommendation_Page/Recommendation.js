// API_KEY ='AIzaSyAqnedwm6RPYv0OO4Q5FBNDDCIyHWmfyJU'
API_KEY ='AIzaSyA0AmffS6q_m8Uv3EBiZqVp5b6PBZRUg3s'
document.getElementById('travel-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Get form data
  const currentLocation = document.getElementById('current-location').value;
  const budget = document.getElementById('budget').value;
  const days = document.getElementById('days').value;
  const preferences = document.getElementById('preferences').value;

  function formatResponse(responseText) {
    // Split response into meaningful parts
    let sections = responseText.split("*");

    let formattedOutput = `
        <div class="recommendation-card show">
            <div class="card-header">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Your Travel Recommendation</h3>
            </div>
            <h4>${sections[0]}</h4> 
            
            <div class="tab-container">
                <button class="tab-button active" onclick="showFormat('list')">List</button>
                <button class="tab-button" onclick="showFormat('card')">Card</button>
                <button class="tab-button" onclick="showFormat('table')">Table</button>
                <button class="tab-button" onclick="showFormat('accordion')">Accordion</button>
            </div>

            <div id="list-format" class="format-section">
                <ul class="recommendation-list">
                    ${sections.slice(1).map(item => `<li>${item.trim()}</li>`).join('')}
                </ul>
            </div>

            <div id="card-format" class="format-section hidden">
                ${sections.slice(1).map(item => `<div class="card-item">${item.trim()}</div>`).join('')}
            </div>

            <div id="table-format" class="format-section hidden">
                <table class="recommendation-table">
                    <tr><th>Feature</th><th>Details</th></tr>
                    ${sections.slice(1).map(item => `<tr><td>${item.split(":")[0]}</td><td>${item.split(":")[1] || ''}</td></tr>`).join('')}
                </table>
            </div>

            <div id="accordion-format" class="format-section hidden">
                ${sections.slice(1).map((item, index) => `
                    <div class="accordion">
                        <button class="accordion-button" onclick="toggleAccordion(${index})">Section ${index + 1}</button>
                        <div class="accordion-content">${item.trim()}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    return formattedOutput;
}


  const requestData = {
    contents: [{
      parts: [{
        text: `Suggest a travel destination based on the following preferences:\nLocation: ${currentLocation}\nBudget: ${budget} INR\nDays: ${days}\nPreferences: ${preferences}`
      }]
    }]
  };

  console.log('Request Data:', requestData);  // Log the data being sent to API

  try {
    // Make the request to the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    // Handle response
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);  // Log the API response

      // Check if candidates array exists and has data
      if (data.candidates && data.candidates.length > 0) {
        // Extract the recommendation text from the response
        const recommendationText = data.candidates[0].content.parts[0].text || 'No content available';
        const formattedData = formatResponse(recommendationText);
        document.getElementById('recommendation-result').innerHTML = formattedData;

        const recommendationResult = document.getElementById('recommendation-result');
    // recommendationResult.innerHTML = `
    //   <div class="recommendation-card show">
    //     <div class="card-header">
    //       <i class="fas fa-map-marker-alt"></i>
    //       <h3>Your Travel Recommendation</h3>
    //     </div>
    //     <p  id="recommendation-text">${formattedData}</p>
    //     <button id="explore-btn">Content creater</button>
    //   </div>
    // `;
      } else {
        document.getElementById('recommendation-text').textContent = 'No recommendations available at this time.';
      }
    } else {
      const errorData = await response.json();
      console.log('Error Data:', errorData);  // Log error details
      document.getElementById('recommendation-text').textContent = 'Sorry, we could not fetch recommendations at this time.';
    }
     // Scroll to the recommendation result section
     document.getElementById('recommendation-result').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } catch (error) {
    console.log('Error:', error);  // Log any network error
    document.getElementById('recommendation-text').textContent = 'An error occurred while fetching recommendations.';
   // Scroll to the recommendation result section in case of an error
   document.getElementById('recommendation-result').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
  }
});
const style = document.createElement('style');
style.innerHTML = `
  .recommendation-list {
    list-style-type: disc;
    padding-left: 20px;
    font-size: 16px;
    color: #333;
  }
  .recommendation-list li {
    margin-bottom: 10px;
  }
  #recommendation-result {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  .recommendation-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }
  .recommendation-card.show {
    transform: scale(1.05);
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: bold;
  }
  #explore-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  #explore-btn:hover {
    background: #0056b3;
  }
`;
document.head.appendChild(style);


document.querySelector('.hamburger').addEventListener('click', () => {
  const navLinks = document.querySelector('.navbar-links');
  navLinks.classList.toggle('show');
});

// document.getElementById('contant-creator-btn').addEventListener('click', () =>{
//   async function getContant (){
//     try {
//       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`);
//       const data =  await response.json();
//       console.log(data);
//     } 
    
//     catch (err) {
//       console.log("This is the contant creator detail error ", err);
//     }
//   }
//   getContant();
// })


document.getElementById('contant-creator-btn').addEventListener('click', () => {
  async function getContant() {
    try {
      if (!API_KEY) {
        throw new Error("API_KEY is undefined. Make sure it is set correctly.");
      }

      console.log("Fetching data...");
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
    } catch (err) {
      console.error("This is the content creator detail error:", err);
    }
  }

  getContant();
});


// document.getElementById('content-creator-btn').addEventListener('click', () => {
//   async function getContent() {
//     try {
//      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`);
// const data = await response.json();
//       console.log(data);
//     } catch (err) {
//       console.log("This is the content creator detail error", err);
//     }
//   }

//   getContent(); // Call the function
// });

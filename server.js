const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable parsing JSON data from requests
app.use(bodyParser.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Function to check if a number is prime
function isPrime(num) {
  if (num < 2) {
    return false; // Numbers less than 2 are not prime
  }
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false; // Divisible by another number, not prime
    }
  }
  return true; // No divisors found, prime number
}

// Function to process incoming data request
function processRequest(data, fileB64) {
  const numbers = []; // Array to store extracted numbers
  const alphabets = []; // Array to store extracted alphabets
  let highestLowercase = null; // Variable to store the highest lowercase alphabet
  let primeFound = false; // Flag to indicate if a prime number was found

  // Loop through each item in the data array
  data.forEach(item => {
    if (!isNaN(item)) { // Check if the item is a number
      numbers.push(parseInt(item)); // Convert string number to integer and add to numbers array
      if (isPrime(parseInt(item))) { // Check if the number is prime
        primeFound = true;
      }
    } else if (/^[a-zA-Z]$/.test(item)) { // Check if the item is an alphabet
      alphabets.push(item); // Add the alphabet to alphabets array
      if (item === item.toLowerCase() && (!highestLowercase || item > highestLowercase)) {
        highestLowercase = item; // Update highest lowercase alphabet if applicable
      }
    }
  });

  // Check if a file is included in the request
  const fileValid = !!fileB64;
  const fileMimeType = fileValid ? "application/octet-stream" : null;
  const fileSizeKB = fileValid ? Buffer.from(fileB64, 'base64').length / 1024 : null;

  // Return the processed response object
  return {
    is_success: true,
    user_id: "lakshika081303", // Replace with actual user ID retrieval logic
    email: "lak081303@gamil.com", // Replace with actual email retrieval logic
    roll_number: "0832IT211033", // Replace with actual roll number retrieval logic
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB
  };
}

// Route handler for POST requests to '/bfhl'
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  // Check if 'data' is present and is an array
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, error: "Invalid data format" });
  }

  const response = processRequest(data, file_b64);
  res.json(response);
});

// Route handler for GET requests to '/bfhl'
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 }); // Send a basic response for GET requests
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
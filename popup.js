document.addEventListener('DOMContentLoaded', function() {
    const bookmarksList = document.getElementById('bookmarks-list');
  
    // Fetch all bookmarks and find the "Learning" folder
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      findLearningFolder(bookmarkTreeNodes);
    });
  });
  
  // Function to find the "Learning" folder
  function findLearningFolder(bookmarks) {
    bookmarks.forEach((bookmark) => {
      if (bookmark.children) {
        if (bookmark.title === 'Learning') {
          // We've found the "Learning" folder, now extract and display its contents
          const urls = extractURLs(bookmark.children);
          sendURLsToBackend(urls); // Send the URLs to Flask backend
          displayBookmarks(bookmark.children); // Also display them in the popup
        } else {
          // Recursively search through folders until we find "Learning"
          findLearningFolder(bookmark.children);
        }
      }
    });
  }
  
  // Function to extract URLs from the bookmarks
  function extractURLs(bookmarks) {
    const urls = bookmarks
      .filter((bookmark) => bookmark.url) // Only get bookmarks that have URLs
      .map((bookmark) => ({
        title: bookmark.title,
        url: bookmark.url
      }));
  
    return urls;
  }
  
  // Function to send URLs to Flask backend
  function sendURLsToBackend(urls) {
    fetch('http://localhost:3000/api/receive-urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }), // Send the URLs in the request body
    })
    .then(response => response.json())
    .then(data => {
      console.log("URLs successfully sent to the Flask server:", data);
    })
    .catch(error => {
      console.error("Error sending URLs to the Flask server:", error);
    });
  }
  
  // Function to display bookmarks in the "Learning" folder
  function displayBookmarks(bookmarks) {
    const bookmarksList = document.getElementById('bookmarks-list');
    bookmarksList.innerHTML = ''; // Clear the list before adding new bookmarks
  
    bookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        // If it's a bookmark, display it as a link
        const bookmarkItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = bookmark.url;
        link.textContent = bookmark.title;
        link.target = '_blank'; // Open the bookmark in a new tab
        bookmarkItem.appendChild(link);
        bookmarksList.appendChild(bookmarkItem);
      }
    });
  }
  
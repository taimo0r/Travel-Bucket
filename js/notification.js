
// Check notification permission on page load
document.addEventListener("DOMContentLoaded", function () {
  if (Notification.permission === "granted") {
    displayForm();
  } else if (Notification.permission === "denied") {
    displayPermissionDeniedMessage();
  } else {
    displayPermissionButton();
  }
});

// Display permission button and hide the form
function displayPermissionButton() {
  document.getElementById("permissionDiv").style.display = "flex";
  document.getElementById("formDiv").style.display = "none";
}

// Display permission denied message
function displayPermissionDeniedMessage() {
  document.getElementById("permissionDiv").style.display = "flex";
  document.getElementById("formDiv").style.display = "none";
  document.getElementById("messageDiv").innerHTML =
    '<p id="errorMsg">Notification permission has been denied.</p>';
}

// Display the form and hide the permission button
function displayForm() {
  document.getElementById("permissionDiv").style.display = "none";
  document.getElementById("formDiv").style.display = "block";
}

document
  .getElementById("permissionBtn")
  .addEventListener("click", requestPermission);

//Request permissions
function requestPermission() {
  console.log("button clicked");

  if (!("Notification" in window)) {
    alert("Not supported")
    console.log("This browser does not support notifications.");
  } else {
    
    Notification.requestPermission().then((permission) => {
      alert(permission)
        if (permission === "granted") {
          displayForm();
        } else if (permission === "denied") {
          displayPermissionDeniedMessage();
        } else {
          // For newer browsers that require a user gesture to request permission
          displayPermissionButton();
        }
      })
      .catch(function (error) {
        console.log("Error requesting permission:", error);
      });
  }
}


// Show the notification
document.getElementById("formDiv").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  if (!title) {
    document.getElementById("messageDiv").innerHTML =
      '<p id="errorMsg">Please enter a title for the notification.</p>';
    return;
  }

  
  const notificationOptions = {
    body: body || "",
    actions: [
      { action: "dismiss", title: "Dismiss" }
      
    ],
  };
  
  navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification(title, notificationOptions);
  });

  document.getElementById("messageDiv").innerHTML = "Notification Sent";
  
});

// Listen for messages from the Service Worker
navigator.serviceWorker.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'notification') {

      // Handle the notification message received from the Service Worker
      document.getElementById("messageDiv").innerHTML = event.data.message;
    }
  });

// Handle notification button clicks
self.addEventListener("notificationclick", function (event) {

  if (event.action === "dismiss") {
    document.getElementById("messageDiv").innerHTML =
      '<p class="notification-message">Notification Has been Dismissed!</p>';
  }

  event.notification.close();
});

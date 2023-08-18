const destinations = document.querySelector('.destinations');
let destinationSearch;

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add destination form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

// render destination data
const renderDestination = (data, id) => {

  const html = `
    <div class="card-panel destination white row" data-id="${id}">
      <img src="/img/tour.png" alt="tourism icon">
      <div class="destination-details">
        <div class="destination-title">${data.name}</div>
        <div class="destination-country">${data.country}</div>
      </div>
      <div class="destination-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>
  `;
  destinations.innerHTML += html;
  console.log("Card Id: ", id);

  destinations.addEventListener('click',async (event) => {
    const clickedElement = event.target;
    const destinationCard = clickedElement.closest('.destination');
  
    if (destinationCard) {
      const id = destinationCard.getAttribute('data-id');
      const data = await getDataById(id);
      const destinationSearch = data.name + ', ' + data.country;
  
      window.location.href = `/pages/destinationDetails.html?title=${encodeURIComponent(destinationSearch)}`;
    }
  });

};

// Assuming db is your Firebase Firestore instance
const getDataById = async (id) => {
  try {
    const docSnapshot = await db.collection('destinations').doc(id).get();
    if (docSnapshot.exists) {
      return docSnapshot.data();
    } else {
      console.log(`No document found with id ${id}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

// remove destination
const removeDestination = (id) => {
  const destination = document.querySelector(`.destination[data-id=${id}]`);
  destination.remove();
};
// enable offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

// real-time listener
db.collection('destinations').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added'){
      renderDestination(change.doc.data(), change.doc.id);
    }
    if(change.type === 'removed'){
      removeDestination(change.doc.id);
    }
  });
});

// add new destination
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();
  
  const destination = {
    name: form.title.value,
    country: form.country.value
  };

  db.collection('destinations').add(destination)
    .catch(err => console.log(err));

  form.title.value = '';
  form.country.value = '';
});

// remove a destination
const destinationContainer = document.querySelector('.destinations');
destinationContainer.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    //console.log(id);
    db.collection('destinations').doc(id).delete();
  }
})
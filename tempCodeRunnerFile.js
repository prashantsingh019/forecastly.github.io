const addClickListeners = () => {
  const searchItems = document.querySelectorAll('.option');
  console.log(searchItems);
  searchItems.forEach(item => {
      item.addEventListener('click', () => handleSearchClick(item.innerHTML));
      console.log(item.innerHTML);
  });
};
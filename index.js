const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users";

const users = [];
const dataPanel = document.querySelector("#data-panel");

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

// Render User List
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderUserList(users);
  })
  .catch((err) => console.log(err));

///// EVENTS /////
// Data Panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
  }
  if (event.target.matches(".fa-heart")) {
    event.target.classList.toggle("fas");
  }
});
// Serch Bar
searchForm.addEventListener("submit", function onSearchBtnClicked(event) {
  event.preventDefault(); // 避免重整頁面

  const keyword = searchInput.value.trim().toLowerCase();
  let filteredUser = []; // .filter() 回傳之結果為陣列
  filteredUser = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  ); // 將符合篩選條件之結果儲存為 filteredUser

  if (!filteredUser.length) {
    return alert("找不到關鍵字：" + keyword);
  } // 錯誤處理

  renderUserList(filteredUser); // 重新渲染畫面
});


///// FUNCTIONS /////
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="card m-2 text-dark bg-light border-light shadow-sm"; style="width: 17rem">
        <img src="${item.avatar}" class="card-img-top" alt="User Avatar">
        <div class="card-body">
          <h5 class="card-title lh-lg text-center text-nowrap overflow-hidden">
            <span><i class="far fa-heart fa-lg"></i></span>
            ${item.name + " " + item.surname}
          </h5>
          <div class="d-grid gap-2">
            <button type="button" 
              class="btn btn-outline-secondary float-end btn-show-user" 
              data-bs-toggle="modal" 
              data-bs-target="#user-modal" 
              data-id="${item.id}">More Information
            </button>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const modalAvatar = document.querySelector("#user-modal-avatar");
  const modalName = document.querySelector("#user-modal-name");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalDescription = document.querySelector("#user-modal-description");

  axios
    .get(INDEX_URL + "/" + id)
    .then((response) => {
      const data = response.data;
      modalName.innerText = data.name + " " + data.surname;
      modalGender.innerHTML = `<i class="fas fa-venus-mars"></i> ${data.gender}`;
      modalRegion.innerHTML = `<i class="fas fa-map-marked-alt"></i></i> ${data.region}`;
      modalAvatar.innerHTML = `<img src="${data.avatar}" alt="User Avatar" class="img-fluid fill ">`;
      modalDescription.innerHTML = `
      <li>Age: ${data.age}</li>
      <li>Birthday: ${data.birthday}</li>
      <li>Email:
        <a href="#">${data.email}</a>
      </li>`;
    })
    .catch((err) => {
      console.log(err);
    });
}


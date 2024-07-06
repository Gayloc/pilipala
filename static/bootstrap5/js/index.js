loadVideos();

function loadVideos(data) {
  fetch("http://127.0.0.1:8888", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => loadVideoCards(data))
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function loadVideoCards(data) {
  console.log(data);
  let content = document.getElementById("content");
  let item = data["item"];
  for (let i = 0; i < item.length; i++) {
    content.appendChild(getVideoCard(item[i]));
  }
}

function getVideoCard(video) {
  let card = document.createElement("div");
  card.className = "card";

  let cover = document.createElement("img");
  let title = document.createElement("h4");
  let card_body = document.createElement("div");
  let text = document.createElement("h5");

  cover.src = "//wsrv.nl/?url=" + video["pic"];
  cover.className = "card-img-top";
  card_body.className = "card-body";
  title.innerHTML = video["title"];
  title.className = "card-title"
  text.innerHTML = video["owner"]["name"]

  card.appendChild(cover);
  card_body.appendChild(title);
  card_body.appendChild(text)
  card.appendChild(card_body);

  card.addEventListener("click",() => {
    alert("跳转视频")
  })

  return card;
}

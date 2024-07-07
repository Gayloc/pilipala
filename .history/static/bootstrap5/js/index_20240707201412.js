let current = 0;
let ranking;
const max_cover_num = 20
const HTTP = "http://127.0.0.1:8888"


loadInfo();
loadVideos();
checkPage();

async function checkPage() {
  if (document.hidden)
  {
    setInterval(function () {
      checkPageVisibility();
      console.log("checkPageVisibility");
    }
      , 1000);
  }
}

function checkPageVisibility() {
  if (!document.hidden) {
    document.title = "欢迎回来！(。・∀・)ノ - PiliPala";
  } else {
    document.title = "别走好吗！(」゜ロ゜)」 - PiliPala";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // 不再监听鼠标悬停事件，改为监听滚动事件
  window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 0) {
      document.body.classList.remove('no-mask');
      document.getElementById('header').classList.remove('no-mask');
      document.getElementById('to-top').style.display = 'flex';
    } else {
      document.body.classList.add('no-mask');
      document.getElementById('header').classList.add('no-mask');
      document.getElementById('to-top').style.display = 'none';
    }
  });
})

function changeInfo(num) {
  if (num >= 0 && num <= max_cover_num - 1) {
    current = num;
  } else if (num < 0) {
    current = max_cover_num - 1
  } else if (num > max_cover_num - 1) {
    current = 0
  }

  document.getElementById("info-title").innerHTML = current + 1 + "#" + ranking[current]["title"]
  document.getElementById("info-text").innerHTML = ranking[current]["owner"]["name"]
  document.querySelector("body").style.backgroundImage = "url(" + "//wsrv.nl/?url=" + ranking[current]["pic"]
}

function setInfo(data, num) {
  ranking = data;
  document.getElementById("info-title").innerHTML = num + 1 + "#" + data[num]["title"]
  document.getElementById("info-text").innerHTML = data[num]["owner"]["name"]
  document.querySelector("body").style.backgroundImage = "url(" + "//wsrv.nl/?url=" + data[num]["pic"]
}

function loadVideos() {
  fetch(HTTP, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .then((data) => loadVideoCards(data["item"]))
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function loadVideoCards(item) {
  let content = document.getElementById("content");
  for (let i = 0; i < item.length; i++) {
    content.appendChild(getVideoCard(item[i]));
  }
}

function getVideoCard(video) {
  let card = document.createElement("div");
  card.className = "card";

  let cover = document.createElement("img");
  let title = document.createElement("p");
  let card_body = document.createElement("div");
  let text = document.createElement("p");

  cover.src = "//wsrv.nl/?url=" + video["pic"];
  cover.className = "card-img-top";
  card_body.className = "card-body";
  title.innerHTML = video["title"];
  title.className = "card-title"
  text.innerHTML = video["owner"]["name"]
  text.className = "card-text"

  card.appendChild(cover);
  card_body.appendChild(title);
  card_body.appendChild(text)
  card.appendChild(card_body);

  card.addEventListener("click", () => {
    const data = {
      "bvid": video["bvid"]
    };
    const queryString = new URLSearchParams(data).toString();
    window.open('http://127.0.0.1:5500/View/detail.html?' + queryString, '_blank');
  })

  return card;
}

function loadInfo() {
  fetch(HTTP + "/rank", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      setInfo(data['list'], current)
      loadVideoCards(data['list'])
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}


let current = 0;
let ranking;
const max_cover_num = 20

loadInfo();
loadVideos(); 

// 获取视频数据
const params = new URLSearchParams(window.location.search);
const bvid = params.get('bvid');


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

function getVideoInfo(bvid) {
    fetch("http://192.168.2.191:8888/get_vedio_by_bvid" + "?bvid=" + bvid, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function loadVideos() {
    fetch("http://192.168.2.191:8888", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => loadVideoCards(data["item"]))
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function loadVideoCards(item) {
    let recommend = document.getElementById("recommend");
    for (let i = 0; i < item.length; i++) {
        recommend.appendChild(getVideoCard(item[i]));
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
        alert("跳转视频")
    })

    return card;
}

function loadInfo() {
    fetch("http://192.168.2.191:8888/rank", {
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

function changeTheme(theme) {
    const body = document.querySelector("body");
    const btngroup = document.querySelector(".btn-group");
    const btns = document.querySelectorAll(".btn-group button");
    if (theme === "light") {
        body.style.backgroundColor = "#fff";
        btngroup.style.backgroundColor = "#f2f2f2";
        for (let i = 0; i < btns.length; i++) {
            btns[i].style.color = "rgb(97, 97, 97)";
        }
    }
    else if (theme === "dark") {
        body.style.backgroundColor = "rgb(38, 38, 38)";
        btngroup.style.backgroundColor = "rgb(52, 52, 52)";
        for (let i = 0; i < btns.length; i++) {
            btns[i].style.color = "#fff";
        }
    }
}
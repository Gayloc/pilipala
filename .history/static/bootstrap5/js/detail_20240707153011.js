let current = 0;
let ranking;
const max_cover_num = 20
const HTTP = "http://127.0.0.1:8888"

// 获取视频数据
const params = new URLSearchParams(window.location.search);
const bvid = params.get('bvid');

loadInfo();
loadVideos();
getVideoInfo(bvid);

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
    fetch(HTTP + "/get_vedio_by_bvid" + "?bvid=" + bvid, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => loadVideoInfo(data))
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function loadVideoInfo(data) {
    console.log(data);

    let timecard = document.createElement("div");
    let time = document.createElement("p");
    timecard.className = "time"
    time.innerHTML = "发布时间：" + formatDate(data["ctime"] * 1000);
    timecard.appendChild(time);

    let introductioncard = document.createElement("div");
    let introduction = document.createElement("p");
    introductioncard.className = "introduction"
    introduction.innerHTML = data["introduction"];

    let ownercard = document.createElement("div");
    let ownername = document.createElement("p");
    let owneravatar = document.createElement("img");
    ownercard.className = "owner"
    ownername.innerHTML = data["owner"]["name"];
    owneravatar.src = data["owner"]["face"];

    let titlecard = document.querySelector(".title");
}

// 时间格式化函数
function formatDate(datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(formattedDate);
    return formattedDate;
}

function loadVideos() {
    fetch(HTTP, {
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
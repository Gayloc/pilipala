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

    let timecard = document.querySelector(".time");
    let time = document.createElement("p");
    timecard.className = "time"
    time.innerHTML = "发布时间：" + formatDate(data["ctime"] * 1000);
    timecard.appendChild(time);

    let titlecard = document.querySelector(".title");
    titlecard.innerHTML = data["title"];
    titlecard.title = data["title"];
    document.title = data["title"] + " - PiliPala";

    let titlestat = document.querySelector(".views");
    let view = document.createElement("p");
    view.innerHTML = data["stat"]["view"] >= 10000 ? (data["stat"]["view"] / 10000).toFixed(1) + "万" : data["stat"]["view"];
    titlestat.appendChild(view);

    let like = document.querySelector(".like");
    let like_num = document.createElement("div");
    like_num.innerHTML = data["stat"]["like"] >= 10000 ? (data["stat"]["like"] / 10000).toFixed(1) + "万" : data["stat"]["like"];
    like.appendChild(like_num);

    let coin = document.querySelector(".coin");
    let coin_num = document.createElement("div");
    coin_num.innerHTML = data["stat"]["coin"] >= 10000 ? (data["stat"]["coin"] / 10000).toFixed(1) + "万" : data["stat"]["coin"];
    coin.appendChild(coin_num);

    let favorite = document.querySelector(".favorite");
    let favorite_num = document.createElement("div");
    favorite_num.innerHTML = data["stat"]["favorite"] >= 10000 ? (data["stat"]["favorite"] / 10000).toFixed(1) + "万" : data["stat"]["favorite"];
    favorite.appendChild(favorite_num);

    let share = document.querySelector(".share");
    let share_num = document.createElement("div");
    share_num.innerHTML = data["stat"]["share"] >= 10000 ? (data["stat"]["share"] / 10000).toFixed(1) + "万" : data["stat"]["share"];
    share.appendChild(share_num);

    let interductions = document.querySelector(".introductions");
    let interduction = document.createElement("div");
    let tname = document.createElement("p");
    let toggleButton = document.createElement("div");
    interduction.className = "introduction";
    interduction.innerHTML = data["desc"];
    toggleButton.className = "togglebutton";
    toggleButton.innerHTML = "展开全部";
    toggleButton.addEventListener('click', () => {
        toggleButton.innerHTML = toggleButton.innerHTML === "展开全部" ? "收起" : "展开全部";
        interduction.style.overflow = toggleButton.innerHTML === "展开全部" ? "" : "hidden";
        interduction.style.textOverflow = toggleButton.innerHTML === "展开全部" ? "ellipsis" : "";
        interduction.style.display = toggleButton.innerHTML === "展开全部" ? "-webkit-box" : "block";
    });
    tname.className = "tname";
    tname.innerHTML = data["tname"];
    interductions.appendChild(interduction);
    if (data["desc"].length > 100) { interductions.appendChild(toggleButton); }
    interductions.appendChild(tname);

    let ownercard = document.createElement("div");
    let ownername = document.createElement("p");
    let owneravatar = document.createElement("img");
    ownercard.className = "owner"
    ownername.innerHTML = data["owner"]["name"];
    owneravatar.src = data["owner"]["face"];

    loadVedioComment(data["aid"]);
}

async function loadVedioComment(aid) {
    await fetch(HTTP + "/get_comment_by_aid" + "?aid=" + aid, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
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
        window.open('http://127.0.0.1:5500/View/detail.html?' + queryString , '_self')
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
    const logo = document.querySelector(".logo");
    if (theme === "light") {
        body.style.backgroundColor = "#fff";
        btngroup.style.backgroundColor = "#f2f2f2";
        logo.style.color = "rgb(52, 52, 52)";
        for (let i = 0; i < btns.length; i++) {
            btns[i].style.color = "rgb(97, 97, 97)";
        }
    }
    else if (theme === "dark") {
        body.style.backgroundColor = "rgb(38, 38, 38)";
        btngroup.style.backgroundColor = "rgb(52, 52, 52)";
        logo.style.color = "#fff";
        for (let i = 0; i < btns.length; i++) {
            btns[i].style.color = "#fff";
        }
    }
}

function returnToIndex() { 
    window.open("http://127.0.0.1:5500/View/index.html", "_blank");
}
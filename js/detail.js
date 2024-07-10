let aid;
let ranking;
let comments;
const max_cover_num = 20
const HTTP = "/data"

// 获取视频数据
const params = new URLSearchParams(window.location.search);
const bvid = params.get('bvid');

loadInfo();
loadVideos();
getVideoInfo(bvid);
getPlayer();

function getPlayer() {
    document.querySelector('.video').innerHTML = '<iframe src="//player.bilibili.com/player.html?bvid=' + bvid + '&muted=false&autoplay=false" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="100%"></iframe>'
}

function getVideoInfo(bvid) {
    fetch(HTTP + "/get_video_by_bvid/" + bvid + ".json", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => loadVideoInfo(data))
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function loadVideoInfo(data) {
    console.log(data)
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
    tname.className = "card tname";
    tname.innerHTML = data["tname"];
    interductions.appendChild(interduction);
    if (data["desc"].length > 100) { interductions.appendChild(toggleButton); }
    interductions.appendChild(tname);

    let ownername = document.createElement("p");
    let owneravatar = document.createElement("img");
    ownername.innerHTML = data["owner"]["name"];
    owneravatar.src = "//wsrv.nl/?url=" + data["owner"]["face"];
    document.querySelector(".auther").appendChild(owneravatar)
    document.querySelector(".auther").appendChild(ownername)

    document.body.style.backgroundImage = "url(//wsrv.nl/?url="+data["pic"]+")";

    aid = data["aid"]
    loadVedioComment(aid);
}

async function loadVedioComment(aid) {
    await fetch(HTTP + "/get_comment_by_aid/" + aid + ".json", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            comments = data;
            getCommentsCards();
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function getCommentsCards() {
    let commentContainer = document.getElementById('comment-container');
    for (let i = 0; i < comments["page"]["size"]; i++) {
        commentContainer.appendChild(getCommentCard(comments["replies"][i]))
    }
}

function getCommentCard(data) {
    let senderInfo = document.createElement("div");
    senderInfo.className = "video-card-sender-info";
    let card = document.createElement("div");
    card.className = "card video-card";
    let avatar = document.createElement("img");
    avatar.className = "video-card-img";
    let title = document.createElement("p");
    title.className = "video-card-title";
    let content = document.createElement("p");
    content.className = "video-card-content";
    let commentReplies = document.createElement("div");
    commentReplies.className = "video-card-comment-replies";
    let commentTime = document.createElement("p");
    commentTime.className = "comment-time";

    avatar.src = "//wsrv.nl/?url=" + data["member"]["avatar"];
    title.innerHTML = data["member"]["uname"]
    content.innerHTML = data["content"]["message"]
    commentTime.innerHTML = "发布时间：" + formatDate(data["ctime"] * 1000);

    let replies = data["replies"]
    if (replies!=null) {
        if (replies.length > 0) {
            for (reply of replies) {
                commentReplies.appendChild(getCommentCard(reply));
            }
        }
    }

    senderInfo.appendChild(avatar);
    senderInfo.appendChild(title);
    card.appendChild(senderInfo);
    card.appendChild(content);
    card.appendChild(commentReplies);
    card.appendChild(commentTime);

    return card;
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
    return formattedDate;
}

function loadVideos() {
    fetch(HTTP + "/index.json" , {
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
        window.open('/detail.html?' + queryString, '_self')
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

function returnToIndex() {
    window.open("/index.html", "_blank");
}
let current = 0;
let ranking;
const max_cover_num = 20

loadInfo();
loadVideos();

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
    let content = document.getElementById("content");
    for (let i = 0; i < item.length; i++) {
        content.appendChild(getVideoCard(item[i]));
    }
}


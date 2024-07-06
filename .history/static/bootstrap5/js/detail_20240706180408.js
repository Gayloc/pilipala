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
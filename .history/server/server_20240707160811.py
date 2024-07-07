from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from bilibili_api import homepage, sync, settings, rank, video, Credential , comment
from urllib.parse import urlparse, parse_qs

# settings.proxy = "http://192.168.2.191:7890"

SESSDATA = ""
BILI_JCT = ""
BUVID3 = ""

settings.proxy = "http://127.0.0.1:7890"

async def get_vedio_by_bvid(bvid):
    credential = Credential(sessdata=SESSDATA, bili_jct=BILI_JCT, buvid3=BUVID3)
    v = video.Video(bvid=bvid , credential=credential)
    info = await v.get_info()
    return info

async def get_comment_by_aid(aid):
    # 存储评论
    comments = []
    # 页码
    page = 1
    # 当前已获取数量
    count = 0
    while True:
        # 获取评论
        c = await comment.get_comments(1906148774, comment.CommentResourceType.VIDEO, page)
        # 存储评论
        comments.extend(c['replies'])
        # 增加已获取数量
        count += c['page']['size']
        # 增加页码
        page += 1
        if count >= c['page']['count']:
            # 当前已获取数量已达到评论总数，跳出循环
            break
    # 打印评论
    for cmt in comments:
        print(f"{cmt['member']['uname']}: {cmt['content']['message']}")
    # 打印评论总数
    print(f"\n\n共有 {count} 条评论（不含子评论）")
    return comments

class MyHandler(BaseHTTPRequestHandler):
    async def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        if path == '/':
            self.send_response(200)
            # 设置响应头，指定内容类型为application/json
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
             # 将响应数据转换为JSON格式并发送
            await self.wfile.write(json.dumps(sync(homepage.get_videos())).encode('utf-8'))
        elif path == '/rank':
            self.send_response(200)
            # 设置响应头，指定内容类型为application/json
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            # 将响应数据转换为JSON格式并发送
            await self.wfile.write(json.dumps(sync(rank.get_rank())).encode('utf-8'))
        elif path == '/get_vedio_by_bvid':
            self.send_response(200)
            # 设置响应头，指定内容类型为application/json
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            await self.wfile.write(json.dumps(sync(get_vedio_by_bvid(query_params["bvid"][0]))).encode('utf-8'))
        elif path == '/get_comment_by_aid':
            self.send_response(200)
            # 设置响应头，指定内容类型为application/json
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            await self.wfile.write(json.dumps(sync(get_comment_by_aid(query_params["aid"][0]))).encode('utf-8'))

# 定义服务器地址和端口
server_address = ('', 8888)

# 创建HTTPServer实例，并指定自定义的请求处理类
httpd = HTTPServer(server_address, MyHandler)

print("Serving HTTP on port 8888...")

# 启动服务器，进入等待请求的状态
httpd.serve_forever()
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from bilibili_api import homepage, sync, settings, rank, video, Credential
from urllib.parse import urlparse, parse_qs

SESSDATA = ""
BILI_JCT = ""
BUVID3 = ""

settings.proxy = "http://127.0.0.1:7890"

async def get_vedio_by_bvid(bvid):
    credential = Credential(sessdata=SESSDATA, bili_jct=BILI_JCT, buvid3=BUVID3)
    v = video.Video(bvid=bvid , credential=credential)
    info = await v.get_info()
    return info

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
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
            self.wfile.write(json.dumps(sync(homepage.get_videos())).encode('utf-8'))
        elif path == '/rank':
            self.send_response(200)
            # 设置响应头，指定内容类型为application/json
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
             # 将响应数据转换为JSON格式并发送
            self.wfile.write(json.dumps(sync(rank.get_rank())).encode('utf-8'))
        elif path == '/get_vedio_by_bvid':
            self.send_response(200)
            # 设置响应头，指定内容类型为application/json
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(sync(get_vedio_by_bvid(query_params["bvid"][0]))).encode('utf-8'))

# 定义服务器地址和端口
server_address = ('', 8888)

# 创建HTTPServer实例，并指定自定义的请求处理类
httpd = HTTPServer(server_address, MyHandler)

print("Serving HTTP on port 8888...")

# 启动服务器，进入等待请求的状态
httpd.serve_forever()
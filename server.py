from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from bilibili_api import homepage, sync

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 设置响应状态码
        self.send_response(200)
        # 设置响应头，指定内容类型为application/json
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # 将响应数据转换为JSON格式并发送
        self.wfile.write(json.dumps(sync(homepage.get_videos())).encode('utf-8'))

# 定义服务器地址和端口
server_address = ('', 8888)

# 创建HTTPServer实例，并指定自定义的请求处理类
httpd = HTTPServer(server_address, MyHandler)

print("Serving HTTP on port 8888...")

# 启动服务器，进入等待请求的状态
httpd.serve_forever()

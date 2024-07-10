import json
from bilibili_api import homepage, sync, settings, rank, video, Credential , comment

SESSDATA = ""
BILI_JCT = ""
BUVID3 = ""

async def get_vedio_by_bvid(bvid):
    credential = Credential(sessdata=SESSDATA, bili_jct=BILI_JCT, buvid3=BUVID3)
    v = video.Video(bvid=bvid , credential=credential)
    info = await v.get_info()
    return info

async def get_comment_by_aid(aid):
    return await comment.get_comments(aid, comment.CommentResourceType.VIDEO, 1)

with open('./data/index.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

for item in data["item"]:
    with open('./data/get_comment_by_aid/'+str(item["id"])+".json", 'w', encoding='utf-8') as file:
        file.write(json.dumps(sync(get_comment_by_aid(item["id"]))))

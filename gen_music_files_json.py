import os
import json

music_dir = 'musicFiles'
output_json = 'musicFiles.json'

# 支持的音频格式
audio_formats = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a']
# 支持的视频格式
video_formats = ['.mp4', '.webm', '.mov', '.avi']

music_list = []
for fname in os.listdir(music_dir):
    # 获取文件扩展名并转换为小写
    ext = os.path.splitext(fname)[1].lower()
    
    if ext in audio_formats or ext in video_formats:
        name = os.path.splitext(fname)[0]
        # 将文件类型简化为两大类
        file_type = "audio" if ext in audio_formats else "video"
        
        music_list.append({
            "name": name,
            "file": f"{music_dir}/{fname}",
            "type": file_type
        })

# 按 name 排序
music_list.sort(key=lambda x: x['name'], reverse=True)

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(music_list, f, ensure_ascii=False, indent=2)

print(f"已生成 {output_json}，共{len(music_list)}首。")

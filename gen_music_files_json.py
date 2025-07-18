import os
import json

music_dir = 'musicFiles'
output_json = 'musicFiles.json'

music_list = []
for fname in os.listdir(music_dir):
    if fname.lower().endswith('.mp3'):
        name = os.path.splitext(fname)[0]
        music_list.append({
            "name": name,
            "file": f"{music_dir}/{fname}"
        })

# 按 name 排序
music_list.sort(key=lambda x: x['name'])

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(music_list, f, ensure_ascii=False, indent=2)

print(f"已生成 {output_json}，共{len(music_list)}首。")
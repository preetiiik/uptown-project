import sys, zipfile, io, re, json, subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / '.tools/media'))
from PIL import Image, ImageOps
from imageio_ffmpeg import get_ffmpeg_exe

source = Path(sys.argv[1])
folder = root / 'public/images/prn-farms'
folder.mkdir(parents=True, exist_ok=True)
photos = []
with zipfile.ZipFile(source / 'prn-farms.zip') as archive:
    entries = [i for i in archive.infolist() if Path(i.filename).suffix.lower() in ['.jpg', '.jpeg', '.png']]
    entries.sort(key=lambda i: (0 if Path(i.filename).stem == 'cover' else 1, int(re.search(r'\d+', Path(i.filename).stem).group()) if re.search(r'\d+', Path(i.filename).stem) else 0))
    for item in entries:
        name = Path(item.filename).stem + '.webp'
        with Image.open(io.BytesIO(archive.read(item))) as original:
            image = ImageOps.exif_transpose(original).convert('RGB')
            image.thumbnail((2000, 2000))
            image.save(folder / name, 'WEBP', quality=85, method=6)
        photos.append('/images/prn-farms/' + name)

folder = root / 'public/images/balinese-layout'
folder.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(source / 'balinese-layout.zip') as archive:
    entry = next(i for i in archive.infolist() if i.filename.lower().endswith('.mp4'))
    (folder / 'source-video.mp4').write_bytes(archive.read(entry))
subprocess.run([get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-i', str(folder / 'source-video.mp4'), '-vf', 'crop=848:414:0:34', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-c:a', 'copy', '-movflags', '+faststart', '-y', str(folder / 'video-filled.mp4')], check=True)
(folder / 'source-video.mp4').unlink()
subprocess.run([get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-ss', '1', '-i', str(folder / 'video-filled.mp4'), '-frames:v', '1', '-vf', 'scale=2000:-2', '-y', str(folder / 'cover-filled.webp')], check=True)

path = root / 'src/projectPhotos.ts'
text = path.read_text(encoding='utf-8')
position = text.rfind('};')
text = text[:position].rstrip().rstrip(',') + ',\n  "prn-farms": ' + json.dumps(photos, indent=4) + ',\n  "balinese-layout": ["/images/balinese-layout/cover-filled.webp"]\n' + text[position:]
path.write_text(text, encoding='utf-8')
path = root / 'src/App.tsx'
text = path.read_text(encoding='utf-8')
text = text.replace("const asset=(folder:string,name='cover')=>['balinese-layout','prn-farms'].includes(folder)?'/images/photos-coming-soon.svg':`/images/${folder}/${name}.webp`;", "const asset=(folder:string,name='cover')=>`/images/${folder}/${name}.webp`;")
needle = '<img className="project-gallery-main" src={photos[photo]}'
assert needle in text
text = text.replace(needle, '{slug===\'balinese-layout\'?<video className="project-gallery-main" src="/images/balinese-layout/video-filled.mp4" poster={asset(slug)} controls playsInline preload="metadata" aria-label="Balinese Layout project video"/>:<img className="project-gallery-main" src={photos[photo]}', 1)
text = text.replace('fetchPriority="high"/>{photos.length>1', 'fetchPriority="high"/>}{photos.length>1', 1)
path.write_text(text, encoding='utf-8')
path = root / '.gitignore'
text = path.read_text(encoding='utf-8')
if '.tools/' not in text:
    path.write_text(text + '\n.tools/\n', encoding='utf-8')
print(f'Imported {len(photos)} PRN photos and Balinese Layout video and cover.')

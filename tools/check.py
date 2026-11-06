from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,subprocess
ROOT=Path(__file__).resolve().parents[1]
files=sorted((ROOT/'app').rglob('*.js'))+[ROOT/'scripts/head.js']
for path in files:subprocess.run(['node','--check',str(path)],check=True)
class References(HTMLParser):
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        value=attrs.get('src') if tag=='script' else attrs.get('href') if tag=='link' else None
        if value:
            url=urlsplit(value)
            if not url.scheme and not url.netloc and url.path!='bundle':
                path=ROOT/unquote(url.path)
                assert path.is_file(),f'Missing page dependency: {value}'
for page in ROOT.glob('*.htm'):References().feed(page.read_text(encoding='utf-8-sig'))
for path in (ROOT/'settings').rglob('*.json'):json.loads(path.read_text(encoding='utf-8-sig'))
print(f'Checked {len(files)} JavaScript files, HTML dependencies and settings JSON')

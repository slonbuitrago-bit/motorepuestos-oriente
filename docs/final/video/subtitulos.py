import json, sys
src, out = sys.argv[1:3]
s = json.load(open(src))
def ts(x):
    h = int(x // 3600); m = int(x % 3600 // 60); sec = x % 60
    return f"{h}:{m:02d}:{sec:05.2f}"
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,DejaVu Sans,25,&H00FFFFFF,&H00FFFFFF,&H28161616,&H28161616,1,0,0,0,100,100,0,0,3,14,0,2,120,120,34,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
lines = [f"Dialogue: 0,{ts(x['ini'] + 0.15)},{ts(x['fin'])},Sub,,0,0,0,,{x['texto']}" for x in s]
open(out, "w").write(head + "\n".join(lines) + "\n")
print(len(lines), "subtítulos")

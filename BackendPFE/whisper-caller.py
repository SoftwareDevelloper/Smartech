import whisper
import sys
import os

def generate_captions(video_path, output_dir):
    model = whisper.load_model("base")
    result = model.transcribe(video_path, fp16=False)
    
    base = os.path.splitext(os.path.basename(video_path))[0]
    output_file = os.path.join(output_dir, f"{base}.srt")

    with open(output_file, "w", encoding="utf-8") as f:
        for i, segment in enumerate(result["segments"]):
            start = segment["start"]
            end = segment["end"]
            text = segment["text"].strip()

            f.write(f"{i+1}\n")
            f.write(f"{format_time(start)} --> {format_time(end)}\n")
            f.write(f"{text}\n\n")

    return output_file

def format_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

if __name__ == "__main__":
    video_path = sys.argv[1]
    output_dir = sys.argv[2]
    print(generate_captions(video_path, output_dir))

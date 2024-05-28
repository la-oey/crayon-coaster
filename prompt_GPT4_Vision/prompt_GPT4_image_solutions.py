# edited version of sample code from https://platform.openai.com/docs/guides/vision

import base64
import requests

# retrieve OpenAI API Key
with open("api_key.txt", "r") as keyfile:
  keyline = keyfile.readline()
  api_key = keyline.split("=")[1]


# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Path to your image
## sample specific images
# image_path = "connect-DE8DEC42101C48DEAF5B12C04FCE8999_img20.png" #interesting solution
image_path = "connect-EA1DDBB0D9E5471381D5FD3553DC8E12_img22.png" #standard solution
# folder_path = "../game2/"

# Getting the base64 string
base64_image = encode_image(image_path)

headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {api_key}"
}

# direct instructions from the human raters task
instructions_txt = """In this task, you’ll act as a judge. We had people play a computer game 
                      where they drew tracks to drop a marble into a goal location (a cup). 
                      Your job is to look at the solutions they came up with and judge how cool 
                      they are. Here’s what the computer game looks like.
                      Players try to transport the marble (drop location marked by the purple 
                      circle) into the black cup. There are obstacles in the game (the black 
                      blocks) that make this harder. Marbles bounce off the black blocks. Let’s 
                      see what happens if we drop the ball without drawing any tracks.
                      Players can draw tracks to guide the ball towards the cup—the tracks are 
                      shown in green. Look, now the ball made it into the cup!
                      Sometimes there will also be wind that pushes the marble in certain 
                      directions (shown by this wind icon in the top right corner of some 
                      images). If the wind is facing the right direction (like below), the wind 
                      will push the marble rightward. If the wind is facing the opposite 
                      direction, the wind will push the marble leftward. If there is no wind 
                      icon, there is no wind pushing the marble. """

payload = {
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": instructions_txt + " How cool is this solution on a scale of 0 to 100, where 0 is less cool and 100 is more cool?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{base64_image}"
          }
        }
      ]
    }
  ],
  "max_tokens": 300
}

response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
print(response.json())
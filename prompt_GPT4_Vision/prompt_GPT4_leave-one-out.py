# edited version of sample code from https://platform.openai.com/docs/guides/vision

import sys
import base64
import requests
from glob import glob
import json
import csv

# retrieve OpenAI API Key
with open("api_key.txt", "r") as keyfile:
  keyline = keyfile.readline()
  api_key = keyline.split("=")[1]


# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')



ratedim = sys.argv[1] # input dimension as first argument in terminal
rateq = "likely this solution is to succeed" if ratedim == "feasible" else ratedim + "this solution is"
ratescale = "likely" if ratedim == "feasible" else ratedim

# retrieve json of other files
humanratings = json.load(open("../analysis/combined/promptLLM.json"))


# test images
# images = ["connect-DE8DEC42101C48DEAF5B12C04FCE8999_img20.png", "connect-EA1DDBB0D9E5471381D5FD3553DC8E12_img22.png"]
# images = ["../game2/assets/stim/tunnel_wide-left/connect-DE486C956E5549A0BD5552CD8C34C086_img26.png"]

# Path to full set of images
path_folder = "../game2/assets/stim/"

headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {api_key}"
}

# direct instructions from the human raters task
instructions_txt = """In this task, you’ll act as a judge. We had people play a computer game 
                      where they drew tracks to drop a marble into a goal location (a cup). 
                      Your job is to look at the solutions they came up with and judge
                      how """ + ratedim + """ they are. Here’s what the computer game looks 
                      like. Players try to transport the marble (drop location marked by the 
                      purple circle) into the black cup. There are obstacles in the game (the 
                      black blocks) that make this harder. Marbles bounce off the black blocks. 
                      Let’s see what happens if we drop the ball without drawing any tracks.
                      Players can draw tracks to guide the ball towards the cup—the tracks are 
                      shown in green. Look, now the ball made it into the cup!
                      Sometimes there will also be wind that pushes the marble in certain 
                      directions (shown by this wind icon in the top right corner of some 
                      images). If the wind is facing the right direction (like below), the wind 
                      will push the marble rightward. If the wind is facing the opposite 
                      direction, the wind will push the marble leftward. If there is no wind 
                      icon, there is no wind pushing the marble. """
prompt = """Guided by the example images and their corresponding ratings that you just observed, 
            rate how """ + rateq + " on a scale of 0 to 100, where 0 is least " + ratescale + """ 
            and 100 is most """ + ratescale + """? Provide an answer and at the end include 
            '| rating:' then just the rated number. Keep your response to less than 100 words."""

outputfile = open("output_loo_" + ratedim + ".csv", "w")
csvwriter = csv.writer(outputfile)
csvwriter.writerow(["ratedim", "prompt", "image", "id", "model", "message", "created", "prompt_tokens", "completion_tokens", "system_fingerprint"])


for key, value in humanratings.items():
  lvlwind = key

  for i in range(0, 15): #the 15 solutions per level
    cloned = value.copy()
    selected = cloned[i]

    img = list(selected.keys())[0]
    print(key + "/" + img)
    rating = selected[img][sys.argv[1]]

    cloned.remove(selected)

    promptarr = []

    for o in cloned:
      o_img = list(o.keys())[0]
      o_rate = o[o_img][sys.argv[1]]

      o_image_path = path_folder + key + "/" + o_img
      # Getting the base64 string
      o_base64_image = encode_image(o_image_path)
      promptarr.append({ "type": "text", 
                        "text": "On a scale where 0 is least " + ratescale + """
                        and 100 is most """ + ratescale + ", this solution was rated " + str(o_rate) + """ 
                        by human raters."""})
      promptarr.append({ "type": "image_url",
                          "image_url": {
                            "url": f"data:image/jpeg;base64,{o_base64_image}"
                          }
                        })



    image_path = path_folder + key + "/" + img
    # Getting the base64 string
    base64_image = encode_image(image_path)

    promptarr.append({ "type": "text", "text": instructions_txt + prompt})
    promptarr.append({ "type": "image_url",
                       "image_url": {
                         "url": f"data:image/jpeg;base64,{base64_image}"
                       }
                     })

    payload = {
      "model": "gpt-4-turbo",
      "messages": [
        {
          "role": "user",
          "content": promptarr
        }
      ],
      "max_tokens": 300
    }

    responseobj = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    r = responseobj.json()
    # print(r)
    csvwriter.writerow([ratedim, instructions_txt + prompt, image_path, r["id"], r["model"], r["choices"][0]["message"]["content"], r["created"], r["usage"]["prompt_tokens"], r["usage"]["completion_tokens"], r["system_fingerprint"]])

outputfile.close()


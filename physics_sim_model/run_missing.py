# runs solutions from designers for 2 levels

import json
import sys
import subprocess

# file = open('solutions.json')
# solutions = json.load(file)

missed_file = open('../analysis/phys_simulation/pilot1/missingdata.json')
missing = json.load(missed_file)

# initiate local server
subprocess.Popen(["php", "-S", "localhost:8888"])

for m in missing:
	# print solutions being opened
	print(m) 

	# open in web browser
	level = "level=" + m['level']
	wind = "&wind=" + m['wind']
	imageid = "&imageid=" + m['image']
	# local url
	url = "http://localhost:8888/?"+level+wind+imageid
	# web url
	# url = "https://lo.velezlab.opalstacked.com/physics_sim_model/index.html?"+level+wind+imageid

	browser = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" #google chrome in MacOS
	subprocess.Popen([browser, "--new-window", url]) #opens simulation in new window
	
missed_file.close()
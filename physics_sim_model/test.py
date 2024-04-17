# runs solutions from designers for 2 levels

import json
import sys
import subprocess

file = open('solutions.json')
solutions = json.load(file)

n = 5

for sid in list(solutions[sys.argv[1]+"-"+sys.argv[2]].keys())[:n]:
	# print solutions being opened
	print(sid) 

	# open in web browser
	level = "level=" + sys.argv[1]
	wind = "&wind=" + sys.argv[2]
	imageid = "&imageid=" + sid[:-4]
	url = "https://lo.velezlab.opalstacked.com/physics_sim_model/index.html?"+level+wind+imageid

	browser = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" #google chrome in MacOS
	subprocess.Popen([browser, "--new-window", url]) #opens simulation in new window
	
file.close()
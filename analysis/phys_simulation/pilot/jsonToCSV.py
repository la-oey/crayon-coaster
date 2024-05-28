import io
import json
import csv
from os import listdir
from os.path import isfile, join
mypath = 'data/' #set path to folder containing json files

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
dat = open('data.csv','w')
csvdatwriter = csv.writer(dat)

headdata = 0
baseheader = ["image", "level", "wind", "starttime"]
for f in files: #iterate through files in folder
	print(f)
	if f not in [".DS_Store", ".json"]:
		with io.open(mypath+f,'r',encoding='utf-8',errors='ignore') as f:
			content = f.read()
			if content != "":
				parsed = json.loads(content)

				image = parsed["expt"]["image"]
				level = parsed["expt"]["levelid"]
				wind = parsed["expt"]["windid"]
				starttime = parsed["starttime"]
				subjData = parsed["data"]

				# data
				if headdata == 0:
					header = baseheader.copy() #init header array
					header.extend(subjData[0].keys())
					csvdatwriter.writerow(header)
					headdata = 1

				for s in subjData:
					vals = [image, level, wind, starttime] #init data array
					vals.extend(s.values())
					csvdatwriter.writerow(vals)

			


dat.close()


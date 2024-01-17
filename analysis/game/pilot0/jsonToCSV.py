import io
import json
import csv
from os import listdir
from os.path import isfile, join
mypath = 'json/loey_crayoncoaster_pilot/' #set path to folder containing json files

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
raw = open('raw.csv','w')
csvwriter = csv.writer(raw)

def without_keys(d, keys):
	return {x: d[x] for x in d if x not in keys}

ignored = {"marbleEndLoc"}
head = 0
for f in files: #iterate through files in folder
	print(f)
	if f not in [".DS_Store", ".json"]:
		with io.open(mypath+f,'r',encoding='utf-8',errors='ignore') as f:
			content = f.read()
			parsed = json.loads(content)
			subjID = parsed["client"]["sid"]
			starttime = parsed["client"]["starttime"]
			useragent = parsed["client"]["userAgent"]
			subjData = parsed["data"]

			if head == 0:
				header = ["subjID", "starttime", "useragent"] #init header array
				header.extend(without_keys(subjData[0], ignored).keys())
				csvwriter.writerow(header)
				head = 1

			for s in subjData:
				vals = [subjID, starttime, useragent] #init data array
				vals.extend(without_keys(s, ignored).values()) # deals with one dataset collecting surplus vars
				# vals.extend(s.values())
				csvwriter.writerow(vals)
raw.close()


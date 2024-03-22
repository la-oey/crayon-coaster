import io
import json
import csv
from os import listdir
from os.path import isfile, join
mypath = 'rating-1/' #set path to folder containing json files

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
dat = open('data.csv','w')
csvdatwriter = csv.writer(dat)
end = open('endsurvey.csv','w')
csvendwriter = csv.writer(end)
dem = open('demosurvey.csv','w')
csvdemwriter = csv.writer(dem)


def without_keys(d, keys):
	return {x: d[x] for x in d if x not in keys}

headdata = 0
headend = 0
headdem = 0
baseheader = ["subjID", "starttime", "useragent"]
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
			endSurvey = parsed["endsurvey"]
			demoSurvey = parsed["demographic"]

			# data
			if headdata == 0:
				header = baseheader.copy() #init header array
				header.extend(subjData[0].keys())
				csvdatwriter.writerow(header)
				headdata = 1

			for s in subjData:
				vals = [subjID, starttime, useragent] #init data array
				vals.extend(s.values())
				csvdatwriter.writerow(vals)

			# end survey
			if endSurvey is not None: 
				if headend == 0:
					header = baseheader.copy() #init header array
					header.extend(endSurvey.keys())
					csvendwriter.writerow(header)
					headend = 1

				vals = [subjID, starttime, useragent] #init data array
				vals.extend(endSurvey.values())
				csvendwriter.writerow(vals)

			# demographic survey
			if demoSurvey is not None: 
				if headdem == 0:
					header = baseheader.copy() #init header array
					header.extend(demoSurvey.keys())
					csvdemwriter.writerow(header)
					headdem = 1

				vals = [subjID, starttime, useragent] #init data array
				vals.extend(demoSurvey.values())
				csvdemwriter.writerow(vals)



dat.close()
end.close()
dem.close()


import io
import json
import csv
from os import listdir
from os.path import isfile, join
mypath = 'pilot1/' #set path to folder containing json files

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
dat = open('data.csv','w')
csvdatwriter = csv.writer(dat)
tut = open('tutorial.csv','w')
csvtutwriter = csv.writer(tut)
end = open('endsurvey.csv','w')
csvendwriter = csv.writer(end)
dem = open('demosurvey.csv','w')
csvdemwriter = csv.writer(dem)
stro = open('strokes.csv','w')
csvstrowriter = csv.writer(stro)


def without_keys(d, keys):
	return {x: d[x] for x in d if x not in keys}

headdata = 0
headtut = 0
headend = 0
headdem = 0
headstro = 0
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
			tutSurvey = parsed["tutorialsurvey"]
			endSurvey = parsed["endsurvey"]
			demoSurvey = parsed["demographic"]
			stroke = parsed["stroke"]

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

			# tutorial survey
			if(len(tutSurvey) > 0): 
				if headtut == 0:
					header = baseheader.copy() #init header array
					header.extend(tutSurvey[0].keys())
					csvtutwriter.writerow(header)
					headtut = 1

				for t in tutSurvey:
					vals = [subjID, starttime, useragent] #init data array
					vals.extend(t.values())
					csvtutwriter.writerow(vals)

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

			# stroke data
			if(len(stroke) > 0): 
				if headstro == 0:
					header = baseheader.copy() #init header array
					header.extend(stroke[0]["stroke"].keys())
					csvstrowriter.writerow(header)
					headstro = 1

				for u in stroke:
					if "graphic" in u["stroke"]: #removes undo/clear clicks when graphic is empty
						vals = [subjID, starttime, useragent] #init data array
						vals.extend(u["stroke"].values())
						csvstrowriter.writerow(vals)


dat.close()
tut.close()
end.close()
dem.close()
stro.close()


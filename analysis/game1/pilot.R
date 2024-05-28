setwd("/Users/lo2069/Desktop/Research/crayon-coaster/analysis/game1")

library(tidyverse)
library(rjson)
library(anytime)

bonusdf = data.frame()
for(j in list.files("json", pattern="*.json", full.names=TRUE)){
  temp = fromJSON(file=j)
  subjID = temp$client$sid
  bonusdf = bind_rows(bonusdf, data.frame(
    subjID = subjID,
    bonus = temp$bonus
  ))
}

bonusdf <- bonusdf %>%
  mutate(bonus = str_remove(bonus, "[$]"),
         bonus = ifelse(bonus == "", "0", bonus),
         bonus = as.numeric(bonus))


raw %>%
  filter(subjID == "connect-A7A920A93A2F48F2B39225FE9D6BE48B", exptPart == "test") %>%
  View()

raw <- read_csv("data.csv")
head(raw)

fullbonusdf <- raw %>%
  mutate(starttime = as.POSIXct(starttime / 1000, origin = "1970-01-01")) %>%
  filter(exptPart == "test") %>%
  group_by(subjID, starttime, useragent) %>%
  count(runOutcome) %>%
  filter(runOutcome == "goal") %>%
  mutate(calculatedBonus = n*0.25) %>%
  ungroup() %>%
  select(subjID, starttime, n, calculatedBonus) %>%
  full_join(bonusdf, "subjID") %>%
  arrange(starttime)

View(fullbonusdf)
  

fullbonusdf %>%
  filter(!is.na(n)) %>%
  select(subjID, calculatedBonus) %>%
  # rename("Participant or Assignment" = subjID) %>%
  rename(Participant = subjID) %>%
  rename(Amount = calculatedBonus) %>%
  write.csv('../../bonus/crayoncoaster2.csv', row.names=F)
  # write.table('../bonus/pilot1.csv', row.names=F, col.names=F, sep=',')





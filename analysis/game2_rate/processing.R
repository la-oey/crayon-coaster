setwd("/Users/lo2069/Desktop/Research/crayon-coaster/analysis/game2_rate")

library(tidyverse)

raw <- read.csv("data.csv")


raw %>%
  nrow()

# 365 participants when we recruited 360 weird....
raw %>%
  distinct(subjID) %>%
  nrow()

# all subjects finished all trials
raw %>%
  count(subjID) %>%
  filter(n < 33)


# look at catch trials
catch = c("stim_left.png","stim_right.png","stim_here.png")
raw %>%
  filter(ratedImg %in% catch) %>%
  ggplot(aes(x=score)) +
  geom_histogram() +
  facet_wrap(~ratedImg)

# visualize stim_here which pointed arrow at slider
raw %>%
  filter(ratedImg == "stim_here.png") %>%
  ggplot(aes(x=score)) +
  geom_histogram() +
  scale_x_continuous(limits=c(48,65))
# mode seems to be 56

subjCatch <- raw %>%
  filter(ratedImg %in% catch) %>%
  mutate(catchSucc = case_when(
    ratedImg == "stim_left.png" ~ score <= 5,
    ratedImg == "stim_right.png" ~ score >= 95,
    ratedImg == "stim_here.png" ~ score >= 51 & score <= 61
  )) %>%
  group_by(subjID) %>%
  summarise(totalCatchSucc = sum(catchSucc)) %>%
  arrange(totalCatchSucc)

## how many participants are eliminated from criteria

subjCatch %>%
  ggplot(aes(x=totalCatchSucc)) +
  geom_bar()

## 40 excluded if we only include participants who finished all 3
subjCatch %>%
  count(totalCatchSucc == 3)

## 13 excluded if we include participants who finished 2 or more
subjCatch %>%
  count(totalCatchSucc >= 2)

# pull out excluded subjects with fewer than 2 correct on catch trials
excludedSubjs <- subjCatch %>%
  filter(totalCatchSucc < 2) %>%
  pull(subjID)

# helper functions
# fetch levelID info from image file name
getLevelID <- function(imagefile){
  vec <- strsplit(imagefile, "-")[[1]]
  return(vec[1])
}

getWind <- function(imagefile){
  vec <- strsplit(imagefile, "-")[[1]]
  vec2 <- strsplit(vec[2], "/")[[1]]
  return(vec2[1])
}

getSubj <- function(imagefile){
  vec <- strsplit(imagefile, "-")[[1]]
  return(paste0("connect-",substr(vec[3], 1, 32))[1])
}

getImgID <- function(imagefile){
  vec <- strsplit(imagefile, "-")[[1]]
  vec2 <- strsplit(vec[3], "_")[[1]]
  return(strsplit(vec2[2], ".png")[[1]])
}

# try this later to remove redundancies
getSplitImg <- function(imagefile){
  split <- strsplit(imagefile, "-")[[1]]
  return(as.list(split))
}
 

# process data to remove excluded subjects and remove ignore catch trials
data <- raw %>%
  filter(!subjID %in% excludedSubjs, !ratedImg %in% catch) %>%
  select(-useragent) %>%
  mutate(levelID = mapply(getLevelID, ratedImg),
         wind = mapply(getWind, ratedImg),
         fullDesigner = mapply(getSubj, ratedImg),
         imgNum = mapply(getImgID, ratedImg),
         designer = substr(fullDesigner, 9, 19),
         image = paste0(fullDesigner, "_", imgNum, ".png")) %>%
  group_by(subjID) %>%
  mutate(zscore = (score - mean(score)) / sd(score))

write_csv(data, "processed.csv")







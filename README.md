# crayon-coaster

Experiment testing how people balance goals for efficient solutions versus unique and interesting solutions, and how populations benefit from weighing the different goals depending on the solution landscape.

Players' goal in the game is to draw paths in environments to make a marble drop in a cup. The game combines drawing and physics using the game framework Phaser 3 (Matter Physics).

## "game" is norming task

Participants (n = 27) play randomly selected 20 trials, varying on level, wind, gravity, and ball size.

Norming task is hosted here: https://lo.velezlab.opalstacked.com/crayon-coaster/index.html?hitId=HIT_ID&workerId=A_WORKER_ID&assignmentId=ASSIGNMENT_ID

## "game1" is training experiment

Participants (n = 72) play 19 trials, with 15 training trials (5 more vs less constrained levels x 3 wind conditions) + 4 critical trials.

"Game1" experiment is hosted here: https://lo.velezlab.opalstacked.com/crayon-coaster-2/index.html

## "game2" is human rating task

Human raters (n = 352) rate 33 trials: 10 levels x 3 wind conditions + 3 catch trials

The rated levels were a sample of "game1" training levels. We sampled such that we included all 15 training trials from 15 "game1 designers" from the 2 conditions (30 unique trials). Each trial that a given rater saw was from a unique designer. The ordering and which trials were all randomly selected for each rater. Humans rated images on dimensions of coolness, uniqueness, or feasibility.

"Game2" task is hosted here: https://lo.velezlab.opalstacked.com/crayon-coaster-rate/index.html

## physics_sim_model runs simulations 

Model consists of sampling from the physics parameters (i.e. strict replication x3, tweak position x/y x100, tweak object bounce/mass x100, tweak environment wind/gravity x100) and running forward simulations of the marble drop. This model allows us to assess designs' likelihood of success. The simulations are sensitive to fullscreen or switching tabs, so you'll need to keep the windows open, or have them run on a second monitor screen.

To run the simulations locally, input into your terminal:

> python run.py [level_id] [wind]

The data will save to the following directory, which you will want to have set up before running:
data/[level_id]-[wind]/

## prompt_GPT4_Vision asks GPT4 to do the rating task

Feeds rating task prompt and images to the OpenAI server to ask GPT-4-turbo and GPT-4o to rate the coolness, uniqueness, and feasibility of solutions. Set up OpenAI API using this documentation: https://platform.openai.com/docs/quickstart

NOTE: You will need a .txt file structured as, replacing "this-is-your-api-key-XXXXXXXXXXXXXXX" with your own key:

api_key=this-is-your-api-key-XXXXXXXXXXXXXXX

prompt_GPT4_image_solutions.py feeds in example solutions (connect-DE8DEC42101C48DEAF5B12C04FCE8999_img20.png, connect-EA1DDBB0D9E5471381D5FD3553DC8E12_img22.png) and prints GPT4's response to the terminal.

prompt_GPT4_zeroshot.py feeds in each solution one by one and asks GPT4 to rate solutions without additional examples for context. The responses are outputted to a csv file. You can adjust the model being used by editing line 9. 

> python prompt_GPT4_zeroshot.py [rate_dimension]

prompt_GPT4_zeroshot_missing.py can be run to rate additional solutions that are still missing if an error arises above. It requires a json file listing missing ratings, and may require adjusting the input missed_file (json) and output csv file.

> python prompt_GPT4_zeroshot_missing.py [rate_dimension]

prompt_GPT4_leave-one-out.py feeds in each solution one by one, and also feeds in the 14 other solutions for that level with their corresponding human rating from "../analysis/combined/promptLLM.json". This is more prone to running into server issues, so may require rerunning python prompt_GPT4_leave-one-out_missing.py, similar to how it was run for zeroshot rounds.

> python prompt_GPT4_leave-one-out.py [rate_dimension]

